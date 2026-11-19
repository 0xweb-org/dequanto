import { UTest } from 'atma-utest';
import { $abiCoder } from 'dequanto/abi/$abiCoder';
import { TEth } from 'dequanto/models/TEth';
import { TAbiInput, TAbiItem } from 'dequanto/types/TAbi';
import { TxLogParser } from 'dequanto/txs/receipt/TxLogParser';
import { TxTopicProvider } from 'dequanto/txs/receipt/TxTopicProvider';
import { $abiProvider } from 'dequanto/utils/$abiProvider';
import { $abiParser } from 'dequanto/utils/$abiParser';
import { $abiUtils } from 'dequanto/utils/$abiUtils';
import { $contract } from 'dequanto/utils/$contract';

const address: TEth.Address = '0x0000000000000000000000000000000000000012';
const hash = `0x${'ab'.repeat(32)}` as TEth.Hex;
const components: TAbiInput[] = [
    { name: 'amount', type: 'uint256' },
    { name: 'account', type: 'address' },
];

function fixture(abi: TAbiItem, topics: TEth.Hex[], data: TEth.Hex, values: any[]) {
    let log = {
        address,
        blockNumber: 42,
        logIndex: 7,
        transactionHash: '0x1234',
        topics: [$abiUtils.getTopicSignature(abi), ...topics],
        data,
    } as TEth.Log;
    let args = abi.inputs.map((input, i) => ({ name: input.name, value: values[i] }));
    return {
        abi,
        log,
        expected: {
            id: 4_200_007,
            blockNumber: 42,
            logIndex: 7,
            transactionHash: '0x1234',
            address,
            event: abi.name,
            arguments: args,
            params: Object.fromEntries(args.map(arg => [arg.name, arg.value])),
        },
    };
}

function changed(value: bigint) {
    // event Changed(uint256 value, address indexed account, uint256 previous, uint256 indexed next)
    let abi: TAbiItem = {
        type: 'event', name: 'Changed', inputs: [
            { name: 'value', type: 'uint256' },
            { name: 'account', type: 'address', indexed: true },
            { name: 'previous', type: 'uint256', indexed: false },
            { name: 'next', type: 'uint256', indexed: true },
        ],
    };
    return fixture(abi, [
        $abiCoder.encode(['address'], [address]),
        $abiCoder.encode(['uint256'], [value + 1n]),
    ], $abiCoder.encode(['uint256', 'uint256'], [value, value - 1n]), [value, address, value - 1n, value + 1n]);
}

function references() {
    let inputs: TAbiInput[] = [
        { name: 'fixedArray', type: 'uint256[2]' },
        { name: 'dynamicArray', type: 'uint256[]' },
        { name: 'staticTuple', type: 'tuple', components },
        { name: 'dynamicTuple', type: 'tuple', components: [{ name: 'text', type: 'string' }] },
        { name: 'text', type: 'string' },
        { name: 'bytes', type: 'bytes' },
    ];
    return inputs.map(input => fixture({
        type: 'event',
        name: `Reference_${input.name}`,
        inputs: [{ ...input, indexed: true }],
    }, [hash], '0x', [hash]));
}

function scalars() {
    let inputs: TAbiInput[] = [
        { name: 'account', type: 'address', indexed: true },
        { name: 'amount', type: 'uint256', indexed: true },
        { name: 'word', type: 'bytes32', indexed: true },
    ];
    let values = [address, 123n, hash];
    return fixture({ type: 'event', name: 'Scalars', inputs },
        inputs.map((input, i) => $abiCoder.encode([input], [values[i]])), '0x', values);
}

function nonIndexed() {
    let inputs: TAbiInput[] = [
        { name: 'fixedArray', type: 'uint256[2]' },
        { name: 'dynamicArray', type: 'uint256[]' },
        { name: 'staticTuple', type: 'tuple', components },
        { name: 'dynamicTuple', type: 'tuple', components: [{ name: 'text', type: 'string' }] },
    ];
    let values = [[11n, 12n], [21n, 22n, 23n], { amount: 31n, account: address }, { text: 'hello' }];
    return fixture({ type: 'event', name: 'NonIndexed', inputs }, [], $abiCoder.encode(inputs, values), values);
}

