"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$sign = void 0;
const ethereumjs_util_1 = require("ethereumjs-util");
var $sign;
(function ($sign) {
    function signEC(message, privateKey) {
        const sig = (0, ethereumjs_util_1.ecsign)(toBuffer(message), toBuffer(privateKey, { encoding: 'hex' }));
        let r = sig.r.toString('hex').padStart(64, '0');
        let s = sig.s.toString('hex').padStart(64, '0');
        let v = sig.v.toString(16);
        return {
            v: `0x${v}`,
            r: `0x${r}`,
            s: `0x${s}`,
            signature: `0x${r}${s}${v}`,
            signatureVRS: `0x${v}${r}${s}`
        };
    }
    $sign.signEC = signEC;
    function signEIPHashed(message, privateKey) {
        const hash = (0, ethereumjs_util_1.hashPersonalMessage)(toBuffer(message, { encoding: 'utf8' }));
        return signEC(hash, privateKey);
    }
    $sign.signEIPHashed = signEIPHashed;
    function toBuffer(message, opts) {
        if (typeof message === 'string') {
            if (/^0x[\da-f]+$/i.test(message)) {
                return Buffer.from(message.substring(2), 'hex');
            }
            return Buffer.from(message, opts?.encoding ?? 'utf8');
        }
        return message;
    }
})($sign = exports.$sign || (exports.$sign = {}));
