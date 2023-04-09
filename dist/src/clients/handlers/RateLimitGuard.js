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
exports.RateLimitGuard = void 0;
const _date_1 = require("@dequanto/utils/$date");
const _logger_1 = require("@dequanto/utils/$logger");
const _promise_1 = require("@dequanto/utils/$promise");
const alot_1 = __importDefault(require("alot"));
const memd_1 = __importDefault(require("memd"));
let rateLimitRgx = {
    checks: [
        // extracted from known and common rate-limit messages
        /rate.+limit/i,
        /too.+many.+request/i,
        /exceed.+request/i,
        /try.+later/i,
        /request.+rate/i,
    ],
    extracts: [
        // 100 per 1 minute
        /(?<limit>\d+)\s*(per|\/)\s*(?<periodValue>\d+)?\s*(?<periodName>[msdh])/i,
    ],
    knownFields: {
        allowed_rps(val) {
            val = Number(val);
            return {
                spanMs: val * 1000,
                spanCount: val
            };
        }
    }
};
let batchLimitRgx = {
    extracts: [
        /batch\s+limit\s+(?<batchLimit>\d+)/i,
    ],
};
class RateLimitGuard {
    constructor(opts) {
        this.awaited = { count: 0, total: 0 };
        this.id = opts.id;
        this.rates = opts.rates;
    }
    static isBatchLimit(error) {
        return batchLimitRgx.extracts.some(x => x.test(error.message));
    }
    static extractBatchLimitFromError(error) {
        for (let rgx of batchLimitRgx.extracts) {
            let val = rgx.exec(error.message)?.groups?.batchLimit;
            if (val != null) {
                return Number(val);
            }
        }
        return null;
    }
    static isRateLimited(error) {
        let message = error.message;
        let hasMatches = rateLimitRgx.checks.some(x => x.test(message));
        if (hasMatches) {
            return true;
        }
        return false;
    }
    /**
     * @param rate 100/5min 30/sec
     */
    static parseRateLimit(rate) {
        return rate.split(';').map(rate => {
            return ShortEpochRateLimitData.parseRateLimit(rate);
        });
    }
    static extractRateLimitFromError(error) {
        let spanMs;
        let spanLimit;
        let backoff;
        let detailsData = error.data?.data ?? error.data;
        if (detailsData != null) {
            for (let key in detailsData) {
                let val = detailsData[key];
                if (/backoff|next|reset/i.test(key) && /^\d+$/.test(String(val))) {
                    val = Number(val);
                    if (val < 50000) {
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
                    spanMs = _date_1.$date.parseTimespan(`${periodValue || 1}${periodName}`);
                }
                catch (error) { }
                spanLimit = Number(limit);
            }
        }
        let result = {
            backoff,
            spanLimit,
            spanMs,
        };
        return result;
    }
    status() {
        return {
            id: this.id,
            guards: this.rates.map(x => x.status())
        };
    }
    checkWaitTime() {
        return this.getWaitTimeFor();
    }
    updateRateLimitInfo(info) {
        if (info == null) {
            const SECOND = 1000;
            let perSecond = this.rates.find(x => x.spanMs === SECOND);
            if (perSecond == null) {
                perSecond = new ShortEpochRateLimitData(SECOND, 100);
                this.rates.unshift(perSecond);
            }
            info = {
                // retries in 2s
                backoff: Date.now() + 2000,
                spanMs: SECOND,
                spanLimit: Math.floor(perSecond.spanLimit * .95)
            };
        }
        if (info.backoff) {
            this.backoff = info.backoff;
        }
        if (info.spanLimit && info.spanMs) {
            (0, _logger_1.l) `Updating the yellow<rate limits> for ${this.id} using: bold<${info.spanLimit}> per bold<${info.spanMs}ms>`;
            let rate = this.rates.find(x => x.spanMs === info.spanMs);
            if (rate) {
                rate.spanLimit = info.spanLimit;
            }
            else {
                this.rates.push(new ShortEpochRateLimitData(info.spanMs, info.spanLimit));
            }
        }
    }
    getWaitTimeFor(reqCount = 1) {
        let waits = this.rates.map(x => x.getWaitTimeFor(reqCount));
        let ms = Math.max(...waits);
        if (ms > 0) {
            //-console.log(`${Date.now()} WaitTime (${ reqCount}) ${waits.join('|')}; SpanRequests: ${ this.rates.map(x => x.ticks.length).join('|') }; Starts: ${ this.rates.map(x => x.ticks[0]).join('|') }`);
        }
        return ms;
    }
    getSpanLimit() {
        return (0, alot_1.default)(this.rates).min(x => x.spanLimit);
    }
    async wait(count = 1, now = Date.now()) {
        if (this.backoff != null) {
            let ms = this.backoff - Date.now();
            this.backoff = null;
            if (ms > 0) {
                await _promise_1.$promise.wait(this.backoff);
            }
        }
        let ms = this.getWaitTimeFor(count);
        this.rates.forEach(rate => rate.addRequests(count, now));
        if (ms > 0) {
            this.awaited.count += 1;
            this.awaited.total += ms;
            this.onThrottle(ms);
            await _promise_1.$promise.wait(ms);
        }
    }
    onComplete(tick) {
        let now = Date.now();
        this.rates.forEach(rate => rate.updateRequests(tick, now));
    }
    onThrottle(ms) {
        let awaited = this.awaited;
        if (awaited.count > 0 && awaited.count % 20 === 0) {
            (0, _logger_1.l) `The Node ${this.id} with (${this.rates[0].counter}req) was ${awaited.count}x throttled, in total for ${_date_1.$date.formatTimespan(awaited.total)}. Current wait-time: ${_date_1.$date.formatTimespan(ms)}`;
        }
        else if (ms > 30000) {
            (0, _logger_1.l) `The Node ${this.id} with (${this.rates[0].counter}req) waits now for ${_date_1.$date.formatTimespan(ms)} to continue.`;
        }
        //-this.rates[1].printStatus()
    }
}
__decorate([
    memd_1.default.deco.queued()
], RateLimitGuard.prototype, "wait", null);
exports.RateLimitGuard = RateLimitGuard;
/**
 * In short epoch rate limiter (1s, 1m, 1h) we track each request
 *
 * sliding(rolling) window | fixed window
 */
class ShortEpochRateLimitData {
    constructor(spanMs, spanLimit) {
        this.spanMs = spanMs;
        this.spanLimit = spanLimit;
        this.counter = 0;
        this.ticks = [];
        this.TOLERANCE = 100;
    }
    static parseRateLimit(rate) {
        let rgx = /^(?<limit>\d+)[\\/](?<time>\w+)$/;
        let match = rgx.exec(rate);
        if (match == null) {
            throw new Error(`Invalid value for rate limit: ${rate}. Expects to match the regex: ${rgx.toString()}`);
        }
        let spanMs = Number(match.groups.limit);
        let spanLimit = _date_1.$date.parseTimespan(match.groups.time);
        return new ShortEpochRateLimitData(spanLimit, spanMs);
    }
    status() {
        return {
            wait: this.getWaitTimeFor(1),
            requests: this.counter,
            spanStart: this.ticks[0],
            spanRequests: this.ticks.length,
            spanMs: this.spanMs,
            spanLimit: this.spanLimit,
        };
    }
    printStatus() {
        let lines = (0, alot_1.default)(this.ticks)
            .groupBy(x => x)
            .map(x => `${_date_1.$date.format(new Date(x.key), 'HH:mm:ss.ms')}: ${x.values.length}`)
            .toArray()
            .join('\n');
        (0, _logger_1.l) `Started at ${_date_1.$date.format(new Date(this.started), 'dd HH:mm:ss.ms')}`;
        (0, _logger_1.l) `${lines}`;
    }
    addRequests(amount = 1, time) {
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
    updateRequests(tick, newTick) {
        for (let i = 0; i < this.ticks.length; i++) {
            if (this.ticks[i] === tick) {
                this.ticks[i] = newTick;
            }
        }
    }
    getWaitTimeFor(ticksCount) {
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
