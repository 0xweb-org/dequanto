import { UTest } from 'atma-utest';
import { $abi } from 'dequanto/abi/$abi';
import { TAbiItem } from 'dequanto/types/TAbi';

const transfer: TAbiItem = {
    type: 'function',
    name: 'transfer',
    inputs: [{ type: 'address' }, { type: 'uint256' }],
};

UTest.create({
    'extract selector from calldata'() {
        const data = $abi.encodeCall(transfer, ['0x0000000000000000000000000000000000000002', 5n]);
        eq_($abi.getSelectorFromData(data), '0xa9059cbb');
        eq_($abi.getSelectorFromData('0xA9059CBB'), '0xa9059cbb');

        const invalid = ['', '0x', '0x123456', 'a9059cbb', '0xa9059cbz', '0xa9059cbb0', '0xa9059cbbzz'];
        for (const data of invalid) {
            eq_($abi.getSelectorFromData(data), null);
        }
    },
    'compute selectors from JSON and human-readable ABI'() {
        eq_($abi.getSelectorFromAbi(transfer), '0xa9059cbb');
        eq_($abi.getSelectorFromAbi('transfer(address,uint256)'), '0xa9059cbb');
        eq_($abi.getSelectorFromAbi('function transfer(address to, uint amount) returns (bool)'), '0xa9059cbb');
        eq_($abi.getSelectorFromAbi({ type: 'function', name: 'totalSupply' }), '0x18160ddd');

        const tuple: TAbiItem = {
            type: 'function',
            name: 'foo',
            inputs: [{ type: 'tuple[2][]', components: [{ type: 'uint' }, { type: 'address' }] }],
        };
        eq_($abi.getSelectorFromAbi(tuple), $abi.getSelectorFromAbi('foo((uint256,address)[2][])'));
    },
    'find function ABI by selector and calldata'() {
        const overload: TAbiItem = { type: 'function', name: 'transfer', inputs: [{ type: 'address' }] };
        const abi: TAbiItem[] = [
            { ...transfer, type: 'event' },
            { ...transfer, type: 'error' },
            { type: 'constructor' },
            { type: 'fallback' },
            { type: 'receive' },
            overload,
            transfer,
        ];
        eq_($abi.findAbiBySelector('0xA9059CBB', abi), transfer);
        eq_($abi.findAbiBySelector($abi.getSelectorFromAbi(overload), abi), overload);
        const data = $abi.encodeCall(transfer, ['0x0000000000000000000000000000000000000002', 5n]);
        eq_($abi.findAbiByData(data, abi), transfer);
        eq_($abi.findAbiByData('0xa9059cbb', abi), transfer);
        eq_($abi.findAbiByData('0x', abi), null);
        eq_($abi.findAbiBySelector(data, abi), null);
        eq_($abi.findAbiBySelector('0x12345678', abi), null);
        eq_($abi.findAbiBySelector('0xa9059cbb', []), null);
        eq_($abi.findAbiBySelector('0xa9059cbb', [{ ...transfer, type: 'error' }]), null);
    },
});
