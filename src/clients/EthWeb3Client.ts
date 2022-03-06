import { $config } from '@dequanto/utils/$config';
import { Transaction, TxData } from '@ethereumjs/tx'
import Common from '@ethereumjs/common'
import { Web3Client } from './Web3Client';
import { TPlatform } from '@dequanto/models/TPlatform';
import { IWeb3EndpointOptions } from './interfaces/IWeb3EndpointOptions';
import { ClientEndpoints } from './utils/ClientEndpoints';

export class EthWeb3Client extends Web3Client {

    platform: TPlatform = 'eth'
    chainId: number = 1;
    chainToken = 'ETH';
    TIMEOUT: number = 15 * 60 * 1000;
    defaultGasLimit = 2_000_000


    constructor (opts?: IWeb3EndpointOptions) {
        super(ClientEndpoints.filterEndpoints($config.get('web3.eth.endpoints'), opts));

        //let host = `192.168.1.220`;
        // let host = `localhost`;
        // this.web3 = new Web3(`ws://${host}:8546`);
        // this.eth = this.web3.eth;
    }
    sign(txData: TxData, privateKey: string): Buffer {

        const key = Buffer.from(privateKey, 'hex');
        const common = new Common({
            chain: 'mainnet'
        })
        const tx = Transaction.fromTxData(txData, { common });
        const signedTx = tx.sign(key);
        return signedTx.serialize();
    }
}
