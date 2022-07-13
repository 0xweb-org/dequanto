"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractReader = void 0;
const a_di_1 = __importDefault(require("a-di"));
const EthWeb3Client_1 = require("@dequanto/clients/EthWeb3Client");
const _abiParser_1 = require("../utils/$abiParser");
const AbiDeserializer_1 = require("./utils/AbiDeserializer");
const BlockDateResolver_1 = require("@dequanto/blocks/BlockDateResolver");
class ContractReader {
    constructor(client = a_di_1.default.resolve(EthWeb3Client_1.EthWeb3Client)) {
        this.client = client;
    }
    forBlock(blockNumber) {
        this.blockNumberTask = blockNumber == null
            ? null
            : Promise.resolve(blockNumber);
        return this;
    }
    forBlockAt(date) {
        if (date != null) {
            let resolver = new BlockDateResolver_1.BlockDateResolver(this.client);
            this.blockNumberTask = resolver.getBlockNumberFor(date);
        }
        else {
            this.blockNumberTask = null;
        }
        return this;
    }
    async getStorageAt(address, position) {
        let blockNumber = void 0;
        if (this.blockNumberTask != null) {
            blockNumber = await this.blockNumberTask;
        }
        return this.client.getStorageAt(address, position, blockNumber);
    }
    async readAsync(address, methodAbi, ...params) {
        let blockNumber = void 0;
        if (this.blockNumberTask != null) {
            blockNumber = await this.blockNumberTask;
        }
        let abi;
        if (typeof methodAbi === 'string') {
            abi = _abiParser_1.$abiParser.parseMethod(methodAbi);
        }
        else {
            abi = methodAbi;
        }
        let method = abi.name;
        let abiArr = [abi];
        try {
            let result = await this.client.readContract({
                address,
                abi: abiArr,
                method: method,
                arguments: params,
                blockNumber: blockNumber,
            });
            if (result == null) {
                throw new Error(`Function call returned undefined`);
            }
            return AbiDeserializer_1.AbiDeserializer.process(result, abi.outputs);
        }
        catch (error) {
            let args = params.map((x, i) => `[${i}] ${x}`).join('\n');
            throw new Error(`Contract: ${address} ${methodAbi} with \n${args}\nfailed with ${error.message}`);
        }
    }
    async getLogs() {
    }
    static async read(client, address, methodAbi) {
        let reader = new ContractReader(client);
        return reader.readAsync(address, methodAbi);
    }
}
exports.ContractReader = ContractReader;
