"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxQueueLoader = void 0;
const _number_1 = require("@dequanto/utils/$number");
class TxQueueLoader {
    constructor(client, cb) {
        this.client = client;
        this.cb = cb;
        this.opts = {
            threads: 1,
            timeout: 20000,
            // log every N ms
            logTimeWindow: 5000,
        };
        this.status = {
            errors: 0,
            processed: 0,
            avgLoadTime: 0,
        };
        this.busy = [];
        this.errors = [];
        this.queue = [];
    }
    push(hash) {
        this.queue.push(hash);
        this.tick();
    }
    stats() {
        return {
            counts: {
                loading: this.busy.length,
                pending: this.queue.length,
                processed: this.status.processed,
                errors: this.status.errors,
            },
            errors: this.errors,
            avgLoadTime: this.status.avgLoadTime,
        };
    }
    tick() {
        if (this.busy.length >= this.opts.threads) {
            return;
        }
        let hash = this.queue.shift();
        let loader = new TxLoader(this.client, hash);
        this.busy.push(loader);
        loader
            .load()
            .then(tx => {
            this.onSuccess(tx);
            this.onCompleted(loader);
        }, err => {
            this.onError(err, hash);
            this.onCompleted(loader);
        });
    }
    onSuccess(tx) {
        this.cb(tx);
    }
    onCompleted(loader) {
        let i = this.busy.indexOf(loader);
        this.busy.splice(i, 1);
        let totalCount = this.status.processed;
        let totalSeconds = this.status.avgLoadTime * totalCount;
        this.status.avgLoadTime = _number_1.$number.round((totalSeconds * totalCount + loader.seconds) / (totalCount + 1));
        this.status.processed++;
        this.tick();
    }
    onError(err, hash) {
        this.status.errors++;
        this.status.processed++;
        let error = {
            hash,
            date: new Date(),
            error: err
        };
        this.errors.push(error);
        this.lastError = error;
        const MAX_ERRORS = 200;
        if (this.errors.length > 200) {
            this.errors.splice(0, MAX_ERRORS / 2);
        }
    }
}
exports.TxQueueLoader = TxQueueLoader;
class TxLoader {
    constructor(client, hash) {
        this.client = client;
        this.hash = hash;
    }
    async load() {
        this.started = Date.now();
        try {
            let tx = await this.client.getTransaction(this.hash);
            return tx;
        }
        catch (error) {
            throw error;
        }
        finally {
            this.seconds = (Date.now() - this.started) / 1000 | 0;
        }
    }
}
