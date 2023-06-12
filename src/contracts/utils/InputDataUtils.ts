import { Web3Client } from '@dequanto/clients/Web3Client';
import { $abiParser } from '../../utils/$abiParser';
import { utils } from 'ethers';
import type { AbiItem } from 'web3-utils';
import type { ParamType } from 'ethers/lib/utils';

export namespace InputDataUtils {
    export function split (inputData: string): { method: string, args: string[] } {
        let str = inputData.substring(2);
        if (str === '') {
            return { method: '', args: [] }
        }
        let methodName = str.substring(0, 8);
        let params = str.substring(8);
        let args = [];
        while (params.length > 0) {
            args.push(params.substring(0, 64));
            params = params.substring(64);
        }
        return {
            method: methodName,
            args
        };
    }

    export function decode (inputs: AbiItem['inputs'], bytes: string) {
        let types = inputs.map(x => x.type);
        let args = utils.defaultAbiCoder.decode(
            types,
            bytes
        );
        let arr = Array.from(args);
        return normalizeArgs(arr);
    }
    export function decodeParamsWithABI (abi: string | AbiItem, bytes: string): any[] {
        if (typeof abi === 'string') {
            abi = $abiParser.parseMethod(abi);
        }
        let inputs = abi.inputs;
        let types = inputs.map(x => x.type);
        let args = utils.defaultAbiCoder.decode(
            //types,
            inputs as ParamType[],
            bytes
        );
        let arr = Array.from(args);
        return normalizeArgs(arr);
    }
    export function decodeWithABI (IFunctionABI: string | AbiItem, ...params): string {
        let iface = new utils.Interface([ IFunctionABI as any ]);
        let methodName: string;

        if (typeof IFunctionABI === 'string') {
            methodName = /function \s*(?<methodName>[\w\d_]+)/.exec(IFunctionABI)?.groups?.methodName;
        } else {
            methodName = IFunctionABI.name;
        }

        if (methodName == null) {
            throw new Error(`Invalid method in ${IFunctionABI}. Expects "function foo(...)"`)
        }
        return iface.encodeFunctionData(methodName, params);
    }


    /**
     * function work(uint256 id, address worker, uint256 principalAmount, uint256 loan, uint256 maxReturn, bytes calldata data)
     */
    export function encodeWithABI (IFunctionABI: string | AbiItem, ...params): string {
        let iface = new utils.Interface([ IFunctionABI as any ]);
        let methodName: string;

        if (typeof IFunctionABI === 'string') {
            methodName = /function \s*(?<methodName>[\w\d_]+)/.exec(IFunctionABI)?.groups?.methodName;
        } else {
            methodName = IFunctionABI.name;
        }
        if (methodName == null) {
            throw new Error(`Invalid method in ${IFunctionABI}. Expects "function foo(...)"`)
        }
        let result = iface.encodeFunctionData(methodName, params);
        return result;
    }

    export function encodeWithTypes (client: Web3Client, types: any[], parameters: any[]): string {
        return client.encodeParameters(types, parameters);
    }

    export function normalizeArgs (args: any[]) {
        return args.map(val => {
            if (val?._isBigNumber) {
                return BigInt(val.toString());
            }

            return val;
        })
    }

}
