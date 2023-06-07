import Web3 from 'web3';
import { type AbiItem } from 'web3-utils';
import { Log, TransactionReceipt } from 'web3-core';
import { $abiUtils } from './$abiUtils';
import { InputDataUtils } from '@dequanto/contracts/utils/InputDataUtils';
import { ITxLogItem } from '@dequanto/txs/receipt/ITxLogItem';
import { $abiParser } from './$abiParser';
import alot from 'alot';
import { $hex } from './$hex';
import { TAddress } from '@dequanto/models/TAddress';

export namespace $contract {


    export function keccak256 (str: string) {
        return Web3.utils.keccak256(str);
    }

    export function normalizeArgs (args: any[]) {
        return args.map(val => {
            if (val?._isBigNumber) {
                return BigInt(val.toString());
            }
            if (Array.isArray(val)) {
                return normalizeArgs(val);
            }
            return val;
        })
    }

    export function extractLogsForAbi (tx: TransactionReceipt, abiItem: AbiItem): ITxLogItem[] {
        let topicHash = $abiUtils.getMethodHash(abiItem);
        let logs = tx
            .logs
            .filter(log => {
                return log.topics[0] === topicHash;
            })
            .map(log => {
                return parseLogWithAbi(log, abiItem);
            })
        return logs;
    }

    export function parseInputData (inputHex: string, abis: AbiItem[]) {
        let str = inputHex.substring(2);
        if (str === '') {
            return null;
        }
        let methodHex = `0x${str.substring(0, 8)}`;
        let bytesHex = `0x${str.substring(8)}`;

        let abi = abis.find(abi => {
            let sig = $abiUtils.getMethodSignature(abi);
            return sig === methodHex;
        });
        if (abi == null) {
            return null;
        }
        let params: any = InputDataUtils.decodeParamsWithABI(abi, bytesHex);
        let asObject = abi.inputs.every(x => x.name != null);
        if (asObject) {
            params = alot(abi.inputs).map((x, i) => {
                return { key: x.name, value: params[i] }
            }).toDictionary(x => x.key, x => x.value);
        }
        return {
            method: abi.name,
            params
        };
    }

    export function decodeCustomError (errorDataHex: string | any, abi: AbiItem[]) {
        if (errorDataHex == null || typeof errorDataHex !== 'string') {
            return errorDataHex;
        }
        if (errorDataHex.startsWith('0x')) {
            let arr = abi?.length === 0 ? store.getFlattened() : abi;
            let errors = [
                ...(arr.filter(x => (x as any).type === 'error')),
                $abiParser.parseMethod(`Error(string)`),
                $abiParser.parseMethod(`Panic(uint256)`),
            ];
            let parsed = $contract.parseInputData(errorDataHex, errors);
            if (parsed) {
                return {
                    type: parsed.method,
                    params: parsed.params,
                }
            }
        }

        return {
            type: 'Unknown',
            params: errorDataHex
        };
    }

    export function parseLogWithAbi(log: Log, abiItem: AbiItem | string): ITxLogItem {
        if(typeof abiItem === 'string') {
            abiItem = $abiParser.parseMethod(abiItem);
        }
        let inputs = abiItem.inputs.slice();

        // Move indexed inputs forward
        inputs.sort((a, b) => {
            if (a.indexed === b.indexed) {
                return 0;
            }
            if (b.indexed === true && a.indexed !== true) {
                return 1;
            }
            return -1;
        });

        let args = log.topics.slice(1).map((bytes, i) => {
            let type = inputs.shift();
            if (type.indexed && $abiUtils.isDynamicType(type.type)) {
                // Dynamic types are stored as keccak256 hashes
                return {
                    name: type.name,
                    value: bytes
                };
            }
            let val = InputDataUtils.decode([ type ], bytes);

            return {
                name: type.name,
                value: val[0]
            }
        });

        if (inputs.length > 0) {
            let values = InputDataUtils.decode(inputs, log.data);

            args.push(...values.map((val, i) => {
                return {
                    name: inputs[i].name,
                    value: val
                };
            }));
        }
        let params = args.reduce((aggr, arg) => {
            aggr[arg.name] = arg.value;
            return aggr;
        }, {});

        return {
            blockNumber: log.blockNumber,
            transactionHash: log.transactionHash,
            address: log.address,
            event: abiItem.name,
            arguments: args,
            params: params,
        };
    }


    export namespace store {
        const knownContracts = [] as {
            abi: AbiItem[]
        }[];

        export function getFlattened () {
            return alot(knownContracts).mapMany(x => x.abi).toArray();
        }
        export function register (contract: { abi: AbiItem[] }) {
            knownContracts.push(contract)
        }
    }
}
