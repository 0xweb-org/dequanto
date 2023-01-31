"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxLogsTransfer = void 0;
const alot_1 = __importDefault(require("alot"));
const TokenDataProvider_1 = require("@dequanto/tokens/TokenDataProvider");
class TxLogsTransfer {
    async extractFromWriter(writer) {
        let receipt = await writer.onCompleted;
        let knownLogs = writer.tx?.knownLogs ?? [];
        return this.extractFromParsed(knownLogs, writer.client.platform);
    }
    async extractFromParsed(knownLogs, platform) {
        let transfers = knownLogs.filter(x => x.event === 'Transfer');
        let tokenService = new TokenDataProvider_1.TokenDataProvider(platform);
        return (0, alot_1.default)(transfers).mapAsync(async (transfer) => {
            let erc20Address = transfer.address;
            let token = await tokenService.getTokenOrDefault(erc20Address);
            let [from, to, amount] = transfer.arguments;
            return {
                event: transfer.event,
                token,
                from: from.value,
                to: to.value,
                amount: amount.value
            };
        }).toArrayAsync();
    }
    // async extractFromReceipt (receipt: TransactionReceipt, platform: TPlatform): Promise<ITxLogsTransferData[]> {
    //     let parser = new TxLogParser();
    //     let logs = await parser.parse(receipt);
    //     logs = logs.filter(x => x != null);
    //     return this.extractFromParsed(logs, platform);
    // }
    async extract(transfer, platform) {
        let tokenService = new TokenDataProvider_1.TokenDataProvider(platform);
        let erc20Address = transfer.address;
        let token = await tokenService.getTokenOrDefault(erc20Address);
        let [from, to, amount] = transfer.arguments;
        return {
            event: transfer.event,
            token,
            from: from.value,
            to: to.value,
            amount: amount.value
        };
    }
}
exports.TxLogsTransfer = TxLogsTransfer;
