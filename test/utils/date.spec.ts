import { $date } from '@dequanto/utils/$date'

UTest({
    'should check add seconds' () {
        let date = new Date();
        let x = $date.tool(date).add(`5s`).toUnixTimestamp();
        eq_(x, (date.valueOf() / 1000 | 0) + 5);
    }
})
