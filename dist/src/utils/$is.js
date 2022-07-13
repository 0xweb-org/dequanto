"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$is = void 0;
var $is;
(function ($is) {
    function Number(val, message = 'Invalid.', opts) {
        if (typeof val !== 'number') {
            throw new Error(`Value is not a number. ${message}`);
        }
        if (opts?.min != null && val < opts.min) {
            throw new Error(`Value ${val} is less than ${opts.min}. ${message}`);
        }
        if (opts?.max != null && val > opts.max) {
            throw new Error(`Value ${val} is greater than ${opts.max}. ${message}`);
        }
        return val;
    }
    $is.Number = Number;
    function notNull(val, message) {
        if (val == null) {
            throw new Error(`Value is undefined. ${message}`);
        }
        return val;
    }
    $is.notNull = notNull;
    function BigInt(val, message) {
        if (typeof val !== 'bigint') {
            throw new Error(`Value is undefined. ${message}`);
        }
        return val;
    }
    $is.BigInt = BigInt;
    function Address(val, message) {
        if (typeof val !== 'string') {
            return false;
        }
        return /^0x[a-fA-F0-9]{40}$/g.test(val);
    }
    $is.Address = Address;
    function hexString(str) {
        if (typeof str !== 'string') {
            return false;
        }
        return /^0x[\da-f]+$/i.test(str);
    }
    $is.hexString = hexString;
})($is = exports.$is || (exports.$is = {}));
