import { UTest } from 'atma-utest';
import { $abiCoder } from 'dequanto/abi/$abiCoder';
import { $contract } from 'dequanto/utils/$contract';
import { File } from 'atma-io'
import { Fixtures } from '../Fixtures';
import { $cryptoImpl } from 'dequanto/utils/$crypto';
import { $buffer } from 'dequanto/utils/$buffer';
import alot from 'alot';

const implementations = [
    new $cryptoImpl.Node(),
    new $cryptoImpl.Web(),
];

UTest.create({
    async 'should calculate HMAC with raw keys' () {
        // RFC 2202 and RFC 4231, test case 1.
        let vectors = [
            { algorithm: 'SHA-1' as const, hash: '0xb617318655057264e28bc0b6fb378c8ef146be00' },
            { algorithm: 'SHA-256' as const, hash: '0xb0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7' },
            { algorithm: 'SHA-512' as const, hash: '0x87aa7cdea5ef619d4ff0b4241a1d6cb02379f4e2ce4ec2787ad0b30545e17cde' +
                'daa833b7d6b8a702038b274eaea3f4e4be9d914eeb61f1702e696c203a126854' },
        ];
        for (let crypto of implementations) {
            for (let { algorithm, hash } of vectors) {
                let secret = new Uint8Array(20).fill(0x0b);
                eq_(await crypto.hmac('Hi There', { secret, algorithm, encoding: 'hex' }), hash);
                let bytes = await crypto.hmac('Hi There', { secret, algorithm });
                eq_(bytes instanceof Uint8Array, true);
                eq_($buffer.toHex(bytes), hash);
                eq_($buffer.toHex(await crypto.hmac($buffer.fromString('Hi There'), {
                    secret, algorithm, encoding: 'binary',
                })), hash);
            }
            // RFC 2202, test case 2: text key without AES key derivation.
            eq_(await crypto.hmac('what do ya want for nothing?', {
                secret: 'Jefe', algorithm: 'SHA-1', encoding: 'hex',
            }), '0xeffcdf6ae5eb2fa2d27416d5f184df9c259a7c79');
        }
    },

    async 'should hash with SHA-1' () {
        let vectors = [
            { message: '', hash: '0xda39a3ee5e6b4b0d3255bfef95601890afd80709' },
            { message: 'abc', hash: '0xa9993e364706816aba3e25717850c26c9cd0d89d' },
            { message: 'abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq', hash: '0x84983e441c3bd26ebaae4aa1f95129e5e54670f1' },
        ];
        for (let crypto of implementations) {
            for (let { message, hash } of vectors) {
                eq_(await crypto.sha1(message, { encoding: 'hex' }), hash);
                let bytes = await crypto.sha1(message);
                eq_(bytes instanceof Uint8Array, true);
                eq_(bytes.length, 20);
                eq_($buffer.toHex(bytes), hash);
                eq_($buffer.toHex(await crypto.sha1($buffer.fromString(message), { encoding: 'binary' })), hash);
            }
        }
    },

    async 'should encrypt' () {
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
