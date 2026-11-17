import { UTest } from 'atma-utest';
import { $abiCoder } from 'dequanto/abi/$abiCoder';
import { $traces } from 'dequanto/utils/$traces';
import { TEth } from 'dequanto/models/TEth';

const address = '0x0000000000000000000000000000000000000001';
const word = (value: number) => value.toString(16).padStart(64, '0');

UTest.create({
    async 'should return JSON calls without struct logs or an ABI' () {
        const output = `0x${'ab'.repeat(100)}` as TEth.Hex;
        const call = await $traces.getCalls({
            tx: { to: address, data: '0x12345678' },
            traces: { failed: false, returnValue: output, gas: 0, structLogs: [] },
            async getABI () { throw new Error('Unknown contract'); },
        });
        eq_(call.method, '0x12345678');
        eq_(call.args, null);
        eq_(call.abi, null);
        eq_(call.return, output);
        eq_(call.input, '0x12345678');
        deepEq_(call.calls, []);
        deepEq_(JSON.parse(JSON.stringify(call)), call);
    },

    async 'should return JSON errors and retain malformed revert bytes' () {
        for (const output of ['0x08c379a0', `0x4e487b71${$abiCoder.encode(['uint256'], [17n]).slice(2)}`] as TEth.Hex[]) {
            const call = await $traces.getCalls({
                tx: { to: address },
                traces: { failed: true, returnValue: output, gas: 0, structLogs: [] },
                async getABI () { return null; },
            });
            eq_(call.failed, true);
            if (output === '0x08c379a0') {
                eq_(call.return, output);
            } else {
                eq_(JSON.stringify(call.return).includes('"17"'), true);
            }
        }
    },

    async 'should zero fill memory expanded by a nested REVERT' () {
        const reason = 'ERC20: transfer from the zero address';
        const output = `0x08c379a0${$abiCoder.encode(['string'], [reason]).slice(2)}` as TEth.Hex;
        const memory = ('0'.repeat(256) + output.slice(2, -8)).match(/.{64}/g);
        const formatted = await $traces.format({
            tx: { to: address },
            traces: {
                failed: true,
                returnValue: output,
                gas: 0,
                structLogs: [
                    { depth: 1, op: 'DELEGATECALL', stack: [word(0), word(0), word(0), word(0), word(1), word(100_000)], memory: [] },
                    { depth: 2, op: 'REVERT', stack: [word(132), word(128)], memory },
                    { depth: 1, op: 'REVERT', stack: [word(132), word(0)], memory: output.slice(2).padEnd(320, '0').match(/.{64}/g) },
                ] as any,
            },
            async getABI () { return null; },
        });
        eq_(formatted.split(reason).length - 1, 2);
        eq_(formatted.split('[FAILED]').length - 1, 2);
        eq_(formatted.includes('delegatecall'), true);
    },

    async 'should preserve traces with malformed revert data' () {
        const formatted = await formatRevert('0x08c379a0');
        eq_(formatted.includes('0x08c379a0'), true);
        eq_(formatted.includes('[FAILED]'), true);
    },

    async 'should format numeric panic arguments' () {
        const formatted = await formatRevert(`0x4e487b71${$abiCoder.encode(['uint256'], [17n]).slice(2)}`);
        eq_(formatted.includes('"type":"Panic"'), true);
        eq_(formatted.includes('"17"'), true);
    },
});

function formatRevert(output: TEth.Hex) {
    return $traces.format({
        tx: { to: address },
        traces: { failed: true, returnValue: output, gas: 0, structLogs: [] },
        async getABI () { return null; },
    });
}
