"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxWriter = void 0;
const a_di_1 = __importDefault(require("a-di"));
const atma_utils_1 = require("atma-utils");
const TxDataBuilder_1 = require("./TxDataBuilder");
const TxLogger_1 = require("./TxLogger");
require("../env/BigIntSerializer");
const _bigint_1 = require("@dequanto/utils/$bigint");
const ChainAccountsService_1 = require("@dequanto/ChainAccountsService");
const Web3ClientFactory_1 = require("@dequanto/clients/Web3ClientFactory");
const _promise_1 = require("@dequanto/utils/$promise");
const ClientErrorUtil_1 = require("@dequanto/clients/utils/ClientErrorUtil");
const _logger_1 = require("@dequanto/utils/$logger");
const TxLogParser_1 = require("./receipt/TxLogParser");
class TxWriter extends atma_utils_1.class_EventEmitter {
    constructor(client, builder, account) {
        super();
        this.client = client;
        this.builder = builder;
        this.account = account;
        this.onSent = new atma_utils_1.class_Dfr();
        this.onCompleted = new atma_utils_1.class_Dfr();
        this.id = Math.round(Math.random() * 10 ** 10) + '';
        this.tx = null;
        this.txs = [];
        this.logger = new TxLogger_1.TxLogger(this.id, this.account.name ?? this.account.key, this.builder);
        this.confirmationAwaiters = [];
    }
    onConfirmed(waitForCount) {
        let promise = new atma_utils_1.class_Dfr();
        if (this.tx.confirmations >= waitForCount) {
            promise.resolve(this.tx.hash);
        }
        else {
            this.confirmationAwaiters.push({
                count: waitForCount,
                promise
            });
        }
        return promise;
    }
    send(options) {
        if (this.tx == null) {
            this.logger.logStart();
            this.onCompleted.defer();
            this.onSent.defer();
            // was not sent
            this.options = options;
            this.sendTxInner();
        }
        return this;
    }
    write(options) {
        if (this.builder?.config?.send !== 'manual') {
            this.send(options);
        }
    }
    sendTxInner() {
        let time = Date.now();
        let signedTxBuffer = this.builder.signToString(this.account.key);
        let tx = {
            timestamp: Date.now(),
            confirmations: 0,
            hash: null,
            receipt: null,
            timeout: null,
        };
        tx.timeout = this.startTimer(tx);
        this.tx = tx;
        this.txs.push(tx);
        let promiEvent = this
            .client
            .sendSignedTransaction(signedTxBuffer)
            .once('transactionHash', hash => {
            if (tx.hash && tx.timeout) {
                // network has reaccepted the tx, restart previous timeout
                this.clearTimer(tx);
                tx.timeout = this.startTimer(tx);
            }
            tx.hash = hash;
            this.onSent.resolve(hash);
            this.emit('transactionHash', hash);
            this.emit('log', `Tx hash received: ${hash}`);
        })
            .once('receipt', receipt => {
            tx.receipt = receipt;
            tx.hash = receipt.transactionHash ?? tx.hash;
            this.receipt = receipt;
            this.clearTimer(tx);
            this.logger.logReceipt(receipt, Date.now() - time);
            this.onSent.resolve();
            this.emit('receipt', receipt);
            this.emit('log', `Tx receipt received for ${receipt.transactionHash}. Status: ${receipt.status}`);
        })
            // .on('confirmation', (confNumber, receipt) => {
            //     tx.hash = receipt.transactionHash ?? tx.hash;
            //     this.onSent.resolve();
            //     this.emit('confirmation', confNumber, receipt);
            //     this.emit('log', `Tx confirmation received for ${tx.hash}. Confirmations: ${confNumber}`);
            //     let arr = this.confirmationAwaiters;
            //     for (let i = 0; i < arr.length; i++) {
            //         if (confNumber >= arr[i].count) {
            //             arr[i].promise.resolve();
            //             arr.splice(i, 1);
            //             i--;
            //         }
            //     }
            // })
            .on('error', error => {
            this.clearTimer(tx);
            this.logger.logError(error);
            this.emit('error', error);
            this.emit('log', `Tx ERROR "${error.message}"`);
        })
            .then(async (receipt) => {
            this.clearTimer(tx);
            try {
                await this.extractLogs(receipt, tx);
            }
            catch (error) { }
            this.onCompleted.resolve(receipt);
        }, async (err) => {
            this.clearTimer(tx);
            tx.error = err;
            const options = this.options ?? {};
            if (err.receipt?.status === false) {
                // read reason
                // let client = await this.client.getWeb3();
                // let tx = await this.client.getTransaction(err.receipt.transactionHash);
                // console.log('RECEIPT', err.receipt, tx);
                // try {
                //     let result = await client.eth.call(tx, tx.blockNumber);
                //     console.log('RESULT', result);
                // } catch (err) {
                //     console.log('CALL ERROR', err);
                // }
                // throw new Error('asd');
            }
            if (ClientErrorUtil_1.ClientErrorUtil.IsInsufficientFunds(err)) {
                if (this.builder.config?.gasFunding) {
                    this.fundAccountAndResend().catch(err => {
                        this.onCompleted.reject(err);
                    });
                    return;
                }
                if (options.retries == null) {
                    options.retries = 1;
                    options.retryDelay = 5000;
                    // If insufficient funds this is can be due to the blockchain hasn't confirmed some incomming transactions
                }
            }
            if (ClientErrorUtil_1.ClientErrorUtil.IsNonceTooLow(err)) {
                if (options.retries == null) {
                    options.retries = 1;
                }
                let nonce = this.builder.data.nonce;
                // reset nonce
                await this.builder.setNonce();
                this.logger.log(`Nonce was ${Number(nonce)} too low. Reetries left: ${options.retries}. New nonce: ${Number(this.builder.data.nonce)}`);
            }
            let submitsCount = this.txs.length;
            let submitsMax = (options.retries ?? 0) + 1;
            if (submitsCount < submitsMax) {
                let ms = options.retryDelay ?? 3000;
                let waitMs = ms * submitsCount;
                _logger_1.$logger.log(`Tx retry in ${waitMs}ms`);
                await _promise_1.$promise.wait(waitMs);
                let onErrorRebuild = options.onErrorRebuild;
                if (onErrorRebuild != null) {
                    let txBuilder = await onErrorRebuild(this, err, submitsCount);
                    if (txBuilder != null) {
                        this.builder = txBuilder;
                    }
                }
                this.resubmit({ increaseGas: false });
                return;
            }
            this.onCompleted.reject(err);
        });
    }
    async extractLogs(receipt, tx) {
        let parser = a_di_1.default.resolve(TxLogParser_1.TxLogParser);
        let logs = await parser.parse(receipt);
        tx.knownLogs = logs.filter(x => x != null);
    }
    async fundAccountAndResend() {
        let account = this.builder.config.gasFunding;
        await this.builder.setGas({
            gasEstimation: true,
            from: this.account.address
        });
        let { gasPrice, gasLimit } = this.builder.data;
        let LITTLE_BIT_MORE = 1.3;
        let wei = _bigint_1.$bigint.multWithFloat(BigInt(gasPrice) * BigInt(gasLimit), LITTLE_BIT_MORE);
        let fundTx = await this.transferNative(account, this.account.address, wei);
        await fundTx.onCompleted;
        // account was funded resubmit the tx
        this.resubmit();
    }
    startTimer(tx) {
        let timeout = this.options?.timeout;
        let ms;
        if (typeof timeout === 'boolean') {
            if (timeout === false) {
                // Timeout was disabled
                return null;
            }
            ms = this.client.TIMEOUT;
        }
        else {
            ms = timeout ?? this.client.TIMEOUT;
        }
        return setTimeout(() => {
            if (this.txs.length > 3) {
                let hashes = this.txs.map(x => x.hash).join(', ');
                this.onCompleted.reject(new Error(`${this.txs.length} retries timeouted, with hashes: ${hashes}`));
                return;
            }
            tx.error = new Error(`Timeouted ${ms}ms`);
            this.resubmit();
        }, ms);
    }
    clearTimer(tx) {
        if (tx.timeout) {
            clearTimeout(tx.timeout);
            tx.timeout = null;
        }
    }
    resubmit({ increaseGas = true } = {}) {
        if (increaseGas !== false) {
            this.builder.increaseGas(1.1);
        }
        this.sendTxInner();
    }
    /** Use this transfer in case of additional account funding */
    async transferNative(from, to, amount) {
        let txBuilder = new TxDataBuilder_1.TxDataBuilder(this.client, from, {
            to: to,
            value: _bigint_1.$bigint.toHex(amount)
        });
        let GAS = 21000;
        await Promise.all([
            txBuilder.setGas({ gasLimit: GAS }),
            txBuilder.setNonce(),
        ]);
        return TxWriter.write(this.client, txBuilder, from);
    }
    toJSON() {
        return {
            id: this.id,
            platform: this.client.platform,
            options: this.options,
            account: this.account.address,
            txs: this.txs,
            builder: this.builder.toJSON(),
        };
    }
    static async fromJSON(json, client) {
        client = client ?? Web3ClientFactory_1.Web3ClientFactory.get(json.platform);
        let service = a_di_1.default.resolve(ChainAccountsService_1.ChainAccountsService);
        let account = await service.get(json.account, json.platform);
        let builder = TxDataBuilder_1.TxDataBuilder.fromJSON(client, account, {
            config: json.builder.config,
            data: json.builder.data,
        });
        let writer = TxWriter.create(client, builder, account, json.options);
        let txs = json.txs;
        writer.id = json.id;
        writer.tx = txs[txs.length - 1];
        writer.txs = txs;
        writer.receipt = txs.find(x => x.receipt)?.receipt;
        return writer;
    }
    static write(client, builder, account, options) {
        let writer = new TxWriter(client, builder, account);
        writer.write(options);
        return writer;
    }
    static create(client, builder, account, options) {
        return new TxWriter(client, builder, account);
    }
}
exports.TxWriter = TxWriter;
