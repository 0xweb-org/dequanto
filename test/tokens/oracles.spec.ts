import { AmmV2PriceQuote } from '@dequanto/tokens/TokenExchanges/AmmV2PriceQuote';
import { AmmV1Oracle } from '@dequanto/tokens/TokenOracles/amm/AmmV1Oracle';
import { AmmV2Oracle } from '@dequanto/tokens/TokenOracles/amm/AmmV2Oracle';
import { ChainlinkOracle } from '@dequanto/tokens/TokenOracles/chainlink/ChainlinkOracle';
import { $date } from '@dequanto/utils/$date';
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
                l`(Chainlink) ${token}: ${result.price}$`;
            },
            async 'from uniswap' () {

                let oracle = new AmmV2Oracle();
                let { error, result } = await oracle.getPrice({ symbol: 'WETH' });
                eq_(error, null);

                l`(AmmV2) ${token}: ${result.price}$`;
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
    },
    async '//uniswap v1' () {
        let token = 'WBTC';
        let oracle = new AmmV1Oracle();
        let { error, result } = await oracle.getPrice({ symbol: token }, { date: $date.parse('01-09-2019') });
        console.log(result, error);

    }
})

// 181434374676281650438n
// 181474374676281650438n