UTest.create({
    async 'decodes all arguments from data when indexed topics are absent'() {
        let abi = $abiParser.parseMethod('event Transfer(address indexed from, address indexed to, uint256 amount)');
        let from = '0x0000000000000000000000000000000000000000';
        let values = [from, address, 10n];
        let transfer = fixture(abi, [], $abiCoder.encode(abi.inputs, values), values);
        let referenceAbi = $abiParser.parseMethod('event Message(string indexed text, uint256 amount)');
        let reference = fixture(referenceAbi, [], $abiCoder.encode(referenceAbi.inputs, ['hello', 42n]), ['hello', 42n]);
        let tests = [transfer, reference];
        let original = $abiProvider.getAbi;
        try {
            for (let test of tests) {
                deepEq_($contract.parseLogWithAbi(test.log, test.abi), test.expected);
                $abiProvider.getAbi = async () => ({ abi: [test.abi] });
                let parsed = await TxLogParser.parseWithAbiLookup({ logs: [test.log] }, { platform: 'hardhat' });
                deepEq_(parsed, [{ ...test.expected, decoded: true, raw: test.log }]);
            }
            deepEq_(abi.inputs.map(input => input.indexed), [true, true, undefined]);
            eq_(referenceAbi.inputs[0].indexed, true);
        } finally {
            $abiProvider.getAbi = original;
        }
    },
    'infers leading indexed arguments when indexed metadata is omitted'() {
        let abi: TAbiItem = {
            type: 'event', name: 'Transfer', inputs: [
                { name: 'from', type: 'address' },
                { name: 'to', type: 'address' },
                { name: 'amount', type: 'uint256' },
            ],
        };
        let values = ['0x0000000000000000000000000000000000000000', address, 10n];
        let counts = [0, 1, 2];
        for (let count of counts) {
            let topics = abi.inputs.slice(0, count).map((input, i) => $abiCoder.encode([input], [values[i]]));
            let test = fixture(abi, topics, $abiCoder.encode(abi.inputs.slice(count), values.slice(count)), values);
            deepEq_($contract.parseLogWithAbi(test.log, 'event Transfer(address from, address to, uint256 amount)'), test.expected);
            deepEq_($contract.parseLogWithAbi(test.log, abi), test.expected);
            deepEq_(abi.inputs.map(input => input.indexed), [undefined, undefined, undefined]);
        }
    },
    async 'decodes ERC20 transfers with the default topic ABI'() {
        let abi: TAbiItem = {
            type: 'event', name: 'Transfer', inputs: [
                { name: 'from', type: 'address', indexed: true },
                { name: 'to', type: 'address', indexed: true },
                { name: 'amount', type: 'uint256', indexed: false },
            ],
        };
        let from = '0x0000000000000000000000000000000000000000';
        let test = fixture(abi, [
            $abiCoder.encode(['address'], [from]),
            $abiCoder.encode(['address'], [address]),
        ], $abiCoder.encode(['uint256'], [10n]), [from, address, 10n]);
        let topic = await new TxTopicProvider().get(test.log.topics[0]);
        deepEq_($contract.parseLogWithAbi(test.log, topic.abi), test.expected);
    },
    'preserves declaration order, named params and metadata'() {
        let test = changed(42n);
        deepEq_($contract.parseLogWithAbi(test.log,
            'event Changed(uint256 value, address indexed account, uint256 previous, uint256 indexed next)'), test.expected);
        deepEq_($contract.parseLogWithAbi(test.log, test.abi), test.expected);
        deepEq_($contract.parseLogWithAbi(test.log, [test.abi]), test.expected);
        deepEq_(test.abi.inputs.map(input => input.name), ['value', 'account', 'previous', 'next']);
    },
    'preserves all indexed reference hashes and decodes scalars and non-indexed composites'() {
        let tests = [...references(), scalars(), nonIndexed()];
        for (let test of tests) {
            deepEq_($contract.parseLogWithAbi(test.log, test.abi), test.expected);
        }
    },
    async 'ABI lookup inherits decoding fixes and preserves repeated events in receipt order'() {
        let tests = [changed(42n), ...references(), scalars(), nonIndexed(), changed(99n), ...references()];
        let abi = tests.map(test => test.abi).filter((item, i, all) => all.findIndex(x => x.name === item.name) === i);
        let logs = tests.map((test, i) => ({ ...test.log, logIndex: i + 10 }));
        let original = $abiProvider.getAbi;
        try {
            $abiProvider.getAbi = async () => ({ abi });
            let parsed = await TxLogParser.parseWithAbiLookup({ logs }, { platform: 'hardhat' });
            eq_(parsed.length, tests.length);
            for (let i = 0; i < tests.length; i++) {
                eq_(parsed[i].raw, logs[i]);
                deepEq_(parsed[i], {
                    ...tests[i].expected,
                    id: 4_200_000 + logs[i].logIndex,
                    logIndex: logs[i].logIndex,
                    decoded: true,
                    raw: logs[i],
                });
            }
        } finally {
            $abiProvider.getAbi = original;
        }
    },
});
