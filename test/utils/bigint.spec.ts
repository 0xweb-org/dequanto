import { $bigint } from '@dequanto/utils/$bigint'


UTest({
    'float math': {
        async 'multiply' () {
            let val = $bigint.multWithFloat(1000n, .99);
            eq_(val, 990n);

            val = $bigint.multWithFloat(1000n, 2);
            eq_(val, 2000n);

            val = $bigint.multWithFloat(1000n, 1/3);
            eq_(val, 333n);

            val = $bigint.multWithFloat($bigint.toWei(10, 18), 0.025);
        }
    },
    'toWei': {
        async 'fromEther' () {
            let val = $bigint.toWei(0.011)
            eq_(val, 11 * 10 ** 15);
        },
        async 'fromGwei' () {
            let val = $bigint.toWeiFromGwei(.5);
            eq_(val, 5_000_000_00n);

            val = $bigint.toWeiFromGwei(.000001);
            eq_(val, 1_000n);

            val = $bigint.toWeiFromGwei(1_000_000_000.000001);
            eq_(val, 1000000000000001000n);
        },
        async 'fromCustom' () {
            let val = $bigint.toWei(0.51, 6)
            eq_(val, 51_0000);
        },
    },
    'parse' () {
        let arr = [
            [ '2.34^2', 234n ],
            [ '.5 ether', 5n * 10n**18n / 10n],
            [ '1.2 gwei', 12n * 10n**9n / 10n],
            [ '0.123^3', 123n],
            [ '0.25e18', 25n * 10n**18n / 100n],
            [ '.03e18', 3n * 10n**18n / 100n],
            [ '1.2e1', 12n],
        ] as const;

        for (let [ input, expected ] of arr) {
            let val = $bigint.parse(input);
            eq_(val, expected);
        }
    }
})
