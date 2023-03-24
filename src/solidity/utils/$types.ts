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
}
