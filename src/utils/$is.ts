import { TAddress } from '@dequanto/models/TAddress';

export namespace $is {
    export function Number <T> (val: T, message: string = 'Invalid.', opts?: { min?: number, max?: number}): T {
        if (typeof val !== 'number') {
            throw new Error(`Value is not a number. ${message}`);
        }
        if (opts?.min != null && val < opts.min) {
            throw new Error(`Value ${val} is less than ${opts.min}. ${message}`);
        }
        if (opts?.max != null && val > opts.max) {
            throw new Error(`Value ${val} is greater than ${opts.max}. ${message}`);
        }

        return val;
    }

    export function notNull<T> (val: T, message: string): T {
        if (val == null) {
            throw new Error(`Value is undefined. ${message}`);
        }
        return val;
    }
    export function BigInt<T> (val: T, message?: string): bigint {
        if (typeof val !== 'bigint') {
            throw new Error(`Value is undefined. ${message}`);
        }
        return val as any as bigint;
    }

    export function Address (val: TAddress, message?: string): val is TAddress {
        if (typeof val !== 'string') {
            return false;
        }
        return /^0x[a-fA-F0-9]{40}$/g.test(val);
    }

    export function TxHash (val: TAddress): boolean {
        if (hexString(val) === false) {
            return false;
        }
        // 0x115f9d0e3c5d7538eb27466cf42ac68527703a14e93c0d1243131164af2d1c6c
        if (val.length !== 2 + 64) {
            return false;
        }
        return true;
    }

    export function hexString(str: string | any) {
        if (typeof str !== 'string') {
            return false;
        }
        return /^0x[\da-f]+$/i.test(str);
    }
}
