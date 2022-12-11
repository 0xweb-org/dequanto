import { $require } from '@dequanto/utils/$require';

export namespace $types {
    export function isFixedArray (type: string) {
        return /\[\d+\]$/.test(type);
    }
    export function isDynamicArray (type: string) {
        return /\[\s*\]$/.test(type);
    }
    export function isMapping(type: string) {
        return /mapping\(.+\)$/.test(type);
    }

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
}
