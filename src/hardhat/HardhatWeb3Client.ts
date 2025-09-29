import { $config } from '@dequanto/utils/$config';
import { Web3Client } from '../clients/Web3Client';
import { TPlatform } from '@dequanto/models/TPlatform';
import { IWeb3EndpointOptions } from '../clients/interfaces/IWeb3EndpointOptions';
import { ClientEndpoints } from '../clients/utils/ClientEndpoints';
import { IWeb3ClientOptions } from '@dequanto/clients/interfaces/IWeb3Client';


// https://hardhat.org/hardhat-network/reference/
// https://hardhat.org/hardhat-network/docs/reference#hardhat_reset

export class HardhatWeb3Client extends Web3Client {

    platform: TPlatform = 'hardhat'
    // https://github.com/MetaMask/metamask-extension/issues/10290
    chainId: number = this.options.chainId ?? 1337
    chainToken = 'ETH';
    TIMEOUT: number = 5 * 60 * 1000;
    defaultGasLimit = 2_000_000

    constructor (opts?: IWeb3EndpointOptions) {
        super(<IWeb3ClientOptions> {
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
                },
                mine: {
                    call: 'hardhat_mine',
                    params: 2
                },
                snapshot: {
                    call: 'evm_snapshot',
                    params: 0
                },
                revert: {
                    call: 'evm_revert',
                    params: 1
                },
                autoMine: {
                    call: 'evm_setAutomine',
                    params: 1
                }
            }
        });
    }

    async getGasPriorityFee(): Promise<bigint> {
        return 10n**9n;
    }

    configureFork (fork: TPlatform) {
        this.forked = {
            platform: fork,
        };
    }
}
