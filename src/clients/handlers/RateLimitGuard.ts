import { $date } from '@dequanto/utils/$date';
import { l } from '@dequanto/utils/$logger';
import { $promise } from '@dequanto/utils/$promise';
import alot from 'alot';
import memd from 'memd';

let rateLimitRgx = {
    checks: [
        // extracted from known and common rate-limit messages
        /rate.+limit/i,
        /too.+many.+request/i,
        /exceed.+request/i,
        /try.+later/i,
        /request.+rate/i,
        /\b429\b/i,
        [/\bCUPS\b/i, /(\b(maximum|limit)\b)i/]
    ],
    extracts: [
        // 100 per 1 minute
        /(?<limit>\d+)\s*(per|\/)\s*(?<periodValue>\d+)?\s*(?<periodName>[msdh])/i,
    ],
    knownFields: {
        allowed_rps (val: number) {
            val = Number(val);
            return {
                spanMs: val * 1000,
                spanCount: val
            };
        }
    }
}
let batchLimitRgx = {
    extracts: [
        /batch\s+limit\s+(?<batchLimit>\d+)/i,
    ],
}

type TRateLimitError = Error & {
    data?: {
        details?: string
        data?: any
    }
};

export class RateLimitGuard {

    static isBatchLimit(error: Error) {
        return batchLimitRgx.extracts.some(x => x.test(error.message));
    }
    static extractBatchLimitFromError (error: Error): number {
        for (let rgx of batchLimitRgx.extracts) {
            let val = rgx.exec(error.message)?.groups?.batchLimit;
            if (val != null) {
                return Number(val);
            }
        }
        return null;
    }

    static isRateLimited (error: TRateLimitError) {
        let message = error.message;
        let hasMatches = rateLimitRgx.checks.some(checkRgxMix => {
            if (Array.isArray(checkRgxMix)) {
                return checkRgxMix.every(rgx => rgx.test(message));
            }
            return checkRgxMix.test(message);
        });
        if (hasMatches) {
            return true;
        }
        return false;
    }

    /**
     * @param rate 100/5min 30/sec
     */
    static parseRateLimit (rate: string) {
        return rate.split(';').map(rate => {
            return ShortEpochRateLimitData.parseRateLimit(rate);
        });
    }

    static extractRateLimitFromError (error: TRateLimitError): {
        spanMs: number,
        spanLimit: number,
        backoff?: number
    } {
        let spanMs: number;
        let spanLimit: number;
        let backoff: number;

        let detailsData = error.data?.data ?? error.data;
        if (detailsData != null) {
            for (let key in detailsData) {
                let val = detailsData[key];
                if (/backoff|next|reset/i.test(key) && /^\d+$/.test(String(val))) {

                    val = Number(val);
                    if (val < 50_000) {
                        // relative time
                        if (val < 1000) {
                            // in seconds
                            val = val * 1000;
                        }
                        val = Date.now() + val;
                    }
                    backoff = val;
                    continue;
                }
                let knownField = rateLimitRgx.knownFields[key];
                if (knownField != null) {
                    let data = knownField(val);

                    backoff = data.backoff ?? backoff;
                    spanMs = data.spanMs ?? spanMs;
                    spanLimit = data.spanLimit ?? spanLimit;
                }
            }
        }

        let message = error.message;
        let fromMessage = rateLimitRgx
            .extracts
            .map(rgx => rgx.exec(message))
            .filter(match => match != null)[0];

        if (fromMessage) {
            let { limit, periodValue, periodName } = fromMessage.groups;
            if (periodValue != null && periodName != null) {
                try {
                    spanMs = $date.parseTimespan(`${periodValue || 1}${periodName}`);
                } catch (error) { }
                spanLimit = Number(limit);
            }
        }
        if (spanLimit == null && spanMs == null && backoff == null) {
            return null;
        }
        let result = {
            backoff,
            spanLimit,
            spanMs,
        };
        return result;
    }

    private awaited = { count: 0, total: 0 };
    private backoff: number;
    private id: string;
    private rates: ShortEpochRateLimitData[];

    constructor(opts: {
        id: string
        rates: ShortEpochRateLimitData[]
    }) {
        this.id = opts.id;
        this.rates = opts.rates;
    }

    status () {
        return {
            id: this.id,
            guards: this.rates.map(x => x.status())
        };
    }

    checkWaitTime () {
        return this.getWaitTimeFor();
    }

    updateRateLimitInfo (info: ReturnType<typeof RateLimitGuard['extractRateLimitFromError']>) {
        if (info == null) {
            const SECOND = 1000;
            let perSecond = this.rates.find(x => x.spanMs === SECOND);
            if (perSecond == null) {
                perSecond = new ShortEpochRateLimitData(SECOND, 100);
                this.rates.unshift(perSecond)
            }
            info = {
                // retries in 2s
                backoff: Date.now() + 2_000,
                spanMs: SECOND,
                spanLimit: Math.floor(perSecond.spanLimit * .95)
            };
        }

        if (info.backoff) {
            this.backoff = info.backoff;
        }

        if (info.spanLimit && info.spanMs) {
            l`Updating the yellow<rate limits> for ${this.id} using: bold<${info.spanLimit}> per bold<${info.spanMs}ms>`;
            let rate = this.rates.find(x => x.spanMs === info.spanMs);
            if (rate) {
                rate.spanLimit = info.spanLimit;
            } else {
                this.rates.push(new ShortEpochRateLimitData(info.spanMs, info.spanLimit));
            }
        }
    }

