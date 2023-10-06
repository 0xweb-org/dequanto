import { $str } from '@dequanto/solidity/utils/$str';
import { $abiType } from '@dequanto/utils/$abiType';
import { $is } from '@dequanto/utils/$is';
import { type TAbiItem, TAbiOutput } from '@dequanto/types/TAbi';
import { $abiParser } from '../../utils/$abiParser';

export namespace AbiDeserializer {

    type AbiNativeType = string;

    export function process(result: any, types: TAbiOutput[]) {
        if (types == null || types.length === 0) {
            // return as-is
            return result;
        }
        let type: 'array' | 'object' | AbiNativeType = $abiParser.getReturnTypeFromTypes(types);
        if (typeof result === 'object') {
            if (type === 'array') {
                return toArray(result, types)
            }
            if (type === 'object') {
                return toObject(result, types);
            }
        }
        return toType(result, types[0]);
    }



    function toType(val, type: TAbiOutput) {
        if (type == null) {
            return val;
        }
        if (typeof val === 'string') {
            let tsType = $abiType.getTsType(type.type);
            switch (tsType) {
                case 'bigint':
                    return BigInt(val);
                case 'number':
                    return Number(val);
                case 'boolean':
                    return Boolean(Number(val));
                case 'string':
                    return $is.Hex(val)
                        ? $str.fromHex(val)
                        : val;
            }
        }
        if (type.type === 'tuple[]') {
            if (Array.isArray(val) === false) {
                throw new Error(`${type.name} tuple[] expects array to deserialize. Got ${val}`);
            }
            return val.map(item => {
                return process(item, type.components);
            });
        }
        return val;
    }

    function toArray(value: object, types: TAbiOutput[]) {
        value = normalizeArray(value);

        if (Array.isArray(value) === false) {
            throw new Error(`Array expected of types: ${types.map(x => x.type)}; Got ${value}`);
        }

        let out = [];
        for (let i = 0; i < types.length; i++) {
            out[i] = toType(value[i], types[i]);
        }
        return out;
    }
    function toObject(value: object, types: TAbiOutput[]) {
        let properties = Object.create(null) as { [key: string]: TAbiOutput };
        types.forEach(type => {
            properties[type.name] = type;
        });

        let out = Object.create(null);
        for (let key in value) {
            if (/^\d+$/.test(key)) {
                continue;
            }
            let info = properties[key];
            out[key] = toType(value[key], info);
        }
        return out;
    }

    // { 0: a, 1: b, 2: c } to array
    function normalizeArray(val) {
        if (Array.isArray(val)) {
            return val;
        }
        let out = [];
        let length = 0;
        let keys = 0;
        for (let key in val) {
            if (/^\d+$/.test(key)) {
                length++;
                out[Number(key)] = val[key]
                continue;
            }
            keys++;
        }
        if (length === 0 && keys > 0) {
            return val;
        }
        return out;
    }
}
