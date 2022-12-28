import { type AbiItem } from 'web3-utils';
import Web3 from 'web3';
import { utils }  from 'ethers';
import { $contract } from './$contract';
import { $abiParser } from './$abiParser';

export namespace $abiUtils {

    export function encodePacked (...args: any[]) {
        return Web3.utils.encodePacked(...args);
    }

    export function encode (types: any[], values: any[]) {
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
            let types = input.components.map(x => serializeMethodSignatureArgumentType(x));
            return `(${types.join(',')})`;
        }
        return input.type;
    }
}
