import { $config } from '@dequanto/utils/$config';
import { Web3Client } from './Web3Client';
import { TPlatform } from '@dequanto/models/TPlatform';
import { IWeb3EndpointOptions } from './interfaces/IWeb3EndpointOptions';
import { ClientEndpoints } from './utils/ClientEndpoints';


// https://hardhat.org/hardhat-network/reference/

export class HardhatWeb3Client extends Web3Client {

    platform: TPlatform = 'hardhat'
    chainId: number = this.options.chainId ?? 31337
    chainToken = 'ETH';
    TIMEOUT: number = 5 * 60 * 1000;
    defaultGasLimit = 2_000_000

    constructor (opts?: IWeb3EndpointOptions) {
        super({
            ...(opts ?? {}),
            endpoints: ClientEndpoints.filterEndpoints($config.get('web3.hardhat.endpoints'), opts)
        });
    }
}
