"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractReaderUtils = exports.ContractReader = void 0;
const a_di_1 = __importDefault(require("a-di"));
const alot_1 = __importDefault(require("alot"));
const EthWeb3Client_1 = require("@dequanto/clients/EthWeb3Client");
const AbiDeserializer_1 = require("./utils/AbiDeserializer");
const BlockDateResolver_1 = require("@dequanto/blocks/BlockDateResolver");
const atma_utils_1 = require("atma-utils");
const _is_1 = require("@dequanto/utils/$is");
const _logger_1 = require("@dequanto/utils/$logger");
const _abiParser_1 = require("../utils/$abiParser");
class ContractReader {
    constructor(client = a_di_1.default.resolve(EthWeb3Client_1.EthWeb3Client)) {
        this.client = client;
        this.options = {};
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
    withAddress(address) {
        this.options.from = address;
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
                options: this.options
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
    async executeBatch(values) {
        let requests = await (0, alot_1.default)(values)
            .mapAsync(async (x) => await x)
            .toArrayAsync();
        // all inputs should be deferred requests
        let invalid = requests.find(x => _is_1.$is.Address(x.request?.address) === false);
        if (invalid != null) {
            _logger_1.$logger.error('Invalid object', invalid);
            throw new Error(`Invalid Deferred Request at position ${requests.indexOf(invalid)}`);
        }
        let inputs = await (0, alot_1.default)(requests).mapAsync(async (req) => {
            return {
                address: req.request.address,
                abi: req.request.abi,
                params: req.request.params,
                blockNumber: req.request.blockNumber,
                options: req.request.options,
            };
        }).toArrayAsync();
        let results = await ContractReaderUtils.readAsyncBatch(this.client, inputs);
        return results;
    }
    async getLogs() {
    }
    static async read(client, address, methodAbi) {
        let reader = new ContractReader(client);
        return reader.readAsync(address, methodAbi);
    }
}
exports.ContractReader = ContractReader;
var ContractReaderUtils;
(function (ContractReaderUtils) {
    class DefferedRequest {
        constructor(request) {
            this.request = request;
            this.promise = Object.assign(new atma_utils_1.class_Dfr(), {
                request: this
            });
        }
    }
    ContractReaderUtils.DefferedRequest = DefferedRequest;
    async function readAsyncBatch(client, requests) {
        let reqs = await (0, alot_1.default)(requests).map(async (request) => {
            let abi = request.abi;
            if (typeof abi === 'string') {
                abi = _abiParser_1.$abiParser.parseMethod(abi);
            }
            let blockNumber = request.blockNumber;
            if (blockNumber instanceof Date) {
                let resolver = a_di_1.default.resolve(BlockDateResolver_1.BlockDateResolver, client);
                blockNumber = await resolver.getBlockNumberFor(blockNumber);
            }
            return {
                address: request.address,
                abi: [abi],
                method: abi.name,
                arguments: request.params,
                blockNumber: blockNumber,
                options: request.options
            };
        }).toArrayAsync();
        let results = await client.readContractBatch(reqs);
        return results.map((result, i) => {
            if (result == null || result instanceof Error) {
                return result;
            }
            let outputs = reqs[i].abi[0].outputs;
            return AbiDeserializer_1.AbiDeserializer.process(result, outputs);
        });
    }
    ContractReaderUtils.readAsyncBatch = readAsyncBatch;
})(ContractReaderUtils = exports.ContractReaderUtils || (exports.ContractReaderUtils = {}));
