import type { TAbiItem, TAbiInput } from '@dequanto/types/TAbi';

import { $is } from './$is';
import { $hex } from './$hex';
import { $str } from '@dequanto/solidity/utils/$str';
import { $types } from '@dequanto/solidity/utils/$types';
import { $abiType } from './$abiType';
import { $contract } from './$contract';
import { $abiParser } from './$abiParser';
import { ParamType } from '@dequanto/abi/fragments';
import { $abiCoder } from '@dequanto/abi/$abiCoder';
import { TEth } from '@dequanto/models/TEth';
import alot from 'alot';

export namespace $abiUtils {

    export function encodePacked(types: string[], values: any[]): TEth.Hex
    export function encodePacked(typeValues: [string, any][]): TEth.Hex
    export function encodePacked(types: ReadonlyArray<string | ParamType>, values: ReadonlyArray<any>): TEth.Hex
    export function encodePacked(...typeValues: { type: string, value: any }[]): TEth.Hex
    export function encodePacked(...typeValues: [string, any][]): TEth.Hex
    export function encodePacked(...mix): TEth.Hex {

        let val: {type, value}[];
        if (arguments.length === 1) {
            let arr = arguments[0];
            let isTypeValueNestedArray = Array.isArray(mix)
                && mix.length > 0
                && Array.isArray(mix[0])
                && mix[0].length === 2
                && typeof mix[0][0] === 'string';

            if (isTypeValueNestedArray) {
                val = arr.map(([type, value]) => {
                    return { type, value };
                });
            }
        }

        if (arguments.length === 2 && Array.isArray(mix[0])) {
            // && typeof mix[0][0] === 'string'
            let [types, values] = mix;
            val = types.map((type, i) => {
                return { type, value: values[i] };
            });
        }

        // [type, value], [type, value], ....
        if (val == null && arguments.length > 0 && Array.isArray(arguments[0]) && arguments[0].length === 2 && typeof arguments[0][0] ==='string') {
            val = Array.from(arguments).map(([type, value]) => {
                return { type, value };
            });
        }
        if (val == null) {
            val = mix;
        }

        let types = val.map(x => x.type);
        let values = val.map(x => x.value);
        return $abiCoder.encodePacked(types, values);
    }

    export function encode(typeValues: [string, any][]): TEth.Hex
    export function encode(types: ReadonlyArray<string | TAbiInput>, values: any[]): TEth.Hex
    export function encode(mix: [string, any][] | ReadonlyArray<string | TAbiInput>, values?: any[]): TEth.Hex {
        let types: (string | ParamType)[];
        if (Array.isArray(mix) && mix.length > 0 && mix[0].length === 2 && typeof mix[0][0] === 'string') {
            types = mix.map(x => x[0]);
            values = mix.map(x => x[1]);
        } else {
            types = mix as any;
        }
        if (types.length === 0) {
            return '0x' as TEth.Hex;
        }

        return $abiCoder.encode(types, values)
    }

    export function decode(types: (string | ParamType | TAbiInput)[], data: string) {
        let arr: any[] = $abiCoder.decode(types, data);

        // Add parameters as dictionary, to be compatible with web3js, but consider to remove this
        let params: { [ key: string ]: any }
        let asObject = types.every(x => x != null && typeof x === 'object' && x.name != null);
        if (asObject) {
            params = alot(types as ParamType[]).map((x, i) => {
                return { key: x.name, value: arr[i] }
            }).toDictionary(x => x.key, x => x.value);
        }
        return {
            args: arr,
            params,
        };
    }


    export function decodePacked <T = any>(types: string | string[] | ParamType[] | TAbiInput | TAbiInput[] | ParamType, data: string) {
        return DecodePacked.decodePacked (types, data) as T;
    }

    /** Returns complete method/event hash */
    export function getMethodHash(mix: string | TAbiItem) {
        let abi = typeof mix === 'string'
            ? $abiParser.parseMethod(mix)
            : mix;
        let types = abi.inputs?.map(serializeMethodSignatureArgumentType) ?? [];
        let signature = `${abi.name}(${types.join(',')})`;
        let hash = $contract.keccak256(signature);
        return hash;
    }

    export function getMethodSignature(mix: string | TAbiItem) {
        let abi = typeof mix === 'string'
            ? $abiParser.parseMethod(mix)
            : mix;
        let types = abi.inputs?.map(serializeMethodSignatureArgumentType) ?? [];
        let signature = `${abi.name}(${types.join(',')})`;
        let hash = $contract.keccak256(signature);
        return hash.substring(0, 10);
    }
    export function serializeMethodCallData(abi: string | TAbiItem, params?: any[]) {
        if (typeof abi === 'string') {
            abi = $abiParser.parseMethod(abi);
        }
        let sig = abi.signature ?? $abiUtils.getMethodSignature(abi);
        let data = $abiUtils.encode(abi.inputs, params ?? []);
        return (sig + data.substring(2)) as TEth.Hex;
    }
    export function parseMethodCallData(mixAbi: string | TAbiItem | TAbiItem[], mixInput: TEth.BufferLike | Pick<TEth.TxLike, 'data' | 'input' | 'value'>) {
        if (typeof mixInput === 'string' || mixInput instanceof Uint8Array) {
            mixInput = { data: mixInput } as any;
            return parseMethodCallData(mixAbi, mixInput);
        }
        let abis: TAbiItem[];
        if (typeof mixAbi === 'string') {
            abis = [ $abiParser.parseMethod(mixAbi) ];
        } else if (Array.isArray(mixAbi)) {
            abis = mixAbi;
        } else {
            abis = [ mixAbi ];
        }
        let tx = mixInput;
        let input = tx.input?? tx.data;
        let str = $hex.ensure(input);
        let methodHex = `${str.substring(0, 10)}`;
        let bytesHex = `0x${str.substring(10)}`;

        let abiFns = abis.filter(x => x.type === 'function');
        let abi = abiFns.find(abi => {
            let sig = getMethodSignature(abi);
            return sig === methodHex;
        });
        if (abi == null) {
            console.log(`Could not find the ABI for ${methodHex}; Available ${ abiFns.map(x => x.name).join(', ') }`);
            return null;
        }
        let { args, params } = decode(abi.inputs, bytesHex);

        return {
            name: abi.name,
            args,
            params,
            value: tx.value,
        };
    }

