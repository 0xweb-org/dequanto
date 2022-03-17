"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const a_di_1 = __importDefault(require("a-di"));
const alot_1 = __importDefault(require("alot"));
const TokensService_1 = require("@dequanto/tokens/TokensService");
class WalletService {
    constructor(wallet) {
        this.wallet = wallet;
    }
    async getTokens(fromBlock) {
        let wallet = this.wallet;
        let account = wallet.account;
        let events = await wallet.explorer.getErc20Transfers(account.address, fromBlock);
        let service = a_di_1.default.resolve(TokensService_1.TokensService, account.platform, wallet.explorer);
        let tokens = await (0, alot_1.default)(events)
            .map(x => x.contractAddress)
            .distinct()
            .mapAsync(async (address) => {
            let token = await service.getKnownToken(address);
            if (token?.address == null) {
                return null;
            }
            return token;
        })
            .toArrayAsync({ threads: 10 });
        return tokens.filter(Boolean);
    }
}
exports.WalletService = WalletService;
class WalletTokensEntity {
}
