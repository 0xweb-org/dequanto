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
        if (val == null) {
            throw new Error(`Value is undefined. ${message}`);
        }
        if (/^0x[\w]{10,}$/.test(val) === false) {
            throw new Error(`Value ${val} is not a valid address. ${message}`);
        }
        return val;
    }
    $is.Address = Address;
})($is = exports.$is || (exports.$is = {}));
