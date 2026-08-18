import alot from 'alot';
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

    async execute (): Promise<TxWriter[]> {
        this.disable();

        let groupStart = 0;
        let writers = [];
        for (let i = 0; i < this.transactions.length; i++) {
            let tx = this.transactions[i];
            let next = i < this.transactions.length - 1
                ? this.transactions[i + i]
                : null;

            if (next == null || $address.eq(tx.account.address, next.account.address) === false) {
                let arr = await this.executeGroup(this.transactions.slice(groupStart, i + 1));
                writers.push(...arr);
            }
        }
        this.enable();
        return writers;
    }

    private async executeGroup (txs: MockTxWriter[]) {
        let { account, sender } = txs[0];
        if (account.name.includes('safe/')) {
            let tx = await this.executeBatchSafe(sender, account, txs);
            return [ tx ];
        }
        if (account.name.includes('timelock/')) {
            let tx = await this.executeBatchTimelock(sender, account, txs);
            return [ tx ];
        }
        let writers = [];
        for (let i = 0; i < txs.length; i++) {
            let tx = txs[i];
            let writer = tx.outerWriter.send();
            await writer.wait();
            writers.push(writer);
        }
        return writers;
    }
    private async executeBatchSafe (sender: TEth.EoAccount, account: TEth.IAccount, txs: MockTxWriter[]) {
        let client = txs[0].outerWriter.client;
        let safe = new SafeTx(account as TEth.SafeAccount, client);

        let calls = txs.map(x => x.outerWriter.builder.getTxData());
        let writer = await safe.executeBatch(...calls);
        await writer.wait();
        return writer;
    }
    private async executeBatchTimelock (sender: TEth.EoAccount, account: TEth.IAccount, txs: MockTxWriter[]) {
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
