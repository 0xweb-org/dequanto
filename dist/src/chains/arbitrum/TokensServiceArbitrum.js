"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokensServiceArbitrum = void 0;
const a_di_1 = __importDefault(require("a-di"));
const TokensService_1 = require("@dequanto/tokens/TokensService");
const Arbiscan_1 = require("./Arbiscan");
class TokensServiceArbitrum extends TokensService_1.TokensService {
    constructor() {
        super('arbitrum', a_di_1.default.resolve(Arbiscan_1.Arbiscan));
    }
    static async erc20(mix) {
        return TokensService_1.TokensService.erc20(mix, 'arbitrum');
    }
}
exports.TokensServiceArbitrum = TokensServiceArbitrum;
