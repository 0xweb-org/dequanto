"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxContract = void 0;
const a_di_1 = __importDefault(require("a-di"));
const alot_1 = __importDefault(require("alot"));
const Etherscan_1 = require("@dequanto/BlockchainExplorer/Etherscan");
const ethers_1 = require("ethers");
const ContractProvider_1 = require("./ContractProvider");
class TxContract {
    constructor(loader = a_di_1.default.resolve(Etherscan_1.Etherscan)) {
        this.loader = loader;
        this.provider = a_di_1.default.resolve(ContractProvider_1.ContractProvider, this.loader);
    }
    async parseTrasaction(tx) {
        const abi = await this.provider.getAbi(tx.to);
        const inter = new ethers_1.utils.Interface(abi);
        const decodedInput = inter.parseTransaction({
            data: tx.input,
            value: tx.value,
        });
        return decodedInput;
    }
    async parseTrasactions(arr) {
        let mapped = await (0, alot_1.default)(arr).mapAsync(async (tx) => {
            let details = await this.parseTrasaction(tx);
            return {
                ...tx,
                details: details
            };
        }).toArrayAsync();
        return mapped;
    }
}
exports.TxContract = TxContract;
