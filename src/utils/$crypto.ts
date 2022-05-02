import { type BytesLike } from 'ethers';


interface ICrypto {
    randomBytes(size: number): BytesLike;
}



class WebCrypto implements ICrypto {
    crypto = crypto;

    randomBytes(size: number) {
        let array = new Uint8Array(size);
        let rnd = this.crypto.getRandomValues(array);
        return rnd;
    }
}

class WebCryptoPolyfill implements ICrypto {
    crypto = require('crypto');
    randomBytes(size: number) {
        const bytes = this.crypto.randomBytes(32);
        return bytes;
    }
}


export const $crypto: ICrypto = typeof crypto === "undefined"
    ? new WebCrypto()
    : new WebCryptoPolyfill()
    ;
