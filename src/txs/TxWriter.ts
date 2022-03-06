import di from 'a-di';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { class_Dfr, class_EventEmitter } from 'atma-utils';
import { TransactionReceipt } from 'web3-core';
import { TxDataBuilder } from './TxDataBuilder';
import { TxLogger } from './TxLogger';
import '../env/BigIntSerializer'
import { ChainAccount } from '@dequanto/ChainAccounts';
import { $bigint } from '@dequanto/utils/$bigint';
import { TAddress } from '@dequanto/models/TAddress';
import { ChainAccountsService } from '@dequanto/ChainAccountsService';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { TPlatform } from '@dequanto/models/TPlatform';
import { $promise } from '@dequanto/utils/$promise';
import { ClientErrorUtil } from '@dequanto/clients/utils/ClientErrorUtil';
import { $logger } from '@dequanto/utils/$logger';
import { ITxLogItem } from './receipt/ITxLogItem';
import { TxLogParser } from './receipt/TxLogParser';

interface ITxWriterEvents {
    transactionHash (hash: string)
    receipt (receipt: TransactionReceipt)
    confirmation (confNumber: number, receipt: TransactionReceipt)
    error (error: Error)
    sent ()
    log (message: string);
}
export interface ITxWriterOptions {
    timeout?: number | boolean
    retries?: number
    retryDelay?: number

    /**
     * The callback is executed on error, to give the opportunity to build a new Tx to resubmit the tx.
     * @param tx - current TxWriter object
     * @param error - current Error with receipt(if any)
     * @param errCount - num of errors already handled
     */
    onErrorRebuild? (tx: TxWriter, error: Error & { receipt?: TransactionReceipt }, errCount: number): Promise<TxDataBuilder>
}

export class TxWriter extends class_EventEmitter<ITxWriterEvents> {

    onSent = new class_Dfr<string>();
    onCompleted = new class_Dfr<TransactionReceipt>();
    receipt: TransactionReceipt

    onConfirmed (waitForCount: number): Promise<string> {
        let promise = new class_Dfr();
        if (this.tx.confirmations >= waitForCount) {
            promise.resolve(this.tx.hash);
        } else {
            this.confirmationAwaiters.push({
                count: waitForCount,
                promise
            });
        }
        return promise as any;
    }

    id = Math.round(Math.random() * 10**10) + '';
    tx: {
        timestamp: number
        confirmations: number,
        hash?: string
        timeout?: NodeJS.Timer
        receipt?: TransactionReceipt
        error?: Error
        knownLogs?: ITxLogItem[]
    } = null

    txs: TxWriter['tx'][] = []
    options: ITxWriterOptions;


    private logger = new TxLogger(
        this.id,
        this.account.name ?? this.account.key,
        this.builder
    );
    private confirmationAwaiters = [] as { count: number, promise }[]


    protected constructor (
        public client: Web3Client,
        public builder: TxDataBuilder,
        public account: { name?: string, key: string, address: string }
    ) {
        super();
    }

