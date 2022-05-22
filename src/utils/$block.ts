import di from 'a-di';
import { BlockDateResolver } from '@dequanto/blocks/BlockDateResolver';
import type { Web3Client } from '@dequanto/clients/Web3Client';

export namespace $block {
    export function getDate(block: { timestamp: string | number }) {
        return new Date(Number(block.timestamp) * 1000);
    }

    export async function ensureNumber(mix: number | Date, client: Web3Client): Promise<number> {
        if (typeof mix === 'number') {
            return mix;
        }
        if (mix instanceof Date) {
            let dateResolver = di.resolve(BlockDateResolver, client)
            return await dateResolver.getBlockNumberFor(mix);
        }
        throw new Error(`Invalid getBlockNumber param: ${mix}`);
    }
}
