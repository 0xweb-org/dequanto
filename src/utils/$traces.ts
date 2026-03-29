import { $abiCoder } from '@dequanto/abi/$abiCoder';
import { TClientDebugTraces } from '@dequanto/clients/debug/ClientDebugMethods';
import { TEth } from '@dequanto/models/TEth';
import { $abiUtils } from './$abiUtils';
import { $bigint } from './$bigint';
import { $hex } from '@dequanto/utils/$hex';
import { $color, ColorData } from './$color';
import { TAbiItem } from '@dequanto/types/TAbi';
import alot from 'alot';

export namespace $traces {

    type TStructLog = TClientDebugTraces['structLogs'][0];
    type TAbiMeta = {
        name?: string
        contractName?: string
        abi: (TAbiItem | TEth.Abi.Item)[]
    };
    type TTraceEvent = {
        index: number
        op: string
        topics: TEth.Hex[]
        data: TEth.Hex
        label?: string
    };

    type TTraceFrame = {
        id: number
        parentId: number | null
        depth: number
        start: number
        end: number
        callSite: number | null
        callOp: string
        to: TEth.Address | null
        value: string | number | bigint | null
        input: TEth.Hex | null
        selector: TEth.Hex | null
        output: TEth.Hex | null
        children: TTraceFrame[]
        events: TTraceEvent[]
        failed?: boolean
        exitOp?: string
        label?: string
    };

    const CALL_OPS = new Set([ 'CALL', 'STATICCALL', 'DELEGATECALL', 'CALLCODE' ]);
    const FAILURE_OPS = new Set([ 'REVERT', 'INVALID' ]);

    export async function format (params: {
        tx: TEth.TxLike
        traces: TClientDebugTraces
        getABI (contract: TEth.Address): Promise<TAbiMeta>
        color?: boolean
        shortAddress?: boolean
        addresses?: Record<TEth.Address, string>,
    }): Promise<string> {
        const logs = params.traces.structLogs ?? [];
        const frames = logs.length > 0
            ? buildFrames(logs)
            : [];
        const abiCache = new Map<string, Promise<TAbiMeta | null>>();

        const entryAbiMeta = params.tx.to != null
            ? await getAbiMeta(params.tx.to)
            : null;
        const entryAbiItem = getFunctionAbiItem(entryAbiMeta, getSelector(params.tx));

        if (frames[0] != null) {
            frames[0].to = params.tx.to ?? null;
            frames[0].value = params.tx.value ?? null;
            frames[0].input = getInput(params.tx);
            frames[0].selector = getSelector(params.tx);
            frames[0].output = params.traces.returnValue ?? frames[0].output;
        }

        await Promise.all(frames.map(async frame => {
            let abiMeta = frame.to != null
                ? await getAbiMeta(frame.to)
                : null;
            let abiItem = getFunctionAbiItem(abiMeta, frame.selector);

            if (frame.id !== 0) {
                frame.label = formatFrameLabel(frame, abiMeta?.contractName ?? abiMeta?.name, abiItem, params);
            }
            for (let event of frame.events) {
                event.label = formatEventLabel(event, abiMeta, params);
            }
        }));

        for (let frame of frames) {
            if (frame.id !== 0) {
                frame.label ??= formatFrameLabel(frame, null, null, params);
            }
            for (let event of frame.events) {
                event.label ??= formatEventLabel(event, null, params);
            }
        }

        let lines: string[] = [];
        let entryLine = formatEntrypointLabel(params.tx, params.traces, entryAbiMeta?.contractName ?? entryAbiMeta?.name, entryAbiItem, params);
        lines.push(`${entryLine}${params.traces.failed ? ' [FAILED]' : ''}`);

        let root = frames[0];
        if (root != null) {
            appendEntries(root, 1, lines);
        }

        let addresses = alot.fromObject(params.addresses ?? {}).map(x => {
            return `${x.key} <=> ${x.value}`;
        }).toArray();

        lines.push('\n', ...addresses);

        return lines.join('\n');

        async function getAbiMeta(contract: TEth.Address): Promise<TAbiMeta | null> {
            let key = contract.toLowerCase();
            if (abiCache.has(key) === false) {
                abiCache.set(key, params.getABI(contract).catch(() => null));
            }
            return await abiCache.get(key);
        }

        function appendEntries(frame: TTraceFrame, level: number, out: string[]) {
            let indent = '  '.repeat(level);
            let entries = [
                ...frame.children.map(child => ({ kind: 'frame' as const, index: child.start, frame: child })),
                ...frame.events.map(event => ({ kind: 'event' as const, index: event.index, event })),
            ].sort((a, b) => a.index - b.index);

            for (let entry of entries) {
                if (entry.kind === 'frame') {
                    out.push(`${indent}${entry.frame.label}${entry.frame.failed ? ' [FAILED]' : ''}`);
                    appendEntries(entry.frame, level + 1, out);
                    continue;
                }
                out.push(`${indent}${entry.event.label}`);
            }
        }
    }

