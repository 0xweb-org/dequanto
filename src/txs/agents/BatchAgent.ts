import alot from 'alot';
import type { Deployments } from '@dequanto/contracts/deploy/Deployments';
import { EoAccount } from '@dequanto/models/TAccount';
import { ITxWriterAgent } from './TxWriterAccountAgents';
import { ITxWriterEmitter, ITxWriterEvents, ITxWriterTransaction, TxWriter } from '../TxWriter';

import { ChainAccountService } from '@dequanto/ChainAccountService';
import { class_Dfr, class_EventEmitter } from 'atma-utils';
import { TEth } from '@dequanto/models/TEth';
import { $date } from '@dequanto/utils/$date';

import { $address } from '@dequanto/utils/$address';
import { $logger } from '@dequanto/utils/$logger';
import { SafeTx } from '@dequanto/safe/SafeTx';
import { TimelockController } from '@dequanto/prebuilt/openzeppelin/TimelockController';
import { TimelockService } from '@dequanto/services/TimelockService/TimelockService';
import { TxDataBuilder } from '../TxDataBuilder';
import { $contract } from '@dequanto/utils/$contract';
import { $require } from '@dequanto/utils/$require';
import { $account } from '@dequanto/utils/$account';


export class BatchAgent implements ITxWriterAgent {

    public transactions: MockTxWriter[] = []

    constructor (public options?: {
        // It is useful not to batch deployment transactions
        ignoreContractCreation?: boolean,
    }) {

    }

    enable () {
        TxWriter.DEFAULTS.agent = this;
        return this;
    }

    disable () {
        TxWriter.DEFAULTS.agent = null;
        return this;
    }

    getTxData (): (Pick<TEth.TxLike, "to" | "data" | "value"> & { sender: TEth.EoAccount, account: TEth.IAccount })[] {
        return this.transactions.map(tx => {
            let data = tx.outerWriter.builder.getTxData();
            return {
                to: data.to,
                value: data.value,
                data: data.data,
                chainId: data.chainId,

                sender: tx.sender,
                account: tx.account,
            };
        });
    }

    // Called by TxWriter for regular transactions. Prevents on-chain submission and keeps the transaction in the batch.
    async process (senderMix: string | EoAccount, account: TEth.IAccount, outerWriter: TxWriter) {

        if (outerWriter.builder.data.to == null && this.options?.ignoreContractCreation != false) {
            return null;
        }

        let sender = typeof senderMix === 'string'
            ? await ChainAccountService.get(senderMix) as EoAccount
            : senderMix;

        let inner = new MockTxWriter(
            sender,
            account,
            outerWriter,
        );

        let title = await this.getTitle(outerWriter.builder);
        $logger.log(`[BatchAgent] ${title}`);

        this.transactions.push(inner);
        await inner.process();
        return inner;
    }

    // Submits queued transactions on-chain. If the account is Safe or Timelock, prepares the corresponding calldata and submits as batch transaction.
    async execute (): Promise<TxWriter[]> {
        this.disable();

        let groupStart = 0;
        let writers = [];
        for (let i = 0; i < this.transactions.length; i++) {
            let tx = this.transactions[i];
            let next = i < this.transactions.length - 1
                ? this.transactions[i + 1]
                : null;

            let acc0 = tx.account?.address ?? tx.sender?.address;
            let acc1 = next?.account?.address ?? next?.sender?.address;

            if (next == null || $address.eq(acc0, acc1) === false) {
                let arr = await this.executeGroup(this.transactions.slice(groupStart, i + 1));
                writers.push(...arr);
                groupStart = i + 1;
            }
        }
        this.enable();
        return writers;
    }

