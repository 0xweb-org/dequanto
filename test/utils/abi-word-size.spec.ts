import { $types } from 'dequanto/solidity/utils/$types';

UTest({
    'static ABI word sizes'() {
        let types = ['uint64', 'uint192', 'uint', 'address', 'bool', 'bytes12'];
        for (let type of types) {
            eq_($types.wordSizeOf(type), 1);
        }
        eq_($types.wordSizeOf('uint8[2]'), 2);
        eq_($types.wordSizeOf('bytes12[2][3]'), 6);
        eq_($types.wordSizeOf('(uint64, uint192, address, bytes12)'), 4);
        eq_($types.wordSizeOf('(uint8, (bytes12, bool))[2]'), 6);
        eq_($types.wordSizeOf({
            type: 'tuple[2]',
            components: [{ type: 'uint8[2]' }, { type: 'tuple', components: [{ type: 'bytes12' }] }]
        }), 6);
    },
    'dynamic and unknown sizes'() {
        let types = ['bytes', 'string', 'uint256[]', 'string[3]', 'uint8[][2]', '(uint8, string)', 'tuple', 'unknown'];
        for (let type of types) {
            eq_($types.wordSizeOf(type), Infinity);
        }
        eq_($types.wordSizeOf({ type: 'tuple', components: [{ type: 'bytes' }] }), Infinity);
    }
});
