"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = void 0;
const a_di_1 = __importDefault(require("a-di"));
const alot_1 = __importDefault(require("alot"));
const ContractProvider_1 = require("./ContractProvider");
const ethers_1 = require("ethers");
const TxDataBuilder_1 = require("@dequanto/txs/TxDataBuilder");
const TxWriter_1 = require("@dequanto/txs/TxWriter");
const _contract_1 = require("@dequanto/utils/$contract");
class Contract {
    constructor(data, opts) {
        this.name = null;
        this.address = null;
        this.proxyImpl = null;
        this.refAbi = null;
        this.abi = null;
        this.name = data.name;
        this.address = data.address;
        this.proxyImpl = data.proxy;
        this.refAbi = data.refAbi;
        this.abi = data.abi;
        this.opts = opts;
    }
    readAsync(methodAbi, ...params) {
        return this.runner.readAsync(this.address, methodAbi, ...params);
    }
    async writeAsyncWithAccount(account, interfaceAbi, ...params) {
        let txBuilder = new TxDataBuilder_1.TxDataBuilder(this.client, account, {
            to: this.address
        });
        txBuilder.setInputDataWithABI(interfaceAbi, ...params);
        await Promise.all([
            txBuilder.setGas(),
            txBuilder.setNonce(),
        ]);
        return TxWriter_1.TxWriter.write(this.client, txBuilder, account);
    }
    async getTransactionsFor(address, opts) {
        let txs = await this.explorer.getTransactions(address);
        txs = txs.filter(x => x.to.toUpperCase() === this.address.toUpperCase());
        if (opts?.decode) {
            txs = await this.parseTrasactions(txs);
        }
        return txs;
    }
    async parseTrasaction(tx) {
        const abiAddress = this.refAbi
            ?? this.proxyImpl
            ?? this.address
            ?? tx.to;
        const abi = this.abi ?? await this.provider.getAbi(abiAddress);
        const inter = new ethers_1.utils.Interface(abi);
        const decodedInput = inter.parseTransaction({
            data: tx.input,
            value: tx.value,
        });
        return {
            ...tx,
            details: {
                name: decodedInput.name,
                args: _contract_1.$contract.normalizeArgs(Array.from(decodedInput.args))
            }
        };
    }
    async parseTrasactions(arr) {
        return await (0, alot_1.default)(arr).mapAsync(async (tx) => {
            return await this.parseTrasaction(tx);
        }).toArrayAsync();
    }
    static async create(mix, opts) {
        let provider = a_di_1.default.resolve(ContractProvider_1.ContractProvider, opts.explorer);
        let info = await provider.getInfo(mix);
        if (info == null) {
            let byName = mix.startsWith('0x') === false;
            if (byName) {
                throw new Error(`Contract by name not found ${mix}`);
            }
            info = { address: mix };
        }
        return new opts.Ctor({
            refAbi: opts.refAbi,
            ...info,
        }, opts);
    }
}
exports.Contract = Contract;
