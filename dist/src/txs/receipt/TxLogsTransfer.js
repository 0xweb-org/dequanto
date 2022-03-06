"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxLogsTransfer = void 0;
const alot_1 = __importDefault(require("alot"));
const TokensServiceFactory_1 = require("@dequanto/tokens/TokensServiceFactory");
const TxLogParser_1 = require("./TxLogParser");
class TxLogsTransfer {
    async extractFromWriter(writer) {
        let receipt = await writer.onCompleted;
        let knownLogs = writer.tx?.knownLogs ?? [];
        return this.extractFromParsed(knownLogs, writer.client.platform);
    }
    async extractFromParsed(knownLogs, platform) {
        let transfers = knownLogs.filter(x => x.name === 'Transfer');
        let tokenService = TokensServiceFactory_1.TokensServiceFactory.get(platform);
        return (0, alot_1.default)(transfers).mapAsync(async (transfer) => {
            let erc20Address = transfer.contract;
            let token = await tokenService.getTokenOrDefault(erc20Address);
            let [from, to, amount] = transfer.arguments;
            return {
                token,
                from: from.value,
                to: to.value,
                amount: amount.value
            };
        }).toArrayAsync();
    }
    async extractFromReceipt(receipt, platform) {
        let parser = new TxLogParser_1.TxLogParser();
        let logs = await parser.parse(receipt);
        logs = logs.filter(x => x != null);
        return this.extractFromParsed(logs, platform);
    }
    async extract(transfer, platform) {
        let tokenService = TokensServiceFactory_1.TokensServiceFactory.get(platform);
        let erc20Address = transfer.contract;
        let token = await tokenService.getTokenOrDefault(erc20Address);
        let [from, to, amount] = transfer.arguments;
        return {
            token,
            from: from.value,
            to: to.value,
            amount: amount.value
        };
    }
}
exports.TxLogsTransfer = TxLogsTransfer;
