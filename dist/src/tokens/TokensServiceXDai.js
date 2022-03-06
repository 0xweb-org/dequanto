"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokensServiceXDai = void 0;
const a_di_1 = __importDefault(require("a-di"));
const TokensService_1 = require("./TokensService");
const XDaiscan_1 = require("@dequanto/chains/xdai/XDaiscan");
class TokensServiceXDai extends TokensService_1.TokensService {
    constructor() {
        super('xdai', a_di_1.default.resolve(XDaiscan_1.XDaiscan));
    }
    static async erc20(mix) {
        return TokensService_1.TokensService.erc20(mix, 'xdai');
    }
    async getTokenBySymbol(symbol, chainLookup = true) {
        if (symbol === 'DAI') {
            symbol = 'wxDAI';
        }
        return super.getTokenBySymbol(symbol, chainLookup);
    }
}
exports.TokensServiceXDai = TokensServiceXDai;
