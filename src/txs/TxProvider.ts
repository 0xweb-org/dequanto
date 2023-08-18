import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TAddress } from '@dequanto/models/TAddress';
import { $platform } from '@dequanto/utils/$platform';
import di from 'a-di';
import memd from 'memd';

export class TxProvider {

    cache: InstanceType<typeof memd.Cache>

    constructor (public client: Web3Client = di.resolve(EthWeb3Client)) {
        let platform = this.client.platform
        this.cache = CacheProvider.create(`./cache/${ $platform.toPath(platform)  }/txs.json`);
    }


    async loadTransaction (txHash: TAddress) {
        let tx = await this.client.getTransaction(txHash);
        return tx;
    }

    @memd.deco.memoize()
    async loadTransactionCached (txHash: TAddress) {
        return this.fromCache(`tx.${txHash}`, () => this.loadTransaction(txHash));
    }

    async loadTransactionReceipt (txHash: TAddress) {
        let receipt = await this.client.getTransactionReceipt(txHash);
        return receipt;
    }
    @memd.deco.memoize()
    async loadTransactionReceiptCached (txHash: TAddress) {
        return this.fromCache(`receipt.${txHash}`, () => this.loadTransactionReceipt(txHash));
    }

    private async loadBlock (blockNumber: number) {
        let block = await this.client.getBlock(blockNumber);
        return block;
    }
    @memd.deco.memoize()
    async loadBlockCached (blockNumber: number) {
        return this.fromCache(`block.${blockNumber}`, () => this.loadBlock(blockNumber));
    }


    private async fromCache<T>(key: string, fn: () => Promise<T>): Promise<T> {
        let cached = await this.cache.getAsync(key);
        if (cached) {
            return cached as T;
        }

        let val = await fn();
        await this.cache.setAsync(key, val);
        return val;
    }
}

class CacheProvider {


    @memd.deco.memoize()
    static create (path) {
        let cache = new memd.Cache({
            persistance: new memd.FsTransport({ path }),
            trackRef: true
        });
        return cache;
    }
}
