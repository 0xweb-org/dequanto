import { Everlog } from 'everlog';
import { ILogger } from './ILogger';

export class LoggerService implements ILogger {


    private channel = Everlog.createChannel(this.name, {
        directory: './logs/dequanto/',
        columns: [
            { type: 'date', name: 'Date' },
            { type: 'string', name: 'Level' },
            { type: 'string', name: 'Message' },
        ]
    })

    constructor(public name: string = 'journal') {

    }

    warn (message: string) {
        this.write([ new Date(), 'Warn', message ]);
    }
    error (message: string) {
        this.write([ new Date(), 'Error', message ]);
    }
    info (message: string) {
        this.write([ new Date(), 'Info', message ]);
    }

    write (row: string)
    write (row: any[])
    write (row: any[] | string) {
        let arr = typeof row === 'string' ? [ row ] : row;
        arr.unshift(new Date());
        this.channel.writeRow(arr);
        console.log(Array.isArray(row) ? row.join(' ') : row);
        return this;
    }
}
