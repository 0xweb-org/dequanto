"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const a_di_1 = __importDefault(require("a-di"));
const ERC20_1 = require("@dequanto/contracts/common/ERC20");
const TokensService_1 = require("@dequanto/tokens/TokensService");
class Wallet {
    constructor(account, client, explorer) {
        this.account = account;
        this.client = client;
        this.explorer = explorer;
        this.tokensService = a_di_1.default.resolve(TokensService_1.TokensService, this.account.platform, this.explorer);
    }
    async balanceOf(mix) {
        let token = await this.tokensService.getToken(mix);
        if (token == null) {
            throw new Error(`Token ${mix} not found`);
        }
        let erc20 = new ERC20_1.ERC20(token.address, this.client, this.explorer);
        return erc20.balanceOf(this.account.address);
    }
}
exports.Wallet = Wallet;
