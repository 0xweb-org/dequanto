"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GasWatcherStore = void 0;
const JsonObjectStore_1 = require("@dequanto/json/JsonObjectStore");
class GasWatcherStore {
    constructor(name = '') {
        this.name = name;
        this.jsonStore = new JsonObjectStore_1.JsonObjectStore({
            path: `./db/gaswatcher/txs${this.name}.json`,
            format: true,
        });
    }
    async savePrice(enty) {
    }
    async loadPrices(from, toDate) {
        return [];
    }
    async saveTxs(txs) {
        return this.jsonStore.save(txs);
    }
    async loadTxs() {
        return this.jsonStore.get();
    }
}
exports.GasWatcherStore = GasWatcherStore;
