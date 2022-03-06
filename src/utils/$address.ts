import { TAddress } from '@dequanto/models/TAddress';

export namespace $address {
    export function eq (a1: string, a2: string) {
        return a1?.toUpperCase() === a2?.toUpperCase();
    }

    export function find<T> (arr: T[], getter: (x: T) => TAddress, address: TAddress) {
        return arr.find(x => eq(getter(x), address));
    }

    export function isValid (address: TAddress) {
        let rgx = /0x[\dA-F]{40,}/i;
        return rgx.test(address);
    }
    export function isEmpty (address: TAddress) {
        if (address == null || address === '') {
            return true;
        }
        if (/^0x0+$/.test(address)) {
            return true;
        }
        return false;
    }
    export function expectValid (address: TAddress, message: string) {
        if (isValid(address) === false) {
            throw new Error(`${address} is invalid: ${message}`);
        }
        return address;
    }

    export function toBytes32 (address: TAddress) {
        return address.toLowerCase().substring(2).padStart(32, '0');
    }

    export const ZERO = '0x0000000000000000000000000000000000000000'
}
