
import di from 'a-di';
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client';
import { ContractReader } from '@dequanto/contracts/ContractReader';
import { TAddress } from '@dequanto/models/TAddress';
import { TBufferLike } from '@dequanto/models/TBufferLike';
import { $config } from '@dequanto/utils/$config';
import { $require } from '@dequanto/utils/$require';
import { INsProvider } from './INsProvider';
import { $ns } from '../utils/$ns';

export class EnsProvider implements INsProvider {

    constructor (public client = di.resolve(EthWeb3Client)) {

    }

    supports (domain: string) {
        return /\.eth$/.test(domain);
    }

    async getAddress(domain: string): Promise<TAddress> {
        let hash = $ns.namehash(domain);
        let resolverAddr = await this.getResolverAddress(hash);
        let address = await this.resolveAddress(hash, resolverAddr);
        return address;
    }

    private async resolveAddress (hash: TBufferLike, resolverAddr: TAddress) {
        let registryAddr = $config.get('ns.ens.registry');
        $require.Address(registryAddr);

        let reader = new ContractReader(this.client);
        let address = await reader.readAsync(resolverAddr, `addr(bytes32):address`, hash);
        return address;
    }
    private async getResolverAddress (hash: TBufferLike): Promise<TAddress> {
        let registryAddr = $config.get('ns.ens.registry');
        $require.Address(registryAddr);

        let reader = new ContractReader(this.client);
        let address = await reader.readAsync(registryAddr, `resolver(bytes32):address`, hash);
        return address;
    }
}