    function buildFrames(logs: TStructLog[]): TTraceFrame[] {
        let root: TTraceFrame = {
            id: 0,
            parentId: null,
            depth: logs[0].depth,
            start: 0,
            end: logs.length - 1,
            callSite: null,
            callOp: 'ROOT',
            to: null,
            value: null,
            input: null,
            selector: null,
            output: null,
            children: [],
            events: []
        };

        let frames = [ root ];
        let open = [ root ];

        for (let i = 1; i < logs.length; i++) {
            let prev = logs[i - 1];
            let current = logs[i];

            while (open.length > 0 && open[open.length - 1].depth > current.depth) {
                let closing = open.pop();
                closing.end = i - 1;
            }

            let active = open[open.length - 1];
            if (current.depth > active.depth) {
                let meta = CALL_OPS.has(prev.op)
                    ? getCallMeta(prev)
                    : { op: prev.op, to: null, value: null, input: null, selector: null };

                let frame: TTraceFrame = {
                    id: frames.length,
                    parentId: active.id,
                    depth: current.depth,
                    start: i,
                    end: i,
                    callSite: i - 1,
                    callOp: meta.op,
                    to: meta.to,
                    value: meta.value,
                    input: meta.input,
                    selector: meta.selector,
                    output: null,
                    children: [],
                    events: []
                };
                active.children.push(frame);
                frames.push(frame);
                open.push(frame);
                active = frame;
            }

            let event = getEventMeta(current, i);
            if (event != null) {
                active.events.push(event);
            }

            active.end = i;
        }

        while (open.length > 0) {
            let frame = open.pop();
            frame.end = logs.length - 1;
        }

        for (let frame of frames) {
            let endLog = logs[frame.end];
            frame.exitOp = endLog?.op;
            frame.failed = FAILURE_OPS.has(frame.exitOp);
            frame.output = getOutputMeta(endLog);
        }

        return frames;
    }

    function getCallMeta(log: TStructLog): {
        op: string
        to: TEth.Address | null
        value: bigint | null
        input: TEth.Hex | null
        selector: TEth.Hex | null
    } {
        let stack = log.stack ?? [];
        let to: TEth.Address | null = null;
        let value: bigint | null = null;
        let inputOffset = 0;
        let inputSize = 0;

        if (log.op === 'CALL' || log.op === 'CALLCODE') {
            if (stack.length < 7) {
                return { op: log.op, to: null, value: null, input: null, selector: null };
            }
            to = toAddress(stack[stack.length - 2]);
            value = toBigInt(stack[stack.length - 3]);
            inputOffset = toNumber(stack[stack.length - 4]);
            inputSize = toNumber(stack[stack.length - 5]);
        } else if (log.op === 'STATICCALL' || log.op === 'DELEGATECALL') {
            if (stack.length < 6) {
                return { op: log.op, to: null, value: null, input: null, selector: null };
            }
            to = toAddress(stack[stack.length - 2]);
            inputOffset = toNumber(stack[stack.length - 3]);
            inputSize = toNumber(stack[stack.length - 4]);
        } else {
            return { op: log.op, to: null, value: null, input: null, selector: null };
        }

        let input = readMemory(log.memory ?? [], inputOffset, inputSize);
        let selector = input != null && input.length >= 10
            ? input.slice(0, 10) as TEth.Hex
            : null;

        return {
            op: log.op,
            to,
            value,
            input,
            selector,
        };
    }

