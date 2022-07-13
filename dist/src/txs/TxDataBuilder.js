"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxDataBuilder = void 0;
const InputDataUtils_1 = require("@dequanto/contracts/utils/InputDataUtils");
const _account_1 = require("@dequanto/utils/$account");
const _bigint_1 = require("@dequanto/utils/$bigint");
class TxDataBuilder {
    constructor(client, account, data, config = null) {
        this.client = client;
        this.account = account;
        this.data = data;
        this.config = config;
        this.data.value = this.data.value ?? 0;
    }
    setInputDataWithTypes(types, paramaters) {
        this.data.data = InputDataUtils_1.InputDataUtils.encodeWithTypes(this.client, types, paramaters);
        return this;
    }
    setInputDataWithABI(IFunctionABI, ...params) {
        try {
            this.data.data = InputDataUtils_1.InputDataUtils.encodeWithABI(IFunctionABI, ...params);
        }
        catch (error) {
            error.message = `${JSON.stringify(IFunctionABI)}\n${error.message}`;
            throw error;
        }
        return this;
    }
    setValue(value) {
        if (value == null) {
            return this;
        }
        if (typeof value === 'number') {
            value = _bigint_1.$bigint.toWei(value);
        }
        if (typeof value === 'bigint') {
            this.data.value = `0x${value.toString(16)}`;
            return this;
        }
        this.data.value = value;
        return this;
    }
    setConfig(config) {
        this.config = config;
        return this;
    }
    async setNonce(opts) {
        let nonce;
        if (opts?.nonce != null) {
            nonce = opts.nonce;
        }
        else if (opts?.overriding) {
            nonce = await this.client.getTransactionCount(this.account.address);
            // override first pending TX:
        }
        else if (opts?.noncePending != null) {
            let pendingIndex = opts.noncePending - 1;
            let submited = await this.client.getTransactionCount(this.account.address);
            let next = pendingIndex;
            if (next > 0) {
                let total = await this.client.getTransactionCount(this.account.address, 'pending');
                let pendingCount = total - submited;
                if (pendingCount > 0 && next > pendingCount - 1) {
                    next = pendingCount - 1;
                }
            }
            nonce = submited + next;
        }
        else {
            nonce = await this.client.getTransactionCount(this.account.address, 'pending');
        }
        this.data.nonce = nonce;
    }
    async setGas({ price, priceRatio, gasLimitRatio, gasLimit, gasEstimation, from, type, } = {}) {
        let [gasPrice, gasUsage] = await Promise.all([
            price != null ?
                { price, base: price, priority: 10n ** 9n }
                : this.client.getGasPrice(),
            gasEstimation
                ? this.client.getGasEstimation(from ?? this.account.address, this.data)
                : (gasLimit ?? this.client.defaultGasLimit ?? 2000000)
        ]);
        let hasPriceRatio = priceRatio != null;
        let hasPriceFixed = price != null;
        let $priceRatio = 1;
        if (hasPriceRatio) {
            $priceRatio = priceRatio;
        }
        else if (hasPriceFixed === false) {
            $priceRatio = 1.4;
        }
        type ?? (type = this.client.defaultTxType);
        if (type === 1) {
            let $baseFee = _bigint_1.$bigint.multWithFloat(gasPrice.price, $priceRatio);
            this.data.gasPrice = _bigint_1.$bigint.toHex($baseFee);
        }
        else {
            let $baseFee = _bigint_1.$bigint.multWithFloat(gasPrice.base ?? gasPrice.price, $priceRatio);
            let $priorityFee = gasPrice.priority ?? 10n ** 9n;
            this.data.maxFeePerGas = _bigint_1.$bigint.toHex($baseFee + $priorityFee);
            this.data.maxPriorityFeePerGas = _bigint_1.$bigint.toHex($priorityFee);
            this.data.type = 2;
        }
        let hasLimitRatio = gasLimitRatio != null;
        let hasLimitFixed = gasLimit != null;
        let $gasLimitRatio = 1;
        if (hasLimitRatio) {
            $gasLimitRatio = gasLimitRatio;
        }
        else if (hasLimitFixed === false) {
            $gasLimitRatio = 1.5;
        }
        this.data.gasLimit = gasLimit ?? Math.floor(Number(gasUsage) * $gasLimitRatio);
        return this;
    }
    increaseGas(ratio) {
        let { gasPrice, maxFeePerGas } = this.data;
        if (gasPrice != null) {
            let price = BigInt(gasPrice);
            let priceNew = _bigint_1.$bigint.multWithFloat(price, ratio);
            this.data.gasPrice = _bigint_1.$bigint.toHex(priceNew);
            return;
        }
        if (maxFeePerGas != null) {
            let price = BigInt(maxFeePerGas);
            let priceNew = _bigint_1.$bigint.multWithFloat(price, ratio);
            this.data.maxFeePerGas = _bigint_1.$bigint.toHex(priceNew);
            return;
        }
        throw new Error(`Not possible to increase the gas price, the price not set yet`);
    }
    getTxData(client) {
        return {
            ...this.data,
            from: this.account?.address ?? void 0,
            chainId: client.chainId,
        };
    }
    /** Returns base64 string of the Tx Data */
    async signToString(privateKey) {
        if (privateKey.startsWith('0x')) {
            privateKey = privateKey.substring(2);
        }
        return this.client.sign(this.data, privateKey);
    }
    toJSON() {
        return {
            config: this.config,
            data: this.data,
        };
    }
    static fromJSON(client, account, json) {
        let sender = _account_1.$account.getSender(account);
        return new TxDataBuilder(client, sender, json.data, json.config);
    }
    static normalize(data) {
        for (let key in data) {
            let v = data[key];
            if (typeof v === 'string' && /^\d+$/.test(v)) {
                data[key] = BigInt(v);
            }
        }
        return data;
    }
    static getGasPrice(builder) {
        let { gasPrice, maxFeePerGas, maxPriorityFeePerGas } = builder.data;
        if (gasPrice != null) {
            return BigInt(gasPrice);
        }
        if (maxFeePerGas != null) {
            return BigInt(maxFeePerGas) + BigInt(maxPriorityFeePerGas ?? 0);
        }
        return null;
    }
}
exports.TxDataBuilder = TxDataBuilder;
TxDataBuilder.nonce = -1;
