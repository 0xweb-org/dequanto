import { $number } from '@dequanto/utils/$number'
import alot from 'alot';

UTest({
    'random': {
        async 'float with explicit digit-count' () {
            let min = 0.01;
            let max = 0.02;

            let values = alot
                .fromRange(0, 50)
                .map(() => {
                    let r = $number.randomFloat(min, max, 8);
                    gte_(r, min);
                    lt_(r, max);
                    return r;
                })
                .toArray();

            let distinct = alot(values).distinct().toArray();
            eq_(distinct.length, values.length, 'Has repeated values.');
        },
        async 'float' () {
            let min = 0.01;
            let max = 0.020001;

            let values = alot
                .fromRange(0, 20)
                .map(() => {
                    let r = $number.randomFloat(min, max);
                    gte_(r, min);
                    lt_(r, max);
                    return r;
                })
                .toArray();

            let distinct = alot(values).distinct().toArray();
            eq_(distinct.length, values.length, 'Has repeated values. Random?');
        }
    }
})
