import { BlockTransactionString } from 'web3-eth';
import { Transaction } from 'web3-core';
import { BlocksWalker } from './handlers/BlocksWalker';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TPlatform } from '@dequanto/models/TPlatform';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { $logger } from '@dequanto/utils/$logger';


export interface IBlocksTxIndexerOptions {
    /** Name of the indexer */
    name?: string
    persistance?: boolean
    loadTransactions?: boolean
}
export type TBlockListener = (client: Web3Client, block: BlockTransactionString, txs?: Transaction[]) => Promise<void>

export class BlocksTxIndexer {
    private client: Web3Client;
    private walker: BlocksWalker;
    private listeners: TBlockListener[] = [];

    constructor (public platform: TPlatform, public opts?: IBlocksTxIndexerOptions) {

        this.client = Web3ClientFactory.get(platform, {
            ws: true
        });
        this.walker = new BlocksWalker({
            name: `${opts?.name ?? 'indexer'}_${this.platform}`,
            client: this.client,
            loadTransactions: opts?.loadTransactions ?? true,
            persistance: opts?.persistance ?? true,
            visitor: async (block, txs) => {
                return this.indexTransactions(block, txs)
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
            this.client.subscribe('newBlockHeaders', (error, blockHeader) => {
                this.walker.processUntil(blockHeader.number);
            });
        }
    }

    private async indexTransactions (block: BlockTransactionString, txs: Transaction[]) {
        for (let i = 0; i < this.listeners.length; i++) {
            let indexer = this.listeners[i];
            try {
                await indexer(this.client, block, txs);
            } catch (error) {
                $logger.log(error);
            }
        }
    }
}

