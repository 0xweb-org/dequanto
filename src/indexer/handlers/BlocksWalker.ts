import di from 'a-di';
import alot from 'alot';
import memd from 'memd';
import { $array } from '@dequanto/utils/$array';
import { FileSafe } from 'atma-io';
import { PackedRanges } from '../../structs/PackedRanges';
import { Everlog } from 'everlog';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { BlockTransactionString } from 'web3-eth';
import { Transaction } from 'web3-core';
import { BlockDateResolver } from '@dequanto/blocks/BlockDateResolver';
import { $date } from '@dequanto/utils/$date';
import { class_Dfr } from 'atma-utils';
import { $is } from '@dequanto/utils/$is';
import { $logger } from '@dequanto/utils/$logger';
import { $block } from '@dequanto/utils/$block';

interface IBlockIndexer {
    name: string
    persistance?: boolean
    blocks?: {
        from: number
        to?: number
    }
    visitor: (block: BlockTransactionString, txs: Transaction[]) => Promise<void>
    client: Web3Client
    loadTransactions?: boolean

}

export class BlocksWalker {
    private onEndPromise: class_Dfr;
    private client = this.params.client;
    private visitor = this.params.visitor;
    private status = {
        blockLoadTime: 0
    };

    private cachedState = new FileSafe(`./db/block-indexers/${this.params.name}.json`);
    private fs = Everlog.createChannel(`indexer-${this.params.name}`, {
        fields: [
            { name: 'Date', type: 'date' },
            { name: 'Total', type: 'number' },
            { name: 'Processed', type: 'number' },
            { name: 'AvgTime', type: 'number' },
            { name: 'BlockLoadTime', type: 'number' },
            { name: 'Error', type: 'string' },
        ]
    });

    private ranges = new PackedRanges({
        ...this.params.blocks,
    });
    private walker: RangeWalker;

    constructor(public params: IBlockIndexer) {

    }


    async start (from?: number | Date, to?: number | Date) {
        if (this.isRestored === false) {
            await this.restore();
        }

        let onlyIncoming = from == null && to == null;
        if (onlyIncoming) {
            return;
        }
        if (from == null) {
            throw new Error(`FromBlock should be set while ToBlock(${to}) is present`);
        }

        this.walker.setFrom(
            await this.getBlockNumber(from)
        );
        this.walker.setTo(
            await this.getBlockNumber(to)
        );

        $is.Number(this.ranges.from, 'From should be a number');
        $is.Number(this.ranges.to, 'To should be a number');

        this.walker.process();
        $logger.log(`BlocksWalker starting. Processing: ${this.ranges.from}-${to}. Completed: ${this.ranges.totalAdded()}; ToDo: ${this.ranges.totalLeft()}`);
    }


    /**
     *  Can be called each time we get a new block from blockchain,
     *  the walker will process its current blocks and up until the specified number
     */
    async processUntil (nr: number) {
        if (this.isRestored === false) {
            await this.restore();
        }
        this.walker.process(nr);
        return this.onEndPromise = new class_Dfr;
    }


    stats () {
        return {
            ...(this.walker?.stats() ?? {}),
            ...(this.status),
        };
    }


    private isRestored = false;

    @memd.deco.memoize()
    private async restore () {
        try {
            if (this.params.persistance !== false) {
                let json = await this.cachedState.readAsync<string>();
                let ranges = JSON.parse(json);
                if (ranges != null) {
                    this.ranges.set(ranges);
                }
            }
        } catch (error) { }

        this.walker = new RangeWalker({
            range: this.ranges,
            onVisit: (nr) => this.processBlock(nr),
            onResult: (error, nr) => {
                this.save();
                this.log()
            },
            onComplete: () => {
                this.onEndPromise?.resolve();
            }
        });
        this.isRestored = true;
    }

    // private async setFromBlockNumber (nr: number): Promise<this> {

    //     this.walker.setFrom(nr);
    //     return this;
    // }
    // private async setFromBlockDate(date: Date): Promise<this> {
    //     let dateResolver = di.resolve(BlockDateResolver, this.client)
    //     let nr = await dateResolver.getBlockNumberFor(date);
    //     return this.setFromBlockNumber(nr);
    // }

    // private async setToBlockNumber (nr: number): Promise<this> {
    //     if (this.isRestored === false) {
    //         await this.restore();
    //     }
    //     this.walker.setTo(nr);
    //     return this;
    // }
    // private async setToBlockDate(date: Date): Promise<this> {
    //     let dateResolver = di.resolve(BlockDateResolver, this.client)
    //     let nr = await dateResolver.getBlockNumberFor(date);
    //     return this.setToBlockNumber(nr);
    // }

    private async getBlockNumber(mix: undefined | number | Date): Promise<number> {
        if (mix == null) {
            return this.client.getBlockNumber();
        }
        return $block.ensureNumber(mix, this.client);
    }

