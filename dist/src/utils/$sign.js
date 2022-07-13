"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$sign = void 0;
const _buffer_1 = require("./$buffer");
const _is_1 = require("./$is");
var $sign;
(function ($sign) {
    /** Adds  "Ethereum Signed Message" */
    async function signEIPHashed(client, message, account, accountPss) {
        const web3 = await client.getWeb3();
        //const buffer = toBuffer(message);
        //const hash = hashPersonalMessage(buffer as Buffer);
        const str = message;
        const key = account.key != null
            ? account.key
            : null;
        if (key != null) {
            let sig = web3.eth.accounts.sign(str, key);
            let r = sig.r.substring(2);
            let s = sig.s.substring(2);
            let v = sig.v.substring(2);
            return toSignature({ r, s, v });
        }
        else {
            let signature = accountPss == null
                ? await web3.eth.sign(message.toString(), account.address)
                : await web3.eth.personal.sign(message.toString(), account.address, accountPss);
            return toSignature(splitSignature(signature));
        }
    }
    $sign.signEIPHashed = signEIPHashed;
    function splitSignature(signature) {
        let r = signature.substring(2, 2 + 64);
        let s = signature.substring(2 + 64, 2 + 64 + 64);
        let v = signature.substring(2 + 64 + 64);
        return { r, s, v };
    }
    function toSignature(sign) {
        let { r, s, v } = sign;
        return {
            v: `0x${v}`,
            r: `0x${r}`,
            s: `0x${s}`,
            signature: `0x${r}${s}${v}`,
            signatureVRS: `0x${v}${r}${s}`
        };
    }
    function toBuffer(message, opts) {
        if (typeof message === 'string') {
            let encoding = opts?.encoding;
            if (encoding == null && _is_1.$is.hexString(message)) {
                encoding = 'hex';
                message = message.substring(2);
            }
            if (encoding === 'hex') {
                return _buffer_1.$buffer.fromHex(message);
            }
            return _buffer_1.$buffer.fromString(message, opts?.encoding ?? 'utf8');
        }
        return message;
    }
})($sign = exports.$sign || (exports.$sign = {}));
