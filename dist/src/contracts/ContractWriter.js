"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractWriter = void 0;
const a_di_1 = __importDefault(require("a-di"));
const EthWeb3Client_1 = require("@dequanto/clients/EthWeb3Client");
const TxWriter_1 = require("@dequanto/txs/TxWriter");
const TxDataBuilder_1 = require("@dequanto/txs/TxDataBuilder");
const _abiParser_1 = require("../utils/$abiParser");
const _logger_1 = require("@dequanto/utils/$logger");
const _class_1 = require("@dequanto/utils/$class");
class ContractWriter {
    constructor(address, client = a_di_1.default.resolve(EthWeb3Client_1.EthWeb3Client)) {
        this.address = address;
        this.client = client;
    }
    $config(builderConfig, writerConfig) {
        return _class_1.$class.curry(this, {
            builderConfig: builderConfig ?? this.builderConfig,
            writerConfig: writerConfig ?? this.writerConfig,
        });
    }
    async writeAsync(eoa, interfaceAbi, params, configs) {
        let txBuilder = new TxDataBuilder_1.TxDataBuilder(this.client, eoa, {
            to: this.address
        });
        let abi = typeof interfaceAbi === 'string'
            ? _abiParser_1.$abiParser.parseMethod(interfaceAbi)
            : interfaceAbi;
        let builderConfig = {
            ...(this.builderConfig ?? {}),
            ...(configs?.builderConfig ?? {}),
        };
        txBuilder.setConfig(builderConfig);
        txBuilder.setValue(eoa.value);
        txBuilder.setInputDataWithABI(abi, ...params);
        await Promise.all([
            txBuilder.setGas({
                price: builderConfig.gasPrice,
                priceRatio: builderConfig.gasPriceRatio,
                gasLimit: builderConfig.gasLimit,
                gasLimitRatio: builderConfig.gasLimitRatio,
                gasEstimation: builderConfig.gasEstimation,
                from: builderConfig.from ?? eoa.address,
                type: builderConfig.type ?? null,
            }),
            txBuilder.setNonce({
                nonce: builderConfig.nonce,
                noncePending: builderConfig.noncePending,
            }),
        ]);
        console.log(txBuilder.data, eoa, this.address);
        let writer = TxWriter_1.TxWriter.write(this.client, txBuilder, eoa, configs?.writerConfig ?? this.writerConfig);
        writer.on('log', message => {
            _logger_1.$logger.log(`TxContract ${abi.name}; ${message}`);
        });
        return writer;
    }
}
exports.ContractWriter = ContractWriter;
