import { JsonArrayStore } from '@dequanto/json/JsonArrayStore';
import { JsonObjectStore } from '@dequanto/json/JsonObjectStore';
import { IToken } from '@dequanto/models/IToken';
import { TAddress } from '@dequanto/models/TAddress';
import memd from 'memd';

interface ITokenPriceOptions {
    date?: Date
    toleranceTop?: number
    toleranceBottom?: number
}

export class TokenPriceStore {

    static forToken (token: TAddress): TokenPriceStore {
        return stores[token] ?? (stores[token] = new TokenPriceStore(token));
    }

    private prices = null as [number, number][]
    private pricesIdx = {} as {
        [day: string]: {
            [hour: string]: {
                [minute: string]: [number, number][]
            }
        }
    }

    private store =  new JsonArrayStore<[number, number]>({
        path: `./db/tokens/${this.token}.json`,
        key: x => String(x[0])
    });

    constructor (public token: TAddress) {

    }

    async getPrice (date = Date.now()) {
        if (this.prices == null) {
            await this.restore();
        }
        let [ timestamp, price ] = this.get(date) ?? EMPTY;
        return price;
    }
    async setPrice(price: number, date = Date.now()) {
        if (this.prices == null) {
            await this.restore();
        }
        this.add(date, price)
    }


    @memd.deco.memoize()
    private async restore () {
        let prices = await this.store.getAll() ?? [];

        prices.forEach(([timestamp, price]) => {
            this.add(timestamp, price);
        });
    }

    @memd.deco.throttle(4 * 1000)
    private async save () {
        await this.store.saveAll(this.prices);
    }
    private add (timestamp: number, price: number) {
        let idx = this.pricesIdx;
        let $minute = pickMinuteArr(idx, timestamp);

        let tuple = [timestamp, price] as [number, number];
        $minute.push(tuple);
        this.prices.push(tuple);

        this.save();
    }
    private get(timestamp: number, tolerance: number = 1): [number, number] {

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

const stores = Object.create(null);
const EMPTY = [ null, null ] as [number, number];
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const keys = ['', '', ''];
function split(timestamp: number) {
    let day = timestamp / DAY | 0;
    let hour = timestamp % DAY / HOUR | 0;
    let minute = timestamp % DAY % HOUR / MINUTE | 0;

    keys[0] = `_${day}`;
    keys[1] = `_${hour}`;
    keys[2] = `_${minute}`;
    return keys;
}

function pickMinuteArr (idx: TokenPriceStore['pricesIdx'], timestamp: number) {
    let [day, hour, min] = split(timestamp);

    let _day = `_${day}`;
    let _hour = `_${hour}`;
    let _min = `_${min}`;


    let $day = idx[_day] ?? (idx[_day] = Object.create(null));
    let $hour = $day[_hour] ?? ($day[_hour] = Object.create(null));
    let $minute = $hour[_min] ?? ($hour[_min] = []);
    return $minute;
}
