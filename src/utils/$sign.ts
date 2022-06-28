import { Web3Client } from '@dequanto/clients/Web3Client';
import { ChainAccount } from '@dequanto/models/TAccount';
import { hashPersonalMessage, ecsign } from 'ethereumjs-util';
import { $buffer, TBytes } from './$buffer';
import { $is } from './$is';


export namespace $sign {
    export type TSignature = {
        v: string
        r: string
        s: string
        signature: string
        signatureVRS: string
    };

    /** Adds  "Ethereum Signed Message" */
    export async function signEIPHashed (client: Web3Client, message: string, account: ChainAccount, accountPss?: string): Promise<TSignature> {
        const web3 = await client.getWeb3();
        //const buffer = toBuffer(message);
        //const hash = hashPersonalMessage(buffer as Buffer);
        const str = message;
        const key = account.key != null
            ? account.key
            : null;

        if (key != null) {

            let sig = web3.eth.accounts.sign(str, key);
            let r = sig.r.substring(2)
            let s = sig.s.substring(2)
            let v = sig.v.substring(2);

            return toSignature({ r, s, v });

        } else {
            let signature =  accountPss == null
                ? await web3.eth.sign(message.toString(), account.address)
                : await web3.eth.personal.sign(message.toString(), account.address, accountPss);

            return toSignature(splitSignature(signature));
        }
    }

    function splitSignature (signature: string): { v, r, s } {
        let r = signature.substring(2, 2 + 64);
        let s = signature.substring(2 + 64, 2 + 64 + 64);
        let v = signature.substring(2 + 64 + 64);
        return { r, s ,v };
    }
    function toSignature (sign: { r, s, v }) {
        let { r, s, v } = sign;
        return {
            v: `0x${v}`,
            r: `0x${r}`,
            s: `0x${s}`,
            signature: `0x${r}${s}${v}`,
            signatureVRS: `0x${v}${r}${s}`
        }
    }

    function toBuffer (message: string | TBytes, opts?: { encoding?: 'utf8' | 'hex' }) {
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
