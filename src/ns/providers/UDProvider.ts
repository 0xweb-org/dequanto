
import di from 'a-di';
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client';
import { ContractReader } from '@dequanto/contracts/ContractReader';
import { TAddress } from '@dequanto/models/TAddress';
import { TBufferLike } from '@dequanto/models/TBufferLike';
import { $config } from '@dequanto/utils/$config';
import { $require } from '@dequanto/utils/$require';
import { INsProvider } from './INsProvider';
import { $ns } from '../utils/$ns';

export class UDProvider implements INsProvider {

    constructor (public client = di.resolve(EthWeb3Client)) {

    }


    supports (domain: string) {
        return /\.(x|crypto|coin|wallet|bitcoin|888|nft|dao|zil|blockchain)([/|?]|$)/.test(domain);
    }

    async getAddress(domain: string): Promise<TAddress> {
        let hash = $ns.namehash(domain);
        let resolverAddr = await this.getResolverAddress(hash);
        let address = await this.getData(hash, resolverAddr);
        return address;
    }

    async getContent(uri: string): Promise<string> {
        let root = $ns.getRoot(uri);
        let path = $ns.getPath(uri);
        let hash = $ns.namehash(root);
        let resolverAddr = await this.getResolverAddress(hash);
        let x = await this.getData(hash, resolverAddr, path);
        return x;
    }

    private async getData (hash: TBufferLike, resolverAddr: TAddress, key: string = 'crypto.ETH.address') {
        let reader = new ContractReader(this.client);
        let data = await reader.readAsync(
            resolverAddr,
            `getData(string[] keys, uint256 tokenId):(address,address,string[])`,
            [ key ],
            hash
        );
        let info = data[2];
        return info[0];
    }
    private async getResolverAddress (hash: TBufferLike): Promise<TAddress> {
        let platform = this.client.platform;
        let registryAddr = $config.get(`ns.ud.${platform}.registry`);
        $require.Address(registryAddr);
        return registryAddr;
    }
}
