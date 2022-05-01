import { $date } from '@dequanto/utils/$date';
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
        this.write([ 'Warn', message ]);
    }
    error (message: string) {
        this.write([ 'Error', message ]);
    }
    info (message: string) {
        this.write([ 'Info', message ]);
    }

    write (row: string)
    write (row: any[])
    write (row: any[] | string) {
        let arr = typeof row === 'string' ? [ row ] : row;
        let date = new Date();
        arr.unshift(date);
        this.channel.writeRow(arr);

        arr[0] = $date.format(date, 'HH:mm:ss');
        console.log(arr.join(' '));
        return this;
    }
}
