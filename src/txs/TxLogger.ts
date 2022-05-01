import { TAddress } from '@dequanto/models/TAddress';
import { $logger } from '@dequanto/utils/$logger';
import { Everlog } from'everlog';
import { TransactionReceipt } from 'web3-core';
import { TxDataBuilder } from './TxDataBuilder';

export class TxLogger {

    constructor(public id: string, public from: TAddress, public builder: TxDataBuilder) {

    }

    log (message: string) {
        $logger.log('TxLog:', message);
        channels.log.writeRow([
            new Date(),
            'LOG',
            this.id,
            message
        ]);
    }

    logStart() {
        channels.start.writeRow([
            new Date(),
            this.id,
            this.from,
            this.builder.data.to,
            this.builder.data.data?.toString()
        ]);
    }
    logReceipt(receipt: TransactionReceipt, time: number) {
        channels.receipt.writeRow([
            new Date(),
            this.id,
            receipt.transactionHash,
            receipt.status,
            time,
        ]);
    }
    logError(error: Error) {
        $logger.log('TxError:', error.message);
        channels.log.writeRow([
            new Date(),
            'ERROR',
            this.id,
            error.message
        ]);
    }
}

const channels = {
    start: Everlog.createChannel('tx-starts', {
        columns: [
            {
                type: 'date',
                name: 'Date'
            },
            {
                type: 'string',
                name: 'ID'
            },
            {
                type: 'string',
                name: 'From'
            },
            {
                type: 'string',
                name: 'To'
            },
            {
                type: 'string',
                name: 'Method'
            }
        ]
    }),
    log: Everlog.createChannel('tx-logs', {
        columns: [
            {
                type: 'date',
                name: 'Date'
            },
            {
                type: 'string',
                name: 'Level'
            },
            {
                type: 'string',
                name: 'TxID'
            },
            {
                type: 'string',
                name: 'Error'
            }
        ]
    }),
    receipt: Everlog.createChannel('tx-receipts', {
        columns: [
            {
                type: 'date',
                name: 'Date'
            },
            {
                type: 'string',
                name: 'ID'
            },
            {
                type: 'string',
                name: 'TxHash'
            },
            {
                type: 'string',
                name: 'Status'
            },
            {
                type: 'number',
                name: 'Duration'
            }
        ]
    }),
}
