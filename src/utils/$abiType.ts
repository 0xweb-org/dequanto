import alot from 'alot';
import { type AbiInput } from 'web3-utils';
import { $require } from './$require';
export namespace $abiType {

    export function getTsTypeFromDefinition (type: string) {
        type = type.trim();

        let rgxArray = /\[(?<size>\d+)?\]$/;
        let isArray = rgxArray.test(type);
        if (isArray) {
            let baseType = array.getBaseType(type);
            let baseTsType = getTsTypeFromDefinition(baseType);
            let match = rgxArray.exec(type);
            return `${baseTsType}${match[0]}`;
        }

        if (type.startsWith('(')) {
            let entries = [] as { ts: string, name: string }[];
            for (let i = 1; i < type.length; i++) {
                i = Parse.skipWhitespace(type, i);

                let c = type[i];

                let start = i;
                let tsTypeEnd: number;
                if (c === '(') {
                    i = 1 + Parse.goToClosing(type, i + 1, c);
                    tsTypeEnd = i;
                } else if (c === 'm' && type.substring(i, i + 'mapping'.length) === 'mapping') {
                    i = i + 'mapping'.length;
                    i = Parse.skipWhitespace(type, i);
                    let c = type[i];
                    if (c !== '(') {
                        throw new Error(`Expect "(" after the mapping keyword. Got ${type.substring(i, i + 10)} ...`);
                    }
                    i = 1 + Parse.goToClosing(type, i + 1, c);
                    tsTypeEnd = i;
                } else {
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
                let tsType = getTsTypeFromDefinition(solType)
                let name: string = null;

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
                return `[ ${entries.map(x => x.ts).join(', ')} ]`
            }
            let keys = entries.map(x => `${x.name}: ${x.ts}`).join(', ');

            return `{ ${keys} }`;
        }

        if (type.startsWith('mapping')) {
            let valueType = $abiType.mapping.getValueType(type);
            let keyType = $abiType.mapping.getKeyType(type);

            let keyTsType = getTsTypeFromDefinition(keyType);
            let valueTsType = getTsTypeFromDefinition(valueType);

            return `Record<${keyTsType}, ${valueTsType}>`;
        }
        return getTsType(type);
    }
    export function getTsType ($abiType: AbiInput['type'], $abi?: { type, name, components? }) {
        let rgxArray = /\[(?<size>\d+)?\]$/
        let isArray = rgxArray.test($abiType);

        // fix subarrays
        let rgxSubType = /\[\]\[\d+\]$/
        if (rgxSubType.test($abiType)) {
            $abiType = $abiType.replace(rgxSubType, '');
        }

        let abiType = isArray
            ? $abiType.replace(rgxArray, '')
            : $abiType;

        let tsType = AbiTsTypes[abiType];
        if (tsType == null) {
            let byRgx = alot(AbiTsTypesRgx).map(definition => ({ match: definition.rgx.exec(abiType), definition })).first(x => x.match != null);
            if (byRgx) {
                let { match, definition } = byRgx;
                tsType = definition.fromMatch?.(match) ?? definition.type;
            }
        }

        if (tsType == null && abiType === 'tuple') {
            let components = $abi?.components as { type, name }[];
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
    };

    export namespace array {
        // uint256[2] bytes32[] ...
        export function getBaseType (arrayType: string) {
            let baseType = arrayType.replace(/\[\d*\]\s*$/, '');
            $require.notEq(baseType, arrayType, `${arrayType} is not valid array declaration`);
            return baseType;
        }
        export function getLength (arrayType: string) {
            let match = /\[(?<len>\d+)?\]$/.exec(arrayType);
            $require.notNull(match, `${arrayType} is not valid array declaration`);

            return Number(match.groups.len ?? Infinity);
        }
    }
    export namespace mapping {
        export function getKeyType (mappingType: string) {
            let mid = mappingType.indexOf('=>');
            $require.True(mid > -1, `Invalid mapping type: ${mappingType}`);
            let str = mappingType.substring(0, mid);
            return str.replace(/mapping\s*\(/, '').trim();
        }
        export function getValueType (mappingType: string) {
            let mid = mappingType.indexOf('=>');
            $require.True(mid > -1, `Invalid mapping type: ${mappingType}`);

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
    }



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
            fromMatch (match: RegExpMatchArray) {
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
            fromMatch (match: RegExpMatchArray) {
                return 'TBufferLike';
            },
            type: null,
        },

        // {
        //     rgx: /uint\d+/,
        //     type: 'bigint',
        // }
    ];
}


namespace Parse {

    export function skipWhitespace (str: string, _i: number) {
        let i = _i;
        for (; i < str.length; i++) {
            if (str.charCodeAt(i) > 32) {
                return i;
            }
        }
        return i;
    }


    export function goToClosing (str: string, startI: number, openChar: string, closeChar?: string) {
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

    const CLOSE_CHARS = {
        '[': ']',
        '(': ')'
    };

    export function goToTypeBoundary(type: string, i: number): number {
        let rgx = /[\w_$]/;
        for (; i < type.length; i++) {
            if (rgx.test(type[i])) {
                continue;
            }
            break;
        }
        return i;
    }
}
