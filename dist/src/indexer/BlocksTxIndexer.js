"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlocksTxIndexer = void 0;
const BlocksWalker_1 = require("./handlers/BlocksWalker");
const Web3ClientFactory_1 = require("@dequanto/clients/Web3ClientFactory");
const _logger_1 = require("@dequanto/utils/$logger");
class BlocksTxIndexer {
    constructor(platform, opts) {
        this.platform = platform;
        this.opts = opts;
        this.listeners = [];
        this.client = Web3ClientFactory_1.Web3ClientFactory.get(platform, {
            ws: true
        });
        this.walker = new BlocksWalker_1.BlocksWalker({
            name: `${opts?.name ?? 'indexer'}_${this.platform}`,
            client: this.client,
            loadTransactions: opts?.loadTransactions ?? true,
            persistance: opts?.persistance ?? true,
            visitor: async (block, txs) => {
                return this.indexTransactions(block, txs);
            }
        });
    }
    onBlock(cb) {
        this.listeners.push(cb);
        return this;
    }
    stats() {
        return this.walker.stats();
    }
    async start(from, to) {
        await this.walker.start(from, to);
        if (to == null) {
            this.client.subscribe('newBlockHeaders', (error, blockHeader) => {
                this.walker.processUntil(blockHeader.number);
            });
        }
    }
    async indexTransactions(block, txs) {
        for (let i = 0; i < this.listeners.length; i++) {
            let indexer = this.listeners[i];
            try {
                await indexer(this.client, block, txs);
            }
            catch (error) {
                _logger_1.$logger.log(error);
            }
        }
    }
}
exports.BlocksTxIndexer = BlocksTxIndexer;
