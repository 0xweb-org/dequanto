import Web3 from 'web3';
import { utils } from 'ethers';
import { $contract } from './$contract';
import { $abiParser } from './$abiParser';
import { $is } from './$is';
import type { AbiItem, AbiInput } from 'web3-utils';
import type { ParamType } from 'ethers/lib/utils';
import { $hex } from './$hex';
import { $buffer } from './$buffer';
import { $types } from '@dequanto/solidity/utils/$types';
import { $abiType } from './$abiType';
import { $str } from '@dequanto/solidity/utils/$str';

export namespace $abiUtils {

    export function encodePacked(types: string[], values: any[])
    export function encodePacked(typeValues: [string, any][])
    export function encodePacked(types: ReadonlyArray<string | ParamType>, values: ReadonlyArray<any>)
    export function encodePacked(...val: Parameters<Web3['utils']['encodePacked']>)
    export function encodePacked(...mix) {

        let val: any[];
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
        if (val == null) {
            val = mix;
        }

        return Web3.utils.encodePacked(...val);
    }

    export function encode(typeValues: [string, any][])
    export function encode(types: ReadonlyArray<string | ParamType>, values: ReadonlyArray<any>)
    export function encode(mix: [string, any][] | ReadonlyArray<string | ParamType>, values?: ReadonlyArray<any>) {
        let types: ReadonlyArray<string | ParamType>;
        if (Array.isArray(mix) && mix[0].length === 2 && typeof mix[0][0] === 'string') {
            types = mix.map(x => x[0]);
            values = mix.map(x => x[1]);
        } else {
            types = mix as any;
        }

        let coder = new utils.AbiCoder();
        return coder.encode(types, values)
    }

    export function decode(types: (string | ParamType)[], data: string) {
        // let types: ReadonlyArray<string | ParamType>;
        // if (Array.isArray(mix) && mix[0].length === 2 && typeof mix[0][0] === 'string') {
        //     types = mix.map(x => x[0]);
        //     values = mix.map(x => x[1]);
        // } else {
        //     types = mix as any;
        // }

        let coder = new utils.AbiCoder();
        return coder.decode(types, data)
    }


    export function decodePacked <T = any>(types: string[] | ParamType[] | AbiInput[] | AbiInput, data: string) {
        return DecodePacked.decodePacked (types, data) as T;
    }

    /** Returns complete method/event hash */
    export function getMethodHash(mix: string | AbiItem) {
        let abi = typeof mix === 'string'
            ? $abiParser.parseMethod(mix)
            : mix;
        let types = abi.inputs?.map(serializeMethodSignatureArgumentType) ?? [];
        let signature = `${abi.name}(${types.join(',')})`;
        let hash = $contract.keccak256(signature);
        return hash;
    }

    export function getMethodSignature(mix: string | AbiItem) {
        let abi = typeof mix === 'string'
            ? $abiParser.parseMethod(mix)
            : mix;
        let types = abi.inputs?.map(serializeMethodSignatureArgumentType) ?? [];
        let signature = `${abi.name}(${types.join(',')})`;
        let hash = $contract.keccak256(signature);
        return hash.substring(0, 10);
    }

    export function getTopicSignature(abi: AbiItem) {
        if ($is.hexString(abi.name)) {
            // anonymous event
            return abi.name;
        }
        let types = abi.inputs?.map(serializeMethodSignatureArgumentType) ?? [];
        let signature = `${abi.name}(${types.join(',')})`;
        let hash = $contract.keccak256(signature);
        return hash;
    }

    export function checkInterfaceOf(abi: AbiItem[], iface: AbiItem[]): { ok: boolean, missing?: string } {
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
    export function fromAliasIfAny(type: string) {
        if (type === 'uint') {
            return 'uint256';
        }
        if (type === 'byte') {
            return 'bytes1';
        }
        return type;
    }

    function abiEquals(a: AbiItem, b: AbiItem) {
        if (a.name !== b.name) {
            return false;
        }
        let aInputs = a.inputs ?? [];
        let bInputs = b.inputs ?? [];
        if (aInputs.length !== bInputs.length) {
            return false;
        }
        //@TODO: may be better AbiInput comparison?
        for (let i = 0; i < aInputs.length; i++) {
            let aInput = aInputs[i];
            let bInput = bInputs[i];
            if (aInput?.type !== bInput?.type) {
                return false;
            }
        }
        return true;
    }


    function serializeMethodSignatureArgumentType(input: AbiItem['inputs'][0]) {
        if (input.type === 'tuple') {
            return serializeComponents(input.components);
        }
        if (input.type === 'tuple[]') {
            return serializeComponents(input.components) + '[]';
        }
        let type = fromAliasIfAny(input.type);

        return type;
    }

    function serializeComponents(components: AbiInput[]) {
        let types = components.map(x => serializeMethodSignatureArgumentType(x));
        return `(${types.join(',')})`;
    }
}


namespace DecodePacked {

    export function decodePacked(mix: string[] | ParamType[] | AbiInput[] | AbiInput, hex: string) {
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
