"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BscContract = void 0;
const a_di_1 = __importDefault(require("a-di"));
const BscWeb3Client_1 = require("@dequanto/clients/BscWeb3Client");
const ContractReader_1 = require("./ContractReader");
const Bscscan_1 = require("@dequanto/BlockchainExplorer/Bscscan");
const Contract_1 = require("./Contract");
const ContractProvider_1 = require("./ContractProvider");
class BscContract extends Contract_1.Contract {
    constructor() {
        super(...arguments);
        this.client = a_di_1.default.resolve(BscWeb3Client_1.BscWeb3Client);
        this.explorer = a_di_1.default.resolve(Bscscan_1.Bscscan);
        this.runner = a_di_1.default.resolve(ContractReader_1.ContractReader, this.client);
        this.provider = a_di_1.default.resolve(ContractProvider_1.ContractProvider, this.explorer);
    }
    static async create(mix, opts) {
        let explorer = a_di_1.default.resolve(Bscscan_1.Bscscan);
        return Contract_1.Contract.create(mix, {
            Ctor: BscContract,
            explorer,
            ...(opts ?? {})
        });
    }
}
exports.BscContract = BscContract;
