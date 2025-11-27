import { EoAccount } from '@dequanto/models/TAccount';
import { ITxWriterAgent } from './TxWriterAccountAgents';
import { ITxWriterEmitter, ITxWriterEvents, ITxWriterTransaction, TxWriter } from '../TxWriter';

import { ChainAccountService } from '@dequanto/ChainAccountService';
import { class_Dfr, class_EventEmitter } from 'atma-utils';
import { TEth } from '@dequanto/models/TEth';
import { $date } from '@dequanto/utils/$date';


import { $require } from '@dequanto/utils/$require';
import { $address } from '@dequanto/utils/$address';
import { $logger } from '@dequanto/utils/$logger';


export class BatchAgent implements ITxWriterAgent {

    public transactions: MockTxWriter[] = []

    constructor (public options?: {
        // It is usefull to not batch the deployment transactions.
        ignoreContractCreation?: boolean,
    }) {

    }

    enable () {
        TxWriter.DEFAULTS.agent = this;
    }

    disable () {
        TxWriter.DEFAULTS.agent = null;
    }

    getTxData (): (Pick<TEth.TxLike, "to" | "data" | "value"> & { sender: TEth.EoAccount, account: TEth.IAccount })[] {
        return this.transactions.map(tx => {
            let data = tx.outerWriter.builder.getTxData();
            return {
                to: data.to,
                value: data.value,
                data: data.data,

                sender: tx.sender,
                account: tx.account,
            };
        })
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

        let methodInfo = await outerWriter.builder.getInputDataInfo();
        $logger.log(`[BatchAgent] ${outerWriter.builder.data.to} (${methodInfo?.method})`);

        this.transactions.push(inner);
        await inner.process();
        return inner;
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
