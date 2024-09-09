import { $date } from '@dequanto/utils/$date';
import { Everlog } from '@everlog/core';
import { ILogger } from './ILogger';
import memd from 'memd';
import { $logger } from '@dequanto/utils/$logger';

export class LoggerService implements ILogger {

    private fs: GlobalChannel;

    constructor(public name: string = 'journal', public options?: {
        fs?: boolean
        std?: boolean
    }) {
        this.options ??= {};

        if (this.options.fs !== false) {
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
        if (this.options.std !== false) {
            $logger[level](this.name, ...params);
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
