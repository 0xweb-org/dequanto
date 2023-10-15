import { TEth } from '@dequanto/models/TEth';
import { $hex } from './$hex';
import { $contract } from './$contract';
import { $buffer } from './$buffer';

export namespace $address {
    export function eq(a1: string, a2: string) {
        return a1?.toUpperCase() === a2?.toUpperCase();
    }

    export function find<T>(arr: T[], getter: (x: T) => TEth.Address, address: TEth.Address) {
        return arr.find(x => eq(getter(x), address));
    }

    export function isValid(address: any): address is TEth.Address {
        if (typeof address !== 'string') {
            return false;
        }
        let rgx = /0x[\dA-F]{40,}/i;
        return rgx.test(address);
    }
    export function isEmpty(address: TEth.Address) {
        if (address == null || address.length < 2 || /^0x0*$/.test(address)) {
            return true;
        }
        return false;
    }
    export function expectValid(address: TEth.Address, message: string) {
        if (isValid(address) === false) {
            throw new Error(`${address} is invalid: ${message}`);
        }
        return address;
    }

    export function toBytes32(address: TEth.Address) {
        return address.toLowerCase().substring(2).padStart(32, '0');
    }
    export function fromBytes32(hex: string): TEth.Address {
        const SIZE = 40;
        return ('0x' + hex.substring(hex.length - SIZE)) as TEth.Address;
    }

    /** Supports https://eips.ethereum.org/EIPS/eip-1191 */
    export function toChecksum(address_: TEth.Address, chainId?: number): TEth.Address {

        let addressHex = $hex.padBytes(address_.toLowerCase(), 20);
        let addressRaw = addressHex.substring(2);

        if (chainId != null) {
            addressHex = chainId + addressHex;
        } else {
            addressHex = $hex.raw(addressHex)
        }

        let hash = $contract.keccak256($buffer.fromString(addressHex), 'buffer');
        let address = addressRaw.split('')
        for (let i = 0; i < 40; i += 2) {
            if (hash[i >> 1] >> 4 >= 8 && address[i]) {
                address[i] = address[i].toUpperCase()
            }
            if ((hash[i >> 1] & 0x0f) >= 8 && address[i + 1]) {
                address[i + 1] = address[i + 1].toUpperCase()
            }
        }

        return `0x${address.join('')}`
    }

    export const ZERO: TEth.Address = `0x0000000000000000000000000000000000000000`
}
