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
exports.TokenPriceStore = void 0;
const JsonArrayStore_1 = require("@dequanto/json/JsonArrayStore");
const memd_1 = __importDefault(require("memd"));
class TokenPriceStore {
    constructor(token) {
        this.token = token;
        this.prices = null;
        this.pricesIdx = {};
        this.store = new JsonArrayStore_1.JsonArrayStore({
            path: `./db/tokens/${this.token}.json`,
            key: x => String(x[0])
        });
    }
    static forToken(token) {
        return stores[token] ?? (stores[token] = new TokenPriceStore(token));
    }
    async getPrice(date = Date.now()) {
        if (this.prices == null) {
            await this.restore();
        }
        let [timestamp, price] = this.get(date) ?? EMPTY;
        return price;
    }
    async setPrice(price, date = Date.now()) {
        if (this.prices == null) {
            await this.restore();
        }
        this.add(date, price);
    }
    async restore() {
        let prices = await this.store.getAll() ?? [];
        prices.forEach(([timestamp, price]) => {
            this.add(timestamp, price);
        });
    }
    async save() {
        await this.store.saveAll(this.prices);
    }
    add(timestamp, price) {
        let idx = this.pricesIdx;
        let $minute = pickMinuteArr(idx, timestamp);
        let tuple = [timestamp, price];
        $minute.push(tuple);
        this.prices.push(tuple);
        this.save();
    }
    get(timestamp, tolerance = 1) {
        let idx = this.pricesIdx;
        let ms = timestamp;
        for (let i = 0; i < tolerance + 1; i++) {
            let $minute = pickMinuteArr(idx, ms - i * MINUTE);
            if ($minute.length !== 0) {
                return $minute[0];
            }
            if (i === 0) {
                continue;
            }
            let $minuteAfter = pickMinuteArr(idx, ms + i * MINUTE);
            if ($minuteAfter.length !== 0) {
                return $minuteAfter[0];
            }
        }
        return null;
    }
}
__decorate([
    memd_1.default.deco.memoize()
], TokenPriceStore.prototype, "restore", null);
__decorate([
    memd_1.default.deco.throttle(4 * 1000)
], TokenPriceStore.prototype, "save", null);
exports.TokenPriceStore = TokenPriceStore;
const stores = Object.create(null);
const EMPTY = [null, null];
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const keys = ['', '', ''];
function split(timestamp) {
    let day = timestamp / DAY | 0;
    let hour = timestamp % DAY / HOUR | 0;
    let minute = timestamp % DAY % HOUR / MINUTE | 0;
    keys[0] = `_${day}`;
    keys[1] = `_${hour}`;
    keys[2] = `_${minute}`;
    return keys;
}
function pickMinuteArr(idx, timestamp) {
    let [day, hour, min] = split(timestamp);
    let _day = `_${day}`;
    let _hour = `_${hour}`;
    let _min = `_${min}`;
    let $day = idx[_day] ?? (idx[_day] = Object.create(null));
    let $hour = $day[_hour] ?? ($day[_hour] = Object.create(null));
    let $minute = $hour[_min] ?? ($hour[_min] = []);
    return $minute;
}
