import alot from 'alot';
import { TAddress } from '@dequanto/models/TAddress';
import { $config } from '@dequanto/utils/$config';
import { $require } from '@dequanto/utils/$require';
import { INsProvider, INsProviderOptions } from './INsProvider';
import { TEth } from '@dequanto/models/TEth';
import { $base } from '@dequanto/utils/$base';
import { TPlatform } from '@dequanto/models/TPlatform';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { $address } from '@dequanto/utils/$address';
import { $is } from '@dequanto/utils/$is';


export abstract class ANsProvider implements INsProvider {

    protected configField: string

    constructor(public client) {

    }
    abstract supports(domain: string): boolean;


    async getAddress(domain: string, opts: INsProviderOptions): Promise<{
        platform: TPlatform
        address: TAddress
    }> {
        let clients = await this.getClients(opts);
        return alot(clients)
            .mapAsync(async client => this.getAddressInner(client, domain))
            .firstAsync(x => $address.isEmpty(x?.address) === false);
    }

    protected abstract getAddressInner (client: Web3Client, domain: string): Promise<{
        platform: TPlatform
        address: TAddress
    }>;

    /** Gets contentHash if root, or the record from path: foo.eth/FOO_RECORD */
    async getContent(uri: string, opts: INsProviderOptions): Promise<{ platform: TPlatform, value: string }> {
        let clients = await this.getClients(opts);
        return alot(clients)
            .mapAsync(async client => this.getContentInner(client, uri))
            .firstAsync(x => x?.value != null);
    }

    protected abstract getContentInner (client: Web3Client, uri: string): Promise<{
        platform: TPlatform
        value: string
    }>;

    async getReverseName(address: TAddress, opts: INsProviderOptions): Promise<{ platform: TPlatform, name: string }> {
        let clients = await this.getClients(opts);
        return await alot(clients)
            .mapAsync(async client => this.getReversedInner(client, address))
            .firstAsync(x => $is.notEmpty(x?.name));
    }
    protected abstract getReversedInner (client: Web3Client, address: TAddress): Promise<{
        platform: TPlatform
        name: string
    }>;

    protected async getClients(opts: INsProviderOptions): Promise<Web3Client[]> {
        if (opts?.multichain === false) {
            return [ this.client ];
        }

        let clients = await alot(this.getSupportedChains())
            .mapAsync(x => Web3ClientFactory.getAsync(x))
            .toArrayAsync();
        return alot([
            this.client,
            ...clients
        ])
        .distinctBy(x => x.network)
        .toArray();
    }

    protected getSupportedChains(): TPlatform[] {
        let settings = $config.get(`ns.${this.configField}`);
        let chains = $config.get(`web3`);
        return Object.keys(settings).filter(x => x in chains) as TPlatform[];
    }

    protected decodeContentHash(hex: TEth.Hex) {
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


    protected getNsAddress(platform: TPlatform, type: 'registry' | 'resolver' = 'registry'): TAddress {
        let key = `ns.${this.configField}.${platform}.${type}`;
        let registryAddr = $config.get(key);
        $require.Address(registryAddr, `Not valid registry address in ${key}`);
        return registryAddr;
    }
}
