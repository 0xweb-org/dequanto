import { class_Dfr } from 'atma-utils';
import { BlocksWalker } from './handlers/BlocksWalker';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TPlatform } from '@dequanto/models/TPlatform';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { $logger } from '@dequanto/utils/$logger';
import { TEth } from '@dequanto/models/TEth';


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
    block: TEth.Block<TEth.Hex>,
    data?: { txs?: TEth.Tx[], receipts?: TEth.TxReceipt[] }
) => Promise<void>

export class BlocksTxIndexer {
    private client: Web3Client;
    private walker: BlocksWalker;
    private listeners: TBlockListener[] = [];

    public onStarted = new class_Dfr;


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

    public async start (from?: Date | number, to?: Date | number) {
        try {
            await this.startInner(from, to);
            this.onStarted.resolve();
        } catch (err) {
            this.onStarted.reject(err);
            throw err;
        }
    }
    private async startInner (from?: Date | number, to?: Date | number) {
        await this.walker.start(from, to);

        if (to == null) {
            try {
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
                console.log('BlockTxIndexer: subscribed', newTo);
            } catch (error) {
                console.error(`Subscription failed`, error);
                throw error;
            }
        }
    }

    private async indexTransactions (block: TEth.Block<TEth.Hex>, data: { txs?: TEth.Tx[], receipts?: TEth.TxReceipt[] }) {
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

