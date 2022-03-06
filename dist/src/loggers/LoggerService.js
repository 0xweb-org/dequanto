"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const everlog_1 = require("everlog");
class LoggerService {
    constructor(name = 'journal') {
        this.name = name;
        this.channel = everlog_1.Everlog.createChannel(this.name, {
            directory: './logs/dequanto/',
            columns: [
                { type: 'date', name: 'Date' },
                { type: 'string', name: 'Level' },
                { type: 'string', name: 'Message' },
            ]
        });
    }
    warn(message) {
        this.write([new Date(), 'Warn', message]);
    }
    error(message) {
        this.write([new Date(), 'Error', message]);
    }
    info(message) {
        this.write([new Date(), 'Info', message]);
    }
    write(row) {
        let arr = typeof row === 'string' ? [row] : row;
        arr.unshift(new Date());
        this.channel.writeRow(arr);
        console.log(Array.isArray(row) ? row.join(' ') : row);
        return this;
    }
}
exports.LoggerService = LoggerService;
