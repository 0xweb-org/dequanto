import { IToken } from '@dequanto/models/IToken';
import { TAddress } from '@dequanto/models/TAddress';
import { $is } from './$is';

export namespace $require {
    export function Number <T> (val: T, message: string = '', opts?: { min?: T, max?: T}): T {
        if (typeof val !== 'number') {
            throw new Error(`Expects number type, got ${typeof val} ${val}. ${message}`);
        }
        if (isNaN(val)) {
            throw new Error(`Value is Not-a-Number. ${message}`);
        }
        if (opts?.min != null && val < opts.min) {
            throw new Error(`Value ${val} is less than ${opts.min}. ${message}`);
        }
        if (opts?.max != null && val > opts.max) {
            throw new Error(`Value ${val} is greater than ${opts.max}. ${message}`);
        }
        return val;
    }
    export function BigInt<T> (val: T, message: string = '', opts?: { min?: T, max?: T}): T {
        if (typeof val !== 'bigint') {
            throw new Error(`Expects bigint type, got ${typeof val} (${val}). ${message}`);
        }
        if (opts?.min != null && val < opts.min) {
            throw new Error(`Value ${val} is less than ${opts.min}. ${message}`);
        }
        if (opts?.max != null && val > opts.max) {
            throw new Error(`Value ${val} is greater than ${opts.max}. ${message}`);
        }
        return val;
    }
    export function Numeric<T>(val: T, message: string = '', opts?: { min?: T, max?: T}): T {
        if (typeof val === 'number') {
            return Number(val, message, opts);
        }
        if (typeof val === 'bigint') {
            return BigInt(val, message, opts);
        }
        throw new Error(`Expects numeric type, got ${typeof val}. ${message}`);
    }

    export function Function<T>(val: T, message: string): T {
        if (typeof val !== 'function') {
            throw new Error(`Value is not a function`);
        }
        return val;
    }
    export function notNull<T> (val: T, message: string): T {
        if (val == null) {
            throw new Error(`Value is undefined. ${message}`);
        }
        return val;
    }

    export function True(value: boolean, message: string) {
        if (value !== true) {
            throw new Error(`Got false expression ${message}`);
        }
    }
    export function notEq<T = any>(a: T, b: T, message: string = '') {
        // not strict equal
        if (a == b) {
            throw new Error(`${a} and ${b} shouldn't be equal. ${message}`)
        }
    }
    export function eq<T = any>(a: T, b: T, message: string = '') {
        // not strict equal
        if (a != b) {
            throw new Error(`${a} and ${b} should be equal. ${message}`)
        }
    }
    export function match (rgx: RegExp, str: string, message = '') {
        if (typeof str !== 'string') {
            throw new Error(`Expected a string to find in. ${message}`);
        }
        if (rgx.test(str) === false) {
            throw new Error(`Expected string "${str}" to match ${rgx.toString()}. ${message}`);
        }
    }
    export function oneOf<T = any>(a: T, arr: T[], message: string = '') {
        // not strict equal
        if (arr.includes(a) === false) {
            throw new Error(`${a} should be one of ${arr.join(', ')}. ${message}`)
        }
    }

    export function Address (val: TAddress, message: string = ''): TAddress {
        if ($is.Address(val) === false) {
            throw new Error(`Value ${val} is not a valid address. ${message}`);
        }
        return val;
    }
    export function Token (token: IToken, message: string = ''): IToken {
        if (token == null) {
            throw new Error(`Token is undefined. ${message}`);
        }
        if (token.address == null) {
            throw new Error(`Token address property is undefined. ${message}`);
        }
        if (token.decimals == null) {
            throw new Error(`Token decimals property is undefined. ${message}`);
        }
        return token;
    }

    /**
     * throws when a <= b
     */
    export function gt<T = number | bigint> (a: T, b: T, message: string = '') {
        Numeric(a);
        Numeric(b);

        if (a <= b) {
            throw new Error(`Expected a(${a}) > b(${b}). ${message}`);
        }
    }
}
