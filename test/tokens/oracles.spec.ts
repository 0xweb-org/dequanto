import { TokenDataProvider } from '@dequanto/tokens/TokenDataProvider';
import { AmmV1Oracle } from '@dequanto/tokens/TokenOracles/amm/AmmV1Oracle';
import { AmmV2Oracle } from '@dequanto/tokens/TokenOracles/amm/AmmV2Oracle';
import { ChainlinkOracle } from '@dequanto/tokens/TokenOracles/chainlink/ChainlinkOracle';
import { SpotPriceAggregator } from '@dequanto/tokens/TokenOracles/SpotPriceAggregator/SpotPriceAggregator';
import { TokenPriceServiceFactory } from '@dequanto/tokens/TokenPriceServiceProvider';
import { $date } from '@dequanto/utils/$date';
import { l } from '@dequanto/utils/$logger';
import { $sig } from '@dequanto/utils/$sig';

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
    async 'spot aggregator' () {
        let spot = new SpotPriceAggregator();

        let ethTokenProvider = new TokenDataProvider('eth');
        let ethLINK  = await ethTokenProvider.getKnownToken('LINK');
        let ethLINKPrice = await spot.getPrice(ethLINK);
        eq_(ethLINKPrice.error, null);
        gt_(ethLINKPrice.result.price, 1);
        lt_(ethLINKPrice.result.price, 100);

        let polTokenProvider = new TokenDataProvider('polygon');
        let polLINK  = await polTokenProvider.getKnownToken('LINK');
        let polLINKPrice = await spot.getPrice(polLINK);
        eq_(polLINKPrice.error, null);
        gt_(polLINKPrice.result.price, 1);
        lt_(polLINKPrice.result.price, 100);

        let d = Math.abs(1 - polLINKPrice.result.price / ethLINKPrice.result.price);
        lt_(d, .2, `${polLINKPrice.result.price} | ${ethLINKPrice.result.price}`);

        let ethNoToken = {
            address: $sig.$account.generate().address,
            platform: 'eth'
        };
        let ethNoPrice = await spot.getPrice(ethNoToken);
        eq_(ethNoPrice.result.price, 0n);
    },
    async 'getting basic token prices' () {
        let service = TokenPriceServiceFactory.get();
        let ethPrice = await service.getPrice('ETH');
        let solPrice = await service.getPrice('SOL');

        gt_(ethPrice.price, 0);
        gt_(solPrice.price, 0);
    },
    async '//check the chainlink with multi hops' () {
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
