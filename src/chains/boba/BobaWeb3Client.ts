import { $config } from '@dequanto/utils/$config';
import { Transaction, TxData } from '@ethereumjs/tx'
import Common from '@ethereumjs/common'
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
    sign(txData: TxData, privateKey: string): Buffer {

        const key = Buffer.from(privateKey, 'hex');
        const common = new Common({
            chain: this.chainId,
            customChains: [{
                chainId: this.chainId,
                networkId: this.chainId,
                url: 'https://mainnet.boba.network/',
                name: 'boba',
                comment: '',
                hardforks: [

                ],
                genesis: {
                    hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    timestamp: '0x5ED20F84',
                    difficulty: 0x1,
                    gasLimit: 0x989680,
                    nonce: '0x0',
                    stateRoot: '',
                    extraData: '',
                }
            } as any]
        })
        const tx = Transaction.fromTxData(txData, { common });
        const signedTx = tx.sign(key);
        return signedTx.serialize();
    }
}
