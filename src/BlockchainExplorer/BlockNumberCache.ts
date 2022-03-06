import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { JsonArrayStore } from '@dequanto/json/JsonArrayStore';
import { TAddress } from '@dequanto/models/TAddress';
import { TPlatform } from '@dequanto/models/TPlatform';
import memd from 'memd';


interface IBlockNumberCache {
    address: TAddress
    blockNumber: number
}

export class BlockNumberCache {
    store: JsonArrayStore<IBlockNumberCache>;


    constructor (public platform: TPlatform, public name: string) {

        this.store = new JsonArrayStore<IBlockNumberCache>({
            path: `/cache/${platform}/blockNumber-${name}.json`,
            key: x => x.address
        });
    }

    async getCached (address: TAddress) {
        let entry = await this.store.getSingle(address);
        return entry ?? {
            address: address,
            blockNumber: null,
        };
    }

    async saveCached (cache: IBlockNumberCache) {
        await this.store.upsert(cache);
    }

    async updateCache (cache: IBlockNumberCache) {
        let client = Web3ClientFactory.get(this.platform);
        let toleranz = 5;

        let number = await client.getBlockNumberCached() - toleranz;

        cache.blockNumber = Math.max(number, cache.blockNumber);
        await this.store.upsert(cache);
    }
}
