"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxLogger = void 0;
const _logger_1 = require("@dequanto/utils/$logger");
const everlog_1 = require("everlog");
class TxLogger {
    constructor(id, from, builder) {
        this.id = id;
        this.from = from;
        this.builder = builder;
    }
    log(message) {
        _logger_1.$logger.log('TxLog:', message);
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
    logReceipt(receipt, time) {
        channels.receipt.writeRow([
            new Date(),
            this.id,
            receipt.transactionHash,
            receipt.status,
            time,
        ]);
    }
    logError(error) {
        _logger_1.$logger.log('TxError:', error.message);
        channels.log.writeRow([
            new Date(),
            'ERROR',
            this.id,
            error.message
        ]);
    }
}
exports.TxLogger = TxLogger;
const channels = {
    start: everlog_1.Monit.createChannel('tx-starts', {
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
    log: everlog_1.Monit.createChannel('tx-logs', {
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
    receipt: everlog_1.Monit.createChannel('tx-receipts', {
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
};
