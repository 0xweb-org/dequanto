import { $config } from '@dequanto/utils/$config';
import { TPlatform } from '@dequanto/models/TPlatform';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IWeb3EndpointOptions } from '@dequanto/clients/interfaces/IWeb3EndpointOptions';
import { ClientEndpoints } from '@dequanto/clients/utils/ClientEndpoints';

export class ArbWeb3Client extends Web3Client {

    platform: TPlatform = 'arbitrum'
    chainId: number = this.options.chainId ?? 42161
    chainToken = 'ETH'
    TIMEOUT: number = 15 * 60 * 1000;
    defaultGasLimit = 2_000_000


    constructor (opts?: IWeb3EndpointOptions) {
        super({
            ...(opts ?? {}),
            endpoints: ClientEndpoints.filterEndpoints($config.get('web3.arbitrum.endpoints'), opts)
        });
    }
}
