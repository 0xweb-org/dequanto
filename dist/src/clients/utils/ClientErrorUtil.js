"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientErrorUtil = void 0;
var ClientErrorUtil;
(function (ClientErrorUtil) {
    function isConnectionFailed(error) {
        if (error.code === 1006 || error.reason === 'connection failed') {
            return true;
        }
        let str = error.message;
        if (str.includes('CONNECTION ERROR') || str.includes('Invalid JSON RPC response') || str.includes('getaddrinfo ENOTFOUND')) {
            return true;
        }
        return false;
    }
    ClientErrorUtil.isConnectionFailed = isConnectionFailed;
    function isAlreadyKnown(error) {
        return /already known/i.test(error.message);
    }
    ClientErrorUtil.isAlreadyKnown = isAlreadyKnown;
    function IsInsufficientFunds(error) {
        // @TODO - is there a future proof way to check for the error?
        return /insufficient funds/i.test(error.message);
    }
    ClientErrorUtil.IsInsufficientFunds = IsInsufficientFunds;
    function IsNonceTooLow(error) {
        return /nonce too low/i.test(error.message);
    }
    ClientErrorUtil.IsNonceTooLow = IsNonceTooLow;
})(ClientErrorUtil = exports.ClientErrorUtil || (exports.ClientErrorUtil = {}));
