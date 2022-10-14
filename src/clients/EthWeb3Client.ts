import { $config } from '@dequanto/utils/$config';
import { Web3Client } from './Web3Client';
import { TPlatform } from '@dequanto/models/TPlatform';
import { IWeb3EndpointOptions } from './interfaces/IWeb3EndpointOptions';
import { ClientEndpoints } from './utils/ClientEndpoints';


export class EthWeb3Client extends Web3Client {

    platform: TPlatform = this.options.platform ?? 'eth';
    chainId: number = this.options.chainId ?? 1;
    chainToken = 'ETH';
    TIMEOUT: number = 15 * 60 * 1000;
    defaultGasLimit = 2_000_000


    constructor (opts?: IWeb3EndpointOptions) {
        super({
            ...(opts ?? {}),
            endpoints: ClientEndpoints.filterEndpoints($config.get(`web3.${opts?.platform ?? 'eth'}.endpoints`), opts)
        });
    }
}
