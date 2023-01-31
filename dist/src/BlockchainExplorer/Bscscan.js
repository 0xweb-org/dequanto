"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bscscan = void 0;
const a_di_1 = __importDefault(require("a-di"));
const BlockChainExplorerFactory_1 = require("./BlockChainExplorerFactory");
const _config_1 = require("@dequanto/utils/$config");
const BscWeb3Client_1 = require("@dequanto/clients/BscWeb3Client");
const contracts = _config_1.$config.get('contracts.bsc', []);
class Bscscan extends BlockChainExplorerFactory_1.BlockChainExplorerFactory.create({
    ABI_CACHE: `./cache/bsc/abis.json`,
    CONTRACTS: contracts,
    getWeb3() {
        return a_di_1.default.resolve(BscWeb3Client_1.BscWeb3Client);
    },
    getConfig() {
        const config = _config_1.$config.get('blockchainExplorer.bsc');
        return {
            key: config?.key,
            host: config?.host,
            www: config?.www,
        };
    }
}) {
}
exports.Bscscan = Bscscan;