    export function getTopicSignature(abi: TAbiItem) {
        if ($is.Hex(abi.name)) {
            // anonymous event
            return abi.name;
        }
        let types = abi.inputs?.map(serializeMethodSignatureArgumentType) ?? [];
        let signature = `${abi.name}(${types.join(',')})`;
        let hash = $contract.keccak256(signature);
        return hash;
    }

    export function checkInterfaceOf(abi: TAbiItem[], iface: TAbiItem[]): { ok: boolean, missing?: string } {
        if (iface == null || iface.length === 0) {
            return { ok: false };
        }
        for (let item of iface) {
            if (item.type === 'constructor') {
                continue;
            }
            let inAbi = abi.some(x => abiEquals(x, item));
            if (inAbi === false) {
                return { ok: false, missing: item.name };
            }
        }
        return { ok: true };
    }

    export function isDynamicType(type: string) {
        if (type === 'string' || type === 'bytes') {
            return true;
        }
        if (/\[\]$/.test(type)) {
            return true;
        }
        if (type.includes('mapping')) {
            return true;
        }
        return false;
    }

    export function isReadMethod (abi: TAbiItem): boolean {
        return abi.type === 'function' &&  ['view', 'pure', null].includes(abi.stateMutability);
    }

    export function fromAliasIfAny(type: string) {
        if (type === 'uint') {
            return 'uint256';
        }
        if (type === 'byte') {
            return 'bytes1';
        }
        return type;
    }

    function abiEquals(a: TAbiItem, b: TAbiItem) {
        if (a.name !== b.name) {
            return false;
        }
        let aInputs = a.inputs ?? [];
        let bInputs = b.inputs ?? [];
        if (aInputs.length !== bInputs.length) {
            return false;
        }
        //@TODO: may be better TAbiInput comparison?
        for (let i = 0; i < aInputs.length; i++) {
            let aInput = aInputs[i];
            let bInput = bInputs[i];
            if (aInput?.type !== bInput?.type) {
                return false;
            }
        }
        return true;
    }


    function serializeMethodSignatureArgumentType(input: TAbiItem['inputs'][0]) {
        if (input.type === 'tuple') {
            return serializeComponents(input.components);
        }
        if (input.type === 'tuple[]') {
            return serializeComponents(input.components) + '[]';
        }
        let type = fromAliasIfAny(input.type);

        return type;
    }

    function serializeComponents(components: TAbiInput[]) {
        let types = components.map(x => serializeMethodSignatureArgumentType(x));
        return `(${types.join(',')})`;
    }
}


namespace DecodePacked {

    export function decodePacked(mix: string | string[] | ParamType[] | TAbiInput | TAbiInput[] | ParamType, hex: string) {
        let size = $hex.getBytesLength(hex);
        let buffer = { hex, cursor: 0, size }

        if (Array.isArray(mix) === false) {
            return decodeSingle(mix as ParamType, buffer)?.value
        }

        if (Array.isArray(mix) && typeof mix[0] === 'string') {
            mix = mix.map(type => ({ type })) as ParamType[];
        }
        let types = mix as ParamType[];
        let arr = types.map(type => decodeSingle(type, buffer)?.value);
        return arr;
    }

    function decodeSingle(type: ParamType, buffer: { hex: string, cursor: number, size: number }): { value, cursor } {
        let t = type.type;
        if ($types.isArray(t)) {
            let size = $abiType.array.getLength(t);
            let tuple = { ...type, type: 'tuple' } as ParamType;
            let arr = [];
            while (arr.length < size && buffer.cursor < buffer.size) {
                let { value, cursor } = decodeSingle(tuple, buffer);
                arr.push(value);
                buffer.cursor = cursor;
            }
            return { value: arr, cursor: buffer.cursor };
        }
        if ($types.isMapping(t)) {
            throw new Error(`Mappings are not supported for decoding packed data`);
        }
        if (t === 'tuple') {
            let asObject = type.components.every(field => $str.isNullOrWhiteSpace(field.name) === false);

            let outputObj = asObject ? {} : null;
            let outputArr = asObject ? null : [];

            for (let field of type.components) {
                let { value, cursor } = decodeSingle(field, buffer);
                if (asObject) {
                    outputObj[field.name] = value;
                } else {
                    outputArr.push(value);
                }
                buffer.cursor = cursor;
            }
            return { value: outputObj ?? outputArr, cursor: buffer.cursor };
        }
        let bits = $types.sizeOf(t);
        if (bits === Infinity) {
            let lengthSize = 32;
            let size = readBuffer(buffer, lengthSize);
            bits = Number(size) * 8;
        }
        let value = readBuffer(buffer, bits / 8);
        return {
            value: $hex.convert(value, t),
            cursor: buffer.cursor
        };
    }


    function readBuffer (buffer: { hex: string, cursor: number, size: number }, size: number) {
        let bytes = $hex.getBytes(buffer.hex, buffer.cursor, size);
        buffer.cursor += size;
        return bytes;
    }
}
