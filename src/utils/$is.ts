import { TAddress } from '@dequanto/models/TAddress';

export namespace $is {
    export function Number <T> (val: number | any): val is number {
        return typeof val === 'number' && isNaN(val) === false;
    }

    export function notNull<T> (val: T): boolean {
        return val != null
    }
    export function BigInt<T> (val: bigint | any): val is bigint {
        return typeof val === 'bigint';
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
