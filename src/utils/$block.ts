import { BlockTransactionBase } from 'web3-eth'

export namespace $block {
    export function getDate(block: { timestamp: string | number }) {
        return new Date(Number(block.timestamp) * 1000);
    }
}
