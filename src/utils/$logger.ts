import { $date } from './$date';

export namespace $logger {
    export function log (...args: any) {
        console.log($date.format(new Date(), 'HH:mm:ss'), ...args);
    }
    export function warn (...args: any) {
        console.warn($date.format(new Date(), 'HH:mm:ss'), ...args);
    }
}
