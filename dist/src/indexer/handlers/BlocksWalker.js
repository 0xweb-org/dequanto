"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlocksWalker = void 0;
const alot_1 = __importDefault(require("alot"));
const memd_1 = __importDefault(require("memd"));
const everlog_1 = require("everlog");
const atma_io_1 = require("atma-io");
const atma_utils_1 = require("atma-utils");
const PackedRanges_1 = require("../../structs/PackedRanges");
const _array_1 = require("@dequanto/utils/$array");
const _date_1 = require("@dequanto/utils/$date");
const _logger_1 = require("@dequanto/utils/$logger");
const _block_1 = require("@dequanto/utils/$block");
const _require_1 = require("@dequanto/utils/$require");
class BlocksWalker {
    constructor(params) {
        this.params = params;
        this.onEndPromise = new atma_utils_1.class_Dfr;
        this.client = this.params.client;
        this.visitor = this.params.visitor;
        this.status = {
            blockLoadTime: 0
        };
        this.cachedState = new atma_io_1.FileSafe(`./0xweb/block-indexers/${this.params.name}.json`, {
            cached: false,
            processSafe: true,
            threadSafe: true
        });
        this.everlog = everlog_1.Everlog.createChannel(`indexer-${this.params.name}`, {
            fields: [
                { name: 'Date', type: 'date' },
                { name: 'Total', type: 'number' },
                { name: 'Processed', type: 'number' },
                { name: 'AvgTime', type: 'number' },
                { name: 'BlockLoadTime', type: 'number' },
                { name: 'Error', type: 'string' },
            ]
        });
        this.ranges = new PackedRanges_1.PackedRanges({
            ...this.params.blocks,
        });
        this.isRestored = false;
    }
    async start(from, to) {
        if (this.isRestored === false) {
            await this.restore();
        }
        if (to != null && from == null) {
            throw new Error(`FromBlock should be set while ToBlock(${to}) is present`);
        }
        this.walker.setFrom(await this.getBlockNumber(from));
        this.walker.setTo(await this.getBlockNumber(to));
        _require_1.$require.Number(this.ranges.from, 'From should be a number');
        _require_1.$require.Number(this.ranges.to, 'To should be a number');
        this.walker.process();
        _logger_1.$logger.log(`BlocksWalker starting. Processing: ${this.ranges.from}-${to ?? 'latest'}. Completed: ${this.ranges.totalAdded()}; ToDo: ${this.ranges.totalLeft()}`);
    }
    /**
     *  Can be called each time we get a new block from blockchain,
     *  the walker will process its current blocks and up until the specified number
     *  @param nr Number is not included: [from, end)
     */
    async processUntil(nr) {
        if (this.isRestored === false) {
            await this.restore();
        }
        this.walker.process(nr);
        this.onEndPromise.defer();
        return this.onEndPromise;
    }
    stats() {
        return {
            ...(this.walker?.stats() ?? {}),
            ...(this.status),
        };
    }
    async restore() {
        try {
            if (this.params.persistance !== false) {
                let json = await this.cachedState.readAsync();
                let ranges = JSON.parse(json);
                if (ranges != null) {
                    this.ranges.set(ranges);
                }
            }
        }
        catch (error) { }
        this.walker = new RangeWalker({
            range: this.ranges,
            onVisit: (nrs) => this.processBlocks(nrs),
            onResult: (error, nr) => {
                this.save();
                this.log();
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
    async getBlockNumber(mix) {
        if (mix == null) {
            return this.client.getBlockNumber();
        }
        return _block_1.$block.ensureNumber(mix, this.client);
    }
    async processBlocks(nrs) {
        // reading block and transactions
        let start = Date.now();
        let blocks = await this.client.getBlocks(nrs);
        let nr = await this.client.getBlockNumber();
        let grouped = await (0, alot_1.default)(blocks).mapAsync(async (block) => {
            let hashes = block.transactions;
            let txs = this.params.loadTransactions
                ? await this.client.getTransactions(hashes)
                : null;
            let receipts = this.params.loadReceipts
                ? await this.client.getTransactionReceipts(hashes)
                : null;
            return { block, txs, receipts };
        }).toArrayAsync({ threads: 4 });
        this.status.blockLoadTime = (Date.now() - start) / nrs.length;
        await (0, alot_1.default)(grouped)
            .forEachAsync(async ({ block, txs, receipts }) => {
            await this.visitor(block, { txs, receipts });
        })
            .toArrayAsync({ threads: 4 });
    }
    async save() {
        if (this.params.persistance !== false) {
            let json = this.ranges.serialize();
            await this.cachedState?.writeAsync(json);
        }
    }
    async log() {
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
        _logger_1.$logger.log(row.join());
    }
}
__decorate([
    memd_1.default.deco.memoize({ perInstance: true })
], BlocksWalker.prototype, "restore", null);
__decorate([
    memd_1.default.deco.throttle(1000 * 4)
], BlocksWalker.prototype, "save", null);
__decorate([
    memd_1.default.deco.throttle(1000 * 5)
], BlocksWalker.prototype, "log", null);
exports.BlocksWalker = BlocksWalker;
class RangeWalker {
    constructor(params) {
        this.opts = {
            threads: 1,
            batch: 1,
            timeout: 20000,
            // log every N ms
            logTimeWindow: 5000,
        };
        this.status = {
            errors: 0,
            processed: 0,
            avgTime: 0,
        };
        this.busy = [];
        this.errors = [];
        this.opts.batch = params.batch ?? this.opts.batch;
        this.range = params.range;
        this.onVisit = params.onVisit;
        this.onResult = params.onResult;
        this.onComplete = params.onComplete;
    }
    stats() {
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
    setFrom(nr) {
        this.range.from = nr;
    }
    setTo(nr) {
        nr += 1;
        let { from } = this.range;
        if (from != null && from > nr) {
            throw new Error(`To (${nr}) should be greater then From (${from})`);
        }
        this.range.to = nr;
    }
    process(toBlock) {
        if (toBlock != null) {
            let to = Math.max(toBlock, this.range.to ?? 0);
            this.range.to = to;
            if (this.range.from == null) {
                // In case we started the walker by listening to incoming mined blocks
                this.range.from = to;
            }
        }
        this.onCompleted = new atma_utils_1.class_Dfr;
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
        return _date_1.$date.formatTimespan(ms);
    }
    async tick() {
        if (this.busy.length > this.opts.threads) {
            return;
        }
        let arr = [];
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
        let error = null;
        try {
            this.busy.push(...workersData);
            await this.onVisit(arr);
        }
        catch (err) {
            _logger_1.$logger.log('BlocksWalker.tick error', err);
            error = err;
        }
        this.onResult?.(error, arr);
        this.onTickComplete(workersData, error);
    }
    onTickComplete(workersData, error) {
        let lastWorkerData = workersData[workersData.length - 1];
        if (error != null) {
            this.lastError = {
                ...lastWorkerData,
                duration: Date.now() - lastWorkerData.startedAt,
                error
            };
            this.errors.push(this.lastError);
            this.status.errors += 1;
            _logger_1.$logger.log(error);
        }
        let prevAvgTime = this.status.avgTime;
        let prevTotal = this.status.processed;
        let time = (Date.now() - lastWorkerData.startedAt) / workersData.length;
        this.status.avgTime = Math.round((prevAvgTime * prevTotal + time) / (prevTotal + 1));
        this.status.processed += workersData.length;
        workersData.forEach(x => _array_1.$array.remove(this.busy, x));
        this.tick();
    }
}
