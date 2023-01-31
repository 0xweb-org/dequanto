export type IAccessorItem = { key: string, type: 'key' } | { key: number, type: 'index' }



export class Accessor {

    constructor (public keys: IAccessorItem[]) {

    }

    /**
     * "foo.bar"
     * "foos[0].bar"
     * "foo['key'].bar"
     * "[0].qux"
     * @param path
     */
    static parse (path: string): Accessor {
        path = path.trim();
        let arr = [] as IAccessorItem[];
        for (let i = 0; i < path.length; i++) {
            i = Parse.skipWhitespace(path, i);

            let c = path[i];
            if (c === '.') {
                continue;
            }
            if (c === "[") {
                let end = Parse.goToClosing(path, i + 1, '[', ']');
                let keyStr = path.substring(i + 1, end);
                let { value, type } = Parse.parseKey(keyStr);
                i = end;
                arr.push({
                    key: value as any,
                    type
                });
                continue;
            }
            let end = Parse.goToFieldEnd(path, i);
            arr.push({
                key: path.substring(i, end),
                type: 'key',
            });
            i = end - 1;
            continue;
        }
        return new Accessor(arr);
    }
}



namespace Parse {

    export function goToFieldEnd (str: string, i: number) {
        for (; i < str.length; i++) {
            let c = str[i];
            if (c === ' ' || c === '.' || c === '[') {
                return i;
            }
        }
        return i;
    }

    export function parseKey(str: string): { value: number | string, type: 'index' | 'key' } {
        let start = skipWhitespace(str, 0);
        let c = str[start];

        let quotes = c === '"' || c === "'";
        if (quotes) {
            start = start + 1;
        }
        let end = quotes ? goToQuoteEnd(str, start + 1, c) : str.length;
        let key = str.substring(start, end);
        let value = key.trim();

        if (quotes === false && /^\d+$/.test(value)) {
            return {
                value: Number(value),
                type: 'index'
            };
        }
        return {
            value,
            type: 'key'
        };
    }

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
    export function goToQuoteEnd (str: string, startI: number, quote: string) {
        for (let i = startI; i < str.length; i++) {
            let c = str[i];
            if (c === '\\') {
                i++;
                continue;
            }
            if (str[i] === quote) {
                return i;
            }
        }
        throw new Error(`Not found closing quote ${quote} in ${str}`);
    }


    const CLOSE_CHARS = {
        '[': ']',
        '(': ')'
    };

}
