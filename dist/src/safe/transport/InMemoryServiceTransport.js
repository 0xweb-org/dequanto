"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryServiceTransport = void 0;
const GnosisSafe_1 = require("@dequanto-contracts/gnosis/GnosisSafe");
class InMemoryServiceTransport {
    constructor(client, owner) {
        this.client = client;
        this.owner = owner;
        this.txs = {};
    }
    async getTx(safeTxHash) {
        return this.txs[safeTxHash];
    }
    async getTxConfirmations(safeTxHash) {
        let tx = this.txs[safeTxHash];
        let confirmations = tx.confirmations ?? [];
        return {
            count: confirmations.length,
            results: confirmations
        };
    }
    async confirmTx(safeTxHash, sig) {
        let tx = this.txs[safeTxHash];
        let confirmations = tx.confirmations;
        if (confirmations == null) {
            confirmations = tx.confirmations = [];
        }
        let innerSig = {
            owner: sig.owner,
            signature: sig.signature
        };
        confirmations.push(innerSig);
        return sig;
    }
    async getSafeInfo(safeAddress) {
        let contract = new GnosisSafe_1.GnosisSafe(safeAddress, this.client);
        let [nonce, threshold] = await Promise.all([
            contract.nonce(),
            contract.getThreshold(),
        ]);
        return { nonce, threshold };
    }
    async estimateSafeTransaction(safeAddress, safeTxEstimation) {
        return {
            safeTxGas: '0x0'
        };
    }
    async proposeTransaction(args) {
        this.txs[args.safeTxHash] = {
            safe: args.safeAddress,
            confirmations: [],
            ...args.safeTransaction.data
        };
    }
}
exports.InMemoryServiceTransport = InMemoryServiceTransport;
