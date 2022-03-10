import { Web3Client } from '@dequanto/clients/Web3Client';
import { $number } from '@dequanto/utils/$number';
import { Transaction } from 'web3-core';

export class TxQueueLoader {
    opts = {
        threads: 4,
        timeout: 20000,
        // log every N ms
        logTimeWindow: 5000,
    };

    status = {
        errors: 0,
        processed: 0,
        avgLoadTime: 0,
    }

    busy = [] as TxLoader[]

    errors = [] as {
        date: Date
        hash: string
        error: Error
    }[]

    lastError: {
        date: Date
        hash: string
        error: Error
    }

    queue: string[] = []
    seen: string[] = []

    push (hash: string) {
        if (this.seen.includes(hash) === false) {
            this.queue.push(hash);

            this.seen.unshift(hash);
            if (this.seen.length > 2000) {
                this.seen = this.seen.slice(0, 1000);
            }
        }
        this.tick();
    }

    constructor (public client: Web3Client, public cb: (tx: Transaction) => void) {

    }

    stats () {

        return {
            counts: {
                loading: this.busy.length,
                pending: this.queue.length,
                processed: this.status.processed,
                errors: this.status.errors,
            },
            errors: this.errors,
            error: this.errors.length > 0
                ? this.errors[this.errors.length - 1]?.error?.message
                : null,
            avgLoadTime: this.status.avgLoadTime,
        };
    }

    private tick () {
        if (this.busy.length >= this.opts.threads) {
            return;
        }
        if (this.queue.length === 0) {
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
            })
    }
    private onSuccess (tx: Transaction) {
        this.cb(tx);
    }
    private onCompleted (loader: TxLoader) {
        let i = this.busy.indexOf(loader);
        this.busy.splice(i, 1);

        let totalCount = this.status.processed;
        let totalSeconds = this.status.avgLoadTime * totalCount;
        this.status.avgLoadTime = $number.round((totalSeconds * totalCount + loader.seconds) / (totalCount + 1));
        this.status.processed++;
        this.tick();
    }
    private onError (err: Error, hash: string) {
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

class TxLoader {
    started: number
    seconds: number

    constructor (public client: Web3Client, public hash: string) {

    }

    async load (): Promise<Transaction> {
        this.started = Date.now();
        try {
            let tx = await this.client.getTransaction(this.hash, { ws: false });
            return tx;
        } catch (error) {
            throw error;
        } finally {
            this.seconds = (Date.now() - this.started) / 1000 | 0;
        }
    }
}
