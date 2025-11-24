import { EoAccount, TAccount, TimelockAccount } from '@dequanto/models/TAccount';
import { ITxWriterAccountAgent } from './TxWriterAccountAgents';
import { $account } from '@dequanto/utils/$account';
import { ITxWriterEmitter, ITxWriterEvents, ITxWriterTransaction, TxWriter } from '../TxWriter';

import { ChainAccountService } from '@dequanto/ChainAccountService';
import { $promise } from '@dequanto/utils/$promise';
import { class_Dfr, class_EventEmitter } from 'atma-utils';
import { TEth } from '@dequanto/models/TEth';
import { $require } from '@dequanto/utils/$require';
import { $date } from '@dequanto/utils/$date';
import { ITimelockTx } from '@dequanto/services/TimelockService/ITimelockService';
import { Web3Client } from '@dequanto/clients/Web3Client';

import { TimelockService } from '@dequanto/services/TimelockService/TimelockService';
import { TimelockControllerFactory } from '@dequanto/prebuilt-factories/TimelockControllerFactory';


export class TimelockAgent implements ITxWriterAccountAgent {
    supports (account: TAccount) {
        return $account.isTimelock(account);
    }
    async process (senderMix: string | EoAccount, timelockAccount: TimelockAccount, outerWriter: TxWriter) {

        let { client, options } = outerWriter;
        let TimelockController = TimelockControllerFactory();
        let timelock = new TimelockController(timelockAccount.address, client);
        let service = new TimelockService(timelock, {
            simulate: false,
        });
        let sender = typeof senderMix === 'string'
            ? await ChainAccountService.get(senderMix) as EoAccount
            : senderMix;

        let inner = new TimelockTxWriter(
            client,
            sender,
            service,
            outerWriter,
        );

        await inner.process();
        return inner;
    }
}

export class TimelockTxWriter extends class_EventEmitter<ITxWriterEvents> implements ITxWriterEmitter {

    onSent = new class_Dfr<string | TEth.Hex>()
    onCompleted = new class_Dfr<TEth.TxReceipt>()
    receipt: TEth.TxReceipt
    tx: ITxWriterTransaction

    schedule: ITimelockTx
    delayTimer: any

    constructor (
        private client: Web3Client,
        private sender: TEth.IAccount,
        private service: TimelockService,
        private outerWriter: TxWriter,
    ) {
        super();
    }

    async process () {
        let { sender, service, client, outerWriter } = this;

        let { error, result } = await $promise.caught(service.processData(sender, outerWriter.builder));
        if (error) {
            this.onCompleted.reject(error);
            this.emit('error', error);
            return this;
        }
        if (result.status === 'completed') {
            $require.Hex(result.tx, 'Timelock transaction hash expected');
            let receipt = await client.getTransactionReceipt(result.tx);
            let block = await client.getBlock(receipt.blockNumber);
            let latestBlock = await client.getBlockNumber();
            $require.notNull(receipt, `Receipt for ${result.tx} not found`);

            let tx = {
                timestamp: block.timestamp,
                confirmations: latestBlock - block.number,
                hash: receipt.transactionHash,
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
        if (result.status === 'pending') {
            let readyAt = $date.fromUnixTimestamp(result.schedule.validAt);
            let readyAtF = $date.format(readyAt, 'yyyy-MM-DD HH:mm:ss');
            this.emit('log', `Timelock transaction pending: ${result.schedule.id}, ready at: ${readyAtF}`);
            this.onSent.resolve(result.schedule.id);

            let ms = readyAt.valueOf() - Date.now();
            $require.gt(ms, 0, `The transaction must be in 'ready' state`);
            this.delayTimer = setTimeout(() => {
                this.process();
            }, ms);
            return this;
        }
        if (result.status === 'ready') {
            throw new Error(`[TimelockAgent] Service emits 'ready' status, however it should execute the transaction directly`);
        }

        throw new Error(`[TimelockAgent] Unsupported status: ${result.status}`);
    }
}
