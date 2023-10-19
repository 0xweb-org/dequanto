import { $bignumber, ROUNDING_MODE } from '@dequanto/utils/$bn';

// https://docs.oracle.com/javase/8/docs/api/java/math/RoundingMode.html

UTest({
    'check rounding': {
        'ROUND_UP'() {
            let fixtures = [
                [5.5, 6],
                [2.5, 3],
                [1.6, 2],
                [1.1, 2],
                [1, 1],
                [-1, -1],
                [-1.1, -2],
                [-1.6, -2],
                [-2.5, -3],
                [-5.5, -6]

            ];
            fixtures.forEach(([x, expect]) => {
                let result = $bignumber.from(x).dp(0, ROUNDING_MODE.ROUND_UP);
                eq_(Number(result.value), expect, `${x} -> ${expect} but got ${result.value}`);
            });
        },
        'ROUND_DOWN'() {
            let fixtures = [
                [5.5, 5],
                [2.5, 2],
                [1.6, 1],
                [1.1, 1],
                [1, 1],
                [-1, -1],
                [-1.1, -1],
                [-1.6, -1],
                [-2.5, -2],
                [-5.5, -5]
            ];
            fixtures.forEach(([x, expect]) => {
                let result = $bignumber.from(x).dp(0, ROUNDING_MODE.ROUND_DOWN);
                eq_(Number(result.value), expect, `${x} -> ${expect} but got ${result.value}`);
            });
        },
        'ROUND_CEIL'() {
            let fixtures = [
                [5.5, 6],
                [2.5, 3],
                [1.6, 2],
                [1.1, 2],
                [1, 1],
                [-1, -1],
                [-1.1, -1],
                [-1.6, -1],
                [-2.5, -2],
                [-5.5, -5]
            ];
            fixtures.forEach(([x, expect]) => {
                let result = $bignumber.from(x).dp(0, ROUNDING_MODE.ROUND_CEIL);
                eq_(Number(result.value), expect, `${x} -> ${expect} but got ${result.value}`);
            });
        },
        'ROUND_FLOOR'() {
            let fixtures = [
                [5.5, 5],
                [2.5, 2],
                [1.6, 1],
                [1.1, 1],
                [1, 1],
                [-1, -1],
                [-1.1, -2],
                [-1.6, -2],
                [-2.5, -3],
                [-5.5, -6]
            ];
            fixtures.forEach(([x, expect]) => {
                let result = $bignumber.from(x).dp(0, ROUNDING_MODE.ROUND_FLOOR);
                eq_(Number(result.value), expect, `${x} -> ${expect} but got ${result.value}`);
            });
        },
        'HALF_UP'() {
            let fixtures = [
                [5.5, 6],
                [2.5, 3],
                [1.6, 2],
                [1.1, 1],
                [1, 1],
                [-1, -1],
                [-1.1, -1],
                [-1.6, -2],
                [-2.5, -3],
                [-5.5, -6]
            ];
            fixtures.forEach(([x, expect]) => {
                let result = $bignumber.from(x).dp(0, ROUNDING_MODE.ROUND_HALF_UP);
                eq_(Number(result.value), expect, `${x} -> ${expect} but got ${result.value}`);
            });
        },
        'HALF_DOWN'() {
            let fixtures = [
                [5.5, 5],
                [2.5, 2],
                [1.6, 2],
                [1.1, 1],
                [1, 1],
                [-1, -1],
                [-1.1, -1],
                [-1.6, -2],
                [-2.5, -2],
                [-5.5, -5]
            ];
            fixtures.forEach(([x, expect]) => {
                let result = $bignumber.from(x).dp(0, ROUNDING_MODE.ROUND_HALF_DOWN);
                eq_(Number(result.value), expect, `${x} -> ${expect} but got ${result.value}`);
            });
        },
        'HALF_EVEN'() {
            let fixtures = [
                [5.5, 6],
                [2.5, 2],
                [1.6, 2],
                [1.1, 1],
                [1, 1],
                [-1, -1],
                [-1.1, -1],
                [-1.6, -2],
                [-2.5, -2],
                [-5.5, -6]
            ];
            fixtures.forEach(([x, expect]) => {
                let result = $bignumber.from(x).dp(0, ROUNDING_MODE.ROUND_HALF_EVEN);
                eq_(Number(result.value), expect, `${x} -> ${expect} but got ${result.value}`);
            });
        },
        'HALF_CEIL'() {
            // Rounds towards nearest neighbor. If equidistant, rounds towards Infinity.
            let fixtures = [
                [5.5, 6],
                [2.5, 3],
                [1.6, 2],
                [1.1, 1],
                [1, 1],
                [-1, -1],
                [-1.1, -1],
                [-1.6, -2],
                [-2.5, -2],
                [-5.5, -5]
            ];
            fixtures.forEach(([x, expect]) => {
                let result = $bignumber.from(x).dp(0, ROUNDING_MODE.ROUND_HALF_CEIL);
                eq_(Number(result.value), expect, `${x} -> ${expect} but got ${result.value}`);
                eq_(Number(result.value), Math.round(x));
            });
        },
        'HALF_FLOOR'() {
            // Rounds towards nearest neighbor. If equidistant, rounds towards -Infinity
            let fixtures = [
                [5.5, 5],
                [2.5, 2],
                [1.6, 2],
                [1.1, 1],
                [1, 1],
                [-1, -1],
                [-1.1, -1],
                [-1.6, -2],
                [-2.5, -3],
                [-5.5, -6]
            ];
            fixtures.forEach(([x, expect]) => {
                let result = $bignumber.from(x).dp(0, ROUNDING_MODE.ROUND_HALF_FLOOR);
                eq_(Number(result.value), expect, `${x} -> ${expect} but got ${result.value}`);
            });
        }
    },
})
