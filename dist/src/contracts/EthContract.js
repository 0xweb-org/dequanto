"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthContract = void 0;
const a_di_1 = __importDefault(require("a-di"));
const ContractReader_1 = require("./ContractReader");
const Contract_1 = require("./Contract");
const ContractProvider_1 = require("./ContractProvider");
const Etherscan_1 = require("@dequanto/BlockchainExplorer/Etherscan");
const EthWeb3Client_1 = require("@dequanto/clients/EthWeb3Client");
class EthContract extends Contract_1.Contract {
    constructor() {
        super(...arguments);
        this.client = this.opts.client ?? a_di_1.default.resolve(EthWeb3Client_1.EthWeb3Client);
        this.explorer = this.opts.explorer ?? a_di_1.default.resolve(Etherscan_1.Etherscan);
        this.runner = a_di_1.default.resolve(ContractReader_1.ContractReader, this.client);
        this.provider = a_di_1.default.resolve(ContractProvider_1.ContractProvider, this.explorer);
    }
    static async create(mix, opts) {
        let explorer = a_di_1.default.resolve(Etherscan_1.Etherscan);
        let contract = Contract_1.Contract.create(mix, {
            Ctor: EthContract,
            explorer,
            ...(opts ?? {})
        });
        return contract;
    }
}
exports.EthContract = EthContract;
