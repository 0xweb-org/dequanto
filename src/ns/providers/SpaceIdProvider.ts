
import di from 'a-di';
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client';
import { ContractReader } from '@dequanto/contracts/ContractReader';
import { TAddress } from '@dequanto/models/TAddress';
import { TBufferLike } from '@dequanto/models/TBufferLike';
import { $config } from '@dequanto/utils/$config';
import { $require } from '@dequanto/utils/$require';
import { INsProvider } from './INsProvider';
import { $ns } from '../utils/$ns';
import { BscWeb3Client } from '@dequanto/clients/BscWeb3Client';

export class SpaceIdProvider implements INsProvider {

    constructor (public client = di.resolve(BscWeb3Client)) {

    }

    supports (domain: string) {
        return /\.bnb$/.test(domain);
    }

    async getAddress(domain: string): Promise<TAddress> {
        let hash = $ns.namehash(domain);
        let resolverAddr = await this.getResolverAddress(hash);
        let address = await this.resolveAddress(hash, resolverAddr);
        return address;
    }

    private async resolveAddress (hash: TBufferLike, resolverAddr: TAddress) {
        let registryAddr = this.getRegistryAddr();

        let reader = new ContractReader(this.client);
        let address = await reader.readAsync(resolverAddr, `addr(bytes32):address`, hash);
        return address;
    }
    private async getResolverAddress (hash: TBufferLike): Promise<TAddress> {
        let registryAddr = this.getRegistryAddr();

        let reader = new ContractReader(this.client);
        let address = await reader.readAsync(registryAddr, `resolver(bytes32):address`, hash);
        return address;
    }

    private getRegistryAddr () {
        let registryAddr = $config.get(`ns.sid.${this.client.platform}.registry`);
        return $require.Address(registryAddr, `SpaceID registry address for ${this.client.platform} not set`);
    }
}
