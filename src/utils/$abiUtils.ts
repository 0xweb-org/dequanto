import { type AbiItem } from 'web3-utils';
import { utils }  from 'ethers';
import { $contract } from './$contract';
import Web3 from 'web3';

export namespace $abiUtils {

    export function encodePacked (...args: any[]) {
        return Web3.utils.encodePacked(...args);
    }

    export function encode (types: any[], values: any[]) {
        let coder = new utils.AbiCoder();
        return coder.encode(types, values)
    }

    /** Returns complete method/event hash */
    export function getMethodHash (abi: AbiItem) {
        let types = abi.inputs?.map(serializeMethodSignatureArgumentType) ?? [];
        let signature = `${abi.name}(${types.join(',')})`;
        let hash = $contract.keccak256(signature);
        return hash;
    }

    export function getMethodSignature (abi: AbiItem) {
        let types = abi.inputs?.map(serializeMethodSignatureArgumentType) ?? [];
        let signature = `${abi.name}(${types.join(',')})`;
        let hash = $contract.keccak256(signature);
        return hash.substring(0, 10);
    }
    function serializeMethodSignatureArgumentType (input: AbiItem['inputs'][0]) {
        if (input.type === 'tuple') {
            let types = input.components.map(x => serializeMethodSignatureArgumentType(x));
            return `(${types.join(',')})`;
        }
        return input.type;
    }
}
