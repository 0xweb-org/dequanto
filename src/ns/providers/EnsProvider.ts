
import di from 'a-di';
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client';
import { TAddress } from '@dequanto/models/TAddress';
import { TBufferLike } from '@dequanto/models/TBufferLike';
import { $config } from '@dequanto/utils/$config';
import { $require } from '@dequanto/utils/$require';
import { INsProvider } from './INsProvider';
import { $ns } from '../utils/$ns';
import type { EnsPublicResolver } from '@dequanto-contracts/ens/EnsPublicResolver/EnsPublicResolver';
import type { EnsRegistry } from '@dequanto-contracts/ens/EnsRegistry/EnsRegistry';
import { $is } from '@dequanto/utils/$is';
import { TEth } from '@dequanto/models/TEth';
import { $base } from '@dequanto/utils/$base';
import { ContractClassFactory } from '@dequanto/contracts/ContractClassFactory';


export class EnsProvider implements INsProvider {

    protected configField: string

    constructor(public client = di.resolve(EthWeb3Client)) {
        this.configField = 'ens';
    }

    supports(domain: string) {
        return /\.eth([/|?]|$)/.test(domain);
    }

    async getAddress(domain: string): Promise<TAddress> {
        let hash = $ns.namehash(domain);
        let resolver = await this.getResolver(hash);
        let address = await resolver.addr(hash);
        return address;
    }

    /** Gets contentHash if root, or the record from path: foo.eth/FOO_RECORD */
    async getContent(uri: string): Promise<string> {
        let domain = $ns.getRoot(uri);
        let node = $ns.namehash(domain);
        let resolver = await this.getResolver(node);

        let key = $ns.getPath(uri);
        if ($is.empty(key)) {
            let data = await resolver.contenthash(node) as TEth.Hex;
            if ($is.empty(data)) {
                return '';
            }
            return this.decodeContentHash(data);
        }
        return await resolver.text(node, key);
    }

    private decodeContentHash(hex: TEth.Hex) {
        const ipfsMatch = /^0x(?<protocol>e3010170|e5010172)(?<hex>[0-9a-f]*)$/i.exec(hex);
        if (ipfsMatch) {
            let scheme = (ipfsMatch.groups.protocol === 'e3010170') ? 'ipfs' : 'ipns';

            let hex = `0x${ipfsMatch.groups.hex}` as const;
            let base58 = $base.$58.encode(hex);
            return `${scheme}://${base58}`;
        }
        // Swarm (CID: 1, Type: swarm-manifest; hash/length hard-coded to keccak256/32)
        const swarm = /^0xe40101fa011b20(?<hex>[0-9a-f]*)$/i.exec(hex);
        if (swarm?.groups?.hex.length === 64) {
            return `bzz:/\/${swarm.groups.hex}`;
        }
        return hex;
    }

    private async getResolver(hash: TBufferLike): Promise<Pick<EnsPublicResolver, 'addr' | 'contenthash' | 'text'>> {
        let registry = await this.getRegistry();
        let address = await registry.resolver(hash);
        $require.Address(address, `Resolver address is empty for ${hash} in registry ${this.client.platform}:${registry.address}`);

        let { contract: resolver } = ContractClassFactory.fromAbi<EnsPublicResolver>(address, [
            'function addr(bytes32) view returns address',
            'function addr(bytes32, uint256) view returns bytes',
            'function contenthash(bytes32) view returns bytes',
            'function text(bytes32 node, string key) view returns string',
        ], this.client);
        return resolver;
    }

    private async getRegistry(): Promise<Pick<EnsRegistry, 'address' | 'resolver'>>  {
        let address = this.getRegistryAddress();

        let { contract: registry } = ContractClassFactory.fromAbi<EnsRegistry>(address, [
            'function resolver(bytes32 node) view returns address',
        ], this.client);
        return registry;
    }
    private getRegistryAddress() {
        let key = `ns.${this.configField}.${this.client.platform}.registry`;
        let registryAddr = $config.get(key);
        $require.Address(registryAddr, `Not valid registry address in ${key}`);
        return registryAddr;
    }
}
