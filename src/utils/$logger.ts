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
    export function error (...args: any) {
        console.error($date.format(new Date(), 'HH:mm:ss'), ...colored(args));
    }


    function colored (args: (string | any)[]) {
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

export function l (strings: TemplateStringsArray, ...values: any[]) {
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
                break;
            default:
                // skip all non-value types.
                continue;
        }
        args[i - 1] = `${before}${value}${after}`;
        args.splice(i, 2);
        i--;
    }

    $logger.log(...args);
}
