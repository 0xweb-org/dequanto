"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const _date_1 = require("@dequanto/utils/$date");
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
        this.write(['Warn', message]);
    }
    error(message) {
        this.write(['Error', message]);
    }
    info(message) {
        this.write(['Info', message]);
    }
    write(row) {
        let arr = typeof row === 'string' ? [row] : row;
        let date = new Date();
        arr.unshift(date);
        this.channel.writeRow(arr);
        arr[0] = _date_1.$date.format(date, 'HH:mm:ss');
        console.log(arr.join(' '));
        return this;
    }
}
exports.LoggerService = LoggerService;
