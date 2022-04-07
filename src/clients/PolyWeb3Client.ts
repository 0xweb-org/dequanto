import Common from '@ethereumjs/common'
import { $config } from '@dequanto/utils/$config';
import { TxData } from '@ethereumjs/tx'
import { Web3Client } from './Web3Client';
import { TPlatform } from '@dequanto/models/TPlatform';
import { ClientEndpoints } from './utils/ClientEndpoints';
import { IWeb3EndpointOptions } from './interfaces/IWeb3EndpointOptions';
import { $bigint } from '@dequanto/utils/$bigint';
import { TxFactory } from './utils/TxFactory';

export class PolyWeb3Client extends Web3Client {

    platform: TPlatform = 'polygon';
    chainId: number = this.options.chainId ?? 137;
    chainToken = 'MATIC';
    defaultGasLimit = 2_000_000;

    constructor (opts?: IWeb3EndpointOptions) {
        super({
            ...(opts ?? {}),
            endpoints: ClientEndpoints.filterEndpoints($config.get('web3.polygon.endpoints'), opts)
        });
    }

    async getGasPrice() {
        let { price, base, priority } = await super.getGasPrice();

        price = $bigint.min(
            price,
            $bigint.toWei(60, $bigint.GWEI_DECIMALS)
        );

        // Use minimum gas price as 15 gwei (network sometimes returns too low fees)
        let gasPrice = $bigint.max(
            price,
            $bigint.toWei(28, $bigint.GWEI_DECIMALS)
        );
        return {
            price: gasPrice,
            base: gasPrice,
            priority: gasPrice
        };
    }

    // https://raw.githubusercontent.com/maticnetwork/launch/master/mainnet-v1/sentry/sentry/bor/genesis.json
    // https://raw.githubusercontent.com/maticnetwork/launch/master/mainnet-v1/sentry/sentry/heimdall/config/genesis.json
    sign(txData: TxData, privateKey: string): Buffer {

        const key = Buffer.from(privateKey, 'hex');

        const common = new Common({
            chain: this.chainId,
            hardfork: 'london',
            customChains: [
                <any> {
                    chainId: this.chainId,
                    networkId: this.chainId,
                    url: 'https://rpc-mainnet.maticvigil.com',
                    name: 'MATIC',
                    comment: '',
                    hardforks: [
                        {
                            name: "spuriousDragon",
                            block: 0
                        },
                        {
                            name: 'berlin',
                            block: 14750000
                        },
                        {
                            name: 'london',
                            block: 23850000
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

        const tx = TxFactory.fromTxData(txData as any, { common });
        const signedTx = tx.sign(key);
        return signedTx.serialize();
    }
}
