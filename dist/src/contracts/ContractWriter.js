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
const _account_1 = require("@dequanto/utils/$account");
const _require_1 = require("@dequanto/utils/$require");
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
    /**
    * We split Tx sending in two awaitable steps
    * 1. This method prepairs(gas, nonce, etc) - and sends the Tx
    * 2. With returned writer you can subscribe to events and/or wait for Tx to be mined
    * @param account
    * @param interfaceAbi
    * @param params
    * @param configs
    * @returns {TxWriter}
     */
    async writeAsync(account, interfaceAbi, params, configs) {
        _require_1.$require.notNull(account, 'Account parameter is undefined.');
        let value = typeof account !== 'string'
            ? account.value
            : null;
        let isSafe = _account_1.$account.isSafe(account);
        let sender = _account_1.$account.getSender(account);
        // if (sender.key == null) {
        //     let addressOrName = sender.address ?? sender.name;
        //     let service = di.resolve(ChainAccountsService);
        //     let fromStorage = await service.get(addressOrName, this.client.platform);
        //     if (fromStorage) {
        //         account = fromStorage;
        //     }
        // }
        let txBuilder = new TxDataBuilder_1.TxDataBuilder(this.client, sender, {
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
        txBuilder.setValue(value);
        txBuilder.setInputDataWithABI(abi, ...params);
        if (isSafe !== true) {
            await Promise.all([
                txBuilder.setGas({
                    price: builderConfig.gasPrice,
                    priceRatio: builderConfig.gasPriceRatio,
                    gasLimit: builderConfig.gasLimit,
                    gasLimitRatio: builderConfig.gasLimitRatio,
                    gasEstimation: builderConfig.gasEstimation,
                    from: builderConfig.from ?? sender.address,
                    type: builderConfig.type ?? null,
                }),
                txBuilder.setNonce({
                    nonce: builderConfig.nonce,
                    noncePending: builderConfig.noncePending,
                }),
            ]);
        }
        let writer = TxWriter_1.TxWriter.write(this.client, txBuilder, account, configs?.writerConfig ?? this.writerConfig);
        writer.on('log', message => {
            _logger_1.$logger.log(`TxContract ${abi.name}; ${message}`);
        });
        return writer;
    }
}
exports.ContractWriter = ContractWriter;
