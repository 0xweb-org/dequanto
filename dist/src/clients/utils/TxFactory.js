"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxFactory = void 0;
const tx_1 = require("@ethereumjs/tx");
var TxFactory;
(function (TxFactory) {
    function fromTxData(txData, opts) {
        const Factory = txData.type && Number(txData.type) === 2
            ? tx_1.FeeMarketEIP1559Transaction
            : tx_1.Transaction;
        return Factory.fromTxData(txData, opts);
    }
    TxFactory.fromTxData = fromTxData;
})(TxFactory = exports.TxFactory || (exports.TxFactory = {}));
