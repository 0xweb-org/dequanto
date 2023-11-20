import { $bigint } from '@dequanto/utils/$bigint';
import { $logger } from '@dequanto/utils/$logger';
import { TTxWriterJson, TxWriter } from '../TxWriter';
import { GasWatcherLogger } from './GasWatcherLogger';

export interface IGasWatcherCondition {
    price: bigint
}

export class GasWatcherTx {

    static async fromJSON (conditionJson: IGasWatcherCondition, writerJson: TTxWriterJson, logger: GasWatcherLogger) {
        let writer = await TxWriter.fromJSON(writerJson);
        return new GasWatcherTx({
            price: BigInt(conditionJson.price)
        }, writer, logger);
    }

    protected constructor (
        public condition: IGasWatcherCondition,
        public txWriter: TxWriter,
        public logger: GasWatcherLogger,
    ) {
        txWriter.on('log', message => this.log(message));
    }

    toJSON () {
        return {
            condition: this.condition,
            writer: this.txWriter.toJSON(),
        };
    }

    async tick (gasPrice: bigint) {
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

    private async send (gasPrice: bigint) {
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
                gasPrice = currentGas + $bigint.toWeiFromGwei(.1);
            }
        }

        await builder.setGas({
            price: gasPrice,
            priceRatio: 1,
            gasLimit: data.gas as number,
        });

        writer.tx = null;
        writer.on('transactionHash', hash => {
            let pendingCount = 0;
            let nullCount = 0;
            let interval = setInterval(async () => {
                let tx = await writer.client.getTransaction(hash);
                $logger.log('Check', hash, 'Block', tx?.blockNumber);
                if (tx == null) {
                    if (++nullCount > 8) {
                        clearInterval(interval);
                    }
                    return;
                }
                if (tx.blockNumber) {
                    // was mined;
                    $logger.log(`${hash} Mined`);
                    clearInterval(interval);
                    return;
                }
                if (++pendingCount > 15) {
                    clearInterval(interval);
                    return;
                }
            }, 5000)
        })
        writer.send({
            timeout: false
        })

    }
    private log(message: string) {
        this.logger.logTx(this.txWriter.id, message);
    }

}
