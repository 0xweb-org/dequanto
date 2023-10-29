import { $config } from '@dequanto/utils/$config';
import { Web3Client } from './Web3Client';
import { TPlatform } from '@dequanto/models/TPlatform';
import { IWeb3EndpointOptions } from './interfaces/IWeb3EndpointOptions';
import { ClientEndpoints } from './utils/ClientEndpoints';


// https://hardhat.org/hardhat-network/reference/
// https://hardhat.org/hardhat-network/docs/reference#hardhat_reset

export class HardhatWeb3Client extends Web3Client {

    platform: TPlatform = 'hardhat'
    chainId: number = this.options.chainId ?? 1337
    chainToken = 'ETH';
    TIMEOUT: number = 5 * 60 * 1000;
    defaultGasLimit = 2_000_000

    constructor (opts?: IWeb3EndpointOptions) {
        super({
            ...(opts ?? {}),
            endpoints: ClientEndpoints.filterEndpoints($config.get('web3.hardhat.endpoints'), opts),
            debug: {
                setStorageAt: {
                    call: 'hardhat_setStorageAt',
                    params: 3
                },
                setCode: {
                    call: 'hardhat_setCode',
                    params: 2,
                },
                setBalance: {
                    call: 'hardhat_setBalance',
                    params: 2
                },
                impersonateAccount: {
                    call: 'hardhat_impersonateAccount',
                    params: 1
                },
                stopImpersonatingAccount: {
                    call: 'hardhat_stopImpersonatingAccount',
                    params: 1,
                },
                reset: {
                    call: 'hardhat_reset',
                    params: 1
                }
            }
        });
    }

    configureFork (fork: TPlatform) {
        this.forked = {
            platform: fork,
        };
    }
}
