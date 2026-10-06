import { strict as assert } from 'assert';
import { SlotsParser } from 'dequanto/solidity/SlotsParser';
import { SlotsStorage } from 'dequanto/solidity/SlotsStorage';
import { SlotsStorageTransportForArray, SlotsStorageTransportForMapping } from 'dequanto/solidity/storage/SlotsStorageTransport';
import { GeneratorStorageReader } from 'dequanto/gen/GeneratorStorageReader';

UTest({
    async 'keeps large slots exact through parsing and storage access' () {
        let base = 2n ** 200n;
        let slots = await SlotsParser.slots({
            path: 'BigSlots.sol',
            code: 'contract BigSlots layout at 2 ** 200 { uint256 a; uint256 b; }'
        });
        assert.deepEqual(slots.map(x => x.slot), [base, base + 1n]);
        let locations: bigint[] = [];
        let transport = {
            async getStorageAt(slot) { locations.push(BigInt(slot)); return '0x' + '0'.repeat(63) + '7'; },
            async setStorageAt(slot) { locations.push(BigInt(slot)); },
            mapToGlobalSlot(slot = 0n) { return BigInt(slot); },
            async extractMappingKeys() { return { keys: [] }; }
        };
        let storage = new SlotsStorage(transport, slots);
        eq_(await storage.get('b'), 7n);
        await storage.set('b', 9n);
        assert.deepEqual(locations, [base + 1n, base + 1n]);

        let legacy = new SlotsStorage(transport, [{ ...slots[0], slot: 3 }]);
        eq_(legacy.slots[0].slot, 3n);
        await legacy.get('a');
        eq_(locations.pop(), 3n);

        for (let reader of [
            new SlotsStorageTransportForArray(transport, base, 2, 3n),
            new SlotsStorageTransportForMapping(transport, base, 7)
        ]) {
            let offset = 2n ** 60n + 1n;
            let location = reader.mapToGlobalSlot(offset);
            locations.length = 0;
            await reader.getStorageAt(offset, 0, 256);
            await reader.setStorageAt(offset, 0, 256, 9n);
            deepEq_(locations, [location, location]);
            eq_(reader.mapToGlobalSlot(3), reader.mapToGlobalSlot(3n));
        }
    },
    async 'generates executable bigint slot literals' () {
        let base = 2n ** 200n;
        for (let target of ['js', 'ts'] as const) {
            let generated = await new GeneratorStorageReader().generate({
                target,
                name: 'BigSlots', contractName: 'BigSlots', network: 'eth',
                address: '0x0000000000000000000000000000000000000001',
                sources: { 'BigSlots.sol': { content: 'contract BigSlots layout at 2 ** 200 { uint256 a; uint256 b; }' } }
            });
            has_(generated.code, String(base));
            has_(generated.types, String(base + 1n));
            if (target === 'js') {
                let Reader = new Function('ContractStorageReaderBase', generated.code + '; return BigSlotsStorageReader;')(class {
                    $createHandler() {}
                });
                deepEq_(new Reader().$slots.map(x => x.slot), [base, base + 1n]);
            }
        }
    }
});
