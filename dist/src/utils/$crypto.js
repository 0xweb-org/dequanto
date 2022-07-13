"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$crypto = void 0;
class WebCrypto {
    constructor() {
        this.crypto = crypto;
    }
    randomBytes(size) {
        let array = new Uint8Array(size);
        let rnd = this.crypto.getRandomValues(array);
        return rnd;
    }
}
class WebCryptoPolyfill {
    constructor() {
        this.crypto = require('crypto');
    }
    randomBytes(size) {
        const bytes = this.crypto.randomBytes(size);
        return bytes;
    }
}
exports.$crypto = typeof crypto === "undefined"
    ? new WebCryptoPolyfill()
    : new WebCrypto();
