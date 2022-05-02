import { $config } from '@dequanto/utils/$config';
import { Web3Client } from './Web3Client';
import { TPlatform } from '@dequanto/models/TPlatform';
import { IWeb3EndpointOptions } from './interfaces/IWeb3EndpointOptions';
import { ClientEndpoints } from './utils/ClientEndpoints';

export class BscWeb3Client extends Web3Client {

    platform: TPlatform = 'bsc'
    chainId: number = this.options.chainId ?? 56
    chainToken = 'BNB';
    defaultGasLimit = 2_000_000


    constructor (opts?: IWeb3EndpointOptions) {
        super({
            ...(opts ?? {}),
            endpoints: ClientEndpoints.filterEndpoints($config.get('web3.bsc.endpoints'), opts)
        });
    }
}
