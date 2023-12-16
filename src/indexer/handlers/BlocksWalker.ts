import alot from 'alot';
import memd from 'memd';
import { Everlog } from 'everlog';
import { FileSafe } from 'atma-io';
import { class_Dfr } from 'atma-utils';
import { PackedRanges } from '../../class/PackedRanges';

import { $array } from '@dequanto/utils/$array';
import { $date } from '@dequanto/utils/$date';
import { $logger } from '@dequanto/utils/$logger';
import { $block } from '@dequanto/utils/$block';
import { $require } from '@dequanto/utils/$require';

import { Web3Client } from '@dequanto/clients/Web3Client';
import { TEth } from '@dequanto/models/TEth';
import { ILogger } from 'everlog/fs/LoggerFile';

interface IBlockIndexer {
    name: string
    persistance?: boolean
    blocks?: {
        from: number
        to?: number
    }
    visitor: (block: TEth.Block<TEth.Hex>, data: { txs?: TEth.Tx[], receipts?: TEth.TxReceipt[] }) => Promise<void>
    client: Web3Client

    loadTransactions?: boolean
    loadReceipts?: boolean
    logProgress?: boolean | string
}

export class BlocksWalker {
    public onEndPromise = new class_Dfr;

    private client: Web3Client;
    private visitor: IBlockIndexer['visitor'];
    private status = {
        blockLoadTime: 0
    };

    private cachedState: InstanceType<typeof FileSafe>
    private everlog: ILogger;

    private ranges: PackedRanges;
    private walker: RangeWalker;

    constructor(public params: IBlockIndexer) {
        this.client = this.params.client;
        this.visitor = this.params.visitor;
        this.cachedState = new FileSafe(`./0xc/block-indexers/${this.params.name}.json`, {
            cached: false,
            processSafe: true,
            threadSafe: true
        });
        this.everlog = Everlog.createChannel(`indexer-${this.params.name}`, {
            fields: [
                { name: 'Date', type: 'date' },
                { name: 'Total', type: 'number' },
                { name: 'Processed', type: 'number' },
                { name: 'AvgTime', type: 'number' },
                { name: 'BlockLoadTime', type: 'number' },
                { name: 'Error', type: 'string' },
            ]
        });
        this.ranges = new PackedRanges({
            ...this.params.blocks,
        })
    }


    async start (from?: number | Date, to?: number | Date) {
        if (this.isRestored === false) {
            await this.restore();
        }

        if (to != null && from == null) {
            throw new Error(`FromBlock should be set while ToBlock(${to}) is present`);
        }

        this.walker.setFrom(
            await this.getBlockNumber(from)
        );
        this.walker.setTo(
            await this.getBlockNumber(to)
        );

        $require.Number(this.ranges.from, 'From should be a number');
        $require.Number(this.ranges.to, 'To should be a number');

        this.walker.process();
        if (this.params.logProgress !== false) {
            $logger.log(`BlocksWalker starting. Processing: ${this.ranges.from}-${ to ?? 'latest' }. Completed: ${this.ranges.totalAdded()}; ToDo: ${this.ranges.totalLeft()}`);
        }
    }


    /**
     *  Can be called each time we get a new block from blockchain,
     *  the walker will process its current blocks and up until the specified number
     *  @param nr Number is not included: [from, end)
     */
    async processUntil (nr: number) {
        if (this.isRestored === false) {
            await this.restore();
        }
        this.walker.process(nr);
        this.onEndPromise.defer();
        return this.onEndPromise;
    }


    stats () {
        return {
            ...(this.walker?.stats() ?? {}),
            ...(this.status),
        };
    }


    private isRestored = false;

    @memd.deco.memoize({ perInstance: true })
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
            onVisit: (nrs) => this.processBlocks(nrs),
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

    private async processBlocks (nrs: number[]) {

        // reading block and transactions
        let start = Date.now();
        let blocks = await this.client.getBlocks(nrs);

        let grouped = await alot(blocks).mapAsync(async block => {
            let hashes = block.transactions as TEth.Hex[];
            let txs = this.params.loadTransactions
                ? await this.client.getTransactions(hashes)
                : null;

            let receipts = this.params.loadReceipts
                ? await this.client.getTransactionReceipts(hashes)
                : null;

            return { block, txs, receipts };
        }).toArrayAsync({ threads: 4 });

        this.status.blockLoadTime = (Date.now() - start) / nrs.length;

        await alot(grouped)
            .forEachAsync(async ({block, txs, receipts}) => {
                await this.visitor(block, { txs, receipts })
            })
            .toArrayAsync({ threads: 4 });
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
        if (this.params.logProgress === false) {
            return;
        }

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

        this.everlog.writeRow(row);
        $logger.log(row.join());
    }
}



class RangeWalker {

    opts = {
        threads: 1,
        batch: 1,
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

    private readonly onVisit: (nrs: number[]) => Promise<void>
    private readonly onResult: (error: Error, nrs: number[]) => void
    private readonly onComplete: () => void

    constructor(params: {
        batch?: number
        range: PackedRanges
        onVisit: RangeWalker['onVisit']
        onResult?: RangeWalker['onResult']
        onComplete?: RangeWalker['onComplete']
    }) {

        this.opts.batch = params.batch ?? this.opts.batch;
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
        nr += 1;

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

        let arr = [] as number[];
        while (arr.length < this.opts.batch) {
            let next = this.range.next();
            if (next == null) {
                break;
            }
            arr.push(next);
        }

        if (arr.length === 0) {
            this.onComplete?.();
            return null;
        }
        let workersData = arr.map(nr => ({ nr, startedAt: Date.now() }));
        let error: Error = null;
        try {
            this.busy.push(...workersData);
            await this.onVisit(arr);
        } catch (err) {
            $logger.log('BlocksWalker.tick error', err);
            error = err;
        }

        this.onResult?.(error, arr);
        this.onTickComplete(workersData, error)
    }

    private onTickComplete (workersData: { nr: number, startedAt: number }[], error?: Error) {

        let lastWorkerData = workersData[workersData.length - 1];
        if (error != null) {
            this.lastError = {
                ...lastWorkerData,
                duration: Date.now() - lastWorkerData.startedAt,
                error
            };

            this.errors.push(this.lastError);
            this.status.errors += 1;
            $logger.log(error);
        }

        let prevAvgTime = this.status.avgTime;
        let prevTotal = this.status.processed;

        let time = (Date.now() - lastWorkerData.startedAt) / workersData.length;
        this.status.avgTime = Math.round((prevAvgTime * prevTotal + time) / (prevTotal + 1));
        this.status.processed += workersData.length;

        workersData.forEach(x => $array.remove(this.busy, x));
        this.tick();
    }
}
