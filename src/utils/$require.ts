import { IToken } from '@dequanto/models/IToken';
import { TAddress } from '@dequanto/models/TAddress';
import { $is } from './$is';
import { $address } from './$address';

const $Array = Array;
export namespace $require {
    export function Number <T> (val: T, message: string = '', opts?: { min?: T, max?: T}): T {
        if (typeof val !== 'number') {
            throw new Error(`Expects number type, got ${typeof val} ${val}. ${message}`);
        }
        if (isNaN(val)) {
            throw new Error(`Value is Not-a-Number. ${message}`);
        }
        if (opts?.min != null && (val as T) < opts.min) {
            throw new Error(`Value ${val} is less than ${opts.min}. ${message}`);
        }
        if (opts?.max != null && (val as T) > opts.max) {
            throw new Error(`Value ${val} is greater than ${opts.max}. ${message}`);
        }
        return val;
    }
    export function BigInt<T> (val: T, message: string = '', opts?: { min?: T, max?: T}): T {
        if (typeof val !== 'bigint') {
            throw new Error(`Expects bigint type, got ${typeof val} (${val}). ${message}`);
        }
        if (opts?.min != null && (val as T) < opts.min) {
            throw new Error(`Value ${val} is less than ${opts.min}. ${message}`);
        }
        if (opts?.max != null && (val as T) > opts.max) {
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
            throw new Error(`Value is not a function ${message}`);
        }
        return val;
    }
    export function Array<T>(val: T, message: string): T {
        if ($Array.isArray(val) === false) {
            throw new Error(`Value is not a function ${message}`);
        }
        return val;
    }
    export function String<T>(val: T, message): T {
        if (typeof val !== 'string') {
            throw new Error(`Value ${val} is not a string ${message}`);
        }
        return val;
    }
    export function notNull<T> (val: T, message: string, ...logs): T {
        if (val == null) {
            logs?.forEach(log => console.error(log));
            throw new Error(`Value is undefined. ${message}`);
        }
        return val;
    }
    export function Null<T> (val: T, message: string, ...logs): T {
        if (val != null) {
            logs?.forEach(log => console.error(log));
            throw new Error(`Value ${val} expects to be undefined. ${message}`);
        }
        return val;
    }
    export function notEmpty<T extends string | Array<any>> (val: T, message: string): T {
        if (val == null) {
            throw new Error(`Value is undefined. ${message}`);
        }
        if (typeof val === 'string' && val.trim().length === 0) {
            throw new Error(`Value is empty string. ${message}`);
        } else if ($Array.isArray(val) && val.length === 0) {
            throw new Error(`Value is empty array. ${message}`);
        }
        return val;
    }

    export async function resolved <T> (x: PromiseLike<T>, message: string): Promise<T> {
        try {
            return await x;
        } catch (error) {
            throw new Error(`${message} ${error.message}`);
        }
    }

    export function True(value: boolean, message?: string) {
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

    export function Address (val: TAddress | string, message: string = ''): TAddress {
        if ($is.Address(val) === false) {
            throw new Error(`Value ${val} is not a valid address. ${message}`);
        }
        return val;
    }
    export function AddressNotEmpty (val: TAddress | string, message: string = ''): TAddress {
        if ($address.isEmpty( $require.Address(val, message))) {
            throw new Error(`Value ${val} is not a valid address. ${message}`);
        }
        return val as TAddress;
    }
    export function AddressChecked (val: TAddress, message: string = ''): TAddress {
        $require.Address(val, message);
        let checkSum = $address.toChecksum(val.toLowerCase() as TAddress);
        if (checkSum !== val) {
            throw new Error(`Checksum address ${checkSum} !== ${val} ${message}`);
        }
        return val;
    }

    export function TxHash (val: string, message: string = ''): string {
        if ($is.TxHash(val) === false) {
            throw new Error(`Value ${val} is not a valid tx hash. ${message}`);
        }
        return val;
    }

    export function Hex (val: string, message: string = ''): string {
        if ($is.Hex(val) === false) {
            throw new Error(`Value ${val} is not a valid hex value. ${message}`);
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
     * must be a > b, throws when a <= b
     */
    export function gt<T = number | bigint> (a: T, b: T, message: string = '') {
        Numeric(a);
        Numeric(b);
        if (a <= b) {
            throw new Error(`Expected a(${a}) > b(${b}). ${message}`);
        }
    }
    export function gte<T = number | bigint> (a: T, b: T, message: string = '') {
        Numeric(a);
        Numeric(b);
        if (a < b) {
            throw new Error(`Expected a(${a}) > b(${b}). ${message}`);
        }
    }

    /**
     * must be a < b, throws when a >= b
     */
    export function lt<T = number | bigint> (a: T, b: T, message: string = '') {
        Numeric(a);
        Numeric(b);
        if (a >= b) {
            throw new Error(`Expected a(${a}) > b(${b}). ${message}`);
        }
    }
    export function lte<T = number | bigint> (a: T, b: T, message: string = '') {
        Numeric(a);
        Numeric(b);
        if (a > b) {
            throw new Error(`Expected a(${a}) > b(${b}). ${message}`);
        }
    }
}
