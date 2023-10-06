import type { TAbiItem, TAbiInput, TAbiOutput } from '@dequanto/types/TAbi';
import { $require } from './$require';
import { $str } from '@dequanto/solidity/utils/$str';

interface IParameter {
    name?: string
    type?: string
    components?: IParameter[]
}
export namespace $abiParser {
    export function getReturnType (abi: TAbiItem): 'array' | 'object' | 'uint256' | 'boolean' | 'buffer' | string {
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
    export function getReturnTypeFromTypes (outputs: TAbiOutput[]): 'array' | 'object' | 'uint256' | 'boolean' | 'buffer' | string {
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

    const rgxMethodName = /^((?<type>function|event)\s+)?(?<methodName>\w+)/;
    const rgxMethodReturn = /((:|returns)(?<return>.+))?$/;
    const rgxArguments = /^\(.?\)$/;
    const rgxModifiers = /(?<=\))[\s\w]+$/
    /**
     *  foo(uint256):address
     *  function foo(uint256): (address account, uint256 value)
     *  function foo(uint256) returns (address)
     */
    export function parseMethod (methodAbi: string): TAbiItem {
        let matchMethodName = rgxMethodName.exec(methodAbi);
        $require.notNull(matchMethodName, `Method name in abi ${methodAbi} is not valid. Expect like 'foo(uint256):address`);

        let matchReturn = rgxMethodReturn.exec(methodAbi);

        let fnName = matchMethodName.groups.methodName;
        let fnParams = $str.removeRgxMatches(methodAbi, matchMethodName, matchReturn).trim();
        $require.notNull(rgxArguments.test(fnParams), `Method arguments in abi ${methodAbi} is not valid. Expect like 'foo(uint256):address`);

        let stateMutability = void 0;
        let fnModifiers = rgxModifiers.exec(fnParams);
        if (fnModifiers) {
            let str = fnModifiers[0]
            stateMutability = /\b(view|pure)\b/.exec(str)?.[1] ?? void 0;
            fnParams = $str.removeRgxMatches(fnParams, fnModifiers);
        }

        // Remove trailing '()'
        fnParams = fnParams.substring(1, fnParams.length - 1);

        let outputs = parseArguments(matchReturn.groups.return?.trim() ?? '');

        let inputs = Parse.parametersLine(fnParams)
        let isSig = /^0x[A-F\d]{8}$/i.test(fnName);

        return <TAbiItem> {
            constant: false,
            payable: false,
            stateMutability,

            name: fnName,
            signature: isSig ? fnName : void 0,
            inputs: inputs,
            outputs: outputs,
            type: matchMethodName.groups.type ?? 'function',
        };
    }

    // uint256
    // address[]
    // (uint256, uint256)
    // (uint256 foo, uint256 bar)
    // (uint256 foo, uint256 bar)[]
    // ((uint256 foo, uint256 bar) foo, uint256 bar)
    export function parseArguments (line: string): TAbiInput[] {
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
            if (isArray) {
                return [
                    {
                        name: '',
                        type: `tuple[]`,
                        components: params
                    }
                ];
            }
            let delimiter = line.indexOf(',', end);
            if (delimiter === -1) {
                delimiter = line.length;
            }
            let tupleName = line.substring(end + 1, delimiter).trim();
            if (tupleName) {
                return [
                    {
                        name: tupleName,
                        type: `tuple`,
                        components: params
                    }
                ];
            }


            // if (params.length === 1) {
            //     line = params[0].type;

            //     params = [
            //         {
            //             name: "",
            //             type: line,
            //         },
            //     ];
            // }

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

        let name = '';
        let type = line;
        let match = /^(?<type>.+)\s+(?<name>[\w_$]+)$/.exec(line);
        if (match) {
            name = match.groups.name;
            type = match.groups.type;
        }
        return [
            {
                name,
                type,
            },
        ];
    }
}

namespace Parse {
    // uint256 foo, uint bar, address qux
    export function parametersLine (paramsStr: string) {
        let arr = splitByDelimiter(paramsStr, ',')
        return arr.map(param => {
                // `(uint256 foo, uint256 bar)` -> single params
                // `(uint256 foo, uint256 bar) param` -> tuple
                let params = $abiParser.parseArguments(param);
                if (param.startsWith('(') && param.endsWith(')')) {
                    return {
                        name: null,
                        type: 'tuple',
                        components: params
                    } as any as TAbiInput;
                };
                return params[0];
            });
    }

    export function splitByDelimiter (line: string, delimiter: string): string[]{
        let parts = [];
        let start = 0;
        for (let i = 0; i < line.length; i++) {
            let c = line[i];
            if (c === delimiter) {
                parts.push(line.substring(start, i).trim());
                start = i + 1;
                continue;
            }
            if (c === '(') {
                i = goToClosing(line, i, c);
                continue;
            }
        }
        // final part
        parts.push(line.substring(start).trim());
        return parts.filter(Boolean);
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
