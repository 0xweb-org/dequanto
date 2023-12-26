import { $abiType } from '@dequanto/utils/$abiType'


UTest({
    'get event topic hash'() {
        ([
            [`uint256`, `bigint`],
            [`mapping(address => uint8)`, `Record<string | number, number>`],
            [`bool[]`, `boolean[]`],
            ['(string foo, bool bar)', '{ foo: string, bar: boolean }'],
            [ '(((uint256[] _values) _inner) members)', '{ members: { _inner: { _values: bigint[] } } }' ],

            [ 'mapping(bytes32 => uint8[])', 'Record<string | number, number[]>' ],
            [ 'mapping(bytes32 => (uint8[] foo))', 'Record<string | number, { foo: number[] }>' ],
            [
                '(((bytes32[] _values, mapping(bytes32 => uint256) _indexes) _inner) members, bytes32 adminRole)',
                '{ members: { _inner: { _values: TEth.Hex[], _indexes: Record<string | number, bigint> } }, adminRole: TEth.Hex }',
            ],
            [
                'mapping(bytes32 => (((bytes32[] _values, mapping(bytes32 => uint256) _indexes) _inner) members, bytes32 adminRole))',
                'Record<string | number, { members: { _inner: { _values: TEth.Hex[], _indexes: Record<string | number, bigint> } }, adminRole: TEth.Hex }>'
            ]
        ]).forEach(([ sol, ts ]) => {

            let result = $abiType.getTsTypeFromDefinition(sol);

            result = result.replace(/\n/g, ', ');
            eq_(result, ts);
        })
    }
})
