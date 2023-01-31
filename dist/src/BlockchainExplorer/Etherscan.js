"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Etherscan = void 0;
const a_di_1 = __importDefault(require("a-di"));
const _config_1 = require("@dequanto/utils/$config");
const EthWeb3Client_1 = require("@dequanto/clients/EthWeb3Client");
const BlockChainExplorerFactory_1 = require("./BlockChainExplorerFactory");
const contracts = _config_1.$config.get('contracts.eth', []);
class Etherscan extends BlockChainExplorerFactory_1.BlockChainExplorerFactory.create({
    ABI_CACHE: `./cache/eth/abis.json`,
    CONTRACTS: contracts,
    getWeb3() {
        return a_di_1.default.resolve(EthWeb3Client_1.EthWeb3Client);
    },
    getConfig(platform) {
        platform ?? (platform = 'eth');
        let config = _config_1.$config.get(`blockchainExplorer.${platform}`);
        let mainnet = /(?<mainnet>\w+):/.exec(platform)?.groups?.mainnet;
        if (mainnet != null) {
            let mainnetConfig = _config_1.$config.get(`blockchainExplorer.${mainnet}`);
            config = {
                ...(mainnetConfig ?? {}),
                ...(config ?? {})
            };
        }
        return {
            key: config?.key,
            host: config?.host,
            www: config?.www,
        };
    }
}) {
}
exports.Etherscan = Etherscan;
