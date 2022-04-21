import { $config } from '@dequanto/utils/$config';
import { FeeMarketEIP1559TxData, TxData } from '@ethereumjs/tx'
import Common from '@ethereumjs/common'
import { Web3Client } from './Web3Client';
import { TPlatform } from '@dequanto/models/TPlatform';
import { IWeb3EndpointOptions } from './interfaces/IWeb3EndpointOptions';
import { ClientEndpoints } from './utils/ClientEndpoints';
import { TxFactory } from './utils/TxFactory';

export class EthWeb3Client extends Web3Client {

    platform: TPlatform = 'eth'
    chainId: number = this.options.chainId ?? 1;
    chainToken = 'ETH';
    TIMEOUT: number = 15 * 60 * 1000;
    defaultGasLimit = 2_000_000


    constructor (opts?: IWeb3EndpointOptions) {
        super({
            ...(opts ?? {}),
            endpoints: ClientEndpoints.filterEndpoints($config.get('web3.eth.endpoints'), opts)
        });
    }
    sign(txData: TxData | FeeMarketEIP1559TxData, privateKey: string): Buffer {

        const key = Buffer.from(privateKey, 'hex');
        const common = new Common({
            chain: 'mainnet',
            hardfork: 'london',
        });
        const tx = TxFactory.fromTxData(txData, { common });
        const signedTx = tx.sign(key);
        return signedTx.serialize();
    }
}