    private getWaitTimeFor(reqCount = 1) {
        let waits = this.rates.map(x => x.getWaitTimeFor(reqCount));
        let ms = Math.max(...waits);
        if (ms > 0) {
            //-console.log(`${Date.now()} WaitTime (${ reqCount}) ${waits.join('|')}; SpanRequests: ${ this.rates.map(x => x.ticks.length).join('|') }; Starts: ${ this.rates.map(x => x.ticks[0]).join('|') }`);
        }
        return ms;
    }

    public getSpanLimit () {
        return alot(this.rates).min(x => x.spanLimit);
    }

    @memd.deco.queued()
    public async wait(count = 1, now = Date.now()) {

        if (this.backoff != null) {
            let ms = this.backoff - Date.now();
            this.backoff = null;
            if (ms > 0) {
                await $promise.wait(ms)
            }
        }

        let ms = this.getWaitTimeFor(count);
        this.rates.forEach(rate => rate.addRequests(count, now))

        if (ms > 0) {
            this.awaited.count += 1;
            this.awaited.total += ms;
            this.onThrottle(ms);
            await $promise.wait(ms);
        }
    }
    public onComplete (tick: number) {
        let now = Date.now();
        this.rates.forEach(rate => rate.updateRequests(tick, now));
    }

    private onThrottle(ms: number) {
        let awaited = this.awaited;
        if (awaited.count > 0 && awaited.count % 20 === 0) {
            l`The Node ${this.id} with (${this.rates[0].counter}req) was ${awaited.count}x throttled, in total for ${ $date.formatTimespan(awaited.total) }. Current wait-time: ${ $date.formatTimespan(ms) }`
        } else if (ms > 30_000) {
            l`The Node ${this.id} with (${this.rates[0].counter}req) waits now for ${ $date.formatTimespan(ms) } to continue.`
        }

        //-this.rates[1].printStatus()
    }


}

/**
 * In short epoch rate limiter (1s, 1m, 1h) we track each request
 *
 * sliding(rolling) window | fixed window
 */
class ShortEpochRateLimitData {
    public started: number;
    public counter = 0;
    public ticks = [] as number[]
    private readonly TOLERANCE = 100;

    constructor(public spanMs: number, public spanLimit: number) {

    }

    static parseRateLimit(rate: string) {
        let rgx = /^(?<limit>\d+)[\\/](?<time>\w+)$/;
        let match = rgx.exec(rate);
        if (match == null) {
            throw new Error(`Invalid value for rate limit: ${rate}. Expects to match the regex: ${rgx.toString()}`);
        }
        let spanMs = Number(match.groups.limit);
        let spanLimit = $date.parseTimespan(match.groups.time);
        return new ShortEpochRateLimitData(spanLimit, spanMs);
    }

    status () {
        return {
            wait: this.getWaitTimeFor(1),
            requests: this.counter,
            spanStart: this.ticks[0],
            spanRequests: this.ticks.length,
            spanMs: this.spanMs,
            spanLimit: this.spanLimit,
        };
    }
    printStatus () {
        let lines = alot(this.ticks)
            .groupBy(x => x)
            .map(x => `${ $date.format(new Date(x.key), 'HH:mm:ss.ms') }: ${x.values.length}`)
            .toArray()
            .join('\n');

        l`Started at ${$date.format(new Date(this.started), 'dd HH:mm:ss.ms')}`;
        l`${ lines }`
    }

    public addRequests (amount = 1, time: number) {
        if (this.counter === 0) {
            this.started = Date.now();
        }
        this.counter += amount;
        while (--amount > -1) {
            this.ticks.push(time);
        }
    }

    /**
     * The server has own request time, with `addTicks` we save the time BEFORE sending to the server
     * Here we should update the times AFTER the response received,
     * otherwise the Request could be removed locally from TimeWindow earlier, as it has been cleared on the backend.
     */
    public updateRequests (tick: number, newTick: number) {
        for (let i = 0; i < this.ticks.length; i++) {
            if (this.ticks[i] === tick) {
                this.ticks[i] = newTick;
            }
        }
    }
    public getWaitTimeFor (ticksCount: number) {
        let now = Date.now();
        let ticks = this.ticks;
        let spanStart = now - this.spanMs;
        for (let i = 0; i < ticks.length; i++) {
            if (ticks[i] < spanStart) {
                // older ticks, continue to slice later
                continue;
            }

            if (i > 0) {
                // remove older requests
                ticks.splice(0, i);
            }
            // in range tick found
            break;
        }

        if ((ticks.length + ticksCount) <= this.spanLimit) {
            // We can add requests to current span
            return 0;
        }

        let timeWeCanAdd = ticks[0] + this.spanMs;
        let ms = timeWeCanAdd - now + this.TOLERANCE;
        return ms;
    }


}
