import { $date } from '@dequanto/utils/$date'

UTest({
    'should check add seconds' () {
        let x = $date.tool().add(`5s`).toUnixTimestamp();
        console.log(x);
    }
})
