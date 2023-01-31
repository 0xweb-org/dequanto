"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$bloom = void 0;
const _contract_1 = require("./$contract");
const _hex_1 = require("./$hex");
var $bloom;
(function ($bloom) {
    function check(bloomHex, hex) {
        let masks = LogsBloom.getBits(hex);
        let matched = masks.every((byte, i) => {
            let b = _hex_1.$hex.getNumber(bloomHex, byte.index);
            let has = (b | byte.mask) === b;
            return has;
        });
        return matched;
    }
    $bloom.check = check;
})($bloom = exports.$bloom || (exports.$bloom = {}));
var LogsBloom;
(function (LogsBloom) {
    function getBits(topicHash) {
        let hashBuf = getHashBuf(topicHash);
        let byte1Mask = 1 << (_hex_1.$hex.getNumber(hashBuf, 1) & 0x7);
        let byte2Mask = 1 << (_hex_1.$hex.getNumber(hashBuf, 3) & 0x7);
        let byte3Mask = 1 << (_hex_1.$hex.getNumber(hashBuf, 5) & 0x7);
        const bloomLength = 256;
        let byte1Pos = bloomLength - ((_hex_1.$hex.getNumber(hashBuf, 0, 2) & 0x7FF) >> 3) - 1;
        let byte2Pos = bloomLength - ((_hex_1.$hex.getNumber(hashBuf, 2, 2) & 0x7FF) >> 3) - 1;
        let byte3Pos = bloomLength - ((_hex_1.$hex.getNumber(hashBuf, 4, 2) & 0x7FF) >> 3) - 1;
        return [
            { index: byte1Pos, mask: byte1Mask },
            { index: byte2Pos, mask: byte2Mask },
            { index: byte3Pos, mask: byte3Mask },
        ];
    }
    LogsBloom.getBits = getBits;
    function getHashBuf(topicHash) {
        let hash = _contract_1.$contract.keccak256(_hex_1.$hex.ensure(topicHash));
        return hash;
    }
    LogsBloom.getHashBuf = getHashBuf;
})(LogsBloom || (LogsBloom = {}));
