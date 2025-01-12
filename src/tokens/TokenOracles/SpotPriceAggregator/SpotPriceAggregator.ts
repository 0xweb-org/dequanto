import { IToken } from '@dequanto/models/IToken';
import { ChainlinkOracle } from '../chainlink/ChainlinkOracle';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { ContractClassFactory } from '@dequanto/contracts/ContractClassFactory';
import { $config } from '@dequanto/utils/$config';
import { IConfigData } from '@dequanto/config/interface/IConfigData';
import { TAddress } from '@dequanto/models/TAddress';
import { IOracle, IOracleOptions, IOracleResult } from '../IOracle';
import { TResultAsync } from '@dequanto/models/TResult';
import { $bigfloat } from '@dequanto/utils/$bigfloat';
import { $require } from '@dequanto/utils/$require';
import { Web3Client } from '@dequanto/clients/Web3Client';

// https://github.com/1inch/spot-price-aggregator?tab=readme-ov-file
export class SpotPriceAggregator implements IOracle {

    private chainlink = new ChainlinkOracle();

    constructor () {

    }


    async getPrice (token: IToken, opts?: IOracleOptions): TResultAsync<IOracleResult> {
        let client = await Web3ClientFactory.getAsync(token.platform);
        let contract = await this.getContract(client, token);
        let [
            priceInEth,
            ethPrice
        ] = await Promise.all([
            contract.getRateToEth(token.address, true),
            this.chainlink.getPrice({ symbol: client.chainToken })
        ]);

        if (ethPrice.error) {
            return { error: ethPrice.error };
        }
        let price = $bigfloat.from(priceInEth).mul(ethPrice.result.price).div(1e18).toNumber();
        return {
            error: null,
            result: {
                price: price,
                date: new Date(),
            }
        }
    }

    private async getContract (client: Web3Client, token: IToken) {

        let config = await $config.get<IConfigData['spotPriceAggregator']['']>(`spotPriceAggregator.${token.platform}`);
        $require.Address(config, `1inch SpotPriceAggregator not defined for ${ token.address } on ${ token.platform }`);

        interface IRate {
            getRateToEth(srcToken: TAddress, useSrcWrappers: boolean): Promise<bigint>
        };
        let { contract } = ContractClassFactory.fromAbi<IRate>(config, [
            `function getRateToEth(address srcToken, bool useSrcWrappers) view returns (uint256)`
        ], client);

        return contract;
    }
}
