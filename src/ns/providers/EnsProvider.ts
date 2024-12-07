
import di from 'a-di';
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client';
import { TAddress } from '@dequanto/models/TAddress';
import { $require } from '@dequanto/utils/$require';
import { $ns } from '../utils/$ns';
import type { EnsPublicResolver } from '@dequanto/prebuilt/ens/EnsPublicResolver/EnsPublicResolver';
import type { EnsRegistry } from '@dequanto/prebuilt/ens/EnsRegistry/EnsRegistry';
import { $is } from '@dequanto/utils/$is';
import { TEth } from '@dequanto/models/TEth';
import { ContractClassFactory } from '@dequanto/contracts/ContractClassFactory';
import { $hex } from '@dequanto/utils/$hex';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TPlatform } from '@dequanto/models/TPlatform';
import { ANsProvider } from './ANsProvider';


export class EnsProvider extends ANsProvider {

    constructor(client: Web3Client = di.resolve(EthWeb3Client)) {
        super(client);
        this.configKey = 'ens';
    }

    supports(domain: string) {
        return /\.eth([/|?]|$)/.test(domain);
    }

    protected async getAddressInner (client: Web3Client, domain: string): Promise<{
        platform: TPlatform
        address: TAddress
    }> {
        let node = $ns.namehash(domain);
        let resolver = await this.getResolver(client, node);
        let address = await resolver.addr(node);
        return {
            platform: client.network,
            address
        };
    }

    /** Gets contentHash if root, or the record from path: foo.eth/FOO_RECORD */
    protected async getContentInner(client: Web3Client, uri: string): Promise<{
        platform: TPlatform
        value: string
    }> {
        let domain = $ns.getRoot(uri);
        let node = $ns.namehash(domain);
        let resolver = await this.getResolver(client, node);

        let key = $ns.getPath(uri);
        if ($is.empty(key)) {
            let data = await resolver.contenthash(node) as TEth.Hex;
            if ($is.empty(data)) {
                return null;
            }
            return {
                platform: client.network,
                value: this.decodeContentHash(data)
            }
        }
        return {
            platform: client.network,
            value: await resolver.text(node, key)
        };
    }

    async getReversedInner(client: Web3Client, address: TAddress): Promise<{
        platform: TPlatform
        name: string
    }> {
        let node = $ns.namehash(`${ $hex.raw(address).toLowerCase() }.addr.reverse`);
        let resolver = await this.getResolver(client, node);
        if (resolver == null) {
            return null;
        }
        try {
            let name = await resolver.name(node);
            return { platform: client.network, name };
        } catch {
            return null;
        }
    }



    protected async getResolver(client: Web3Client, node: TEth.Hex): Promise<Pick<EnsPublicResolver, 'addr' | 'contenthash' | 'text' | 'name'>> {
        let registry = await this.getRegistry(client);
        let address = await registry.resolver(node);
        $require.AddressNotEmpty(address, `Resolver address is empty for ${node} in registry ${this.client.platform}:${registry.address}`);

        let { contract: resolver } = ContractClassFactory.fromAbi<EnsPublicResolver>(address, [
            'function addr(bytes32) view returns address',
            'function addr(bytes32, uint256) view returns bytes',
            'function contenthash(bytes32) view returns bytes',
            'function text(bytes32 node, string key) view returns string',
            'function name(bytes32) view returns (string)',
        ], client);
        return resolver;
    }

    protected async getRegistry(client: Web3Client): Promise<Pick<EnsRegistry, 'address' | 'resolver'>> {
        let address = this.getNsAddress(client.network);
        let { contract: registry } = ContractClassFactory.fromAbi<EnsRegistry>(address, [
            'function resolver(bytes32 node) view returns address',
        ], client);
        return registry;
    }
}
