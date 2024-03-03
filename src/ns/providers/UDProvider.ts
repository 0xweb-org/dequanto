
import di from 'a-di';
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client';
import { ContractReader } from '@dequanto/contracts/ContractReader';
import { TAddress } from '@dequanto/models/TAddress';
import { TBufferLike } from '@dequanto/models/TBufferLike';
import { $config } from '@dequanto/utils/$config';
import { $require } from '@dequanto/utils/$require';
import { INsProvider } from './INsProvider';
import { $ns } from '../utils/$ns';
import { TPlatform } from '@dequanto/models/TPlatform';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { ANsProvider } from './ANsProvider';

export class UDProvider extends ANsProvider {

    constructor (client: Web3Client) {
        super(client);
        this.configKey = 'ud';
    }

    supports (domain: string) {
        return /\.(x|crypto|coin|wallet|bitcoin|888|nft|dao|zil|blockchain)([/|?]|$)/.test(domain);
    }

    protected async getAddressInner(client: Web3Client, domain: string): Promise<{ platform: TPlatform, address: TAddress }> {
        let hash = $ns.namehash(domain);
        let resolverAddr = await this.getNsAddress(client.network, 'registry');
        let address = await this.getData(client, hash, resolverAddr);
        return {
            platform: client.network,
            address
        };
    }

    protected async getContentInner(client: Web3Client, uri: string): Promise<{ platform: TPlatform, value: string }> {
        let root = $ns.getRoot(uri);
        let path = $ns.getPath(uri);
        let hash = $ns.namehash(root);
        let registryAddr = await this.getNsAddress(client.network, 'registry');
        let x = await this.getData(client, hash, registryAddr, path);
        return {
            platform: client.network,
            value: x
        };
    }

    protected async getReversedInner(client: Web3Client, address: TAddress): Promise<{ platform: TPlatform, name: string }> {
        let resolverAddr = await this.getNsAddress(client.network, 'resolver');
        let reader = new ContractReader(client);
        let name = await reader.readAsync(
            resolverAddr,
            `reverseNameOf(address address): string`,
            address
        );
        return {
            platform: client.network,
            name: name
        };
    }

    private async getData (client: Web3Client, hash: TBufferLike, registryAddr: TAddress, key: string = 'crypto.ETH.address') {
        let reader = new ContractReader(client);
        let data = await reader.readAsync(
            registryAddr,
            `getData(string[] keys, uint256 tokenId):(address,address,string[])`,
            [ key ],
            hash
        );
        if (data == null || data.length === 0) {
            return null;
        }
        let info = data[2];
        return info?.[0];
    }
}