    public send (options?: ITxWriterOptions): this {
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

    protected write (options?: ITxWriterOptions) {
        if (this.builder?.config?.send !== 'manual') {
            this.send(options);
        }
    }

    private sendTxInner () {
        let time = Date.now();
        let signedTxBuffer = this.builder.signToString(this.account.key);

        let tx = <TxWriter['tx']> {
            timestamp: Date.now(),
            confirmations: 0,
            hash: null,
            receipt: null,
            timeout: null as NodeJS.Timeout,
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
            .then(async receipt => {
                this.clearTimer(tx);

                try {
                    await this.extractLogs(receipt, tx);
                } catch (error) { }
                this.onCompleted.resolve(receipt);

            }, async (err: Error & { receipt?: TransactionReceipt }) => {
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

                if (ClientErrorUtil.IsInsufficientFunds(err)) {
                    if (this.builder.config?.gasFunding) {
                        this.fundAccountAndResend().catch (err => {
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
                if (ClientErrorUtil.IsNonceTooLow(err)) {
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
                    $logger.log(`Tx retry in ${waitMs}ms`);
                    await $promise.wait(waitMs);

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
    private async extractLogs(receipt: TransactionReceipt, tx: TxWriter['tx']) {
        let parser = di.resolve(TxLogParser);
        let logs = await parser.parse(receipt);
        tx.knownLogs = logs.filter(x => x != null);
    }

    private async fundAccountAndResend () {
        let account = this.builder.config.gasFunding;
        await this.builder.setGas({
            gasEstimation: true,
            from: this.account.address
        });
        let { gasPrice, gasLimit } = this.builder.data;
        let LITTLE_BIT_MORE = 1.3;
        let wei = $bigint.multWithFloat(BigInt(gasPrice as any) * BigInt(gasLimit as any), LITTLE_BIT_MORE);

        let fundTx = await this.transferNative(account, this.account.address, wei);
        await fundTx.onCompleted;
        // account was funded resubmit the tx
        this.resubmit();
    }
    private startTimer (tx: TxWriter['tx']): NodeJS.Timeout {
        let timeout = this.options?.timeout
        let ms: number;
        if (typeof timeout === 'boolean') {
            if (timeout === false) {
                // Timeout was disabled
                return null;
            }
            ms = this.client.TIMEOUT;
        } else {
            ms = timeout ?? this.client.TIMEOUT;
        }

        return setTimeout(() => {
            if (this.txs.length > 3) {
                let hashes = this.txs.map(x => x.hash).join(', ')
                this.onCompleted.reject(new Error(`${this.txs.length} retries timeouted, with hashes: ${ hashes }`))
                return;
            }
            tx.error = new Error(`Timeouted ${ms}ms`);
            this.resubmit()
        }, ms);
    }
    private clearTimer (tx: TxWriter['tx']) {
        if (tx.timeout) {
            clearTimeout(tx.timeout);
            tx.timeout = null;
        }
    }
    private resubmit ({ increaseGas = true}: { increaseGas?: boolean} = {}) {
        if (increaseGas !== false) {
            this.builder.increaseGas(1.1);
        }
        this.sendTxInner();
    }

    /** Use this transfer in case of additional account funding */
    private async transferNative (from: ChainAccount, to: TAddress, amount: bigint): Promise<TxWriter> {
        let txBuilder = new TxDataBuilder(this.client, from, {
            to: to,
            value: $bigint.toHex(amount)
        });

        let GAS = 21000;
        await Promise.all([
            txBuilder.setGas({ gasLimit: GAS }),
            txBuilder.setNonce(),
        ]);
        return TxWriter.write(this.client, txBuilder, from);
    }

    toJSON (): TTxWriterJson {
        return {
            id: this.id,
            platform: this.client.platform,
            options: this.options,
            account: this.account.address,
            txs: this.txs,
            builder: this.builder.toJSON(),
        };
    }

    static async fromJSON (json: TTxWriterJson, client?: Web3Client): Promise<TxWriter> {
        client = client ?? Web3ClientFactory.get(json.platform);

        let service = di.resolve(ChainAccountsService);
        let account = await service.get(json.account, json.platform);

        let builder = TxDataBuilder.fromJSON(client, account, {
            config: json.builder.config,
            data: json.builder.data,
        });
        let writer = TxWriter.create(client, builder, account, json.options);
        let txs = json.txs;

        writer.id = json.id;
        writer.tx = txs[txs.length - 1];
        writer.txs = txs;
        writer.receipt = txs.find(x =>x.receipt)?.receipt;

        return writer;
    }


    static write (client: Web3Client, builder: TxDataBuilder, account: ChainAccount, options?: ITxWriterOptions): TxWriter {
        let writer = new TxWriter(client, builder, account);
        writer.write(options);
        return writer;
    }

    static create (client: Web3Client, builder: TxDataBuilder, account: ChainAccount, options?: ITxWriterOptions): TxWriter {
        return new TxWriter(client, builder, account);
    }
}

export type TTxWriterJson = {
    id: string
    platform: TPlatform
    options: ITxWriterOptions
    account: TAddress
    txs: TxWriter['txs']
    builder: ReturnType<TxDataBuilder['toJSON']>
};