    function getEventMeta(log: TStructLog, index: number): TTraceEvent | null {
        let match = /^LOG([0-4])$/.exec(log.op);
        if (match == null) {
            return null;
        }
        let topicCount = Number(match[1]);
        let stack = log.stack ?? [];
        if (stack.length < topicCount + 2) {
            return null;
        }
        let offset = toNumber(stack[stack.length - 1]);
        let size = toNumber(stack[stack.length - 2]);
        let topics = Array.from({ length: topicCount }, (_, i) => {
            return $hex.ensure(stack[stack.length - 3 - i]) as TEth.Hex;
        });
        let data = readMemory(log.memory ?? [], offset, size) ?? '0x';
        return {
            index,
            op: log.op,
            topics,
            data,
        };
    }

    function readMemory(memory: string[], offset: number, size: number): TEth.Hex | null {
        if (size <= 0 || memory.length === 0) {
            return null;
        }
        let hex = memory.join('');
        let start = offset * 2;
        let end = start + size * 2;
        return `0x${hex.slice(start, end)}` as TEth.Hex;
    }

    function formatEntrypointLabel(
        tx: TEth.TxLike,
        traces: TClientDebugTraces,
        contractName: string | null,
        abi: TEth.Abi.Item | null,
        params: {
            color?: boolean
        }
    ): string {
        let frame: TTraceFrame = {
            id: -1,
            parentId: null,
            depth: 0,
            start: 0,
            end: 0,
            callSite: null,
            callOp: '',
            to: tx.to ?? null,
            value: tx.value ?? null,
            input: getInput(tx),
            selector: getSelector(tx),
            output: traces.returnValue ?? null,
            children: [],
            events: [],
            failed: traces.failed,
            exitOp: null,
        };
        return formatFrameLabel(frame, contractName, abi, params);
    }

    function formatFrameLabel(frame: TTraceFrame, contractName: string | null, abi: TEth.Abi.Item | null, params: {
        shortAddress?: boolean
        color?: boolean
        addresses?: Record<string, string>
    }): string {
        let head = color('gray', frame.callOp.toLowerCase(), params);
        let suffix = '';

        if (frame.to != null) {
            let address = shortAddress(frame.to, params);
            if (contractName != null && abi != null && 'name' in abi && abi.name != null) {
                let args = frame.input != null
                    ? decodeArgs(abi, frame.input, params)
                    : '';
                if (params != null) {
                    params.addresses ??= {};
                    params.addresses[address] = contractName;
                }
                suffix = `${color('bold', contractName, params)}.${color('magenta', abi.name, params)}(${args})`;
            } else {
                suffix = `${address}${frame.selector ? ` ${frame.selector}` : ''}`;
                if (frame.input != null) {
                    suffix += ` calldata=${shortHex(frame.input, 18, 10)}`;
                }
            }
        }

        if (frame.value != null && frame.value !== 0n) {
            suffix += `${suffix ? ' ' : ''}`;
            if (frame.value && BigInt(frame.value) > 0n) {
                suffix += `value=${frame.value.toString()}`
            }
        }
        if (frame.exitOp != null && frame.exitOp !== 'STOP' && frame.exitOp !== 'RETURN') {
            suffix += `${suffix ? ' ' : ''}exit=${frame.exitOp}`;
        }
        if (frame.output != null) {
            let returnValue = formatReturnValue(frame, abi, params);
            suffix += `: ${returnValue}`;
        }

        return suffix ? `${head} ${suffix}` : head;
    }

