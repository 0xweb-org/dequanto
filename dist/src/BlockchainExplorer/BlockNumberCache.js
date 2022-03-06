"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockNumberCache = void 0;
const Web3ClientFactory_1 = require("@dequanto/clients/Web3ClientFactory");
const JsonArrayStore_1 = require("@dequanto/json/JsonArrayStore");
class BlockNumberCache {
    constructor(platform, name) {
        this.platform = platform;
        this.name = name;
        this.store = new JsonArrayStore_1.JsonArrayStore({
            path: `/cache/${platform}/blockNumber-${name}.json`,
            key: x => x.address
        });
    }
    async getCached(address) {
        let entry = await this.store.getSingle(address);
        return entry ?? {
            address: address,
            blockNumber: null,
        };
    }
    async saveCached(cache) {
        await this.store.upsert(cache);
    }
    async updateCache(cache) {
        let client = Web3ClientFactory_1.Web3ClientFactory.get(this.platform);
        let toleranz = 5;
        let number = await client.getBlockNumberCached() - toleranz;
        cache.blockNumber = Math.max(number, cache.blockNumber);
        await this.store.upsert(cache);
    }
}
exports.BlockNumberCache = BlockNumberCache;
