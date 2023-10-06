import { secp256k1 } from '@noble/curves/secp256k1'
import { TEth } from '@dequanto/models/TEth';
import { $buffer } from './$buffer';
import { $contract } from './$contract';
import { $is } from './$is';
import { $hex } from './$hex';
import { $address } from './$address';

export namespace $signRawNative {
    export function signEC (message: string | Uint8Array, privateKey: string | Uint8Array, chainId?: number) {
        const sig = secp256k1.sign(
            toUint8Array(message) as Uint8Array,
            toUint8Array(privateKey, { encoding: 'hex' }) as Uint8Array
        );

        let r = sig.r.toString(16).padStart(64, '0');
        let s = sig.s.toString(16).padStart(64, '0');
        // https://eips.ethereum.org/EIPS/eip-155
        let v = (chainId != null
            ? sig.recovery + chainId * 2 + 35
            : sig.recovery + 27
        ).toString(16);

        return {
            v: `0x${v}`,
            r: `0x${r}`,
            s: `0x${s}`,
            signature: `0x${r}${s}${v}`,
            signatureVRS: `0x${v}${r}${s}`
        }
    }
    export function signEIPHashed (message: string | Uint8Array, privateKey: string) {
        const buffer = toUint8Array(message);
        const hash = hashPersonalMessage(buffer);
        return signEC(hash, privateKey);
    }

    export function ecrecover (digest: TEth.Hex | Uint8Array, signature: TEth.Hex | { v, r, s }): TEth.Address {
        return recoverAddress(digest, signature);
    }
    export function eipRecover (message: string | Uint8Array, signature: TEth.Hex | { v, r, s }): TEth.Address {
        const buffer = toUint8Array(message);
        const hash = hashPersonalMessage(buffer);
        return recoverAddress(hash, signature);
    }

    export function recoverAddress (digest: TEth.Hex | Uint8Array, signature: TEth.Hex | { v, r, s }): Promise<TEth.Address> {
        const publicKey = recoverPubKey(digest, signature);
        const address = $contract.keccak256(`0x${publicKey.substring(4)}`).slice(-40)
        return $address.toChecksum(`0x${address}`);
    }
    export function recoverPubKey (digest: TEth.Hex | Uint8Array, signature: TEth.Hex | { v, r, s }) {
        let { v, r, s } = $is.Hex(signature)
            ? splitSignature(signature)
            : signature;

        let vNum = Number(v);
        let recovery: 0 | 1;
        if (vNum === 0 || vNum === 1) {
            recovery = vNum;
        } else if (vNum === 27 || vNum === 28) {
            recovery = (vNum - 27) as 0 | 1;
        } else if (vNum > 35) {
            vNum -= 35;
            recovery = vNum % 2 === 0 ? 0 : 1;
        }
        r = r.substring(2);
        s = s.substring(2);

        const publicKey = secp256k1.Signature.fromCompact(`${r}${s}`)
            .addRecoveryBit(recovery)
            .recoverPublicKey($hex.raw($hex.ensure(digest)))
            .toHex(false);
          return `0x${publicKey}`
    }

    function splitSignature (signature: TEth.Hex): { v, r, s} {
        let r = signature.substring(2, 2 + 64);
        let s = signature.substring(2 + 64, 2 + 64 + 64);
        let v = signature.substring(2 + 64 + 64);
        return { r, s ,v };
    }

    function hashPersonalMessage (buffer: Uint8Array) {
        const prefix = $buffer.fromString(`\u0019Ethereum Signed Message:\n${buffer.length}`, 'utf-8')
        return $contract.keccak256($buffer.concat([prefix, buffer]))
    }

    function toUint8Array (message: string | Uint8Array, opts?: { encoding?: 'utf8' | 'hex' }): Uint8Array {
        if (typeof message === 'string') {
            let encoding = opts?.encoding;
            if (encoding == null && $is.Hex(message)) {
                encoding = 'hex';
                message = message.substring(2);
            }
            if (encoding === 'hex') {
                return $buffer.fromHex(message);
            }
            return $buffer.fromString(message, opts?.encoding ?? 'utf8');
        }
        return message;
    }
}