    function formatEventLabel(event: TTraceEvent, abiMeta: TAbiMeta | null | undefined, params: {
        color?: boolean
    }): string {
        let abi = getEventAbiItem(abiMeta, event.topics);
        if (abi == null) {
            let head = color('cyan', 'event', params);
            let name = event.topics[0] != null
                ? shortHex(event.topics[0], 18, 10)
                : event.op;
            return `${head} ${name}`;
        }

        let args = decodeEventArgs(abi, event, params);
        return `${color('cyan', 'event', params)} ${color('magenta', abi.name, params)}(${args})`;
    }

    function getFunctionAbiItem(abiMeta: TAbiMeta | null | undefined, selector: TEth.Hex | null): TEth.Abi.Item | null {
        if (abiMeta == null || selector == null) {
            return null;
        }
        return abiMeta.abi.find(item => {
            if (item.type !== 'function' || !('name' in item)) {
                return false;
            }
            return $abiUtils.getMethodSignature(item) === selector;
        }) ?? null;
    }

    function getEventAbiItem(abiMeta: TAbiMeta | null | undefined, topics: TEth.Hex[]): TEth.Abi.Item | null {
        if (abiMeta == null) {
            return null;
        }
        return abiMeta.abi.find(item => {
            if (item.type !== 'event' || !('name' in item) || item.name == null) {
                return false;
            }
            if ('anonymous' in item && item.anonymous === true) {
                return topics.length === (item.inputs?.filter(x => x.indexed).length ?? 0);
            }
            return topics[0] === $abiUtils.getTopicSignature(item);
        }) ?? null;
    }

    function decodeArgs(abi: TEth.Abi.Item, input: TEth.Hex, params: {
        color?: boolean
    }): string {
        try {
            let inputs = 'inputs' in abi && Array.isArray(abi.inputs)
                ? abi.inputs
                : [];
            if (inputs.length === 0) {
                return '';
            }
            let data = `0x${input.slice(10)}` as TEth.Hex;
            let values = $abiCoder.decode(inputs as any, data);
            return inputs.map((param, index) => {
                let name = param.name?.trim() || `arg${index}`;
                return `${name}: ${formatValue(values[index], params)}`;
            }).join(', ');
        } catch {
            return shortHex(input, 18, 10);
        }
    }

    function decodeEventArgs(abi: TEth.Abi.Item, event: TTraceEvent, params: {
        color?: boolean
    }): string {
        try {
            let inputs = 'inputs' in abi && Array.isArray(abi.inputs)
                ? abi.inputs
                : [];
            if (inputs.length === 0) {
                return '';
            }
            let dataInputs = inputs.filter(x => x.indexed !== true);
            let dataValues = dataInputs.length > 0
                ? $abiCoder.decode(dataInputs as any, event.data)
                : [];
            let topicIndex = 'anonymous' in abi && abi.anonymous === true ? 0 : 1;
            let dataIndex = 0;

            return inputs.map((param, index) => {
                let name = param.name?.trim() || `arg${index}`;
                let value;
                if (param.indexed === true) {
                    let topic = event.topics[topicIndex++];
                    if (topic == null) {
                        value = 'undefined';
                    } else if ($abiUtils.isDynamicType(param.type)) {
                        value = topic;
                    } else {
                        value = $abiCoder.decode([ param ] as any, topic)[0];
                    }
                } else {
                    value = dataValues[dataIndex++];
                }
                return `${name}: ${formatValue(value, params)}`;
            }).join(', ');
        } catch {
            let rendered = [
                ...event.topics.map(topic => shortHex(topic, 18, 10)),
                event.data !== '0x' ? shortHex(event.data, 18, 10) : null,
            ].filter(Boolean);
            return rendered.join(', ');
        }
    }

