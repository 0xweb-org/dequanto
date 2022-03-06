import { $fn } from '@dequanto/utils/$fn'

function foo (num: number) {
    if (num < 5) {
        return Promise.reject(new Error(`Too low: ${num}`));
    }
    return Promise.resolve(num);
}

UTest({
    async 'should resolve retriable' () {
        let result = await $fn
            .retriable(foo, null)
            .options({
                async onError (err) {
                    return [8]
                }
            })
            .call(3);

        eq_(result, 8);
    },
    async 'should throw' () {
        try {
            await $fn
                .retriable(foo, null)
                .options({
                    async onError (err) {
                        return [4]
                    }
                })
                .call(3);

            eq_(1, 0);
        } catch (error) {
            has_(error.message, `: 4`);
        }
    }
})
