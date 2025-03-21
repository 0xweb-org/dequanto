import alot from 'alot';
import { keccak_256 } from '@noble/hashes/sha3';

import type { TAbiItem } from '@dequanto/types/TAbi';

import { ITxLogItem } from '@dequanto/txs/receipt/ITxLogItem';
import { TBufferLike } from '@dequanto/models/TBufferLike';

import { $abiUtils } from './$abiUtils';
import { $abiParser } from './$abiParser';
import { $require } from './$require';
import { $buffer } from './$buffer';
import { TEth } from '@dequanto/models/TEth';
import { $abiCoder } from '@dequanto/abi/$abiCoder';
import { $logger } from './$logger';

import { EvmBytecode } from '@dequanto/evm/EvmBytecode';
import { $bytecode } from '@dequanto/evm/utils/$bytecode';
import { $hex } from './$hex';
import { $is } from './$is';

export namespace $contract {

    export function keccak256(str: string | TBufferLike, output: 'buffer'): Uint8Array
    export function keccak256(str: string | TBufferLike, output?: 'hex'): TEth.Hex
    export function keccak256(str: string | TBufferLike, output?: 'buffer' | 'hex'): Uint8Array | TEth.Hex {
        if (str == null || str === '0x') {
            return `0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470`;
        }
        let input;
        if (typeof str === 'string') {
            input = $is.Hex(str)
                ? $buffer.fromHex(str)
                : $buffer.fromString(str);
        } else {
            input = str;
        }
        let hashBytes = keccak_256(input);
        if (output === 'buffer') {
            return hashBytes
        }
        return $buffer.toHex(hashBytes);
    }

    export function normalizeArgs(args: any[]) {
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
    function normalizeValue(val: any) {
        if (val == null || typeof val !== 'object') {
            return val;
        }
        if (val?._isBigNumber) {
            return BigInt(val.toString());
        }
        return val;
    }

    export function extractLogsForAbi(tx: TEth.TxReceipt, abiItem: string | TAbiItem): ITxLogItem[] {
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

    export function parseInputData(inputHex: string, abis: TAbiItem[]) {
        if (abis == null || abis.length === 0 || inputHex == null) {
            return null;
        }
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
        let params: any = $abiCoder.decode(abi.inputs, bytesHex);

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

    export function decodeDeploymentArguments(input: TEth.Hex, ctorAbi: TAbiItem) {
        let { arguments: hex } = $bytecode.parseContractCreation(input);
        if ($hex.isEmpty(hex)) {
            return null;
        }
        let decoded = $abiUtils.decode(ctorAbi.inputs, hex);
        return {
            encoded: hex,
            ...decoded
        };
    }
    export function parseDeploymentBytecode(input: TEth.Hex) {

        let evm = new EvmBytecode(input, { withConstructorCode: true });
        let opcodes = evm.getOpcodes();
        let codeSize = opcodes.findIndex(x => x.name === 'CODESIZE');
        if (codeSize === -1) {
            return {
                bytecode: input,
                arguments: '0x',
            };
        }
        let prev = opcodes[codeSize - 1];
        $require.True(/PUSH/.test(prev.name), `PUSH expected but got ${prev.name}`);

        let codeSizeValue = $buffer.toBigInt(prev.pushData) * 2n;
        let inputCursor = 2 /*0x*/ + Number(codeSizeValue);
        return {
            bytecode: input.substring(0, inputCursor),
            arguments: '0x' + input.substring(inputCursor),
        };
    }

    export function decodeCustomError(errorDataHex: string | { type, params } | any, abiArr: TAbiItem[]) {
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

    export function parseLogWithAbi(log: TEth.Log, mix: TAbiItem[] | TAbiItem | string): ITxLogItem {
        let abiItem: TAbiItem;
        if (typeof mix === 'string') {
            abiItem = $abiParser.parseMethod(mix);
        } else if (Array.isArray(mix)) {
            abiItem = mix.find(x => {
                let topic = log.topics[0];
                let sig = $abiUtils.getTopicSignature(x);
                return topic === sig;
            });
            if (abiItem == null) {
                $logger.log(`Abi not found for ${log.topics[0]} within ${mix.map(x => x.name)}`);
                return <any>{
                    event: 'Unknown',
                    ...log,
                }
            }
        } else {
            abiItem = mix;
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
            let val = $abiCoder.decode([type], bytes);

            return {
                name: type.name,
                value: val[0]
            }
        });

        if (inputs.length > 0) {
            let values = $abiCoder.decode(inputs, log.data);

            args.push(...values.map((val, i) => {
                return {
                    name: inputs[i].name,
                    value: val
                };
            }));
        }
        let params = args.reduce((agr, arg) => {
            agr[arg.name] = arg.value;
            return agr;
        }, {});

        return {
            id: log.blockNumber * 100_000 + log.logIndex,
            blockNumber: log.blockNumber,
            logIndex: log.logIndex,
            transactionHash: log.transactionHash,
            address: log.address,
            event: abiItem.name,
            arguments: args,
            params: params,
        };
    }

    export function formatCall(call: { method?, type?, params?}) {
        let method = call.method ?? call.type ?? 'Unknown';
        let paramsStr = '';
        if (call.params != null) {
            if (typeof call.params === 'string') {
                paramsStr = call.params;
            } else {
                let arr = [];
                for (let key in call.params) {
                    let value = call.params[key];
                    if (value != null && typeof value === 'object') {
                        value = formatJson(value);
                    }
                    arr.push(`${key}=${value}`);
                }
                paramsStr = arr.join(', ');
            }
        }
        return `${method}(${paramsStr})`;
    }
    export function formatCallFromAbi(abi: TAbiItem, params: any[]) {
        let method = abi.name;
        let paramsItems = [];
        let count = Math.max(abi.inputs.length, params.length);
        for (let i = 0; i < count; i++) {
            let key = abi.inputs[i]?.name;
            let value = params[i];
            let valueStr = value != null && typeof value === 'object'
                ? formatJson(value)
                : String(value);

            if (key == null) {
                paramsItems.push(valueStr);
                continue;
            }
            paramsItems.push(`${key}=${valueStr}`);
        }
        let paramsStr = paramsItems.join(', ');
        return `${method}(${paramsStr})`;
    }

    export namespace store {
        const knownContracts = [] as {
            abi: TAbiItem[]
        }[];

        export function getFlattened() {
            return alot(knownContracts).mapMany(x => x.abi).toArray();
        }
        export function register(contract: { abi: TAbiItem[] }) {
            knownContracts.push(contract)
        }
    }

    function formatJson(json) {
        let str = JSON.stringify(json, null, 2);
        str = str.replace(/"([\w]+)":/g, '$1:');
        return str;
    }
}
