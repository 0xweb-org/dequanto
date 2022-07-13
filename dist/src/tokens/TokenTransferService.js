"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenTransferService = void 0;
const a_di_1 = __importDefault(require("a-di"));
const TxDataBuilder_1 = require("@dequanto/txs/TxDataBuilder");
const TxWriter_1 = require("@dequanto/txs/TxWriter");
const _bigint_1 = require("@dequanto/utils/$bigint");
const _is_1 = require("@dequanto/utils/$is");
const TokensService_1 = require("./TokensService");
const _address_1 = require("@dequanto/utils/$address");
const _promise_1 = require("@dequanto/utils/$promise");
const LoggerService_1 = require("@dequanto/loggers/LoggerService");
const _logger_1 = require("@dequanto/utils/$logger");
const _account_1 = require("@dequanto/utils/$account");
class TokenTransferService {
    constructor(client, logger = a_di_1.default.resolve(LoggerService_1.LoggerService)) {
        this.client = client;
        this.logger = logger;
        this.tokenService = a_di_1.default.resolve(TokensService_1.TokensService, this.client.platform);
    }
    $config(builderConfig) {
        this.builderConfig = builderConfig;
        return this;
    }
    $configWriter(writerConfig) {
        this.writerConfig = writerConfig;
        return this;
    }
    async getBalance(address, token) {
        token = await this.getToken(token);
        let isNative = this.tokenService.isNative(token.address);
        if (isNative) {
            return this.client.getBalance(address);
        }
        let erc20 = await TokensService_1.TokensService.erc20(token, this.client.platform);
        let balance = await erc20.balanceOf(address);
        return balance;
    }
    async getReceived(receipt) {
        let receiver = receipt.from;
        let ANYTOKEN = 'USDC';
        let erc20 = await TokensService_1.TokensService.erc20(ANYTOKEN, this.client.platform);
        let transfers = erc20.extractLogsTransfer(receipt);
        let transfer = transfers.find(x => _address_1.$address.eq(x.params.to, receiver));
        return transfer?.params.value ?? 0n;
    }
    /** Returns NULL for transaction, if no balance to transfer */
    async transferAll(from, to, token) {
        token = await this.getToken(token);
        let isNative = this.tokenService.isNative(token.address);
        if (isNative) {
            return this.transferNativeAll(from, to);
        }
        return this.transferErc20All(from, to, token);
    }
    async transferAllWithRemainder(from, to, token, remainder) {
        token = await this.getToken(token);
        let isNative = this.tokenService.isNative(token.address);
        if (isNative) {
            return this.transferNativeAll(from, to, { remainder });
        }
        return this.transferErc20All(from, to, token, { remainder });
    }
    async transfer(from, to, token, amount) {
        token = await this.getToken(token);
        amount = this.getAmount(amount, token);
        let isNative = this.tokenService.isNative(token.address);
        if (isNative) {
            return this.transferNative(from, to, amount);
        }
        return this.transferErc20(from, to, token, amount);
    }
    async getToken(token) {
        if (typeof token === 'string') {
            token = await this.tokenService.getKnownToken(token);
        }
        _is_1.$is.notNull(token, 'Token is undefined to transfer');
        return token;
    }
    isNativeToken(token) {
        return this.tokenService.isNative(typeof token === 'string' ? token : token.address);
    }
    async transferNativeAll(from, to, opts) {
        let buildTxRetries = 1;
        const buildTx = async () => {
            let GAS = 21000;
            let GAS_RATIO = 1.05;
            let [balance, gasPrice] = await Promise.all([
                this.client.getBalance(from.address),
                this.client.getGasPrice()
            ]);
            if (opts?.remainder != null) {
                let remainder = this.getAmount(opts.remainder, 18);
                balance -= remainder;
            }
            let $gasPrice = _bigint_1.$bigint.multWithFloat(gasPrice.price, GAS_RATIO);
            console.log('$gasPrice', _bigint_1.$bigint.toGweiFromWei($gasPrice));
            let gasConsumed = BigInt(GAS) * $gasPrice;
            let transferValue = balance - gasConsumed;
            if (transferValue <= 0) {
                if (--buildTxRetries > -1) {
                    _logger_1.$logger.log(`No balance to transfer retry in 5s`);
                    await _promise_1.$promise.wait(5000);
                    return buildTx();
                }
                // No balance to transfer
                _logger_1.$logger.log(`No balance to transfer in ${from.address}. ${opts?.remainder ? ("Remainder: " + opts?.remainder) : ""}`);
                return null;
            }
            let txBuilder = new TxDataBuilder_1.TxDataBuilder(this.client, from, {
                to: to,
                value: _bigint_1.$bigint.toHex(transferValue)
            });
            txBuilder.data.gasPrice = _bigint_1.$bigint.toHex($gasPrice);
            // txBuilder.data.maxFeePerGas = $bigint.toHex($gasPrice - 20n**9n);
            // txBuilder.data.maxPriorityFeePerGas = $bigint.toHex(20n**9n);
            txBuilder.data.gasLimit = GAS;
            txBuilder.data.type = 1;
            txBuilder.setConfig(this.builderConfig);
            await Promise.all([
                txBuilder.setNonce({ overriding: true }),
            ]);
            _logger_1.$logger.log(`TransferNative ALL. Balance ${balance}; GasConsumed ${gasConsumed}; TransferValue ${transferValue}; Nonce: ${txBuilder.data.nonce}`);
            return txBuilder;
        };
        let txBuilder = await buildTx();
        return TxWriter_1.TxWriter.write(this.client, txBuilder, from, {
            ...(this.writerConfig ?? {}),
            retries: 3,
            async onErrorRebuild(tx, error, errCount) {
                // In case we got `balance` value, but that one was outdated, then all our calculations where wrong.
                // Retry the calculation and transfer once again.
                if (/insufficient funds/.test(error.message)) {
                    const ms = 6000 * errCount;
                    _logger_1.$logger.log(`TokenTransfer Failed: insufficient funds. Waiting ${ms}ms to retry`);
                    await _promise_1.$promise.wait(ms);
                    return buildTx();
                }
                return null;
            }
        });
    }
    async transferNative(from, to, amount) {
        let txBuilder = new TxDataBuilder_1.TxDataBuilder(this.client, _account_1.$account.getSender(from), {
            to: to,
            value: _bigint_1.$bigint.toHex(amount)
        });
        let GAS = 21000;
        await Promise.all([
            txBuilder.setGas({ priceRatio: this.gasPriorityFee, gasLimit: GAS }),
            txBuilder.setNonce(),
        ]);
        txBuilder.setConfig(this.builderConfig);
        return TxWriter_1.TxWriter.write(this.client, txBuilder, from, this.writerConfig);
    }
    async transferErc20All(from, to, token, opts) {
        let erc20 = await TokensService_1.TokensService.erc20(token, this.client.platform);
        let balance = await erc20.balanceOf(from.address);
        if (opts?.remainder != null) {
            let remainder = this.getAmount(opts.remainder, 18);
            balance -= remainder;
        }
        if (balance <= 0n) {
            if (opts?.retryCount == null || opts?.retryCount !== 0) {
                // re-read
                this.logger.warn(`TransferErc20All has no balance to transfer: ${token.address}. Balance re-fetch scheduled.`);
                await _promise_1.$promise.wait(4000);
                return this.transferErc20All(from, to, token, {
                    ...(opts ?? {}),
                    retryCount: 0
                });
            }
            if (this.builderConfig.gasFunding == null) {
                return null;
            }
        }
        return erc20
            .$config(this.builderConfig, this.writerConfig)
            .transfer(from, to, balance);
    }
    async transferErc20(from, to, token, amount) {
        let erc20 = await TokensService_1.TokensService.erc20(token, this.client.platform);
        return erc20
            .$config(this.builderConfig, this.writerConfig)
            .transfer(from, to, amount);
    }
    getAmount(amount, mix) {
        if (typeof amount === 'number') {
            amount = _bigint_1.$bigint.toWei(amount, typeof mix === 'number' ? mix : mix.decimals);
        }
        return amount;
    }
}
exports.TokenTransferService = TokenTransferService;
