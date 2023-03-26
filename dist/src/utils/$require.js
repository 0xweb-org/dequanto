"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$require = void 0;
const _is_1 = require("./$is");
var $require;
(function ($require) {
    function Number(val, message = '', opts) {
        if (typeof val !== 'number') {
            throw new Error(`Expects number type, got ${typeof val} ${val}. ${message}`);
        }
        if (isNaN(val)) {
            throw new Error(`Value is Not-a-Number. ${message}`);
        }
        if (opts?.min != null && val < opts.min) {
            throw new Error(`Value ${val} is less than ${opts.min}. ${message}`);
        }
        if (opts?.max != null && val > opts.max) {
            throw new Error(`Value ${val} is greater than ${opts.max}. ${message}`);
        }
        return val;
    }
    $require.Number = Number;
    function BigInt(val, message = '', opts) {
        if (typeof val !== 'bigint') {
            throw new Error(`Expects bigint type, got ${typeof val} (${val}). ${message}`);
        }
        if (opts?.min != null && val < opts.min) {
            throw new Error(`Value ${val} is less than ${opts.min}. ${message}`);
        }
        if (opts?.max != null && val > opts.max) {
            throw new Error(`Value ${val} is greater than ${opts.max}. ${message}`);
        }
        return val;
    }
    $require.BigInt = BigInt;
    function Numeric(val, message = '', opts) {
        if (typeof val === 'number') {
            return Number(val, message, opts);
        }
        if (typeof val === 'bigint') {
            return BigInt(val, message, opts);
        }
        throw new Error(`Expects numeric type, got ${typeof val}. ${message}`);
    }
    $require.Numeric = Numeric;
    function Function(val, message) {
        if (typeof val !== 'function') {
            throw new Error(`Value is not a function ${message}`);
        }
        return val;
    }
    $require.Function = Function;
    function String(val, message) {
        if (typeof val !== 'string') {
            throw new Error(`Value ${val} is not a string ${message}`);
        }
        return val;
    }
    $require.String = String;
    function notNull(val, message) {
        if (val == null) {
            throw new Error(`Value is undefined. ${message}`);
        }
        return val;
    }
    $require.notNull = notNull;
    function notEmpty(val, message) {
        if (val == null) {
            throw new Error(`Value is undefined. ${message}`);
        }
        if (typeof val === 'string' && val.trim().length === 0) {
            throw new Error(`Value is empty string. ${message}`);
        }
        else if (Array.isArray(val) && val.length === 0) {
            throw new Error(`Value is empty array. ${message}`);
        }
        return val;
    }
    $require.notEmpty = notEmpty;
    function True(value, message) {
        if (value !== true) {
            throw new Error(`Got false expression ${message}`);
        }
    }
    $require.True = True;
    function notEq(a, b, message = '') {
        // not strict equal
        if (a == b) {
            throw new Error(`${a} and ${b} shouldn't be equal. ${message}`);
        }
    }
    $require.notEq = notEq;
    function eq(a, b, message = '') {
        // not strict equal
        if (a != b) {
            throw new Error(`${a} and ${b} should be equal. ${message}`);
        }
    }
    $require.eq = eq;
    function match(rgx, str, message = '') {
        if (typeof str !== 'string') {
            throw new Error(`Expected a string to find in. ${message}`);
        }
        if (rgx.test(str) === false) {
            throw new Error(`Expected string "${str}" to match ${rgx.toString()}. ${message}`);
        }
    }
    $require.match = match;
    function oneOf(a, arr, message = '') {
        // not strict equal
        if (arr.includes(a) === false) {
            throw new Error(`${a} should be one of ${arr.join(', ')}. ${message}`);
        }
    }
    $require.oneOf = oneOf;
    function Address(val, message = '') {
        if (_is_1.$is.Address(val) === false) {
            throw new Error(`Value ${val} is not a valid address. ${message}`);
        }
        return val;
    }
    $require.Address = Address;
    function TxHash(val, message = '') {
        if (_is_1.$is.TxHash(val) === false) {
            throw new Error(`Value ${val} is not a valid tx hash. ${message}`);
        }
        return val;
    }
    $require.TxHash = TxHash;
    function Token(token, message = '') {
        if (token == null) {
            throw new Error(`Token is undefined. ${message}`);
        }
        if (token.address == null) {
            throw new Error(`Token address property is undefined. ${message}`);
        }
        if (token.decimals == null) {
            throw new Error(`Token decimals property is undefined. ${message}`);
        }
        return token;
    }
    $require.Token = Token;
    /**
     * throws when a <= b
     */
    function gt(a, b, message = '') {
        Numeric(a);
        Numeric(b);
        if (a <= b) {
            throw new Error(`Expected a(${a}) > b(${b}). ${message}`);
        }
    }
    $require.gt = gt;
})($require = exports.$require || (exports.$require = {}));
