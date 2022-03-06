"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxService = void 0;
class TxService {
    constructor(client) {
        this.client = client;
    }
    async cancelTx(hash) {
        let tx = await this.client.getTransaction(hash);
        if (tx == null) {
            throw new Error(`Tx ${hash} not found`);
        }
        if (tx.blockNumber) {
            throw new Error(`Tx ${hash} was already mined in block ${tx.blockNumber}`);
        }
        console.log(tx);
    }
}
exports.TxService = TxService;
