import { TEth } from '@dequanto/models/TEth';

interface ICrypto {
    randomBytes(size: number): Uint8Array;
    createECDH (curve: string)
}



export class WebCrypto implements ICrypto {
    crypto = crypto;

    randomBytes(size: number) {
        let array = new Uint8Array(size);
        let rnd = this.crypto.getRandomValues(array);
        return rnd;
    }
    createECDH(curve: string) {
        /** use this.crypto.subtle.importKey */
        throw new Error("Method not implemented.");
    }
}

export class WebCryptoPolyfill implements ICrypto {
    crypto = require('crypto');

    randomBytes(size: number) {
        const bytes = this.crypto.randomBytes(size);
        return bytes;
    }
    createECDH(curve: string) {
        return this.crypto.createECDH(curve);
    }
}


export const $crypto: ICrypto = typeof crypto === "undefined"
    ? new WebCryptoPolyfill()
    : new WebCrypto()
    ;
