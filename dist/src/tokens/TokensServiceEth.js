"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokensServiceEth = void 0;
const a_di_1 = __importDefault(require("a-di"));
const TokensService_1 = require("./TokensService");
const Etherscan_1 = require("@dequanto/BlockchainExplorer/Etherscan");
class TokensServiceEth extends TokensService_1.TokensService {
    constructor() {
        super('eth', a_di_1.default.resolve(Etherscan_1.Etherscan));
    }
}
exports.TokensServiceEth = TokensServiceEth;
