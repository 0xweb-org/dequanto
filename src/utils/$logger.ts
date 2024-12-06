import memd from 'memd';
import { $color } from './$color';
import { $date } from './$date';
import alot from 'alot';
import { $dependency } from './$dependency';


export enum ELogLevel {
    INFO = 0,
    WARN = 1,
    ERROR = 2,
    RESULT = 3,
}

interface ILoggerOptions {
    time?: boolean
    color?: boolean
    level?: ELogLevel
}
class Logger {
    private stdCalls = [];
    private stdOnHold = false;
    private stdQueue = [];

    constructor(private options?: ILoggerOptions) {
        this.options ??= {};
        this.options.level ??= ELogLevel.INFO;
        this.options.color ??= true;
        this.options.time ??= true;
    }

    config (options: ILoggerOptions) {
        for (let key in options) {
            this.options[key] = options[key];
        }
    }

    log(...args: any) {
        if (this.options?.level > ELogLevel.INFO) {
            return;
        }
        if (args.length === 1 && typeof args[0] !== 'string') {
            console.dir(args[0], { depth: null });
            return;
        }
        this.print(this.format(...args), { method: 'log' });
    }

    toast(str: string) {
        if (this.options?.level > ELogLevel.INFO) {
            return;
        }
        let row = this.colored([ str ]);
        this.print(row, { method: 'log', isToast: true });
    }

    warn(...args: any) {
        if (this.options?.level > ELogLevel.WARN) {
            return;
        }
        this.print(this.format(...args), { method: 'warn' });
    }
    error(...args: any) {
        this.print(this.format(...args), { method: 'error' });
    }

    result (...args: any) {
        let row = this.colored(args);
        this.print(row, { method: 'log' });
    }

    table(arr: (string | number | bigint)[][]) {

        arr = arr.filter(x => x != null && x.length > 0);
        if (arr.length === 0) {
            // No rows
            return;
        }

        let lengths = arr[0].map((_, i) => {
            let size = alot(arr).max(x => {
                if (x.length === 1) {
                    // If a row has only one column do not calculate column sizes and it will take the whole space
                    return 0;
                }

                let str = String(x[i]);
                let lines = str.split('\n');
                let max = alot(lines).max(x => x.length);
                const LIMIT_COLUMNG_LENGTH = 100;
                return Math.min(max, LIMIT_COLUMNG_LENGTH);
            });
            return size;
        });

        let lines = arr.map(row => {

            let multiLines = row.map(x => String(x).split('\n'));
            let multiLinesCount = alot(multiLines).max(x => x.length);
            return alot
                .fromRange(0, multiLinesCount)
                .map(y => {

                    return row.map((_, i) => {
                        let x = multiLines[i][y];
                        let size = lengths[i];
                        let str = String(x ?? '').padEnd(size, ' ');
                        if (i % 2 === 1) {
                            str = `bold<${str}>`;
                        }
                        return str;
                    })
                    .join(' ');
                })
                .toArray()
                .join('\n')
        });

        let row = this.colored([ lines.join('\n') ])
        this.print(row, { method: 'log' });
    }

    /**
     * Print log message not often than every 1 second
     */
    @memd.deco.throttle(1000)
    throttled(...args: any) {
        this.log(...args);
    }

    private print(row: (string | any)[], params: { method: 'log' | 'warn' | 'error', isToast?: boolean }) {
        if (params?.isToast) {
            if (StdToast.isLoaded !== true) {
                this.stdOnHold = true;
                StdToast.initialize().then(x => {
                    let arr = this.stdQueue;
                    this.stdOnHold = false;
                    this.stdQueue = [];
                    arr.map(([row, params]) => {
                        this.print(row, params);
                    });


                });
            }
        }
        if (this.stdOnHold) {
            this.stdQueue.push([row, params]);
            return;
        }

        if (this.stdCalls[0]?.isToast) {
            // Last print is the toast, clear it
            StdToast.clean();
        }

        console[params.method](...row);

        this.stdCalls.unshift(params);
        if (this.stdCalls.length > 100) {
            this.stdCalls.splice(50);
        }

    }

    private format(...args: any): (string | any)[] {
        let row = this.colored(args);
        if (this.options?.time) {
            row.unshift($date.format(new Date(), 'HH:mm:ss'));
        }
        return row;
    }

    private colored(args: (string | any)[]) {
        if (this.options?.color === false) {
            return args;
        }
        for (let i = 0; i < args.length; i++) {
            let x = args[i];
            if (typeof x !== 'string') {
                continue;
            }
            args[i] = $color(args[i]);
        }
        return args;
    }
}

export let $logger = new Logger();

export function l(strings: TemplateStringsArray, ...values: any[]) {
    let args = [];
    for (let i = 0; i < strings.length; i++) {
        args.push(strings[i]);
        if (i < values.length) {
            args.push(values[i]);
        }
    }

    // join value types if should be colorized: l`Age: bold<${age}>`
    for (let i = 1; i < args.length - 1; i++) {
        let before = args[i - 1];
        let value = args[i];
        let after = args[i + 1];
        if (typeof before !== 'string' || typeof after !== 'string') {
            continue;
        }
        switch (typeof value) {
            case 'number':
            case 'string':
            case 'boolean':
            case 'undefined':
            case 'bigint':
                break;
            default:
                // skip colorizing all non-value types.
                continue;
        }
        args[i - 1] = `${before}${value}${after}`;
        args.splice(i, 2);
        i--;
    }

    $logger.log(...args);
}

namespace StdToast {

    let rl: typeof import('readline');

    export let isLoaded = false;
    export function clean() {
        rl.clearLine(process.stdout, 0);
        rl.cursorTo(process.stdout, 0, null);

        rl.moveCursor(process.stdout, 0, -1);
        rl.clearLine(process.stdout, 0);
    }
    export async function initialize() {
        /** lazy */
        rl = await $dependency.load('readline');
        isLoaded = true;
    }
}
