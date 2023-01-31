"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$is = void 0;
var $is;
(function ($is) {
    function Number(val) {
        return typeof val === 'number' && isNaN(val) === false;
    }
    $is.Number = Number;
    function notNull(val) {
        return val != null;
    }
    $is.notNull = notNull;
    function BigInt(val) {
        return typeof val === 'bigint';
    }
    $is.BigInt = BigInt;
    function Address(val, message) {
        if (typeof val !== 'string') {
            return false;
        }
        return /^0x[a-fA-F0-9]{40}$/g.test(val);
    }
    $is.Address = Address;
    function TxHash(val) {
        if (hexString(val) === false) {
            return false;
        }
        // 0x115f9d0e3c5d7538eb27466cf42ac68527703a14e93c0d1243131164af2d1c6c
        if (val.length !== 2 + 64) {
            return false;
        }
        return true;
    }
    $is.TxHash = TxHash;
    function hexString(str) {
        if (typeof str !== 'string') {
            return false;
        }
        return /^0x[\da-f]+$/i.test(str);
    }
    $is.hexString = hexString;
})($is = exports.$is || (exports.$is = {}));
