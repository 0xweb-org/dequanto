import { $contract } from './$contract';
import { $hex } from './$hex';

export namespace $bloom {
    export function check (bloomHex: string, hex: string) {

        let masks = LogsBloom.getBits(hex);
        let matched = masks.every((byte, i) => {
            let b = $hex.getNumber(bloomHex, byte.index);
            let has = (b | byte.mask) === b;
            return has;
        });
        return matched;
    }
}


namespace LogsBloom {

    export function getBits (topicHash: string) {
        let hashBuf = getHashBuf(topicHash);

        let byte1Mask = 1 << ($hex.getNumber(hashBuf, 1) & 0x7);
        let byte2Mask = 1 << ($hex.getNumber(hashBuf, 3) & 0x7);
        let byte3Mask = 1 << ($hex.getNumber(hashBuf, 5) & 0x7);

        const bloomLength = 256;
        let byte1Pos = bloomLength - (($hex.getNumber(hashBuf, 0, 2) & 0x7FF) >> 3) - 1;
        let byte2Pos = bloomLength - (($hex.getNumber(hashBuf, 2, 2) & 0x7FF) >> 3) - 1;
        let byte3Pos = bloomLength - (($hex.getNumber(hashBuf, 4, 2) & 0x7FF) >> 3) - 1;

        return [
            { index: byte1Pos, mask: byte1Mask },
            { index: byte2Pos, mask: byte2Mask },
            { index: byte3Pos, mask: byte3Mask },
        ]
    }

    export function getHashBuf (topicHash: string) {
        let hash = $contract.keccak256($hex.ensure(topicHash));
        return hash;
    }
}
