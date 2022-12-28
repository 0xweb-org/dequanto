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
}
