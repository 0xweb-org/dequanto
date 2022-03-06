"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletBsc = void 0;
const a_di_1 = __importDefault(require("a-di"));
const BscWeb3Client_1 = require("@dequanto/clients/BscWeb3Client");
const Wallet_1 = require("./Wallet");
const Bscscan_1 = require("@dequanto/BlockchainExplorer/Bscscan");
/** @deprecated use generic Wallet.ts */
class WalletBsc extends Wallet_1.Wallet {
    constructor(account) {
        super(account, a_di_1.default.resolve(BscWeb3Client_1.BscWeb3Client), a_di_1.default.resolve(Bscscan_1.Bscscan));
    }
}
exports.WalletBsc = WalletBsc;
