"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$signRaw = void 0;
const ethereumjs_util_1 = require("ethereumjs-util");
const _buffer_1 = require("./$buffer");
const _is_1 = require("./$is");
const ethers_1 = require("ethers");
var $signRaw;
(function ($signRaw) {
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
    $signRaw.signEC = signEC;
    function signEIPHashed(message, privateKey) {
        const buffer = toBuffer(message);
        const hash = (0, ethereumjs_util_1.hashPersonalMessage)(buffer);
        return signEC(hash, privateKey);
    }
    $signRaw.signEIPHashed = signEIPHashed;
    function ecrecover(message, signature) {
        return ethers_1.utils.recoverAddress(message, signature);
    }
    $signRaw.ecrecover = ecrecover;
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
})($signRaw = exports.$signRaw || (exports.$signRaw = {}));
