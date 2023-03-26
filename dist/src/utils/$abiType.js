"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$abiType = void 0;
const _types_1 = require("@dequanto/solidity/utils/$types");
const alot_1 = __importDefault(require("alot"));
const _require_1 = require("./$require");
var $abiType;
(function ($abiType_1) {
    function getTsTypeFromDefinition(type) {
        type = type.trim();
        if (_types_1.$types.isArray(type)) {
            let baseType = array.getBaseType(type);
            let baseTsType = getTsTypeFromDefinition(baseType);
            return `${baseTsType}[${array.serializeLength(type)}]`;
        }
        if (type.startsWith('(')) {
            let entries = [];
            for (let i = 1; i < type.length; i++) {
                i = Parse.skipWhitespace(type, i);
                let c = type[i];
                let start = i;
                let tsTypeEnd;
                if (c === '(') {
                    i = 1 + Parse.goToClosing(type, i + 1, c);
                    tsTypeEnd = i;
                }
                else if (c === 'm' && type.substring(i, i + 'mapping'.length) === 'mapping') {
                    i = i + 'mapping'.length;
                    i = Parse.skipWhitespace(type, i);
                    let c = type[i];
                    if (c !== '(') {
                        throw new Error(`Expect "(" after the mapping keyword. Got ${type.substring(i, i + 10)} ...`);
                    }
                    i = 1 + Parse.goToClosing(type, i + 1, c);
                    tsTypeEnd = i;
                }
                else {
                    i = Parse.goToTypeBoundary(type, i);
                    tsTypeEnd = i;
                }
                i = Parse.skipWhitespace(type, i);
                c = type[i];
                if (c === '[') {
                    i = 1 + Parse.goToClosing(type, i + 1, c);
                    tsTypeEnd = i;
                }
                let solType = type.substring(start, i);
                let tsType = getTsTypeFromDefinition(solType);
                let name = null;
                i = Parse.skipWhitespace(type, i);
                c = type[i];
                if (/[\w_$]/.test(c)) {
                    start = i;
                    i = Parse.goToTypeBoundary(type, i);
                    name = type.substring(start, i);
                }
                entries.push({ ts: tsType, name: name });
                i = Parse.skipWhitespace(type, i);
                c = type[i];
                if (c === ')') {
                    break;
                }
                if (c === ',') {
                    i++;
                    continue;
                }
                console.log(`Invalid character starting at: ${type.substring(i)}`);
            }
            let isArray = entries.every(x => x.name == null);
            if (isArray) {
                return `[ ${entries.map(x => x.ts).join(', ')} ]`;
            }
            let keys = entries.map(x => `${x.name}: ${x.ts}`).join(', ');
            return `{ ${keys} }`;
        }
        if (_types_1.$types.isMapping(type)) {
            let valueType = $abiType.mapping.getValueType(type);
            let keyType = $abiType.mapping.getKeyType(type);
            let keyTsType = getTsTypeFromDefinition(keyType);
            let valueTsType = getTsTypeFromDefinition(valueType);
            return `Record<${keyTsType}, ${valueTsType}>`;
        }
        return getTsType(type);
    }
    $abiType_1.getTsTypeFromDefinition = getTsTypeFromDefinition;
    function getTsType($abiType, $abi) {
        let rgxArray = /\[(?<size>\d+)?\]$/;
        let isArray = rgxArray.test($abiType);
        // fix subarrays
        let rgxSubType = /\[\]\[\d+\]$/;
        if (rgxSubType.test($abiType)) {
            $abiType = $abiType.replace(rgxSubType, '');
        }
        let abiType = isArray
            ? $abiType.replace(rgxArray, '')
            : $abiType;
        let tsType = AbiTsTypes[abiType];
        if (tsType == null) {
            let byRgx = (0, alot_1.default)(AbiTsTypesRgx).map(definition => ({ match: definition.rgx.exec(abiType), definition })).first(x => x.match != null);
            if (byRgx) {
                let { match, definition } = byRgx;
                tsType = definition.fromMatch?.(match) ?? definition.type;
            }
        }
        if (tsType == null && abiType === 'tuple') {
            let components = $abi?.components;
            if (components == null) {
                throw new Error(`Components undefined for tuple ${$abi?.name ?? ''}`);
            }
            let fields = components.map(x => {
                return `${x.name}: ${getTsType(x.type, x)}`;
            }).join(', ');
            tsType = `{ ${fields} }`;
        }
        if (tsType == null) {
            throw new Error(`Unknown abi type in return: "${abiType}"`);
        }
        return isArray
            ? `${tsType}[]`
            : `${tsType}`;
    }
    $abiType_1.getTsType = getTsType;
    ;
    let array;
    (function (array) {
        // uint256[2] bytes32[] ...
        function getBaseType(arrayType) {
            let baseType = arrayType.replace(/\[\d*\]\s*$/, '');
            _require_1.$require.notEq(baseType, arrayType, `${arrayType} is not valid array declaration`);
            return baseType;
        }
        array.getBaseType = getBaseType;
        function getLength(arrayType) {
            let match = /\[(?<len>\d+)?\]$/.exec(arrayType);
            _require_1.$require.notNull(match, `${arrayType} is not valid array declaration`);
            return Number(match.groups.len ?? Infinity);
        }
        array.getLength = getLength;
        function serializeLength(arrayType) {
            let match = /\[(?<len>\d+)?\]$/.exec(arrayType);
            return match?.groups?.len ?? '';
        }
        array.serializeLength = serializeLength;
    })(array = $abiType_1.array || ($abiType_1.array = {}));
    let mapping;
    (function (mapping) {
        function getKeyType(mappingType) {
            let mid = mappingType.indexOf('=>');
            _require_1.$require.True(mid > -1, `Invalid mapping type: ${mappingType}`);
            let str = mappingType.substring(0, mid);
            return str.replace(/mapping\s*\(/, '').trim();
        }
        mapping.getKeyType = getKeyType;
        function getValueType(mappingType) {
            let mid = mappingType.indexOf('=>');
            _require_1.$require.True(mid > -1, `Invalid mapping type: ${mappingType}`);
            let closed = 0;
            for (let i = mid + 2; i < mappingType.length; i++) {
                let c = mappingType[i];
                if (c === '(') {
                    closed++;
                    continue;
                }
                if (c === ')') {
                    closed -= 1;
                    if (closed === -1) {
                        return mappingType.substring(mid + 2, i).trim();
                    }
                }
            }
            throw new Error(`Mapping value was not extracted from ${mappingType}`);
        }
        mapping.getValueType = getValueType;
        // export function isMapping (type: string) {
        //     return type.startsWith('mapping');
        // }
    })(mapping = $abiType_1.mapping || ($abiType_1.mapping = {}));
    const AbiTsTypes = {
        'enum': 'number',
        'uint': 'number',
        'int': 'number',
        'bool': 'boolean',
        'bytes': 'TBufferLike',
        'bytes4': 'TBufferLike',
        'bytes32': 'TBufferLike',
        'bytes64': 'TBufferLike',
        'bytes128': 'TBufferLike',
        'bytes256': 'TBufferLike',
        'address': 'TAddress',
        'string': 'string',
    };
    const AbiTsTypesRgx = [
        {
            rgx: /u?int(?<bits>\d+)?/,
            fromMatch(match) {
                let bits = Number(match.groups.bits ?? 256);
                if (bits > 64) {
                    return 'bigint';
                }
                return 'number';
            },
            type: null,
        },
        {
            rgx: /bytes(?<bits>\d+)?/,
            fromMatch(match) {
                return 'TBufferLike';
            },
            type: null,
        },
        // {
        //     rgx: /uint\d+/,
        //     type: 'bigint',
        // }
    ];
})($abiType = exports.$abiType || (exports.$abiType = {}));
var Parse;
(function (Parse) {
    function skipWhitespace(str, _i) {
        let i = _i;
        for (; i < str.length; i++) {
            if (str.charCodeAt(i) > 32) {
                return i;
            }
        }
        return i;
    }
    Parse.skipWhitespace = skipWhitespace;
    function goToClosing(str, startI, openChar, closeChar) {
        closeChar = closeChar ?? CLOSE_CHARS[openChar];
        let count = 1;
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
    function goToTypeBoundary(type, i) {
        let rgx = /[\w_$]/;
        for (; i < type.length; i++) {
            if (rgx.test(type[i])) {
                continue;
            }
            break;
        }
        return i;
    }
    Parse.goToTypeBoundary = goToTypeBoundary;
})(Parse || (Parse = {}));