    /**
     * Format all queued transactions for display.
     */
    async print (data?: {
        deployments: Deployments[]
    }): Promise<string> {
        const contracts = await alot(data?.deployments ?? [])
            .mapManyAsync(d => d.store.getDeployments())
            .toArrayAsync();

        const lines = await alot(this.transactions).mapManyAsync(async (tx, i) => {
            let builder = tx.outerWriter.builder;
            let data = builder.data;
            let info = await builder.getInputDataInfo();
            let arr = [];

            let localContract = contracts.find(x => $address.eq(x.address, data.to));
            let acc = tx.account ?? tx.sender;

            arr.push(
                `Transaction: #${i + 1}`,
                `    To:   ${data.to} ${localContract?.id ?? ''}`,
                `    From: ${acc.address} ${acc.name}`,
                `    Data: ${data.data}`,
            );
            if (info?.method) {
                arr.push(`    Function  : ${info.method}`);
                if (info.params != null) {
                    arr.push(`    Parameters:`);
                    if (Array.isArray(info.params)) {
                        info.params.forEach(val => arr.push(`        ${JSON.stringify(val)}`));
                    } else if (typeof info.params === 'object') {
                        alot
                            .fromObject(info.params)
                            .forEach(entry => arr.push(`        ${entry.key}: ${JSON.stringify(entry.value)}`))
                            .toArray();
                    }
                }
            }
            return arr;
        }).toArrayAsync();

        return lines.join('\n');
    }

    private async executeGroup (txs: MockTxWriter[]) {
        let { account, sender } = txs[0];
        let acc = account ?? sender;
        if ($account.isSafe(acc)) {
            let tx = await this.executeBatchSafe(acc, txs);
            return [ tx ];
        }
        if ($account.isTimelock(acc)) {
            let tx = await this.executeBatchTimelock(sender, account, txs);
            return [ tx ];
        }
        let writers = [];
        for (let i = 0; i < txs.length; i++) {
            let writer = txs[i].outerWriter;
            writer.tx = null;
            writer.txs = [];
            writer.receipt = null;
            writers.push(writer);
            await writer.send().wait();
        }
        return writers;
    }
    private async executeBatchSafe (account: TEth.IAccount, txs: MockTxWriter[]) {
        let client = txs[0].outerWriter.client;
        let safe = new SafeTx(account as TEth.SafeAccount, client);

        let calls = txs.map(x => x.outerWriter.builder.getTxData());
        let writer = await safe.executeBatch(...calls);
        await writer.wait();
        return writer;
    }
    private async executeBatchTimelock (sender: TEth.EoAccount, account: TEth.IAccount, txs: MockTxWriter[]) {
        $require.notNull(sender, `Sender is undefined`);
        $require.notNull(account, `Timelock is undefined`);

        sender = await TxWriter.prepareAccount(sender) as TEth.EoAccount;

        let client = txs[0].outerWriter.client;
        let timelock = new TimelockController(account.address, client);
        let service = new TimelockService(timelock, {

        });
        let titles = await alot(txs)
            .map(x => this.getTitle(x.outerWriter.builder))
            .toArrayAsync();
        let taskName = $contract.keccak256(titles.join(','), 'hex');
        let calls = txs.map(x => x.outerWriter.builder.getTxData());

        let { tx } = await service.processBatch(taskName, sender, calls);
        if (tx == null) {
            // No transactions
            return null;
        }
        return TxWriter.fromTxHash(client, tx);
    }

    private async getTitle (builder: TxDataBuilder) {
        let methodInfo = await builder.getInputDataInfo();
        return `${builder.data.to} [${methodInfo?.method}(${JSON.stringify(methodInfo?.params ?? [])})]`
    }
}

export class MockTxWriter extends class_EventEmitter<ITxWriterEvents> implements ITxWriterEmitter {

    onSent = new class_Dfr<string | TEth.Hex>()
    onCompleted = new class_Dfr<TEth.TxReceipt>()
    receipt: TEth.TxReceipt
    tx: ITxWriterTransaction

    constructor (
        public sender: TEth.EoAccount,
        public account: TEth.IAccount,
        public outerWriter: TxWriter,
    ) {
        super();
    }

    async process () {
        let receipt = {
            status: 1,
            transactionHash: '0x',
            transactionIndex: 0n,
            blockHash: '0x',
            blockNumber: 0,
            from: $address.ZERO,
            to: $address.ZERO,
            cumulativeGasUsed: 0n,
            gasUsed: 0n,
            effectiveGasPrice: 0n,
            logs: [],
            logsBloom: '0x'
        } as TEth.TxReceipt;

        let tx = {
            timestamp: $date.toUnixTimestamp(),
            confirmations: 5,
            hash: '0x',
            receipt: receipt,
            error: null,
            knownLogs: null,
        } as ITxWriterTransaction;

        this.tx = tx;
        this.emit('transactionHash', receipt.transactionHash);
        this.emit('receipt', receipt);
        this.onCompleted.resolve(receipt);
        return this;

    }
}
