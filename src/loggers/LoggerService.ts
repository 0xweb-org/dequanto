import { $date } from '@dequanto/utils/$date';
import { Everlog } from 'everlog';
import { ILogger } from './ILogger';
import memd from 'memd';

export class LoggerService implements ILogger {

    public logs: any[][] = [];

    private fs: GlobalChannel;

    constructor(public name: string = 'journal', public options?: {
        fs?: boolean
        std?: boolean
        memory?: number
    }) {
        if (options.fs !== false) {
            this.fs = GlobalChannel.singleton();
        }
    }

    log (...params: (string | any)[]) {
        this.logInternal('log', ...params);
    }
    warn (...params: (string | any)[]) {
        this.logInternal('warn', ...params);
    }
    error (...params: (string | any)[]) {
        this.logInternal('error', ...params);
    }
    info (...params: (string | any)[]) {
        this.logInternal('info', ...params);
    }


    private logInternal (level: 'warn' | 'error' | 'log' | 'info', ...params) {
        if (this.options.fs !== false) {
            this.fs.write(level, this.name, params)
        }

        let args = [$date.format(new Date(), 'HH:mm:ss'), ...params ]
        if (this.options.std !== false) {
            console[level](...args);
        }

        let maxMemory = this.options?.memory ?? 5000;
        if (maxMemory !== 0) {
            let size = this.logs.push([level, ...args]);
            if (size > maxMemory) {
                let removeAmount = Math.floor(maxMemory * .3);
                this.logs.splice(0, removeAmount);
            }
        }
    }
}

class GlobalChannel {

    @memd.deco.memoize()
    static singleton () {
        return new GlobalChannel();
    }

    private channel = Everlog.createChannel('dequanto', {
        directory: './logs/',
        columns: [
            { type: 'date', name: 'Date' },
            { type: 'string', name: 'Level' },
            { type: 'string', name: 'Name' },
            { type: 'string', name: 'Message' },
        ]
    })

    write (level: string, name: string, ...params) {
        let message = params.map(param => {
            if (param == null || typeof param !== 'object') {
                return param;
            }
            try {
                return JSON.stringify(param);
            } catch (e) {
                return `<serialize error: ${e.message}>`
            }
        });

        this.channel.writeRow([
            new Date(),
            level,
            name,
            message.join(' | ')
        ]);

    }
}
