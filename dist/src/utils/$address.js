"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$address = void 0;
var $address;
(function ($address) {
    function eq(a1, a2) {
        return a1?.toUpperCase() === a2?.toUpperCase();
    }
    $address.eq = eq;
    function find(arr, getter, address) {
        return arr.find(x => eq(getter(x), address));
    }
    $address.find = find;
    function isValid(address) {
        let rgx = /0x[\dA-F]{40,}/i;
        return rgx.test(address);
    }
    $address.isValid = isValid;
    function isEmpty(address) {
        if (address == null || address === '') {
            return true;
        }
        if (/^0x0+$/.test(address)) {
            return true;
        }
        return false;
    }
    $address.isEmpty = isEmpty;
    function expectValid(address, message) {
        if (isValid(address) === false) {
            throw new Error(`${address} is invalid: ${message}`);
        }
        return address;
    }
    $address.expectValid = expectValid;
    function toBytes32(address) {
        return address.toLowerCase().substring(2).padStart(32, '0');
    }
    $address.toBytes32 = toBytes32;
    $address.ZERO = '0x0000000000000000000000000000000000000000';
})($address = exports.$address || (exports.$address = {}));
