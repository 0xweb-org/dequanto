import { TEth } from '@dequanto/models/TEth';
import { $buffer } from './$buffer';
import { $require } from './$require';
import { $is } from './$is';

interface ICrypto {
    randomBytes(size: number): Uint8Array;
    createECDH(curve: string)

    sha256 (mix: string | TEth.Hex | Uint8Array): Promise<Uint8Array>;

    encrypt(buffer: string | TEth.Hex | Uint8Array, opts: IEncryptionParams & { encoding?: undefined | 'binary' }): Promise<Uint8Array>
    encrypt(buffer: string | TEth.Hex | Uint8Array, opts: IEncryptionParams & { encoding: 'hex' }): Promise<TEth.Hex>
    encrypt(buffer: string | TEth.Hex | Uint8Array, opts: IEncryptionParams & { encoding: 'utf8' }): Promise<string>

    decrypt(buffer: TEth.Hex | Uint8Array, opts: IEncryptionParams & { encoding?: undefined | 'binary' }): Promise<Uint8Array>
    decrypt(buffer: TEth.Hex | Uint8Array, opts: IEncryptionParams & { encoding: 'hex' }): Promise<TEth.Hex>
    decrypt(buffer: TEth.Hex | Uint8Array, opts: IEncryptionParams & { encoding: 'utf8' }): Promise<string>
}

interface IEncryptionParams {
    secret: string | Uint8Array
    encoding?: 'binary' | 'hex' | 'utf8'
}

const CIPHER_ALGO = 'aes-256-ctr';

abstract class CryptoBase implements ICrypto {
    abstract randomBytes(size: number): Uint8Array;
    abstract createECDH(curve: string)

    sha256 (mix: string | TEth.Hex | Uint8Array, opts?: { encoding?: undefined | 'binary' }): Promise<Uint8Array>
    sha256 (mix: string | TEth.Hex | Uint8Array, opts?: { encoding: 'hex' }): Promise<TEth.Hex>
    async sha256 (mix: string | TEth.Hex | Uint8Array, opts?: { encoding?: 'hex' | 'binary' }) {
        const buffer = utils.toBuffer(mix);
        const hash = await this.sha256Inner(buffer);
        if (opts?.encoding === 'hex') {
            return $buffer.toHex(hash);
        }
        return hash;
    }

    encrypt(mix: string | TEth.Hex | Uint8Array, opts: IEncryptionParams & { encoding?: undefined | 'binary' }): Promise<Uint8Array>
    encrypt(mix: string | TEth.Hex | Uint8Array, opts: IEncryptionParams & { encoding: 'hex' }): Promise<TEth.Hex>
    encrypt(mix: string | TEth.Hex | Uint8Array, opts: IEncryptionParams & { encoding: 'utf8' }): Promise<string>
    async encrypt(mix: string | TEth.Hex | Uint8Array, opts: IEncryptionParams) {
        const buffer = utils.toBuffer(mix);
        $require.gt(buffer.length, 0, `Buffer to encrypt must be a non-empty`);
        const secret = opts.secret;
        $require.gt(secret.length, 0, `Secret must be a non-empty`);
        const bufferSecret = await this.prepareSecret(secret);

        let encrypted = await this.encryptInner(buffer, bufferSecret);
        switch (opts.encoding) {
            case 'hex':
                return $buffer.toHex(encrypted);
            case 'utf8':
                return $buffer.toString(encrypted);
            default:
                return encrypted;
        }
    }

    decrypt(buffer: TEth.Hex | Uint8Array, opts: IEncryptionParams & { encoding?: undefined | 'binary' }): Promise<Uint8Array>
    decrypt(buffer: TEth.Hex | Uint8Array, opts: IEncryptionParams & { encoding: 'hex' }): Promise<TEth.Hex>
    decrypt(buffer: TEth.Hex | Uint8Array, opts: IEncryptionParams & { encoding: 'utf8' }): Promise<string>
    async decrypt(mix: TEth.Hex | Uint8Array, opts: IEncryptionParams) {
        const buffer = $buffer.ensure(mix);
        $require.gt(buffer?.length, 0, `Buffer to decrypt must be a non-empty`);
        const secret = opts.secret;
        $require.gt(secret.length, 0, `Secret must be a non-empty`);
        const bufferSecret = await this.prepareSecret(secret);

        let decrypted = await this.decryptInner(buffer, bufferSecret);
        switch (opts.encoding) {
            case 'hex':
                return $buffer.toHex(decrypted);
            case 'utf8':
                return $buffer.toString(decrypted, 'utf8');
            default:
                return decrypted;
        }
    }

