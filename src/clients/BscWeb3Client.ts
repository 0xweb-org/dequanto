import { $config } from '@dequanto/utils/$config';
import { Transaction, TxData } from '@ethereumjs/tx'
import Common from '@ethereumjs/common'
import { Web3Client } from './Web3Client';
import { TPlatform } from '@dequanto/models/TPlatform';
import { IWeb3EndpointOptions } from './interfaces/IWeb3EndpointOptions';
import { ClientEndpoints } from './utils/ClientEndpoints';

export class BscWeb3Client extends Web3Client {

    platform: TPlatform = 'bsc'
    chainId: number = 56
    chainToken = 'BNB';
    defaultGasLimit = 2_000_000


    constructor (opts?: IWeb3EndpointOptions) {
        super(ClientEndpoints.filterEndpoints($config.get('web3.bsc.endpoints'), opts));
    }
    sign(txData: TxData, privateKey: string): Buffer {

        const key = Buffer.from(privateKey, 'hex');
        const common = new Common({
            chain: 56,
            customChains: [{
                chainId: 56,
                networkId: 56,
                url: 'https://bsc-dataseed.binance.org/',
                name: 'bnb',
                comment: '',
                hardforks: [{ name: 'mainnet' }]
            } as any]
        })
        const tx = Transaction.fromTxData(txData, { common });
        const signedTx = tx.sign(key);
        return signedTx.serialize();
    }
}
