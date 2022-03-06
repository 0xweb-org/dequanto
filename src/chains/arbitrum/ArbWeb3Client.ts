import { $config } from '@dequanto/utils/$config';
import { Transaction, TxData } from '@ethereumjs/tx'
import Common from '@ethereumjs/common'
import { TPlatform } from '@dequanto/models/TPlatform';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IWeb3EndpointOptions } from '@dequanto/clients/interfaces/IWeb3EndpointOptions';
import { ClientEndpoints } from '@dequanto/clients/utils/ClientEndpoints';

export class ArbWeb3Client extends Web3Client {

    platform: TPlatform = 'arbitrum'
    chainId: number = 42161
    chainToken = 'ETH'
    TIMEOUT: number = 15 * 60 * 1000;
    defaultGasLimit = 2_000_000


    constructor (opts?: IWeb3EndpointOptions) {
        super(ClientEndpoints.filterEndpoints($config.get('web3.arbitrum.endpoints'), opts));
    }
    sign(txData: TxData, privateKey: string): Buffer {

        const key = Buffer.from(privateKey, 'hex');
        const common = new Common({
            chain: 42161,
            customChains: [{
                chainId: 42161,
                networkId: 42161,
                url: 'https://arb1.arbitrum.io/rpc',
                name: 'aeth',
                comment: '',
                hardforks: [{ name: 'mainnet' }]
            } as any]
        })
        const tx = Transaction.fromTxData(txData, { common });
        const signedTx = tx.sign(key);
        return signedTx.serialize();
    }
}
