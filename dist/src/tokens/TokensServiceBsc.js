"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokensServiceBsc = void 0;
const a_di_1 = __importDefault(require("a-di"));
const TokensService_1 = require("./TokensService");
const Bscscan_1 = require("@dequanto/BlockchainExplorer/Bscscan");
class TokensServiceBsc extends TokensService_1.TokensService {
    constructor() {
        super('bsc', a_di_1.default.resolve(Bscscan_1.Bscscan));
    }
    static async erc20(mix) {
        return TokensService_1.TokensService.erc20(mix, 'bsc');
    }
}
exports.TokensServiceBsc = TokensServiceBsc;