    private async processBlock (nr: number) {
        // reading block and transactions
        let start = Date.now();
        let block = await this.client.getBlock(nr);
        let txs = null as Transaction[];

        if (this.params.loadTransactions !== false) {
            let hashes = block.transactions;

            txs = await alot(hashes).mapAsync(async hash => {
                return this.client.getTransaction(hash);
            }).toArrayAsync({ threads: 8 });
        }


        this.status.blockLoadTime = Date.now() - start;
        await this.visitor(block, txs)
    }

    @memd.deco.throttle(1000 * 4)
    private async save () {
        if (this.params.persistance !== false) {
            let json = this.ranges.serialize();
            await this.cachedState?.writeAsync(json);
        }
    }

    @memd.deco.throttle(1000 * 5)
    private async log () {
        let error = this.walker.pluckLastErrorMessage();
        let row = [
            new Date().toISOString(),
            this.walker.range.total(),
            this.walker.range.totalLeft(),
            `${this.walker.status.avgTime}ms`,
            this.walker.avgTimeLeft(),
            `${this.status.blockLoadTime}ms`,
            this.walker.status.errors,
            error,
        ];
        this.fs.writeRow(row);
        $logger.log(row.join());
    }
}



class RangeWalker {

    opts = {
        threads: 1,
        timeout: 20000,
        // log every N ms
        logTimeWindow: 5000,
    };

    status = {
        errors: 0,
        processed: 0,
        avgTime: 0,
    }

    busy = [] as {
        nr: number
        startedAt: number
    }[]

    errors = [] as {
        nr: number
        startedAt: number
        duration: number
        error: Error
    }[]

    lastError: {
        nr: number
        startedAt: number
        duration: number
        error: Error
    }

    public onCompleted: class_Dfr
    public readonly range: PackedRanges

    private readonly onVisit: (nr: number) => Promise<void>
    private readonly onResult: (error: Error, nr: number) => void
    private readonly onComplete: () => void

    constructor(params: {
        range: PackedRanges
        onVisit: RangeWalker['onVisit']
        onResult?: RangeWalker['onResult']
        onComplete?: RangeWalker['onComplete']
    }) {

        this.range = params.range;
        this.onVisit = params.onVisit;
        this.onResult = params.onResult;
        this.onComplete = params.onComplete;
    }

    stats () {
        return {
            ...this.status,
            busy: this.busy,
            errors: this.errors,

            from: this.range.from,
            to: this.range.to,
            totalLeft: this.range.totalLeft(),
            totalTimeLeft: this.avgTimeLeft()
        };
    }

    setFrom (nr: number) {
        this.range.from = nr;
    }
    setTo (nr: number) {
        let { from } = this.range;
        if (from != null && from > nr) {
            throw new Error(`To (${nr}) should be greater then From (${from})`);
        }

        this.range.to = nr;
    }
    process (toBlock?: number) {
        if (toBlock != null) {
            let to = Math.max(toBlock, this.range.to ?? 0);
            this.range.to = to;

            if (this.range.from == null) {
                // In case we started the walker by listening to incoming mined blocks
                this.range.from = to;
            }
        }

        this.onCompleted = new class_Dfr;
        let i = Math.max(this.opts.threads - this.busy.length, 0);
        while (--i > -1) {
            this.tick();
        }
    }

    pluckLastError() {
        let err = this.lastError;
        this.lastError = null;
        return err;
    }
    pluckLastErrorMessage() {
        let err = this.pluckLastError();
        if (err == null) {
            return '';
        }
        return `Date: ${new Date(err.startedAt).toISOString()} Nr: ${err.nr}. Duration: ${err.duration}ms; Error: ${err.error.message}`;
    }

    avgTimeLeft() {
        let avgTime = this.status.avgTime;
        let leftBlocks = this.range.totalLeft();
        let ms = avgTime * leftBlocks;
        return $date.formatTimespan(ms);
    }


    private async tick () {
        if (this.busy.length > this.opts.threads) {
            return;
        }

        let next = this.range.next();
        if (next == null) {
            this.onComplete?.();
            return null;
        }
        let workerData = {
            nr: next,
            startedAt: Date.now()
        };
        let error: Error = null;
        try {
            this.busy.push(workerData);
            await this.onVisit(next);
        } catch (err) {
            $logger.log('BlocksWalker.tick error', err);
            error = err;
        }

        this.onResult?.(error, workerData.nr);
        this.onTickComplete(workerData, error)
    }

    private onTickComplete (workerData: { nr: number, startedAt: number }, error?: Error) {

        if (error != null) {
            this.lastError = {
                ...workerData,
                duration: Date.now() - workerData.startedAt,
                error
            };

            this.errors.push(this.lastError);
            this.status.errors += 1;
            $logger.log(error);
        }

        let time = Date.now() - workerData.startedAt;
        let prevAvgTime = this.status.avgTime;
        let prevTotal = this.status.processed;

        this.status.avgTime = Math.round((prevAvgTime * prevTotal + time) / (prevTotal + 1));
        this.status.processed += 1;

        $array.remove(this.busy, workerData);
        this.tick();
    }
}
