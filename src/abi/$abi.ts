import { TAbiInput } from '@dequanto/types/TAbi';
import { ParamType } from './fragments';
import { TEth } from '@dequanto/models/TEth';
import { $abiCoder } from './$abiCoder';

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

    function ensureTypes (types: TAbiType | TAbiType[]): TAbiType[] {
        let arr = Array.isArray(types) ? types : [ types ];
        return arr.map($abiCoder.normalizeType);
    }
}
