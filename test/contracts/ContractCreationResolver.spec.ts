import { Config } from '@dequanto/config/Config';
import { ContractCreationResolver } from '@dequanto/contracts/ContractCreationResolver';
import { $promise } from '@dequanto/utils/$promise';

UTest({
    async $before () {
        await Config.fetch()
    },
    async 'should get the date for contract' () {
        //> dai-eth uniswap v2 pair
        let address = `0xa478c2975ab1ea89e8196811f51a7b7ade33eb11` as const;
        let resolver = ContractCreationResolver.get('eth');

        let info = await resolver.getInfo(address);
        eq_(info.tx, '0xc4c1840db940f5075c5404266efe50d7c65bc079f318ab8e5a10b8a432b49d30');
        eq_(info.block, 10042267);
        eq_(info.timestamp, 1589164213);
    },
    async 'should throw if not a contract' () {
        let address = `0xa478c2975ab1ea89e8196811f51a7b7ade33eb00` as const;
        let resolver = ContractCreationResolver.get('eth');

        let { error } = await $promise.caught(resolver.getInfo(address))
        has_(error?.message, 'not a contract')
    }
})
