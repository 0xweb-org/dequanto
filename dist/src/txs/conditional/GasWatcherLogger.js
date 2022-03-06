"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GasWatcherLogger = void 0;
const _bigint_1 = require("@dequanto/utils/$bigint");
const _date_1 = require("@dequanto/utils/$date");
const _logger_1 = require("@dequanto/utils/$logger");
const everlog_1 = require("everlog");
class GasWatcherLogger {
    constructor() {
        this.channels = {
            prices: everlog_1.Everlog.createChannel('gaswatcher-prices', {
                columns: [
                    {
                        type: 'date',
                        name: 'Date'
                    },
                    {
                        type: 'number',
                        name: 'Price(Gwei)'
                    },
                ]
            }),
            txs: everlog_1.Everlog.createChannel('gaswatcher-txs', {
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
                        name: 'Message'
                    }
                ]
            }),
        };
    }
    logPrice(gasPrice, block) {
        let date = new Date();
        let gwei = _bigint_1.$bigint.toGweiFromWei(gasPrice);
        _logger_1.$logger.log(`Gas ${block || ''} ${_date_1.$date.format(date, 'HH:mm')} ${gwei} GWEI`);
        this.channels.prices.writeRow([
            date,
            gwei,
        ]);
    }
    logTx(id, message) {
        let date = new Date();
        let str = `Tx ${_date_1.$date.format(date, 'HH:mm')} ${message}`;
        _logger_1.$logger.log(str);
        this.channels.txs.writeRow([
            date,
            id,
            str
        ]);
    }
}
exports.GasWatcherLogger = GasWatcherLogger;
