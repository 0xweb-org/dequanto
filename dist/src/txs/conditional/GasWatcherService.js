"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GasWatcherService = void 0;
const _bigint_1 = require("@dequanto/utils/$bigint");
const alot_1 = __importDefault(require("alot"));
const GasWatcherLogger_1 = require("./GasWatcherLogger");
const GasWatcherStore_1 = require("./GasWatcherStore");
const GasWatcherTx_1 = require("./GasWatcherTx");
class GasWatcherService {
    constructor(client, store) {
        this.client = client;
        this.store = store;
        this.pending = [];
        this.logger = new GasWatcherLogger_1.GasWatcherLogger();
    }
    static async load(client, store = new GasWatcherStore_1.GasWatcherStore(client.platform)) {
        let service = new GasWatcherService(client, store);
        await service.loadTxs();
        return service;
    }
    start() {
        this.tick();
        //setInterval(() => this.tick(), ms);
    }
    async tick() {
        let start = Date.now();
        let [block, price] = await Promise.all([
            this.client.getBlockNumber(),
            this.client.getGasPrice()
        ]);
        this.logger.logPrice(price, block);
        await this.store.savePrice({ date: new Date(), price });
        await (0, alot_1.default)(this.pending)
            .forEachAsync(async (entry) => {
            await entry.tick(price);
        })
            .toArrayAsync();
        // let end = Date.now();
        // console.log(`Gas tick completed in ${$date.formatTimespan(end - start)}`);
        let ms = 30000;
        if (this.pending.length > 0) {
            let expectPrice = (0, alot_1.default)(this.pending).max(x => x.condition.price);
            if (expectPrice < price && price - expectPrice < 10) {
                ms = 15000;
            }
        }
        // if (expectPrice < price) {
        //     ms *= Number(price) / Number(expectPrice) * .5;
        // }
        setTimeout(() => {
            this.tick();
        }, ms);
    }
    async add(writer, condition) {
        let writerJson = writer.toJSON();
        let exists = this.pending.some(pending => {
            let currentData = writer.builder.data;
            let pendingData = pending.txWriter.builder.data;
            let currentTo = currentData.to;
            let pendingTo = pendingData.to;
            if (currentTo !== pendingTo) {
                return false;
            }
            let currentFrom = writer.account.address;
            let pendingFrom = pending.txWriter.account.address;
            if (currentFrom !== pendingFrom) {
                return false;
            }
            if (currentData.data !== pendingData.data) {
                return false;
            }
            // similar
            return true;
        });
        if (exists) {
            return;
        }
        let gasWatcherWriter = await GasWatcherTx_1.GasWatcherTx.fromJSON(condition, writerJson, this.logger);
        this.pending.push(gasWatcherWriter);
        let id = gasWatcherWriter.txWriter.id;
        let gwei = _bigint_1.$bigint.toGweiFromWei(gasWatcherWriter.condition.price);
        this.logger.logTx(id, `Transaction was added to listed for ${gwei} gas gwei`);
        // Ensure completed txs are removed
        this.pending = this.pending.filter(x => x.txWriter.receipt == null);
        await this.saveTxs();
    }
    async loadTxs() {
        let jsons = await this.store.loadTxs();
        let pending = await (0, alot_1.default)(jsons)
            .mapAsync(x => GasWatcherTx_1.GasWatcherTx.fromJSON(x.condition, x.writer, this.logger))
            .toArrayAsync();
        this.pending = pending;
    }
    async saveTxs() {
        let jsons = this.pending.map(x => x.toJSON());
        await this.store.saveTxs(jsons);
    }
}
exports.GasWatcherService = GasWatcherService;
