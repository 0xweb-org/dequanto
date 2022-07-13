"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractBase = void 0;
const a_di_1 = __importDefault(require("a-di"));
const memd_1 = __importDefault(require("memd"));
const ContractReader_1 = require("./ContractReader");
const ContractWriter_1 = require("./ContractWriter");
const _contract_1 = require("@dequanto/utils/$contract");
const ethers_1 = require("ethers");
const ContractStream_1 = require("./ContractStream");
const TxTopicInMemoryProvider_1 = require("@dequanto/txs/receipt/TxTopicInMemoryProvider");
const _class_1 = require("@dequanto/utils/$class");
const _block_1 = require("@dequanto/utils/$block");
const alot_1 = __importDefault(require("alot"));
class ContractBase {
    constructor(address, client, explorer) {
        this.address = address;
        this.client = client;
        this.explorer = explorer;
    }
    async getStorageAt(position) {
        let reader = await this.getContractReader();
        return reader.getStorageAt(this.address, position);
    }
    parseInputData(buffer, value) {
        const inter = new ethers_1.utils.Interface(this.abi);
        const decodedInput = inter.parseTransaction({
            data: buffer,
            value: value,
        });
        return {
            name: decodedInput.name,
            args: _contract_1.$contract.normalizeArgs(Array.from(decodedInput.args))
        };
    }
    $config(builderConfig, writerConfig) {
        let $contract = _class_1.$class.curry(this, {
            builderConfig: builderConfig,
            writerConfig: writerConfig,
        });
        return $contract;
    }
    forBlock(mix) {
        if (typeof mix === 'undefined' || typeof mix === 'number') {
            return this.forBlockNumber(mix);
        }
        return this.forBlockAt(mix);
    }
    forBlockNumber(blockNumber) {
        let $contract = _class_1.$class.curry(this, {
            blockNumber: blockNumber,
            blockDate: null
        });
        return $contract;
    }
    forBlockAt(date) {
        let $contract = _class_1.$class.curry(this, {
            blockNumber: null,
            blockDate: date
        });
        return $contract;
    }
    async $read(abi, ...params) {
        let reader = await this.getContractReader();
        return reader.readAsync(this.address, abi, ...params);
    }
    $on(event, cb) {
        let stream = this.getContractStream();
        return stream.on(event, cb);
    }
    async $write(abi, account, ...params) {
        let writer = await this.getContractWriter();
        return writer.writeAsync(account, abi, params, {
            builderConfig: this.builderConfig,
            writerConfig: this.writerConfig,
        });
    }
    $getAbiItem(type, name) {
        return this.abi.find(x => x.type === type && x.name === name);
    }
    $extractLogs(tx, abiItem) {
        let logs = _contract_1.$contract.extractLogsForAbi(tx, abiItem);
        return logs;
    }
    $extractLog(log, abiItem) {
        let parsed = _contract_1.$contract.parseLogWithAbi(log, abiItem);
        return parsed;
    }
    async $getPastLogs(filters) {
        return this.client.getPastLogs(filters);
    }
    async $getPastLogsFilters(abi, options) {
        let filters = {};
        if (options.fromBlock) {
            filters.fromBlock = await _block_1.$block.ensureNumber(options.fromBlock, this.client);
        }
        if (options.toBlock) {
            filters.toBlock = await _block_1.$block.ensureNumber(options.toBlock, this.client);
        }
        let topics = [options.topic];
        (0, alot_1.default)(abi.inputs)
            .takeWhile(x => x.indexed)
            .forEach(arg => {
            let param = options.params?.[arg.name];
            if (param == null) {
                topics.push(undefined);
                return;
            }
            topics.push(param);
        })
            .toArray();
        filters.topics = topics;
        return filters;
    }
    async getContractReader() {
        let reader = await this.getContractReaderInner();
        if (this.blockDate != null) {
            reader.forBlockAt(this.blockDate);
        }
        if (this.blockNumber != null) {
            reader.forBlock(this.blockNumber);
        }
        return reader;
    }
    async getContractReaderInner() {
        let reader = a_di_1.default.resolve(ContractReader_1.ContractReader, this.client);
        return reader;
    }
    async getContractWriter() {
        if (this.abi != null) {
            let logParser = a_di_1.default.resolve(TxTopicInMemoryProvider_1.TxTopicInMemoryProvider);
            logParser.register(this.abi);
        }
        let writer = a_di_1.default.resolve(ContractWriter_1.ContractWriter, this.address, this.client);
        return writer;
    }
    getContractStream() {
        let stream = a_di_1.default.resolve(ContractStream_1.ContractStream, this.address, this.abi, this.client);
        return stream;
    }
}
__decorate([
    memd_1.default.deco.memoize({ perInstance: true })
], ContractBase.prototype, "getContractReaderInner", null);
__decorate([
    memd_1.default.deco.memoize({ perInstance: true })
], ContractBase.prototype, "getContractWriter", null);
__decorate([
    memd_1.default.deco.memoize({ perInstance: true })
], ContractBase.prototype, "getContractStream", null);
exports.ContractBase = ContractBase;
