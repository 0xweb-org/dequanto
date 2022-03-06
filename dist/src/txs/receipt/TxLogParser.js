"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxLogParser = void 0;
const alot_1 = __importDefault(require("alot"));
const _contract_1 = require("@dequanto/utils/$contract");
const TxTopicProvider_1 = require("./TxTopicProvider");
class TxLogParser {
    constructor(topics = new TxTopicProvider_1.TxTopicProvider()) {
        this.topics = topics;
    }
    async parse(receipt) {
        let logs = await (0, alot_1.default)(receipt.logs).mapAsync(async (log) => {
            let topic = await this.topics.get(log.topics[0]);
            if (topic == null) {
                return null;
            }
            let { abi, formatter } = topic;
            let parsed = _contract_1.$contract.parseLogWithAbi(log, abi);
            return parsed;
        }).toArrayAsync();
        return logs;
    }
}
exports.TxLogParser = TxLogParser;
