import { hashPersonalMessage, ecsign } from 'ethereumjs-util';
import { $buffer } from './$buffer';
import { $is } from './$is';

export namespace $signRaw {
    export function signEC (message: string | Buffer, privateKey: string | Buffer) {
        const sig = ecsign(
            toBuffer(message) as Buffer,
            toBuffer(privateKey, { encoding: 'hex' }) as Buffer
        );

        let r = sig.r.toString('hex').padStart(64, '0')
        let s = sig.s.toString('hex').padStart(64, '0');
        let v = sig.v.toString(16);

        return {
            v: `0x${v}`,
            r: `0x${r}`,
            s: `0x${s}`,
            signature: `0x${r}${s}${v}`,
            signatureVRS: `0x${v}${r}${s}`
        }
    }
    export function signEIPHashed (message: string | Buffer, privateKey: string) {
        const buffer = toBuffer(message);
        const hash = hashPersonalMessage(buffer as Buffer);
        return signEC(hash, privateKey);
    }

    function toBuffer (message: string | Buffer, opts?: { encoding?: 'utf8' | 'hex' }) {
        if (typeof message === 'string') {
            let encoding = opts?.encoding;
            if (encoding == null && $is.hexString(message)) {
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
