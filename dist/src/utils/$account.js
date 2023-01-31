"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$account = void 0;
const _address_1 = require("./$address");
var $account;
(function ($account) {
    function getSender(account) {
        if (typeof account === 'string') {
            if (_address_1.$address.isValid(account)) {
                return { address: account };
            }
            return { name: account };
        }
        let acc = isSafe(account)
            ? account.operator
            : account;
        return acc;
    }
    $account.getSender = getSender;
    function isSafe(account) {
        if (account == null) {
            return false;
        }
        if (typeof account === 'string') {
            return /^safe\//.test(account);
        }
        return 'operator' in account;
    }
    $account.isSafe = isSafe;
})($account = exports.$account || (exports.$account = {}));
