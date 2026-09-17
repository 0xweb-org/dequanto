import { TAbiInput, TAbiItem } from '@dequanto/types/TAbi';
import { AbiCoder } from './abi-coder';
import { solidityPacked } from './abi-coder-packed';
import { ParamType } from './fragments';
import { TEth } from '@dequanto/models/TEth';
import { $abiParser } from '@dequanto/utils/$abiParser';

export namespace $abiCoder {

    type TAbiType = string | ParamType | TAbiInput;
    type TDecodeOptions = {
        loose?: boolean
        dynamic?: boolean
    };

    export function encode(types: TAbiType, values: any): TEth.Hex
    export function encode(types: TAbiType[], values: any[]): TEth.Hex
    export function encode(types: TAbiType | TAbiType[], values: any | any[]): TEth.Hex {
        if (Array.isArray(types) == false) {
            return encodeSingle(types, values)
        }
        let coder = new AbiCoder();
        return coder.encode(types, values) as TEth.Hex;
    }
    export function encodeSingle(type: TAbiType, value: any): TEth.Hex {
        type = normalizeType(type);
        let coder = new AbiCoder();
        return coder.encodeSingle(type, value) as TEth.Hex;
    }

    export function encodePacked(types: string[], values: any[]): TEth.Hex {
        return solidityPacked(types, values) as TEth.Hex;
    }

    export function decode(types: TAbiType, hex: string, opts?: TDecodeOptions): any
    export function decode(types: TAbiType[], hex: string, opts?: TDecodeOptions): any[]
    export function decode(types: TAbiType| TAbiType[], hex: string, opts?: TDecodeOptions): any {
        if (Array.isArray(types) == false) {
            return decodeSingle(types, hex, opts)
        }
        let coder = new AbiCoder();
        let arr = coder.decode(types, hex, opts);
        return arr.map((x, i) => {
            return unwrap(types[i] as TAbiInput, x);
        });
    }
    export function decodeSingle(type: TAbiType, hex: string, opts?: TDecodeOptions): any {
        type = normalizeType(type);
        let coder = new AbiCoder();
        let x = coder.decodeSingle(type, hex, opts);
        return unwrap(type as TAbiInput, x);
    }


    function unwrap (mixAbi: string | TAbiInput, mixValue: any) {
        let abi = typeof mixAbi === 'string'
            ? $abiParser.parseArguments(mixAbi)[0]
            : mixAbi;

        if (abi.type.startsWith('tuple')) {
            if (Array.isArray(mixValue) === false) {
                return mixValue;
            }

            let isArray = abi.type.endsWith(`[]`);
            if (isArray) {
                return mixValue.map(item => {
                    return unwrap({
                        ...abi,
                        type: abi.type.slice(0, -2),
                    }, item)
                });
            }

            if ('components' in abi) {
                // Unwrap the array to an object
                let result = {};
                for (let i = 0; i < abi.components.length; i++) {
                    let component = abi.components[i];
                    let value = i < mixValue.length ? mixValue[i] : null;
                    result[component.name] = unwrap(component, value);
                }
                return result;
            }
        }
        return mixValue;
    }


    function normalizeType (type: TAbiType) {
        if (typeof type === 'string' && /\bstruct /.test(type)) {
            return $abiParser.parseStruct(type);
        }
        return type;
    }
}
