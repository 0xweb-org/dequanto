import { AmmPriceV2Oracle } from '@dequanto/tokens/TokenOracles/AmmPriceV2Oracle';
import { ChainlinkOracle } from '@dequanto/tokens/TokenOracles/chainlink/ChainlinkOracle';
import { l } from '@dequanto/utils/$logger';

UTest({
    async 'ETH' () {
        let token = 'ETH';

        return UTest({
            async 'from chainlink' () {
                let oracle = new ChainlinkOracle();
                let { error, result } = await oracle.getPrice({ symbol: token });

                eq_(error, null);
                gt_(result.price, 1);
                lt_(result.price, 100_000);
                l`${token}: ${result.price}$`;
            },
            async 'from uniswap' () {

                // let oracle = new AmmPriceV2Oracle();
                // let { error, result } = await oracle.getPrice({ symbol: token });

            }
        });
    },
    async 'check the chainlink with multihops' () {
        let token = 'GTC';
        let oracle = new ChainlinkOracle();
        let { error, result } = await oracle.getPrice({ symbol: token });

        eq_(error, null);
        gt_(result.price, .01);
        lt_(result.price, 100);
        l`${token}: ${result.price}$`;
    }
})
