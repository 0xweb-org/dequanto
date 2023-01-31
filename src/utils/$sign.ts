import { Web3Client } from '@dequanto/clients/Web3Client';
import { ChainAccount } from '@dequanto/models/TAccount';
import { $buffer, TBytes } from './$buffer';
import { $is } from './$is';
import type { TransactionConfig } from 'web3-core';
import { ethers } from 'ethers';

export namespace $sign {
    export type TSignature = {
        v: string
        r: string
        s: string
        signature?: string
        signatureVRS?: string
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
        }

        let signature =  accountPss == null
            ? await web3.eth.sign(message.toString(), account.address)
            : await web3.eth.personal.sign(message.toString(), account.address, accountPss);

        return toSignature(splitSignature(signature));

    }

    export async function signTx (client: Web3Client, tx: TransactionConfig, account: ChainAccount, accountPss?: string): Promise<ReturnType<typeof splitSignature>> {
        const web3 = await client.getWeb3();
        const key = account.key != null
            ? account.key
            : null;

        if (key != null) {
            if (typeof tx.chainId === 'string') {
                // chainIDBN in @ethereumjs supports HEX only if base is specified, otherwise 10 base is taken, and hex numbers are wrongly parsed to a number
                tx.chainId = Number(tx.chainId);
            }
            let sig = await web3.eth.accounts.signTransaction(tx, key);
            return toSignature(sig);
        }

        let signed =  accountPss == null
            ? await web3.eth.signTransaction(tx)
            : await web3.eth.personal.signTransaction(tx, accountPss);

        return toSignature(signed.tx);
    }

    export async function serializeTx (tx, signature: string | TSignature): Promise<string> {
        let sig = getSignature(signature);
        if (Number(sig.v) === 0) {
            // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md
            sig.v = '0x25';
        }
        return ethers.utils.serializeTransaction(tx, {
            ...sig,
            v: Number(sig.v)
        });
    }
    export async function recoverTx(client: Web3Client, tx: TransactionConfig, signature: string | TSignature) {
        const web3 = await client.getWeb3();
        const sig = getSignature(signature);
        const rawTransaction = await serializeTx(tx, sig);
        return web3.eth.accounts.recoverTransaction(rawTransaction);
    }

    function splitSignature (signature: string): TSignature {
        let r = signature.substring(2, 2 + 64);
        let s = signature.substring(2 + 64, 2 + 64 + 64);
        let v = signature.substring(2 + 64 + 64);
        return { r, s ,v };
    }
    function toSignature (sign: { r, s, v }) {
        let { r, s, v } = sign;
        r = remove0x(r);
        s = remove0x(s);
        if (typeof v === 'number') {
            v = v.toString(16);
        }
        v = remove0x(v);
        return {
            v: `0x${v}`,
            r: `0x${r}`,
            s: `0x${s}`,
            signature: `0x${r}${s}${v}`,
            signatureVRS: `0x${v}${r}${s}`
        }
    }
    function remove0x(hex:string) {
        return hex.startsWith('0x') ? hex.substring(2) : hex;
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


    function getSignature(signature: string | TSignature): TSignature {
        let sig = typeof signature === 'string'
                ? splitSignature(signature)
                : signature;

        if (sig?.r == null || sig?.v == null || sig?.s == null) {
            throw new Error(`Invalid signature ${JSON.stringify(sig)}`);
        }
        return sig;
    }
}
