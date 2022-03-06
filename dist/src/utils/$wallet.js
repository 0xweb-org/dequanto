"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$wallet = void 0;
const ethers_1 = require("ethers");
var $wallet;
(function ($wallet) {
    async function ecdsaSign(account, message) {
        let wallet = new ethers_1.Wallet(account.key);
        let signature = await wallet.signMessage(message);
        return signature;
    }
    $wallet.ecdsaSign = ecdsaSign;
})($wallet = exports.$wallet || (exports.$wallet = {}));
