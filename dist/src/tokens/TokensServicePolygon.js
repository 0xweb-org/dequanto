"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokensServicePolygon = void 0;
const a_di_1 = __importDefault(require("a-di"));
const TokensService_1 = require("./TokensService");
const Polyscan_1 = require("@dequanto/BlockchainExplorer/Polyscan");
class TokensServicePolygon extends TokensService_1.TokensService {
    constructor() {
        super('polygon', a_di_1.default.resolve(Polyscan_1.Polyscan));
    }
    static async erc20(mix) {
        return TokensService_1.TokensService.erc20(mix, 'polygon');
    }
}
exports.TokensServicePolygon = TokensServicePolygon;
