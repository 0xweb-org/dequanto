import { $abiType } from '@dequanto/utils/$abiType'
import { $abiUtils } from '@dequanto/utils/$abiUtils'

UTest({
    'get event topic hash'() {
        ([
            [`uint256`, `bigint`],
            [`mapping(address => uint8)`, `Record<TAddress, number>`],
            [`bool[]`, `boolean[]`],
            ['(string foo, bool bar)', '{ foo: string, bar: boolean }'],
            [ '(((uint256[] _values) _inner) members)', '{ members: { _inner: { _values: bigint[] } } }' ],

            [ 'mapping(bytes32 => uint8[])', 'Record<TBufferLike, number[]>' ],
            [ 'mapping(bytes32 => (uint8[] foo))', 'Record<TBufferLike, { foo: number[] }>' ],
            [
                '(((bytes32[] _values, mapping(bytes32 => uint256) _indexes) _inner) members, bytes32 adminRole)',
                '{ members: { _inner: { _values: TBufferLike[], _indexes: Record<TBufferLike, bigint> } }, adminRole: TBufferLike }'
            ],
            [
                'mapping(bytes32 => (((bytes32[] _values, mapping(bytes32 => uint256) _indexes) _inner) members, bytes32 adminRole))',
                'Record<TBufferLike, { members: { _inner: { _values: TBufferLike[], _indexes: Record<TBufferLike, bigint> } }, adminRole: TBufferLike }>'
            ]
        ]).forEach(([ sol, ts ]) => {

            let result = $abiType.getTsTypeFromDefinition(sol);

            result = result.replace(/\n/g, ', ');
            eq_(result, ts);
        })
    }
})
