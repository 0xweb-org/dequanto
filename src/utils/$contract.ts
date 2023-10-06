import alot from 'alot';
import { keccak_256 } from '@noble/hashes/sha3';

import type { TAbiItem } from '@dequanto/types/TAbi';

import { InputDataUtils } from '@dequanto/contracts/utils/InputDataUtils';
import { ITxLogItem } from '@dequanto/txs/receipt/ITxLogItem';
import { TBufferLike } from '@dequanto/models/TBufferLike';

import { $abiUtils } from './$abiUtils';
import { $abiParser } from './$abiParser';
import { $require } from './$require';
import { $buffer } from './$buffer';
import { TEth } from '@dequanto/models/TEth';
import { $abiCoder } from '@dequanto/abi/$abiCoder';

export namespace $contract {

    export function keccak256 (str: string | TBufferLike, output: 'buffer'): Uint8Array
    export function keccak256 (str: string | TBufferLike): TEth.Hex
    export function keccak256 (str: string | TBufferLike, output?: 'buffer'): Uint8Array | TEth.Hex {
        if (str == null || str === '0x') {
            return `0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470`;
        }
        let input;
        if (typeof str === 'string') {
            input = str.startsWith('0x')
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

    export function extractLogsForAbi (tx: TEth.TxReceipt, abiItem: TAbiItem): ITxLogItem[] {
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

    export function parseInputData (inputHex: string, abis: TAbiItem[]) {
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

    // export function decodeMethodCall <TArguments = any[]> (mix: TEth.Hex | Pick<TEth.Tx, 'input' | 'value'>, abis: TAbiItem[]) {
    //     if (typeof mix === 'string') {
    //         return decodeMethodCall({ input: mix }, abis);
    //     }
    //     let tx = mix;
    //     let str = tx.input.substring(2);
    //     if (str === '') {
    //         return null;
    //     }
    //     let methodHex = `0x${str.substring(0, 8)}`;
    //     let bytesHex = `0x${str.substring(8)}`;

    //     let abi = abis.find(abi => {
    //         let sig = $abiUtils.getMethodSignature(abi);
    //         return sig === methodHex;
    //     });
    //     if (abi == null) {
    //         return null;
    //     }
    //     let args = $abiCoder.decode(abi.inputs, bytesHex);
    //     return {
    //         method: abi.name,
    //         arguments: args as TArguments,
    //         value: tx.value
    //     };
    // }
    // export function decodeMethodCallAsObject (inputHex: TEth.Hex, abis: TAbiItem[]) {
    //     let call = decodeMethodCall(inputHex, abis);
    //     if (call == null) {
    //         return null;
    //     }

    //     let abi = abis.find(x => x.name === call.method);
    //     $require.notNull(abi, `Abi not found for ${call.method}`);

    //     let obj = {};
    //     abi.inputs.forEach((input, i) => {
    //         obj[input.name] = call.arguments[i];
    //     });
    //     return obj as any;

    // }
    // function arrayToObject (mix) {
    //     if (mix == null || typeof mix !== 'object' || Array.isArray(mix) === false) {
    //         return normalizeValue(mix);
    //     }
    //     let obj = {};
    //     let keyCount = 0;
    //     let proto = Array.prototype;
    //     for (let key in mix) {
    //         if (key in proto || /^\d+$/.test(key)) {
    //             continue;
    //         }
    //         let val = mix[key];
    //         obj[key] = typeof val === 'object'? arrayToObject(val) : normalizeValue(val);
    //         keyCount++;
    //     }
    //     if (keyCount === 0) {
    //         if (Array.isArray(mix)) {
    //             return mix.map(arrayToObject);
    //         }
    //         return mix;
    //     }
    //     return obj;
    // }



    export function decodeCustomError (errorDataHex: string | { type, params } | any, abiArr: TAbiItem[]) {
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

    export function parseLogWithAbi(log: TEth.Log, abiItem: TAbiItem | string): ITxLogItem {
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
            let val = $abiCoder.decode([ type ], bytes);

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
            abi: TAbiItem[]
        }[];

        export function getFlattened () {
            return alot(knownContracts).mapMany(x => x.abi).toArray();
        }
        export function register (contract: { abi: TAbiItem[] }) {
            knownContracts.push(contract)
        }
    }
}
