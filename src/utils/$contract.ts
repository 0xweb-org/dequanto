import alot from 'alot';
import Web3 from 'web3';
import { Log, TransactionReceipt } from 'web3-core';
import { $abiUtils } from './$abiUtils';
import { InputDataUtils } from '@dequanto/contracts/utils/InputDataUtils';
import { ITxLogItem } from '@dequanto/txs/receipt/ITxLogItem';
import { $abiParser } from './$abiParser';
import { TBufferLike } from '@dequanto/models/TBufferLike';
import type { AbiItem } from 'web3-utils';
import { $require } from './$require';

export namespace $contract {


    export function keccak256 (str: string | TBufferLike) {
        if (str == null || str === '0x') {
            return `0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470`;
        }
        return Web3.utils.keccak256(str as string);
    }
    export function soliditySha3 (str: string) {
        return Web3.utils.soliditySha3Raw(str);
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
    function normalizeValue (val: any) {
        if (val == null || typeof val !== 'object') {
            return val;
        }
        if (val?._isBigNumber) {
            return BigInt(val.toString());
        }
        return val;
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

    export function decodeMethodCall <TArguments = any[]> (inputHex: string, abis: AbiItem[]) {
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
        let args = params.map(param => {
            return arrayToObject(param);
        });
        return {
            method: abi.name,
            arguments: args as TArguments
        };
    }
    export function decodeMethodCallAsObject (inputHex: string, abis: AbiItem[]) {
        let call = decodeMethodCall(inputHex, abis);
        if (call == null) {
            return null;
        }

        let abi = abis.find(x => x.name === call.method);
        $require.notNull(abi, `Abi not found for ${call.method}`);

        let obj = {};
        abi.inputs.forEach((input, i) => {
            obj[input.name] = call.arguments[i];
        });
        return obj as any;

    }
    function arrayToObject (mix) {
        if (mix == null || typeof mix !== 'object' || Array.isArray(mix) === false) {
            return normalizeValue(mix);
        }
        let obj = {};
        let keyCount = 0;
        let proto = Array.prototype;
        for (let key in mix) {
            if (key in proto || /^\d+$/.test(key)) {
                continue;
            }
            let val = mix[key];
            obj[key] = typeof val === 'object'? arrayToObject(val) : normalizeValue(val);
            keyCount++;
        }
        if (keyCount === 0) {
            if (Array.isArray(mix)) {
                return mix.map(arrayToObject);
            }
            return mix;
        }
        return obj;
    }



    export function decodeCustomError (errorDataHex: string | { type, params } | any, abiArr: AbiItem[]) {
        if (errorDataHex == null) {
            return null;
        }
        if (typeof errorDataHex !== 'string') {
            let isUnknown = errorDataHex.type === 'Unknown' && typeof errorDataHex.params === 'string';
            if (isUnknown === false) {
                return errorDataHex;
            }
            errorDataHex = errorDataHex.params;
        }
        if (errorDataHex.startsWith('0x')) {
            let arr = abiArr?.length === 0 ? store.getFlattened() : abiArr;
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
