import { $config } from '@dequanto/utils/$config';
import { TPlatform } from '@dequanto/models/TPlatform';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IWeb3EndpointOptions } from '@dequanto/clients/interfaces/IWeb3EndpointOptions';
import { ClientEndpoints } from '@dequanto/clients/utils/ClientEndpoints';


export class BobaWeb3Client extends Web3Client {

    platform: TPlatform = 'boba'
    chainId: number = this.options.chainId ?? 288
    chainToken = 'ETH';
    defaultGasLimit = 500_000

    constructor (opts?: IWeb3EndpointOptions) {
        super({
            ...(opts ?? {}),
            endpoints: ClientEndpoints.filterEndpoints($config.get('web3.boba.endpoints'), opts)
        });
    }
}
