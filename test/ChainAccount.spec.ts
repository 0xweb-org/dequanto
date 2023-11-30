
import { ChainAccountService } from '@dequanto/ChainAccountService';
import { Config } from '@dequanto/Config';
import { $account } from '@dequanto/utils/$account';
import { $is } from '@dequanto/utils/$is';
import { File } from 'atma-io';
import memd from 'memd';


UTest({
    async 'generate account' () {
        let { key, address } = $account.generate();
        eq_($is.Address(address), true);
    },
    async 'save encrypted account' () {
        const path = './test/tmp/accounts.json';
        await File.removeAsync(path);

        async function createService () {
            memd.fn.clearMemoized(Config.fetch);

            let config = await Config.fetch({
                "config-accounts": path,
                "pin": "12345"
            });


            let service = new ChainAccountService({ config });
            return { service, config };
        }


        let { service } = await createService();
        let account = await service.generate({ name: 'foo' });

        eq_(await File.existsAsync(path), true);
        let content = await File.readAsync(path, { skipHooks: true });
        gt_(content.length, 10)
        hasNot_(content, 'foo');


        let { service: serviceFresh } = await createService();

        let account2 = await serviceFresh.get('foo');
        deepEq_(account, account2);
    }
})
