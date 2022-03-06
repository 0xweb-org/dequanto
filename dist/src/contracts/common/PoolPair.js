"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolPair = void 0;
const a_di_1 = __importDefault(require("a-di"));
const Etherscan_1 = require("@dequanto/BlockchainExplorer/Etherscan");
const EthWeb3Client_1 = require("@dequanto/clients/EthWeb3Client");
const ContractBase_1 = require("@dequanto/contracts/ContractBase");
class PoolPair extends ContractBase_1.ContractBase {
    constructor(address, client = a_di_1.default.resolve(EthWeb3Client_1.EthWeb3Client), explorer = a_di_1.default.resolve(Etherscan_1.Etherscan)) {
        super(address, client, explorer);
        this.address = address;
        this.client = client;
        this.explorer = explorer;
        this.abi = null;
    }
    async getReserves() {
        return await this.$read('getReserves() returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)');
    }
}
exports.PoolPair = PoolPair;
