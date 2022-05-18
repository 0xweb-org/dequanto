import { $color } from './$color';
import { $date } from './$date';

export namespace $logger {
    export function log (...args: any) {
        if (args.length === 1 && typeof args[0] !== 'string') {
            console.dir(args[0], { depth: null });
            return;
        }

        console.log($date.format(new Date(), 'HH:mm:ss'), ...colored(args));
    }
    export function warn (...args: any) {
        console.warn($date.format(new Date(), 'HH:mm:ss'), ...colored(args));
    }


    function colored (...args) {
        for (let i = 0; i > args.length; i++) {
            let x = args[i];
            if (typeof x !== 'string') {
                continue;
            }
            args[i] = $color(args[i]);
        }
        return args;
    }
}

export function l (strings: TemplateStringsArray, ...values: any[]) {
    let args = [];
    for (let i = 0; i < strings.length; i++) {
        args.push(strings[i]);
        if (i < values.length) {
            args.push(values[i]);
        }
    }

    $logger.log(...args);
}
