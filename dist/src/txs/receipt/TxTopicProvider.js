"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxTopicProvider = void 0;
//import { TxLogsTransfer } from './TxLogsTransfer';
const TxTopicInMemoryProvider_1 = require("./TxTopicInMemoryProvider");
class TxTopicProvider {
    constructor() {
        this.default = new TxTopicInMemoryProvider_1.TxTopicInMemoryProvider();
        this.register([
            'event Transfer(address from, address to, uint256 amount)'
            // {
            //     abi: 'event Transfer(address from, address to, uint256 amount)',
            //     formatter: di.resolve(TxLogsTransfer)
            // }
        ]);
    }
    async get(topicHash) {
        return this.default.get(topicHash);
    }
    register(mix) {
        this.default.register(mix);
        return this;
    }
}
exports.TxTopicProvider = TxTopicProvider;
