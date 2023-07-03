import type { BlockTransactionString } from 'web3-eth';
import type { Transaction, TransactionReceipt } from 'web3-core';
import { BlocksWalker } from './handlers/BlocksWalker';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TPlatform } from '@dequanto/models/TPlatform';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { $logger } from '@dequanto/utils/$logger';


export interface IBlocksTxIndexerOptions {
    /** Name of the indexer */
    name?: string

    /** Save indexer progress (visited blocks) to a file */
    persistance?: boolean

    /** Load transactions from the block and provide them to the visitor method */
    loadTransactions?: boolean

    /** Load receipts from the block and provide them to the visitor method */
    loadReceipts?: boolean

    client?: Web3Client

    logProgress?: boolean
}
export type TBlockListener = (
    client: Web3Client,
    block: BlockTransactionString,
    data?: { txs?: Transaction[], receipts?: TransactionReceipt[] }
) => Promise<void>

export class BlocksTxIndexer {
    private client: Web3Client;
    private walker: BlocksWalker;
    private listeners: TBlockListener[] = [];

    constructor (public platform: TPlatform, public opts?: IBlocksTxIndexerOptions) {

        this.client = this.opts.client ?? Web3ClientFactory.get(platform, {
            ws: true
        });
        this.walker = new BlocksWalker({
            name: `${opts?.name ?? `indexer_${ Date.now() }`}_${this.platform}`,
            client: this.client,
            loadTransactions: opts?.loadTransactions ?? true,
            loadReceipts: opts?.loadReceipts ?? false,
            persistance: opts?.persistance ?? true,
            logProgress: opts?.logProgress?? true,

            visitor: async (block, data) => {
                return this.indexTransactions(block, data)
            }
        });
    }

    public onBlock (cb: TBlockListener): this {
        this.listeners.push(cb);
        return this;
    }

    public stats () {
        return this.walker.stats();
    }

    async start (from?: Date | number, to?: Date | number) {
        await this.walker.start(from, to);

        if (to == null) {
            await this.client.subscribe('newBlockHeaders', (error, blockHeader) => {
                if (error) {
                    $logger.error(`Subscription to "newBlockHeaders" failed with`, error);
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

    private async indexTransactions (block: BlockTransactionString, data: { txs?: Transaction[], receipts?: TransactionReceipt[] }) {
        for (let i = 0; i < this.listeners.length; i++) {
            let indexer = this.listeners[i];
            try {
                await indexer(this.client, block, data);
            } catch (error) {
                $logger.log(error);
            }
        }
    }
}

