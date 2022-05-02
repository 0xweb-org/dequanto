import { $config } from '@dequanto/utils/$config';
import { Web3Client } from './Web3Client';
import { TPlatform } from '@dequanto/models/TPlatform';
import { ClientEndpoints } from './utils/ClientEndpoints';
import { IWeb3EndpointOptions } from './interfaces/IWeb3EndpointOptions';
import { $bigint } from '@dequanto/utils/$bigint';

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

}
