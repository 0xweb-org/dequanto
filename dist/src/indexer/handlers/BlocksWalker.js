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
const _array_1 = require("@dequanto/utils/$array");
const atma_io_1 = require("atma-io");
const PackedRanges_1 = require("../../structs/PackedRanges");
const everlog_1 = require("everlog");
const BlockDateResolver_1 = require("@dequanto/blocks/BlockDateResolver");
const a_di_1 = __importDefault(require("a-di"));
const _date_1 = require("@dequanto/utils/$date");
const atma_utils_1 = require("atma-utils");
const _is_1 = require("@dequanto/utils/$is");
const _logger_1 = require("@dequanto/utils/$logger");
class BlocksWalker {
    constructor(params) {
        this.params = params;
        this.client = this.params.client;
        this.visitor = this.params.visitor;
        this.status = {
            blockLoadTime: 0
        };
        this.cachedState = new atma_io_1.FileSafe(`./db/block-indexers/${this.params.name}.json`);
        this.fs = everlog_1.Everlog.createChannel(`indexer-${this.params.name}`, {
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
        let onlyIncoming = from == null && to == null;
        if (onlyIncoming) {
            return;
        }
        if (from == null) {
            throw new Error(`FromBlock should be set while ToBlock(${to}) is present`);
        }
        this.walker.setFrom(await this.getBlockNumber(from));
        this.walker.setTo(await this.getBlockNumber(to));
        _is_1.$is.Number(this.ranges.from, 'From should be a number');
        _is_1.$is.Number(this.ranges.to, 'To should be a number');
        this.walker.process();
        _logger_1.$logger.log(`BlocksWalker starting. Processing: ${this.ranges.from}-${to}. Completed: ${this.ranges.totalAdded()}; ToDo: ${this.ranges.totalLeft()}`);
    }
    /**
     *  Can be called each time we get a new block from blockchain,
     *  the walker will process its current blocks and up until the specified number
     */
    async processUntil(nr) {
        if (this.isRestored === false) {
            await this.restore();
        }
        this.walker.process(nr);
        return this.onEndPromise = new atma_utils_1.class_Dfr;
    }
    stats() {
        return {
            ...(this.walker.stats()),
            ...(this.status),
        };
    }
    async restore() {
        try {
            let json = await this.cachedState.readAsync();
            let ranges = JSON.parse(json);
            if (ranges != null) {
                this.ranges.set(ranges);
            }
        }
        catch (error) { }
        this.walker = new RangeWalker({
            range: this.ranges,
            onVisit: (nr) => this.processBlock(nr),
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
        if (typeof mix === 'number') {
            return mix;
        }
        if (mix instanceof Date) {
            let dateResolver = a_di_1.default.resolve(BlockDateResolver_1.BlockDateResolver, this.client);
            return await dateResolver.getBlockNumberFor(mix);
        }
        throw new Error(`Invalid getBlockNumber param: ${mix}`);
    }
    async processBlock(nr) {
        // reading block and transactions
        let start = Date.now();
        let block = await this.client.getBlock(nr);
        let txs = null;
        if (this.params.loadTransactions !== false) {
            let hashes = block.transactions;
            txs = await (0, alot_1.default)(hashes).mapAsync(async (hash) => {
                return this.client.getTransaction(hash);
            }).toArrayAsync({ threads: 8 });
        }
        this.status.blockLoadTime = Date.now() - start;
        await this.visitor(block, txs);
    }
    async save() {
        let json = this.ranges.serialize();
        await this.cachedState?.writeAsync(json);
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
        this.fs.writeRow(row);
        _logger_1.$logger.log(row.join());
    }
}
__decorate([
    memd_1.default.deco.memoize()
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
        let next = this.range.next();
        if (next == null) {
            this.onComplete?.();
            return null;
        }
        let workerData = {
            nr: next,
            startedAt: Date.now()
        };
        let error = null;
        try {
            this.busy.push(workerData);
            await this.onVisit(next);
        }
        catch (err) {
            _logger_1.$logger.log('BlocksWalker.tick error', err);
            error = err;
        }
        this.onResult?.(error, workerData.nr);
        this.onTickComplete(workerData, error);
    }
    onTickComplete(workerData, error) {
        if (error != null) {
            this.lastError = {
                ...workerData,
                duration: Date.now() - workerData.startedAt,
                error
            };
            this.errors.push(this.lastError);
            this.status.errors += 1;
            _logger_1.$logger.log(error);
        }
        let time = Date.now() - workerData.startedAt;
        let prevAvgTime = this.status.avgTime;
        let prevTotal = this.status.processed;
        this.status.avgTime = Math.round((prevAvgTime * prevTotal + time) / (prevTotal + 1));
        this.status.processed += 1;
        _array_1.$array.remove(this.busy, workerData);
        this.tick();
    }
}
