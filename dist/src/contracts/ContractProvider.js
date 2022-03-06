"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractProvider = void 0;
const Etherscan_1 = require("@dequanto/BlockchainExplorer/Etherscan");
const a_di_1 = __importDefault(require("a-di"));
class ContractProvider {
    constructor(api = a_di_1.default.resolve(Etherscan_1.Etherscan)) {
        this.api = api;
    }
    async getByName(name) {
        let info = this.api.localDb.find(x => x.name === name);
        let { abi } = await this.api.getContractAbi(info.address);
        return {
            ...info,
            abi
        };
    }
    async getByAddress(address) {
        let info = await this.getInfo(address);
        if (info == null) {
            throw new Error(`Contract info not found for ${address}`);
        }
        let abi = await this.getAbi(info.address);
        return {
            ...info,
            abi
        };
    }
    async getAbi(address) {
        let { abi } = await this.api.getContractAbi(address);
        return abi;
    }
    async getInfo(q) {
        return this.api.getContractMeta(q);
    }
}
exports.ContractProvider = ContractProvider;
