"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PendingTxIndexer = void 0;
const Web3ClientFactory_1 = require("@dequanto/clients/Web3ClientFactory");
const TxQueueLoader_1 = require("./handlers/TxQueueLoader");
const BlocksTxIndexer_1 = require("./BlocksTxIndexer");
const _number_1 = require("@dequanto/utils/$number");
class PendingTxIndexer {
    constructor(platform, opts) {
        this.platform = platform;
        this.opts = opts;
        this.listeners = [];
        //private mempool = [];
        this.mempoolHash = Object.create(null);
        this.status = {
            startedAt: null,
            // ~ tx/s
            txSpeed: 0,
            txCount: 0,
            txNulls: 0,
            // tx not seen in mempool
            txPrivateCount: 0,
        };
        this.client = Web3ClientFactory_1.Web3ClientFactory.get(platform, {
            ws: true
        });
        this.loader = new TxQueueLoader_1.TxQueueLoader(this.client, tx => {
            this.onMempoolTxLoaded(tx);
        });
        this.blocks = new BlocksTxIndexer_1.BlocksTxIndexer(platform, {
            name: opts.name,
            loadTransactions: false,
        });
        this.blocks.onBlock(async (client, block) => {
            this.onBlockLoaded(block);
        });
    }
    onTransaction(cb) {
        this.listeners.push(cb);
        return this;
    }
    stats() {
        if (this.status.startedAt == null) {
            return { active: false };
        }
        let seconds = (Date.now() - this.status.startedAt) / 1000 | 0;
        let txSpeed = _number_1.$number.round(this.status.txCount / seconds, 2);
        return {
            active: true,
            txSpeed: txSpeed,
            ...this.status,
            loader: {
                ...this.loader.stats()
            },
            blocks: {
                ...this.blocks.stats()
            },
        };
    }
    async start() {
        this.status.startedAt = Date.now();
        this.client.subscribe('pendingTransactions', (error, hash) => {
            this.status.txCount++;
            this.mempoolHash[hash] = 1;
            this.loader.push(hash);
        });
        this.blocks.start();
    }
    onMempoolTxLoaded(tx) {
        if (tx == null) {
            this.status.txNulls++;
            return;
        }
        for (let i = 0; i < this.listeners.length; i++) {
            this.listeners[i](this.client, tx);
        }
    }
    onBlockLoaded(block) {
        for (let i = 0; i < block.transactions.length; i++) {
            let hash = block.transactions[i];
            if (hash in this.mempoolHash) {
                delete this.mempoolHash[hash];
                continue;
            }
            //Not seen in memhash;
            this.status.txPrivateCount++;
            this.status.txCount++;
            this.mempoolHash[hash] = 1;
            this.loader.push(hash);
        }
    }
}
exports.PendingTxIndexer = PendingTxIndexer;
