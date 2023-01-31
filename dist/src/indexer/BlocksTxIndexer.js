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
        this.client = this.opts.client ?? Web3ClientFactory_1.Web3ClientFactory.get(platform, {
            ws: true
        });
        this.walker = new BlocksWalker_1.BlocksWalker({
            name: `${opts?.name ?? 'indexer'}_${this.platform}`,
            client: this.client,
            loadTransactions: opts?.loadTransactions ?? true,
            loadReceipts: opts?.loadReceipts ?? false,
            persistance: opts?.persistance ?? true,
            visitor: async (block, data) => {
                return this.indexTransactions(block, data);
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
            await this.client.subscribe('newBlockHeaders', (error, blockHeader) => {
                if (error) {
                    _logger_1.$logger.error(`Subscription to "newBlockHeaders" failed with`, error);
                    return;
                }
                if (blockHeader.transactions?.length === 0) {
                    // hardhat emits empty blocks
                    return;
                }
                this.walker.processUntil(blockHeader.number + 1);
            });
            // Reload the blocknumber, to ensure we didn't missed the block between walker starting and subscription
            let newTo = await this.client.getBlockNumber();
            this.walker.processUntil(newTo + 1);
        }
    }
    async indexTransactions(block, data) {
        for (let i = 0; i < this.listeners.length; i++) {
            let indexer = this.listeners[i];
            try {
                await indexer(this.client, block, data);
            }
            catch (error) {
                _logger_1.$logger.log(error);
            }
        }
    }
}
exports.BlocksTxIndexer = BlocksTxIndexer;
