"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileServiceTransport = void 0;
const GnosisSafe_1 = require("@dequanto-contracts/gnosis/GnosisSafe");
const atma_io_1 = require("atma-io");
const _address_1 = require("@dequanto/utils/$address");
class FileServiceTransport {
    constructor(client, owner, path) {
        this.client = client;
        this.owner = owner;
        this.path = path;
        this.file = new atma_io_1.File(this.path, { cached: false });
    }
    async getTx(safeTxHash) {
        let current = await this.get();
        let tx = current.find(x => x.safeTxHash === safeTxHash);
        if (tx == null) {
            throw new Error(`Safe Tx not found in ${this.path}`);
        }
        return tx;
    }
    async getTxConfirmations(safeTxHash) {
        let tx = await this.getTx(safeTxHash);
        let confirmations = tx.confirmations ?? [];
        return {
            count: confirmations.length,
            results: confirmations
        };
    }
    async confirmTx(safeTxHash, sig) {
        let arr = await this.get();
        let tx = arr.find(x => x.safeTxHash === safeTxHash);
        if (tx == null) {
            throw new Error(`Safe Tx not found in ${this.path}`);
        }
        let confirmations = tx.confirmations;
        if (confirmations == null) {
            confirmations = tx.confirmations = [];
        }
        let currentSig = confirmations.find(x => _address_1.$address.eq(x.owner, sig.owner));
        if (currentSig) {
            // already signed
            return currentSig;
        }
        let innerSig = {
            owner: sig.owner,
            signature: sig.signature
        };
        confirmations.push(innerSig);
        await this.save(arr);
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
        let arr = await this.get();
        let current = arr.find(x => x.safeTxHash === args.safeTxHash);
        if (current) {
            //already created
            return;
        }
        arr.push({
            ...args.safeTransaction.data,
            safe: args.safeAddress,
            safeTxHash: args.safeTxHash,
            confirmations: [],
        });
        await this.save(arr);
    }
    async get() {
        try {
            return await atma_io_1.File.readAsync(this.path, { cached: false });
        }
        catch (error) {
            return [];
        }
    }
    async save(arr) {
        await atma_io_1.File.writeAsync(this.path, arr);
    }
}
exports.FileServiceTransport = FileServiceTransport;
