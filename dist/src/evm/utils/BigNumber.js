"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigNumber = void 0;
var BigNumber;
(function (BigNumber) {
    function isInstance(mix) {
        return typeof mix === 'bigint';
    }
    BigNumber.isInstance = isInstance;
    function isZero(mix) {
        return mix === 0n;
    }
    BigNumber.isZero = isZero;
})(BigNumber = exports.BigNumber || (exports.BigNumber = {}));
