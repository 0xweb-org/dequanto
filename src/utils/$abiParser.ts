import type { AbiItem, AbiInput, AbiOutput } from 'web3-utils';

interface IParameter {
    name?: string
    type?: string
    components?: IParameter[]
}
export namespace $abiParser {
    export function getReturnType (abi: AbiItem): 'array' | 'object' | 'uint256' | 'boolean' | 'buffer' | string {
        let outputs = abi.outputs;
        if (outputs == null || outputs.length == 0) {
            return 'uint256';
        }
        if (outputs.length === 1 && !outputs[0].name) {
            return outputs[0].type;
        }
        let hasKeys = outputs.every(x => Boolean(x.name));
        if (hasKeys) {
            return 'object';
        }
        return 'array';
    }
    export function getReturnTypeFromTypes (outputs: AbiOutput[]): 'array' | 'object' | 'uint256' | 'boolean' | 'buffer' | string {
        if (outputs == null || outputs.length == 0) {
            return 'uint256';
        }
        if (outputs.length === 1 && !outputs[0].name) {
            return outputs[0].type;
        }
        let hasKeys = outputs.every(x => Boolean(x.name));
        if (hasKeys) {
            return 'object';
        }
        return 'array';
    }

    const methodRgx = /^((?<type>function|event)\s+)?(?<methodName>\w+)\s*\((?<params>[^)]+)?\)\s*((:|returns)(?<return>.+))?$/;

    /**
     *  foo(uint256):address
     *  function foo(uint256): (address account, uint256 value)
     *  function foo(uint256) returns (address)
     */
    export function parseMethod (methodAbi: string): AbiItem {
        let outputs: IParameter[];


        let match = methodRgx.exec(methodAbi);
        if (match == null) {
            throw new Error(`Invalid method abi ${methodAbi}. Expect like 'foo(uint256):address'`);
        }

        let fnName = match.groups.methodName;
        let $return = match.groups.return?.trim() ?? '';

        outputs = parseArguments($return);

        let inputs = Parse.parametersLine(match.groups.params ?? '')

        return <AbiItem> {
            constant: false,
            payable: false,
            //"stateMutability": "view",

            name: fnName,
            inputs: inputs,
            outputs: outputs,
            type: match.groups.type ?? 'function',
        };
    }

    // uint256
    // address[]
    // (uint256, uint256)
    // (uint256 foo, uint256 bar)
    // (uint256 foo, uint256 bar)[]
    export function parseArguments (line: string): AbiInput[] {
        line = line?.trim();

        if (!line || line === '()') {
            return [];
        }
        let c = line[0];
        if (c === '{') {
            throw new Error(`${line} is not supported, use (...) or [...] declarations`);
        }


        if (c === '[' || c === '(') {
            let end = Parse.goToClosing(line, 0, c);
            let parametersLine = line.substring(1, end);
            let isArray = line.endsWith('[]');

            let params = Parse.parametersLine(parametersLine);
            let isTuple = params.every(x => Boolean(x.name));
            if (isTuple && isArray) {
                return [
                    {
                        name: '',
                        type: `tuple[]`,
                        components: params
                    }
                ];
            }

            if (params.length === 1) {
                line = params[0].type;

                params = [
                    {
                        name: "",
                        type: line,
                    },
                ];
            }

            return params;
        }

        // if (c === '{') {
        //     let params = line.substring(1, line.length - 1);

        //     outputs = params.split(',').map(x => x.trim()).map(param => {
        //         let [_type, _name] = param.split(/[\s+:]/).map(x => x.trim()).filter(Boolean);

        //         return {
        //             name: _name ?? '',
        //             type: _type.trim()
        //         };
        //     });
        // }
        return [
            {
                name: '',
                type: line,
            },
        ];
    }
}

namespace Parse {
    // uint256 foo, uint bar, address qux
    export function parametersLine (paramsStr: string) {
        return paramsStr
            .split(',')
            .map(x => x.trim())
            .filter(Boolean)
            .map(param => {
                let [_type, _name] = param.split(/\s+/).map(x => x.trim()).filter(Boolean);
                return {
                    name: _name ?? '',
                    type: _type.trim()
                };
            });
    }


    export function goToClosing (str: string, startI: number, openChar: string, closeChar?: string) {
        closeChar = closeChar ?? CLOSE_CHARS[openChar];
        let count = 0;
        for (let i = startI; i < str.length; i++) {
            if (str[i] === openChar) {
                count++;
            }
            if (str[i] === closeChar) {
                count--;
            }
            if (count === 0) {
                return i;
            }
        }
        throw new Error(`Unmatched closing chars ${openChar} ${closeChar} in ${str}`);
    }

    const CLOSE_CHARS = {
        '[': ']',
        '(': ')'
    };
}
