"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Etherscan = void 0;
const BlockChainExplorerFactory_1 = require("./BlockChainExplorerFactory");
const _config_1 = require("@dequanto/utils/$config");
const EthWeb3Client_1 = require("@dequanto/clients/EthWeb3Client");
const a_di_1 = __importDefault(require("a-di"));
const config = _config_1.$config.get('blockchainExplorer.eth');
const contracts = _config_1.$config.get('contracts.eth', []);
class Etherscan extends BlockChainExplorerFactory_1.BlockChainExplorerFactory.create({
    KEY: config.key,
    HOST: config.host,
    ABI_CACHE: `./cache/eth/abis.json`,
    CONTRACTS: contracts,
    getWeb3() {
        return a_di_1.default.resolve(EthWeb3Client_1.EthWeb3Client);
    }
}) {
}
exports.Etherscan = Etherscan;
