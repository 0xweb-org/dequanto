import { TAbiInput, TAbiItem } from '@dequanto/types/TAbi';
import { AbiCoder } from './abi-coder';
import { solidityPacked } from './abi-coder-packed';
import { ParamType } from './fragments';
import { TEth } from '@dequanto/models/TEth';
import { $abiParser } from '@dequanto/utils/$abiParser';

export namespace $abiCoder {
    export function encode(types: (string | ParamType | TAbiInput)[], values: any[]): TEth.Hex {
        let coder = new AbiCoder();
        return coder.encode(types, values) as TEth.Hex;
    }
    export function encodePacked(types: string[], values: any[]): TEth.Hex {
        return solidityPacked(types, values) as TEth.Hex;
    }

    export function decode(types: (string | ParamType | TAbiInput)[], hex: string, opts?: {
        loose?: boolean
        dynamic?: boolean
    }): any {
        let coder = new AbiCoder();
        let arr = coder.decode(types, hex, opts);
        return arr.map((x, i) => {
            return unwrap(types[i] as TAbiInput, x);
        });
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
                // unwrap array to object
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
}
