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

    export function Address (val: TAddress, message?: string): TAddress {
        if (val == null) {
            throw new Error(`Value is undefined. ${message}`);
        }
        if (/^0x[\w]{10,}$/.test(val) === false) {
            throw new Error(`Value ${val} is not a valid address. ${message}`);
        }
        return val;
    }
}
