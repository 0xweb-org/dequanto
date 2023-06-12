import Web3 from 'web3';
import { utils }  from 'ethers';
import { $contract } from './$contract';
import { $abiParser } from './$abiParser';
import { $is } from './$is';
import type { AbiItem, AbiInput } from 'web3-utils';
import type { ParamType } from 'ethers/lib/utils';

export namespace $abiUtils {

    export function encodePacked (types: string[], values: any[])
    export function encodePacked (typeValues: [string, any][])
    export function encodePacked (...val: Parameters<Web3['utils']['encodePacked']>)
    export function encodePacked (...mix) {

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

        if (arguments.length === 2 && Array.isArray(mix[0]) && typeof mix[0][0] === 'string') {
            let [ types, values ] = mix;
            val = types.map((type, i) => {
                return { type, value: values[i] };
            });
        }
        if (val == null) {
            val = mix;
        }

        return Web3.utils.encodePacked(...val);
    }

    export function encode (typeValues: [string, any][])
    export function encode (types: ReadonlyArray<string | ParamType>, values: ReadonlyArray<any>)
    export function encode (mix: [string, any][] | ReadonlyArray<string | ParamType>, values?: ReadonlyArray<any>) {
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

    /** Returns complete method/event hash */
    export function getMethodHash (mix: string | AbiItem) {
        let abi = typeof mix === 'string'
            ? $abiParser.parseMethod(mix)
            : mix;
        let types = abi.inputs?.map(serializeMethodSignatureArgumentType) ?? [];
        let signature = `${abi.name}(${types.join(',')})`;
        let hash = $contract.keccak256(signature);
        return hash;
    }

    export function getMethodSignature (mix: string | AbiItem) {
        let abi = typeof mix === 'string'
            ? $abiParser.parseMethod(mix)
            : mix;
        let types = abi.inputs?.map(serializeMethodSignatureArgumentType) ?? [];
        let signature = `${abi.name}(${types.join(',')})`;
        let hash = $contract.keccak256(signature);
        return hash.substring(0, 10);
    }

    export function getTopicSignature (abi: AbiItem) {
        if ($is.hexString(abi.name)) {
            // anonymous event
            return abi.name;
        }
        let types = abi.inputs?.map(serializeMethodSignatureArgumentType) ?? [];
        let signature = `${abi.name}(${types.join(',')})`;
        let hash = $contract.keccak256(signature);
        return hash;
    }

    export function checkInterfaceOf (abi: AbiItem[], iface: AbiItem[]): { ok: boolean, missing?: string } {
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

    function abiEquals (a: AbiItem, b: AbiItem) {
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


    function serializeMethodSignatureArgumentType (input: AbiItem['inputs'][0]) {
        if (input.type === 'tuple') {
            return serializeComponents(input.components);
        }
        if (input.type === 'tuple[]') {
            return serializeComponents(input.components) + '[]';
        }
        return input.type;
    }

    function serializeComponents (components: AbiInput[]) {
        let types = components.map(x => serializeMethodSignatureArgumentType(x));
        return `(${types.join(',')})`;
    }
}
