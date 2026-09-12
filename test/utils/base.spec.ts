import { $base } from '@dequanto/utils/$base';

UTest({
    'test the base58 encode from hex string'() {
        const fixtures = [
            ['0x', ''],
            ['0x00', ''],
            ['0x61', '2g'],
            ['0x626262', 'a3gV'],
            ['0x636363', 'aPEr'],
            ['0x73696d706c792061206c6f6e6720737472696e67', '2cFupjhnEsSn59qHXstmK2ffpLv2'],
            ['0x00eb15231dfceb60925886b67d065299925915aeb172c06647', 'NS17iag9jJgTHD1VXjvLCEnZuQ3rJDE9L'],
            ['0x516b6fcd0f', 'ABnLTmg'],
            ['0xbf4f89001e670274dd', '3SEo3LWLoPntC'],
            ['0x123400', '77dH'],
        ] as const;

        for (const [hex, base58] of fixtures) {
            eq_($base.$58.encode(hex), base58);
        }
    }
})
