"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GasWatcherTx = void 0;
const _bigint_1 = require("@dequanto/utils/$bigint");
const _logger_1 = require("@dequanto/utils/$logger");
const TxWriter_1 = require("../TxWriter");
class GasWatcherTx {
    constructor(condition, txWriter, logger) {
        this.condition = condition;
        this.txWriter = txWriter;
        this.logger = logger;
        txWriter.on('log', message => this.log(message));
    }
    static async fromJSON(conditionJson, writerJson, logger) {
        let writer = await TxWriter_1.TxWriter.fromJSON(writerJson);
        return new GasWatcherTx({
            price: BigInt(conditionJson.price)
        }, writer, logger);
    }
    toJSON() {
        return {
            condition: this.condition,
            writer: this.txWriter.toJSON(),
        };
    }
    async tick(gasPrice) {
        if (gasPrice > this.condition.price) {
            // condition not matched
            return;
        }
        if (this.txWriter.receipt != null) {
            this.log(`Tx was already mined: ${this.txWriter.receipt.transactionHash}`);
            return;
        }
        let tx = this.txWriter.tx;
        if (tx == null) {
            this.send(gasPrice);
            return;
        }
        let timeEllipsedS = (Date.now() - tx.timestamp) / 1000 | 0;
        if (tx.hash == null) {
            if (timeEllipsedS > 30) {
                // tx was not accepted for 30s
                this.log(`Tx was not accepted for 30s. Resend`);
                this.send(gasPrice);
            }
            // otherwise let wait for a hash
            return;
        }
        let hash = tx.hash;
        let client = this.txWriter.client;
        let txData = await client.getTransaction(hash);
        if (this.txWriter.receipt) {
            // was mined inbetween
            return;
        }
        if (txData == null) {
            if (timeEllipsedS > 45) {
                this.log(`Tx not in a pending block: ${hash}. Resend`);
                // tx not in a pending block
                this.send(gasPrice);
            }
            // otherwise let wait to be included into the pending block
            return;
        }
        if (timeEllipsedS > 60 * 5) {
            this.log(`Tx 5mins not mined: ${hash}. Resend`);
            // 5mins not mined;
            this.send(gasPrice);
        }
    }
    async send(gasPrice) {
        let writer = this.txWriter;
        let builder = writer.builder;
        let data = builder.data;
        if (data.nonce == null) {
            throw new Error(`Nonce should be already set on initial tx creating`);
            await builder.setNonce();
        }
        if (writer.tx && data.gasPrice) {
            // re-submitting
            let currentGas = BigInt(data.gasPrice.toString());
            if (currentGas >= gasPrice) {
                // we can't resubmit with less gas
                gasPrice = currentGas + _bigint_1.$bigint.toWeiFromGwei(.1);
            }
        }
        await builder.setGas({
            price: gasPrice,
            priceRatio: 1,
            gasLimit: data.gasLimit,
        });
        writer.tx = null;
        writer.on('transactionHash', hash => {
            let pendingCount = 0;
            let nullCount = 0;
            let interval = setInterval(async () => {
                let tx = await writer.client.getTransaction(hash);
                _logger_1.$logger.log('Check', hash, 'Block', tx?.blockNumber);
                if (tx == null) {
                    if (++nullCount > 8) {
                        clearInterval(interval);
                    }
                    return;
                }
                if (tx.blockNumber) {
                    // was mined;
                    _logger_1.$logger.log(`${hash} Mined`);
                    clearInterval(interval);
                    return;
                }
                if (++pendingCount > 15) {
                    clearInterval(interval);
                    return;
                }
            }, 5000);
        });
        writer.send({
            timeout: false
        });
    }
    log(message) {
        this.logger.logTx(this.txWriter.id, message);
    }
}
exports.GasWatcherTx = GasWatcherTx;
