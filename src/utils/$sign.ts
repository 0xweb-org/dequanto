import { hashPersonalMessage, ecsign } from 'ethereumjs-util';

export namespace $sign {
    export function signEC (message: string | Buffer, privateKey: string | Buffer) {
        const sig = ecsign(
            toBuffer(message),
            toBuffer(privateKey, { encoding: 'hex' })
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
        const hash = hashPersonalMessage(toBuffer(message, { encoding: 'utf8' }));
        return signEC(hash, privateKey);
    }

    function toBuffer (message: string | Buffer, opts?: { encoding?: 'utf8' | 'hex' }) {
        if (typeof message === 'string') {
            if (/^0x[\da-f]+$/i.test(message)) {
                return Buffer.from(message.substring(2), 'hex');
            }
            return Buffer.from(message, opts?.encoding ?? 'utf8');
        }
        return message;
    }
}