    protected abstract encryptInner (buffer: Uint8Array, secret: Uint8Array): Promise<Uint8Array>;
    protected abstract decryptInner (buffer: Uint8Array, secret: Uint8Array): Promise<Uint8Array>;
    protected abstract sha256Inner (buffer: Uint8Array): Promise<Uint8Array>;

    private async prepareSecret (secret: string | TEth.Hex | Uint8Array): Promise<Uint8Array> {
        if (typeof secret === 'string' && $is.HexBytes32(secret) === false) {
            let buffer = $buffer.fromString(secret);
            return await this.sha256Inner(buffer);
        }
        return $buffer.ensure(secret);
    }
}

namespace WebCryptoImpl {
    export class CryptoWeb extends CryptoBase {
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
        async encryptInner(buffer: Uint8Array, secret: Uint8Array): Promise<Uint8Array> {
            const key = await this._getEncryptionKey(secret);
            const iv = this.randomBytes(16);
            const cipherText = await this.crypto.subtle.encrypt(
                {
                    name: 'AES-GCM',
                    iv,
                },
                key,
                buffer
            );
            const encrypted = $buffer.concat([iv, new Uint8Array(cipherText)]);
            return encrypted;
        }
        async decryptInner(buffer: Uint8Array, secret: Uint8Array): Promise<Uint8Array> {

            const key = await this._getEncryptionKey(secret);
            const iv = buffer.slice(0, 16);
            const encrypted = buffer.slice(16);

            const output = await crypto.subtle.decrypt(
                {
                  name: 'AES-GCM',
                  iv: iv,
                },
                key,
                encrypted
              );
            return new Uint8Array(output);
        }
        private async _getEncryptionKey(secret: Uint8Array): Promise<CryptoKey> {

            const secretKey = await this.crypto.subtle.importKey('raw', secret, {
                name: 'AES-GCM',
                length: 256,
            },
                true,
                ['encrypt', 'decrypt']
            );
            return secretKey;
        }
        protected async sha256Inner(buffer: Uint8Array): Promise<Uint8Array> {
            const arrayBuffer = await crypto.subtle.digest('SHA-256', buffer);
            return new Uint8Array(arrayBuffer);
        }
    }
}

namespace NodeCryptoImpl {
    export class CryptoNode extends CryptoBase {
        crypto = require('crypto');

        randomBytes(size: number) {
            const bytes = this.crypto.randomBytes(size);
            return bytes;
        }
        createECDH(curve: string) {
            return this.crypto.createECDH(curve);
        }

        protected async encryptInner(buffer: Uint8Array, secret: Uint8Array): Promise<Uint8Array> {
            $require.gt(buffer.length, 0, `Buffer to encrypt must be a non-empty`);

            const key = secret;
            const iv = this.crypto.randomBytes(16);
            const cipher = this.crypto.createCipheriv(CIPHER_ALGO, key, iv);

            const cipherText = cipher.update(buffer);
            const encrypted = $buffer.concat([iv, cipherText, cipher.final()]);
            return encrypted;
        }
        protected async decryptInner(buffer: Uint8Array, secret: Uint8Array): Promise<Uint8Array> {
            const key = secret;
            const iv = buffer.slice(0, 16);
            const decipher = this.crypto.createDecipheriv(CIPHER_ALGO, key, iv);
            const cipherBuf = buffer.slice(16);
            const output = $buffer.concat([decipher.update(cipherBuf), decipher.final()]);
            return output;
        }

        protected async sha256Inner(buffer: Uint8Array): Promise<Uint8Array> {
            return this.crypto.createHash('sha256').update(buffer).digest()
        }
    }
}

export const $crypto: ICrypto = typeof crypto === "undefined"
    ? new NodeCryptoImpl.CryptoNode()
    : new WebCryptoImpl.CryptoWeb()
    ;

export const $cryptoImpl = {
    Web: WebCryptoImpl.CryptoWeb,
    Node: NodeCryptoImpl.CryptoNode,
};


namespace utils {
    export function toBuffer (mix: string | TEth.Hex | Uint8Array) {
        if (typeof mix === 'string' && $is.HexBytes32(mix) === false) {
            return $buffer.fromString(mix);
        }
        return $buffer.ensure(mix);
    }
}
