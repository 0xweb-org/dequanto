import { UTest } from 'atma-utest';
import { TEth } from 'dequanto/models/TEth';
import { TAbiItem } from 'dequanto/types/TAbi';
import { TxLogParser } from 'dequanto/txs/receipt/TxLogParser';
import { $abiProvider } from 'dequanto/utils/$abiProvider';
import { $abiUtils } from 'dequanto/utils/$abiUtils';
import { $contract } from 'dequanto/utils/$contract';

const event: TAbiItem = {
    type: 'event', name: 'Value', inputs: [{ name: 'value', type: 'uint256', indexed: true }]
};
const address: TEth.Address = '0x00000000000000000000000000000000000000ab';
const originalGetAbi = $abiProvider.getAbi;

function log(overrides: Partial<TEth.Log> = {}): TEth.Log {
    return {
        address,
        blockNumber: 10,
        logIndex: 0,
        transactionHash: '0x01',
        topics: [$abiUtils.getTopicSignature(event), `0x${'2a'.padStart(64, '0')}`],
        data: '0x',
        ...overrides,
    } as TEth.Log;
}

UTest.create({
    $after() {
        $abiProvider.getAbi = originalGetAbi;
    },
    async 'decodes by emitter and preserves order'() {
        let requests: TEth.Address[] = [];
        $abiProvider.getAbi = async (emitter, platform) => {
            eq_(platform, 'hardhat');
            requests.push(emitter);
            await Promise.resolve();
            return { abi: [{ ...event, inputs: [{ ...event.inputs[0], name: emitter.toLowerCase() === address ? 'value' : 'other' }] }] };
        };
        let logs = [log(), log({ address: '0x00000000000000000000000000000000000000AB', logIndex: 1 }),
            log({ address: '0x00000000000000000000000000000000000000cd', logIndex: 2 })];
        let parsed = await TxLogParser.parseWithAbiLookup({ logs }, { platform: 'hardhat' });
        deepEq_(requests, logs.map(item => item.address));
        eq_(parsed.length, 3);
        for (let i = 0; i < parsed.length; i++) {
            let item = parsed[i];
            eq_(item.raw, logs[i]);
            eq_(item.decoded, true);
            if (item.decoded === true) {
                eq_(item.event, 'Value');
                eq_(item.params[i === 2 ? 'other' : 'value'], 42n);
            }
        }
    },
    async 'returns individual failure reasons and continues decoding'() {
        let cases = [
            { abi: null, reason: 'ABI_UNAVAILABLE' },
            { abi: [], reason: 'EVENT_NOT_FOUND' },
            { abi: [{ ...event, type: 'function' }], reason: 'EVENT_NOT_FOUND' },
            { abi: [{ ...event, anonymous: true }], reason: 'EVENT_NOT_FOUND' },
            { abi: [event, { ...event, inputs: [{ ...event.inputs[0], indexed: false }] }], reason: 'AMBIGUOUS_EVENT' },
            { abi: [event], overrides: { topics: [$abiUtils.getTopicSignature(event), '0x'] }, reason: 'DECODE_FAILED' },
            { abi: [event], overrides: { topics: [$abiUtils.getTopicSignature(event)] }, reason: 'DECODE_FAILED' },
            { abi: [{ ...event, inputs: [{ ...event.inputs[0], indexed: false }] }], overrides: { topics: [$abiUtils.getTopicSignature(event)] }, reason: 'DECODE_FAILED' },
            { abi: [event], overrides: { topics: [] }, reason: 'EVENT_NOT_FOUND' },
            { abi: [event], reason: null },
        ];
        let logs = cases.map((test, i) => log({
            address: `0x${i.toString(16).padStart(40, '0')}`, ...test.overrides,
        } as Partial<TEth.Log>));
        $abiProvider.getAbi = async emitter => {
            let test = cases[logs.findIndex(item => item.address === emitter)];
            return test.abi == null ? null : { abi: test.abi as TAbiItem[] };
        };
        let parsed = await new TxLogParser().parseWithAbiLookup({ logs }, { platform: 'hardhat' });
        eq_(parsed.length, logs.length);
        for (let i = 0; i < cases.length; i++) {
            eq_(parsed[i].raw, logs[i]);
            eq_(parsed[i].decoded, cases[i].reason == null);
            if (parsed[i].decoded === false) {
                eq_((parsed[i] as { reason: string }).reason, cases[i].reason);
            }
        }
    },
    async 'uses the provider local ABI store and handles empty receipts'() {
        $abiProvider.getAbi = originalGetAbi;
        let emitter: TEth.Address = '0x000000000000000000000000000000000000abcd';
        $contract.store.register({ address: emitter, abi: [event] });
        let parsed = await TxLogParser.parseWithAbiLookup({ logs: [log({ address: emitter })] }, { platform: 'hardhat' });
        eq_(parsed[0].decoded, true);
        deepEq_(await TxLogParser.parseWithAbiLookup({ logs: [] }, { platform: 'hardhat' }), []);
    },
});
