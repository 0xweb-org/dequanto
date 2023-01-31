"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Accessor = void 0;
class Accessor {
    constructor(keys) {
        this.keys = keys;
    }
    /**
     * "foo.bar"
     * "foos[0].bar"
     * "foo['key'].bar"
     * "[0].qux"
     * @param path
     */
    static parse(path) {
        path = path.trim();
        let arr = [];
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
                    key: value,
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
exports.Accessor = Accessor;
var Parse;
(function (Parse) {
    function goToFieldEnd(str, i) {
        for (; i < str.length; i++) {
            let c = str[i];
            if (c === ' ' || c === '.' || c === '[') {
                return i;
            }
        }
        return i;
    }
    Parse.goToFieldEnd = goToFieldEnd;
    function parseKey(str) {
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
    Parse.parseKey = parseKey;
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
    function goToQuoteEnd(str, startI, quote) {
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
    Parse.goToQuoteEnd = goToQuoteEnd;
    const CLOSE_CHARS = {
        '[': ']',
        '(': ')'
    };
})(Parse || (Parse = {}));
