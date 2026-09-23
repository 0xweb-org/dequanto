import { TAbiInput, TAbiItem, TAbiOutput } from '@dequanto/types/TAbi';
import { ParamType } from './fragments';
import { TEth } from '@dequanto/models/TEth';
import { $abiCoder } from './$abiCoder';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { $abiParser } from '@dequanto/utils/$abiParser';

export namespace $abi {
    type TAbiType = string | ParamType | TAbiInput;
    type TDecodeOptions = {
        loose?: boolean
        dynamic?: boolean
    };

    export function encode(types: TAbiType, values: any): TEth.Hex
    export function encode(types: TAbiType[], values: any[]): TEth.Hex
    export function encode(types: TAbiType | TAbiType[], values: any | any[]): TEth.Hex {
        const isSingle = Array.isArray(types) === false;
        const arr = ensureTypes(types);
        const hex = $abiCoder.encode(arr, isSingle ? [ values ] : values);
        return hex;
    }

    export function decode(types: TAbiType, hex: string, opts?: TDecodeOptions): any
    export function decode(types: TAbiType[], hex: string, opts?: TDecodeOptions): any[]
    export function decode(types: TAbiType | TAbiType[], hex: string, opts?: TDecodeOptions): any {
        const isSingle = Array.isArray(types) === false;
        const arr = ensureTypes(types);
        let result = $abiCoder.decode(arr, hex, opts);

        return isSingle ? result[0] : result;
    }

    export function encodeCall(abi: string | TAbiItem, params?: any[]): TEth.Hex {
        return $abiUtils.serializeMethodCallData(abi, params);
    }

    export function decodeReturn<T = any>(abi: string | TAbiItem | TAbiOutput[], hex: string): T {
        let outputs = typeof abi === 'string'
            ? ($abiParser.parseMethod(abi).outputs ?? [])
            : (Array.isArray(abi) ? abi : abi.outputs ?? []);
        let returnAbi = outputs;
        let isDynamic: boolean = null;
        if (outputs.length > 1) {
            let isNamedTuple = outputs.every(x => x.name != null && x.name !== '');
            if (isNamedTuple) {
                returnAbi = [{ type: 'tuple', components: outputs, name: null }];
                isDynamic = false;
            }
        }

        try {
            let arr = $abiCoder.decode(returnAbi as any, hex, {
                dynamic: isDynamic
            });
            return returnAbi.length === 1 ? arr[0] : arr;
        } catch (error) {
            if (outputs.length === 1 && returnAbi.length === 1) {
                return $abiCoder.decodeSingle(returnAbi[0], hex);
            }
            throw error;
        }
    }

    function ensureTypes (types: TAbiType | TAbiType[]): TAbiType[] {
        let arr = Array.isArray(types) ? types : [ types ];
        return arr.map($abiCoder.normalizeType);
    }
}
