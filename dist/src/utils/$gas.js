"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$gas = void 0;
const _bigint_1 = require("@dequanto/utils/$bigint");
var $gas;
(function ($gas) {
    function formatUsed(txData, receipt) {
        let usage = receipt.gasUsed;
        let price = BigInt(receipt.effectiveGasPrice ?? txData.gasPrice ?? 1);
        let priceGwei = _bigint_1.$bigint.toGweiFromWei(price);
        let totalEth = _bigint_1.$bigint.toEther(BigInt(usage) * price);
        return `${totalEth}ETH(${usage}gas × ${priceGwei}gwei)`;
    }
    $gas.formatUsed = formatUsed;
})($gas = exports.$gas || (exports.$gas = {}));
