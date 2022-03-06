"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenPriceServiceProvider = void 0;
const a_di_1 = __importDefault(require("a-di"));
const Etherscan_1 = require("@dequanto/BlockchainExplorer/Etherscan");
const EthWeb3Client_1 = require("@dequanto/clients/EthWeb3Client");
const TokenPriceService_1 = require("./TokenPriceService");
const BscWeb3Client_1 = require("@dequanto/clients/BscWeb3Client");
const Bscscan_1 = require("@dequanto/BlockchainExplorer/Bscscan");
var TokenPriceServiceProvider;
(function (TokenPriceServiceProvider) {
    function create(platform, client, explorer) {
        if (platform === 'eth') {
            return a_di_1.default.resolve(TokenPriceService_1.TokenPriceService, client ?? a_di_1.default.resolve(EthWeb3Client_1.EthWeb3Client), explorer ?? a_di_1.default.resolve(Etherscan_1.Etherscan));
        }
        if (platform === 'bsc') {
            return a_di_1.default.resolve(TokenPriceService_1.TokenPriceService, client ?? a_di_1.default.resolve(BscWeb3Client_1.BscWeb3Client), explorer ?? a_di_1.default.resolve(Bscscan_1.Bscscan));
        }
        throw new Error(`Unsupported platform: ${platform}`);
    }
    TokenPriceServiceProvider.create = create;
    /** To boot performance use cached prices within 5 minutes interval */
    function createTimeRanged(platform, client, explorer) {
        let service = TokenPriceServiceProvider.create(platform, client, explorer);
        return new TokenPriceService_1.TokenPriceServiceCacheable(service);
    }
    TokenPriceServiceProvider.createTimeRanged = createTimeRanged;
})(TokenPriceServiceProvider = exports.TokenPriceServiceProvider || (exports.TokenPriceServiceProvider = {}));
