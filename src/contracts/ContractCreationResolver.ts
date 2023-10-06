import memd from 'memd';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { $block } from '@dequanto/utils/$block';
import { $cache } from '@dequanto/utils/$cache';
import { TPlatform } from '@dequanto/models/TPlatform';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { BlockChainExplorerProvider } from '@dequanto/BlockchainExplorer/BlockChainExplorerProvider';
import { $require } from '@dequanto/utils/$require';
import { $promise } from '@dequanto/utils/$promise';
import { TEth } from '@dequanto/models/TEth';

export class ContractCreationResolver {

    constructor (public client: Web3Client, public explorer: IBlockChainExplorer) {
        $require.notNull(client, 'Web3Client is undefined');
        $require.notNull(explorer, 'Explorer is undefined');
    }

    static get (platform: TPlatform) {
        let client = Web3ClientFactory.get(platform);
        let explorer = BlockChainExplorerProvider.get(platform);
        return new ContractCreationResolver(client, explorer);
    }

    @memd.deco.memoize({
        trackRef: true,
        key: (ctx, address: TEth.Address) => {
            let self = ctx.this as ContractCreationResolver;
            let key = `${self.client.platform}:${address}`;
            return key;
        },
        persistance: new memd.FsTransport({ path:  $cache.file('contract-dates.json') })
    })
    async getInfo (address: TEth.Address): Promise<{
        block: number
        timestamp: number
        tx: string
    }> {
        let resolver = new BlockchainExplorerDateResolver(this.client, this.explorer);
        return resolver.get(address);
    }
}


class OnchainDateResolver {

    private from: number;
    private to: number;

    constructor(public client: Web3Client) {
        throw new Error(`Not implemented`);
    }

    async get (address: TEth.Address) {
        this.to = await this.client.getBlockNumberCached();
        this.from = 0;
    }
}

class BlockchainExplorerDateResolver {
    constructor (public client: Web3Client, public explorer: IBlockChainExplorer) {

    }

    async get (address: TEth.Address) {
        let { result: info, error } = await $promise.caught(this.explorer.getContractCreation(address));
        if (error) {
            if (/empty/i.test(error.message)) {
                let code = await this.client.getCode(address);
                if (code == null) {
                    throw new Error(`${this.client.platform}:${address} is not a contract`);
                }
            }
            throw error;
        }
        let tx = await this.client.getTransaction(info.txHash);
        let block = await this.client.getBlock(tx.blockNumber);
        return {
            tx: tx.hash,
            block: tx.blockNumber,
            timestamp: $block.getDate(block).valueOf()
        };
    }
}
