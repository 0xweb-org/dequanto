"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenSwapService = void 0;
const ChainAccountsService_1 = require("@dequanto/ChainAccountsService");
const a_di_1 = __importDefault(require("a-di"));
const Paraswap_1 = require("./defi/paraswap/Paraswap");
class TokenSwapService {
    constructor(client, provider = a_di_1.default.resolve(Paraswap_1.Paraswap, client.platform, client)) {
        this.client = client;
        this.provider = provider;
    }
    async swap(account, params) {
        if (typeof account === 'string') {
            let accountsService = a_di_1.default.resolve(ChainAccountsService_1.ChainAccountsService);
            let acc = await accountsService.get(account, this.client.platform);
            if (acc == null) {
                throw new Error(`Account ${account} not found`);
            }
            account = acc;
        }
        // let transfer = di.resolve(TokenTransferService, this.client);
        // let balance = await transfer.getBalance(account, params.from);
        // let token = await transfer.getToken(TOKEN_FROM);
        // let amount = balance - $bigint.toWei(24, token.decimals);
        let { from, to, amount } = params;
        let tx = await this.provider.swap(account, {
            from: from,
            to: to,
            fromAmount: amount,
        });
        return tx;
    }
}
exports.TokenSwapService = TokenSwapService;
