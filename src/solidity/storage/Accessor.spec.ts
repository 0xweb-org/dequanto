import { Accessor } from './Accessor'

UTest({
    'should parse accessors' () {
        ([
            [
                ['foo', ' foo '],
                [ { key: 'foo', type: 'key' } ]
            ],
            [
                ['foo.bar', 'foo . bar', `['foo']["bar"]`],
                [ { key: 'foo', type: 'key'}, { key: 'bar', type: 'key' } ]
            ],
            [
                ['foo[1].bar', 'foo [1].bar', 'foo [ 1 ].bar'],
                [
                    { key: 'foo', type: 'key'},
                    { key: 1, type: 'index'},
                    { key: 'bar', type: 'key' },
                ]
            ],
            [
                ['foo["some"].bar', 'foo [   "some"  ] .bar', ],
                [
                    { key: 'foo', type: 'key'},
                    { key: 'some', type: 'key'},
                    { key: 'bar', type: 'key' },
                ]
            ],
            [
                ['[2].bar', '[2 ] ["bar"]'],
                [
                    { key: 2, type: 'index'},
                    { key: 'bar', type: 'key' },
                ]
            ],
        ] as const).forEach(([paths, expect]) => {

            paths.forEach(path => {
                let keys = Accessor.parse(path).keys;
                deepEq_(keys, expect, `${path} doesnt match ${ JSON.stringify(expect, null, 2) }`);
            })
        })
    }
})
