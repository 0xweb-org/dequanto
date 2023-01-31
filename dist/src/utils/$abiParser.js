"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$abiParser = void 0;
var $abiParser;
(function ($abiParser) {
    function getReturnType(abi) {
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
    $abiParser.getReturnType = getReturnType;
    function getReturnTypeFromTypes(outputs) {
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
    $abiParser.getReturnTypeFromTypes = getReturnTypeFromTypes;
    const methodRgx = /^((?<type>function|event)\s+)?(?<methodName>\w+)\s*\((?<params>[^)]+)?\)\s*((:|returns)(?<return>.+))?$/;
    /**
     *  foo(uint256):address
     *  function foo(uint256): (address account, uint256 value)
     *  function foo(uint256) returns (address)
     */
    function parseMethod(methodAbi) {
        let outputs;
        let match = methodRgx.exec(methodAbi);
        if (match == null) {
            throw new Error(`Invalid method abi ${methodAbi}. Expect like 'foo(uint256):address'`);
        }
        let fnName = match.groups.methodName;
        let $return = match.groups.return?.trim() ?? '';
        outputs = parseArguments($return);
        let inputs = Parse.parametersLine(match.groups.params ?? '');
        return {
            constant: false,
            payable: false,
            //"stateMutability": "view",
            name: fnName,
            inputs: inputs,
            outputs: outputs,
            type: match.groups.type ?? 'function',
        };
    }
    $abiParser.parseMethod = parseMethod;
    // uint256
    // address[]
    // (uint256, uint256)
    // (uint256 foo, uint256 bar)
    // (uint256 foo, uint256 bar)[]
    function parseArguments(line) {
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
    $abiParser.parseArguments = parseArguments;
})($abiParser = exports.$abiParser || (exports.$abiParser = {}));
var Parse;
(function (Parse) {
    // uint256 foo, uint bar, address qux
    function parametersLine(paramsStr) {
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
    Parse.parametersLine = parametersLine;
    function goToClosing(str, startI, openChar, closeChar) {
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
    Parse.goToClosing = goToClosing;
    const CLOSE_CHARS = {
        '[': ']',
        '(': ')'
    };
})(Parse || (Parse = {}));
