"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxTopicProvider = void 0;
const a_di_1 = __importDefault(require("a-di"));
const TxLogsTransfer_1 = require("./TxLogsTransfer");
const TxTopicInMemoryProvider_1 = require("./TxTopicInMemoryProvider");
class TxTopicProvider {
    constructor() {
        this.default = new TxTopicInMemoryProvider_1.TxTopicInMemoryProvider();
        this.register([
            //'event Transfer(address from, address to, uint256 amount)'
            {
                abi: 'event Transfer(address from, address to, uint256 amount)',
                formatter: a_di_1.default.resolve(TxLogsTransfer_1.TxLogsTransfer)
            }
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
