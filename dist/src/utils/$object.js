"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$object = void 0;
const atma_utils_1 = require("atma-utils");
var $object;
(function ($object) {
    function clean(json, opts = {
        removePrivate: false,
        skipProperties: null,
        removeEmptyArrays: false,
        removeFalsy: false
    }) {
        if (json == null || typeof json !== 'object') {
            return json;
        }
        if ((0, atma_utils_1.is_ArrayLike)(json)) {
            let arr = json;
            let i = 0;
            let notNullIndex = -1;
            for (; i < arr.length; i++) {
                let val = arr[i];
                if (val != null) {
                    notNullIndex = i;
                }
                $object.clean(val, opts);
            }
            // clean all last nullable values
            if (notNullIndex + 1 < arr.length) {
                arr.splice(notNullIndex + 1);
            }
            return json;
        }
        if ((0, atma_utils_1.is_Object)(json)) {
            for (let key in json) {
                if (opts.skipProperties != null && key in opts.skipProperties) {
                    delete json[key];
                    continue;
                }
                if (opts.ignoreProperties != null && key in opts.ignoreProperties) {
                    continue;
                }
                if (opts.removePrivate === true && key[0] === '_') {
                    delete json[key];
                    continue;
                }
                let val = json[key];
                if (opts.shouldRemove?.(key, val)) {
                    delete json[key];
                    continue;
                }
                if (isDefault(val, opts)) {
                    if (opts.strictProperties != null && key in opts.strictProperties && val != null) {
                        continue;
                    }
                    delete json[key];
                    continue;
                }
                if (opts.deep !== false) {
                    $object.clean(val, opts);
                }
                if (opts.removeEmptyArrays && (0, atma_utils_1.is_ArrayLike)(val) && val.length === 0) {
                    delete json[key];
                }
            }
            return json;
        }
        return json;
    }
    $object.clean = clean;
    function isDefault(x, opts) {
        if (x == null) {
            return true;
        }
        if (opts.removeFalsy && (x === '' || x === false)) {
            return true;
        }
        if (opts.removeEmptyArrays && (0, atma_utils_1.is_ArrayLike)(x) && x.length === 0) {
            return true;
        }
        return false;
    }
})($object = exports.$object || (exports.$object = {}));
