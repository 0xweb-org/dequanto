"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polyscan = void 0;
const a_di_1 = __importDefault(require("a-di"));
const BlockChainExplorerFactory_1 = require("./BlockChainExplorerFactory");
const _config_1 = require("@dequanto/utils/$config");
const PolyWeb3Client_1 = require("@dequanto/clients/PolyWeb3Client");
const contracts = _config_1.$config.get('contracts.polygon', []);
class Polyscan extends BlockChainExplorerFactory_1.BlockChainExplorerFactory.create({
    ABI_CACHE: `./cache/poly/abis.json`,
    CONTRACTS: contracts,
    getWeb3() {
        return a_di_1.default.resolve(PolyWeb3Client_1.PolyWeb3Client);
    },
    getConfig() {
        const config = _config_1.$config.get('blockchainExplorer.polygon');
        return {
            key: config?.key,
            host: config?.host,
        };
    }
}) {
}
exports.Polyscan = Polyscan;
