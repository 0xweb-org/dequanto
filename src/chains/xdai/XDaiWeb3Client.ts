import { $config } from '@dequanto/utils/$config';
import { TPlatform } from '@dequanto/models/TPlatform';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IWeb3EndpointOptions } from '@dequanto/clients/interfaces/IWeb3EndpointOptions';
import { ClientEndpoints } from '@dequanto/clients/utils/ClientEndpoints';
import memd from 'memd';
import axios from 'axios';
import { $bigint } from '@dequanto/utils/$bigint';

export class XDaiWeb3Client extends Web3Client {

    platform: TPlatform = 'xdai'
    chainId: number = this.options.chainId ?? 100
    chainToken = 'XDAI';
    defaultGasLimit = 500_000
    defaultTxType: 1 | 2 = 1;


    constructor (opts?: IWeb3EndpointOptions) {
        super({
            ...(opts ?? {}),
            endpoints: ClientEndpoints.filterEndpoints($config.get('web3.xdai.endpoints'), opts)
        });
    }


    async getGasPrice() {
        let gasPrice:bigint;
        try {
            gasPrice = await this.loadGasPrice();
        } catch (err) {
            let { price } = await super.getGasPrice();
            gasPrice = price;
        }
        // MIN 20gwei, max: 80gwei
        const MAX = $bigint.toWeiFromGwei(80);
        const MIN = $bigint.toWeiFromGwei(20);

        if (gasPrice < MIN) gasPrice = MIN;
        if (gasPrice > MAX) gasPrice = MAX;

        return {
            price: gasPrice
        };
    }

    @memd.deco.memoize({ maxAge: 10 })
    private async loadGasPrice () {
        let resp = await axios.get<{ average: number }>(`https://blockscout.com/xdai/mainnet/api/v1/gas-price-oracle`);
        let avg = resp.data?.average;
        if (avg) {
            return $bigint.toWeiFromGwei(avg);
        }
        throw new Error(`Field is missing`);
    }
}
