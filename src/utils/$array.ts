export namespace $array {
    export function upsert<T>(arr: T[], x:T, matcher: (x: T) => boolean, opts?: { patch: boolean }) {
        if (arr == null) {
            return [ x ];
        }
        for (let i = 0; i < arr.length; i++) {
            if (matcher(arr[i])) {
                let current = arr[i];
                if (opts?.patch === true) {
                    for (let key in x) {
                        if (x[key] != null) {
                            current[key] = x[key];
                        }
                    }
                    return arr;
                }
                arr.splice(i, 1, x);
                return arr;
            }
        }
        arr.push(x);
        return arr;
    }

    export function equal<T>(a: T[], b: T[]) {
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i++) {
            let aVal = a[i];
            if (aVal == null) {
                if (b[i] != null) {
                    return false;
                }
                continue;
            }
            if (typeof aVal !== 'object') {
                if (aVal != /** not strict eq*/ b[i]) {
                    return false;
                }
                continue;
            }
            if (Array.isArray(aVal)) {
                if (equal(aVal, b[i] as any[]) === false) {
                    return false;
                }
                continue;
            }
            console.error(aVal, b[i]);
            throw new Error(`Invalid comparison`)
        }
        return true;
    }

    export function remove<T>(arr: T[], matcher: (x: T) => boolean): T[]
    export function remove<T>(arr: T[], item: T): T[]
    export function remove<T>(arr: T[], x: any): T[] {
        if (typeof x === 'function') {
            let removed = [];
            for (let i = 0; i < arr.length; i++) {
                if (x(arr[i], i)) {
                    removed.push(arr[i]);
                    arr.splice(i, 1);
                    i--;
                }
            }
            return removed;
        }
        let i = arr.indexOf(x);
        if (i > -1) {
            return arr.splice(i, 1);
        }
    }

    export function replace<T>(arr: T[], item:T, matcher: (x: T, item: T, i: number) => boolean) {
        for (let i = 0; i < arr.length; i++) {
            if (matcher(arr[i], item, i)) {
                arr[i] = item;
            }
        }
        arr.push(item);
    }

    export function shuffle <T> (arr: T[]): T[]  {
        return arr.sort(() => Math.random() - 0.5);
    }

    export function trimEnd <T> (arr: T[]): T[] {
        let i = arr.length;
        while (--i > -1) {
            if (arr[i] != null) {
                break;
            }
        }
        if (i < arr.length - 1) {
            arr = arr.splice(0, i + 1);
        }
        return arr;
    }

    export function findIndex<T>(array: T[], matcher: (item: T, i?: number) => boolean, fromIdx?: number) {
        let i = fromIdx ?? 0;
        if (i < 0) {
            i = 0;
        }
        for (let i = fromIdx ?? 0; i < array.length; i++) {
            if (matcher(array[i], i)) {
                return i;
            }
        }
        return -1;
    }
}
