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
const ethers_1 = require("ethers");
const _contract_1 = require("@dequanto/utils/$contract");
const _class_1 = require("@dequanto/utils/$class");
const _abiParser_1 = require("@dequanto/utils/$abiParser");
const ContractReader_1 = require("./ContractReader");
const ContractWriter_1 = require("./ContractWriter");
const ContractStream_1 = require("./ContractStream");
const TxTopicInMemoryProvider_1 = require("@dequanto/txs/receipt/TxTopicInMemoryProvider");
const BlocksTxIndexer_1 = require("@dequanto/indexer/BlocksTxIndexer");
const SubjectStream_1 = require("@dequanto/class/SubjectStream");
const _logger_1 = require("@dequanto/utils/$logger");
const _address_1 = require("@dequanto/utils/$address");
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
    async $executeBatch(values) {
        let reader = await this.getContractReader();
        return reader.executeBatch(values);
    }
    $config(builderConfig, writerConfig) {
        let $contract = _class_1.$class.curry(this, {
            builderConfig: builderConfig,
            writerConfig: writerConfig,
        });
        return $contract;
    }
    forBlock(mix) {
        if (mix == null) {
            return this;
        }
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
    $read(abi, ...params) {
        if (this.builderConfig?.send === 'manual') {
            let req = new ContractReader_1.ContractReaderUtils.DefferedRequest({
                address: this.address,
                abi,
                params,
                blockNumber: this.blockNumber ?? this.blockDate,
                options: {
                    from: this.builderConfig?.from
                }
            });
            return req;
        }
        let reader = this.getContractReader();
        return reader.readAsync(this.address, abi, ...params);
    }
    $onLog(event, cb) {
        let stream = this.getContractStream();
        let events = stream.on(event);
        if (cb) {
            events.onData(cb);
        }
        return events;
    }
    $onTransaction(options) {
        options ?? (options = {});
        let stream = new SubjectStream_1.SubjectStream();
        BlockWalker.onBlock(this.client, options, async (client, block, { txs }) => {
            txs = txs.filter(x => _address_1.$address.eq(x.to, this.address));
            if (txs.length === 0) {
                return;
            }
            txs.forEach(tx => {
                try {
                    let calldata = this.parseInputData(tx.input);
                    let method = options.filter?.method;
                    if (method != null && method !== '*') {
                        if (calldata.name !== method) {
                            return;
                        }
                    }
                    let args = options.filter?.arguments;
                    if (args != null) {
                        for (let i = 0; i < args.length; i++) {
                            let val = args[i];
                            if (val != null && val != calldata.args[i]) {
                                return;
                            }
                        }
                    }
                    stream.next({
                        block,
                        tx,
                        calldata: { method: calldata.name, arguments: calldata.args }
                    });
                }
                catch (error) {
                    _logger_1.$logger.log(`Unexpected exception onTx parser: ${error.message}`);
                    stream.error(error);
                }
            });
        });
        return stream;
    }
    async $write(abi, account, ...params) {
        let writer = await this.getContractWriter();
        return writer.writeAsync(account, abi, params, {
            builderConfig: this.builderConfig,
            writerConfig: this.writerConfig,
        });
    }
    $getAbiItem(type, name, argsCount) {
        let arr = this.abi.filter(x => x.type === type && x.name === name);
        if (arr.length === 0) {
            throw new Error(`AbiItem ${name} not found`);
        }
        if (arr.length === 1) {
            return arr[0];
        }
        if (argsCount == null) {
            throw new Error(`Found multiple AbiItems for ${name}. Args count not specified to pick one`);
        }
        return arr.find(x => (x.inputs?.length ?? 0) === argsCount);
    }
    $getAbiItemOverload(abis, args) {
        let $abis = abis
            .map(methodAbi => _abiParser_1.$abiParser.parseMethod(methodAbi))
            .filter(x => (x.inputs?.length ?? 0) === args.length);
        if ($abis.length === 0) {
            throw new Error(`ABI not found in overloads \n${abis.join('\n')}\n by arguments count. Got ${args.length} arguments`);
        }
        if ($abis.length === 1) {
            return $abis[0];
        }
        throw new Error(`Not implemented exception. Got multiple overloads for the argument count ${args.length}. We should pick the ABI by parameters type.`);
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
        return this.getContractReader().getLogs(filters);
    }
    async $getPastLogsFilters(abi, options) {
        return this.getContractReader().getLogsFilter(abi, {
            ...(options ?? {}),
            address: this.address
        });
    }
    getContractReader() {
        let reader = this.getContractReaderInner();
        if (this.blockDate != null) {
            reader.forBlockAt(this.blockDate);
        }
        if (this.blockNumber != null) {
            reader.forBlockNumber(this.blockNumber);
        }
        let from = this.builderConfig?.from;
        if (from != null) {
            reader.withAddress(from);
        }
        return reader;
    }
    getContractReaderInner() {
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
var BlockWalker;
(function (BlockWalker) {
    const indexers = {};
    function onBlock(client, options, cb) {
        let key = `${client.platform}_${options?.name ?? ''}_${options?.persistance ?? false}`;
        let current = indexers[key];
        if (current) {
            current.onBlock(cb);
            return current;
        }
        let indexer = new BlocksTxIndexer_1.BlocksTxIndexer(client.platform, {
            name: options.name,
            persistance: options.persistance,
            loadTransactions: true,
            client: client,
        });
        indexers[key] = indexer;
        indexer.onBlock(cb);
        indexer.start();
        return indexer;
    }
    BlockWalker.onBlock = onBlock;
})(BlockWalker || (BlockWalker = {}));
