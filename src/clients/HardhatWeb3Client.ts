import Common from '@ethereumjs/common'
import { $config } from '@dequanto/utils/$config';
import { TxData } from '@ethereumjs/tx'
import { Web3Client } from './Web3Client';
import { TPlatform } from '@dequanto/models/TPlatform';
import { IWeb3EndpointOptions } from './interfaces/IWeb3EndpointOptions';
import { ClientEndpoints } from './utils/ClientEndpoints';
import { TxFactory } from './utils/TxFactory';


// https://hardhat.org/hardhat-network/reference/

export class HardhatWeb3Client extends Web3Client {

    platform: TPlatform = 'hardhat'
    chainId: number = 31337
    chainToken = 'ETH';
    TIMEOUT: number = 5 * 60 * 1000;
    defaultGasLimit = 2_000_000

    constructor (opts?: IWeb3EndpointOptions) {
        super(ClientEndpoints.filterEndpoints($config.get('web3.hardhat.endpoints'), opts));
    }

    sign(txData: TxData, privateKey: string): Buffer {

        const key = Buffer.from(privateKey, 'hex');
        const common = new Common({
            chain: 31337,
            hardfork: 'london',
            customChains: [
                <any> {
                    chainId: 31337,
                    url: 'http://127.0.0.1:8545/',
                    name: 'ETH',
                    comment: '',
                    hardforks: [
                        {
                            name: 'london',
                            block: 0
                        }
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
                }
            ]
        });

        const tx = TxFactory.fromTxData(txData, { common });
        const signedTx = tx.sign(key);
        return signedTx.serialize();
    }
}
