"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockChainExplorerProvider = void 0;
const a_di_1 = __importDefault(require("a-di"));
const Arbiscan_1 = require("@dequanto/chains/arbitrum/Arbiscan");
const Bscscan_1 = require("./Bscscan");
const Etherscan_1 = require("./Etherscan");
const Polyscan_1 = require("./Polyscan");
const XDaiscan_1 = require("@dequanto/chains/xdai/XDaiscan");
var BlockChainExplorerProvider;
(function (BlockChainExplorerProvider) {
    function get(platform) {
        switch (platform) {
            case 'bsc':
                return a_di_1.default.resolve(Bscscan_1.Bscscan);
            case 'eth':
                return a_di_1.default.resolve(Etherscan_1.Etherscan);
            case 'polygon':
                return a_di_1.default.resolve(Polyscan_1.Polyscan);
            case 'arbitrum':
                return a_di_1.default.resolve(Arbiscan_1.Arbiscan);
            case 'xdai':
                return a_di_1.default.resolve(XDaiscan_1.XDaiscan);
            case 'hardhat':
                return null;
            default:
                throw new Error(`Unsupported platform ${platform} for block chain explorer`);
        }
    }
    BlockChainExplorerProvider.get = get;
})(BlockChainExplorerProvider = exports.BlockChainExplorerProvider || (exports.BlockChainExplorerProvider = {}));
