import { BlocksWalker } from './handlers/BlocksWalker';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TPlatform } from '@dequanto/models/TPlatform';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { TxQueueLoader } from './handlers/TxQueueLoader';
import { BlocksTxIndexer } from './BlocksTxIndexer';
import { $number } from '@dequanto/utils/$number';
import { TEth } from '@dequanto/models/TEth';


export interface IPendingTxIndexerOptions {
    /** Name of the indexer */
    name?: string
}
export type TPendingTxListener = (client: Web3Client, tx: TEth.Tx) => Promise<void>

export class PendingTxIndexer {

    private client: Web3Client;
    private walker: BlocksWalker;
    private listeners: TPendingTxListener[] = [];

    //private mempool = [];
    private mempoolHash = Object.create(null);

    private loader: TxQueueLoader;
    private blocks: BlocksTxIndexer;
    private status = {
        startedAt: null as number,
        // ~ tx/s
        txSpeed: 0,

        txCount: 0,
        txNulls: 0,

        // tx not seen in mempool
        txPrivateCount: 0,
    }

    constructor (public platform: TPlatform, public opts?: IPendingTxIndexerOptions) {

        this.client = Web3ClientFactory.get(platform, {
            ws: true
        });


        let pool = Web3ClientFactory.get(platform);
        this.loader = new TxQueueLoader(pool, tx => {
            this.onMempoolTxLoaded(tx);
        });
        this.blocks = new BlocksTxIndexer(platform, {
            name: opts.name,
            loadTransactions: false,
            persistence: false,
        });
        this.blocks.onBlock(async (client, block) => {
            this.onBlockLoaded(block);
        });
    }

    public onTransaction (cb: TPendingTxListener): this {
        this.listeners.push(cb);
        return this;
    }

    public stats () {
        if (this.status.startedAt == null) {
            return { active: false }
        }
        let seconds = (Date.now() - this.status.startedAt) / 1000 | 0;
        let txSpeed = $number.round(this.status.txCount / seconds, 2);
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
        }
    }

    async start () {
        this.status.startedAt = Date.now();
        this.client.subscribe('pendingTransactions', (error, hash) => {
            this.status.txCount++;
            this.mempoolHash[hash] = 1;
            this.loader.push(hash);
        });

        let blockNumber = await this.client.getBlockNumber();
        this.blocks.start(blockNumber);
    }


    private onMempoolTxLoaded (tx: TEth.Tx) {
        if (tx == null) {
            this.status.txNulls++;
            return;
        }
        for (let i = 0; i < this.listeners.length; i++) {
            this.listeners[i](this.client, tx);
        }
    }
    private onBlockLoaded (block: TEth.Block<TEth.Hex>) {
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

