"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3ClientFactory = void 0;
const a_di_1 = __importDefault(require("a-di"));
const BscWeb3Client_1 = require("./BscWeb3Client");
const EthWeb3Client_1 = require("./EthWeb3Client");
const PolyWeb3Client_1 = require("./PolyWeb3Client");
const ArbWeb3Client_1 = require("@dequanto/chains/arbitrum/ArbWeb3Client");
const XDaiWeb3Client_1 = require("@dequanto/chains/xdai/XDaiWeb3Client");
var Web3ClientFactory;
(function (Web3ClientFactory) {
    function get(platform, opts) {
        switch (platform) {
            case 'bsc':
                return a_di_1.default.resolve(BscWeb3Client_1.BscWeb3Client, opts);
            case 'eth':
                return a_di_1.default.resolve(EthWeb3Client_1.EthWeb3Client, opts);
            case 'polygon':
                return a_di_1.default.resolve(PolyWeb3Client_1.PolyWeb3Client, opts);
            case 'arbitrum':
                return a_di_1.default.resolve(ArbWeb3Client_1.ArbWeb3Client, opts);
            case 'xdai':
                return a_di_1.default.resolve(XDaiWeb3Client_1.XDaiWeb3Client, opts);
            default:
                throw new Error(`Unsupported platform ${platform} for web3 client`);
        }
    }
    Web3ClientFactory.get = get;
})(Web3ClientFactory = exports.Web3ClientFactory || (exports.Web3ClientFactory = {}));
