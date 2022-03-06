"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XDaiscan = void 0;
const a_di_1 = __importDefault(require("a-di"));
const _config_1 = require("@dequanto/utils/$config");
const BlockChainExplorerFactory_1 = require("@dequanto/BlockchainExplorer/BlockChainExplorerFactory");
const XDaiWeb3Client_1 = require("./XDaiWeb3Client");
const config = _config_1.$config.get('blockchainExplorer.xdai');
const contracts = _config_1.$config.get('contracts.xdai', []);
class XDaiscan extends BlockChainExplorerFactory_1.BlockChainExplorerFactory.create({
    KEY: config?.key,
    HOST: config?.host,
    ABI_CACHE: `./cache/xdai/abis.json`,
    CONTRACTS: contracts,
    getWeb3() {
        return a_di_1.default.resolve(XDaiWeb3Client_1.XDaiWeb3Client);
    }
}) {
}
exports.XDaiscan = XDaiscan;
