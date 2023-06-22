import { $abiParser } from '@dequanto/utils/$abiParser';
import { $abiType } from '@dequanto/utils/$abiType';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import alot from 'alot';

export namespace $types {
    export function isFixedArray (type: string) {
        return /\[\d+\]$/.test(type);
    }
    export function isDynamicArray (type: string) {
        return /\[\s*\]$/.test(type);
    }
    export function isArray (type: string) {
        let rgxArray = /\[(?<size>\d+)?\]$/;
        let isArray = rgxArray.test(type);
        return isArray;
    }
    export function isStruct (type: string) {
        return /^\(.+\)$/.test(type);
    }
    export function isMapping(type: string) {
        return /mapping\(.+\)$/.test(type);
    }


    export function sizeOf(type: string) {
        if (type === 'address') {
            // 20bytes
            return 20 * 8;
        }
        if (type === 'bool') {
            return 1 * 8;
        }
        if (type === 'string') {
            return Infinity;
        }
        type = $abiUtils.fromAliasIfAny(type);

        let intMatch = /^u?int(?<size>\d+)?$/.exec(type);
        if (intMatch) {
            return Number(intMatch.groups.size ?? 256);
        }

        let bytesMatch = /^bytes(?<size>\d+)$/.exec(type);
        if (bytesMatch) {
            return Number(bytesMatch.groups.size) * 8;
        }
        if ($types.isFixedArray(type)) {
            let baseType = $abiType.array.getBaseType(type);
            let baseTypeSize = sizeOf(baseType);
            let length = $abiType.array.getLength(type);
            return baseTypeSize * length;
        }
        if ($types.isStruct(type)) {
            let inputs = $abiParser.parseArguments(type);
            let size = alot(inputs).sum(input => sizeOf(input.type));
            return size;
        }
        return Infinity;
    }
}
