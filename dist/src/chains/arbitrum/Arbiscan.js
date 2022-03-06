"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arbiscan = void 0;
const a_di_1 = __importDefault(require("a-di"));
const _config_1 = require("@dequanto/utils/$config");
const BlockChainExplorerFactory_1 = require("@dequanto/BlockchainExplorer/BlockChainExplorerFactory");
const ArbWeb3Client_1 = require("./ArbWeb3Client");
const config = _config_1.$config.get('blockchainExplorer.arbitrum');
const contracts = _config_1.$config.get('contracts.arbitrum', []);
class Arbiscan extends BlockChainExplorerFactory_1.BlockChainExplorerFactory.create({
    KEY: config?.key,
    HOST: config?.host,
    ABI_CACHE: `./cache/arb/abis.json`,
    CONTRACTS: contracts,
    getWeb3() {
        return a_di_1.default.resolve(ArbWeb3Client_1.ArbWeb3Client);
    }
}) {
}
exports.Arbiscan = Arbiscan;
