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
}
