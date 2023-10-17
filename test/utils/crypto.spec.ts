import { $abiCoder } from '@dequanto/abi/$abiCoder';
import { $contract } from '@dequanto/utils/$contract';
import { File } from 'atma-io'
import { Fixtures } from '../Fixtures';
import { $cryptoImpl } from '@dequanto/utils/$crypto';
import { $buffer } from '@dequanto/utils/$buffer';
import alot from 'alot';

const implementations = [
    new $cryptoImpl.Node(),
    new $cryptoImpl.Web(),
];

UTest({
    async 'encrypt' () {
        let fixtures = {
            'simple signature': [
                {
                    message: 'hello world',
                    key: 'mypassword',
                }
            ]
        };

        await Fixtures.walk(fixtures, async ([{ message, key }]) => {

            await alot(implementations).forEachAsync(async $crypto => {

                let encrypted = await $crypto.encrypt(message, { secret: key });
                let decrypted = await $crypto.decrypt(encrypted, { secret: key, encoding: 'utf8' });
                eq_(message, decrypted);

            }).toArrayAsync({ threads: 1 })

        });
    }
})