    function formatReturnValue(frame: TTraceFrame, abi: TEth.Abi.Item | null, params: {
        color?: boolean
    }): string {
        if (frame.output == null) {
            return '0x';
        }
        if (frame.failed !== true && abi != null) {
            try {
                let outputs = 'outputs' in abi && Array.isArray(abi.outputs)
                    ? abi.outputs
                    : [];
                if (outputs.length > 0) {
                    let values = $abiCoder.decode(outputs as any, frame.output);
                    return outputs.map((param, index) => {
                        let name = param.name?.trim();
                        if (!name && outputs.length > 1) {
                            name = `out${index}`;
                        }
                        if (name) {
                            name += ': ';
                        }
                        return `${name ?? ''}${formatValue(values[index], params)}`;
                    }).join(', ');
                }
            } catch {
                // Fall back to raw bytes if decoding fails.
            }
        }
        return shortHex(frame.output, 18, 10);
    }

    function getOutputMeta(log: TStructLog | null | undefined): TEth.Hex | null {
        if (log == null || (log.op !== 'RETURN' && log.op !== 'REVERT')) {
            return null;
        }
        let stack = log.stack ?? [];
        if (stack.length < 2) {
            return null;
        }
        let offset = toNumber(stack[stack.length - 1]);
        let size = toNumber(stack[stack.length - 2]);
        return readMemory(log.memory ?? [], offset, size);
    }

    function getInput(tx: TEth.TxLike): TEth.Hex | null {
        return tx.data ?? tx.input ?? null;
    }

    function getSelector(tx: TEth.TxLike): TEth.Hex | null {
        let input = getInput(tx);
        return input != null && input.length >= 10
            ? input.slice(0, 10) as TEth.Hex
            : null;
    }

    function formatValue(value: any, params: { color?: boolean }): string {
        if (typeof value === 'bigint') {
            return color('cyan', value.toString(), params);
        }
        if (Array.isArray(value)) {
            return `[${value.map(x => formatValue(x, params)).join(', ')}]`;
        }
        if (value != null && typeof value === 'object') {
            let entries = Object.entries(value);
            return `{ ${entries.map(([ key, val ]) => `${key}: ${formatValue(val, params)}`).join(', ')} }`;
        }
        if (typeof value === 'string') {
            if (/^0x[a-fA-F0-9]{40}$/.test(value)) {
                return value as TEth.Address;
            }
            if (/^0x[a-fA-F0-9]{18,}$/.test(value)) {
                return shortHex(value as TEth.Hex, 18, 10);
            }
            return color('yellow', value, params);
        }
        return String(value);
    }

    function shortAddress(address: TEth.Address, params: {
        shortAddress?: boolean
    }): string {
        if (params.shortAddress === false) {
            return address;
        }
        return `${address.slice(0, 8)}...${address.slice(-4)}`;
    }

    function shortHex(hex: TEth.Hex, start: number, end: number): string {
        if (hex.length <= start + end) {
            return hex;
        }
        return `${hex.slice(0, start)}...${hex.slice(-end)}`;
    }

    function toAddress(word: string): TEth.Address {
        let hex = word.replace(/^0x/, '').slice(-40).toLowerCase();
        return `0x${hex}` as TEth.Address;
    }

    function toBigInt(word: string): bigint {
        return $bigint.from($hex.ensure(word));
    }

    function toNumber(word: string): number {
        let value = toBigInt(word);
        return value > BigInt(Number.MAX_SAFE_INTEGER)
            ? Number.MAX_SAFE_INTEGER
            : Number(value);
    }

    function color (name: keyof (typeof ColorData['ColorAscii'])['value'], str: string, params: { color?: boolean }): string {
        if (!params.color) {
            return str;
        }
        return $color(`${name}<${str}>`);
    }
}
