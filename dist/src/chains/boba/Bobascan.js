"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bobascan = void 0;
const a_di_1 = __importDefault(require("a-di"));
const _config_1 = require("@dequanto/utils/$config");
const BlockChainExplorerFactory_1 = require("@dequanto/BlockchainExplorer/BlockChainExplorerFactory");
const BobaWeb3Client_1 = require("./BobaWeb3Client");
const config = _config_1.$config.get('blockchainExplorer.boba');
const contracts = _config_1.$config.get('contracts.boba', []);
class Bobascan extends BlockChainExplorerFactory_1.BlockChainExplorerFactory.create({
    ABI_CACHE: `./cache/boba/abis.json`,
    CONTRACTS: contracts,
    getWeb3() {
        return a_di_1.default.resolve(BobaWeb3Client_1.BobaWeb3Client);
    },
    getConfig() {
        const config = _config_1.$config.get('blockchainExplorer.boba');
        return {
            key: config?.key,
            host: config?.host,
        };
    }
}) {
}
exports.Bobascan = Bobascan;
