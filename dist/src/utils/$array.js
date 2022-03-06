"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$array = void 0;
var $array;
(function ($array) {
    function upsert(arr, x, matcher, opts) {
        if (arr == null) {
            return [x];
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
    $array.upsert = upsert;
    function remove(arr, x) {
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
    $array.remove = remove;
    function replace(arr, item, matcher) {
        for (let i = 0; i < arr.length; i++) {
            if (matcher(arr[i], item, i)) {
                arr[i] = item;
            }
        }
        arr.push(item);
    }
    $array.replace = replace;
    function shuffle(arr) {
        return arr.sort(() => Math.random() - 0.5);
    }
    $array.shuffle = shuffle;
})($array = exports.$array || (exports.$array = {}));
