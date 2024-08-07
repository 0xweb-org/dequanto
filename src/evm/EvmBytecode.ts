import alot from 'alot';
import type { TAbiItem } from '@dequanto/types/TAbi';
import { OpcodesInfo } from './OpcodesInfo';
import { JsonObjectStore } from '@dequanto/json/JsonObjectStore';
import { $path } from '@dequanto/utils/$path';
import { $abiParser } from '@dequanto/utils/$abiParser';
import Opcode from './interfaces/IOpcode';
import IMemory from './interfaces/IMemory';
import IJumps from './interfaces/IJumps';
import Stack from './Stack';
import IStorage from './interfaces/IStorage';
import { OpcodesWalker } from './OpcodesWalker';
import { $logger } from '@dequanto/utils/$logger';
import IOpcode from './interfaces/IOpcode';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { $bytecode } from './utils/$bytecode';
import { $buffer } from '@dequanto/utils/$buffer';
import { $array } from '@dequanto/utils/$array';
import { TEth } from '@dequanto/models/TEth';
import opcodeFunctions from './utils/opcodes';

/**
 * Functions to SKIP
 * 08c379a0 - Error(string)
 * 4e487b71 - Panic(uint256)
 * ffffffff -
 */


class Stores {
    functions = new JsonObjectStore<Record<string, string>>({
        path: $path.resolve(`/data/evm/functionHashes.json`)
    })
    functionHashes: Record<string, string>;

    events = new JsonObjectStore<Record<string, string>>({
        path: $path.resolve(`/data/evm/eventHashes.json`)
    })
    eventHashes: Record<string, string>;

    async readAll () {
        let [ functions, events ] = await Promise.all([
            this.functions.get(),
            this.events.get(),
        ]);
        this.functionHashes = functions;
        this.eventHashes = events;
    }
}


export class EvmBytecode {
    pc: number = 0;
    stack = new Stack();
    memory: IMemory = {}

    instructions: any = [];
    storage: IStorage = {};
    jumps: IJumps = {};

    mappings: any = {};
    layer: number = 0
    halted: boolean = false;
    functions: any = {};
    variables: any = {};
    events: any = {};
    gasUsed: number = 0;

    private opcodes: Opcode[] = [];
    private code: Uint8Array;

    public store = new Stores();

    constructor(code: TEth.Hex | Uint8Array, opts?: { withConstructorCode?: boolean }) {
        if (code instanceof Uint8Array) {
            this.code = code;
        } else {
            if (opts?.withConstructorCode !== true) {
                // remove the constructor code, leave the runtime bytecode only;
                code = $bytecode.trimConstructorCode(code);
            }
            this.code = $buffer.fromHex(code.replace('0x', ''));
        }
    }

    public getOpcodes(): Opcode[] {
        if (this.opcodes.length === 0) {
            for (let index = 0; index < this.code.length; index++) {
                const currentOp = OpcodesInfo.get(this.code[index], true);
                currentOp.pc = index;
                this.opcodes.push(currentOp);
                if (currentOp.name.startsWith('PUSH')) {
                    const pushDataLength = this.code[index] - 0x5f;
                    const pushData = this.code.slice(index + 1, index + pushDataLength + 1);
                    currentOp.pushData = pushData;
                    index += pushDataLength;
                }
            }
        }
        return this.opcodes;
    }

    public getInstructions () {
        if (this.instructions.length === 0) {
            const opcodes = this.getOpcodes();
            for (this.pc; this.pc < opcodes.length && !this.halted; this.pc++) {
                const opcode = opcodes[this.pc];
                this.gasUsed += opcode.fee;
                if (opcode.name in opcodeFunctions === false) {
                    throw new Error('Unknown OPCODE: ' + opcode.name);
                }
                opcodeFunctions[opcode.name](opcode, this);
            }
        }
        return this.instructions;
    }

    async getAbi(opts?: { parseStateMutability?: boolean }): Promise<TAbiItem[]> {
        await this.prepare();

        let [functions, events] = await Promise.all([
            this.getFunctions(),
            this.getEvents(),
        ]);

        let fnsAbi = await alot(functions).mapAsync(async entry => {
            let str = entry.name ?? `_${entry.signature}()`;
            let abi = $abiParser.parseMethod(str);

            try {
                if (opts?.parseStateMutability !== false) {
                    let { opcodes } = this.getMethodOpcodes({ sig: entry.signature })
                    let isReadOnly = $opcodes.isReadOnly(opcodes);
                    if (isReadOnly) {
                        abi.stateMutability = 'view';
                    }
                }
            } catch (error) {
                $logger.error(`Getting method ${str} opcodes failed: ${error.message}`);
            }
            return abi;
        }).toArrayAsync();
        let eventsAbi = events.map(entry => {
            if (entry.name == null) {
                return null;
            }
            let str = `event ${entry.name}`;
            return $abiParser.parseMethod(str);
        }).filter(Boolean);
        return [
            ...fnsAbi,
            ...eventsAbi,
        ];
    }

    async getFunctions(): Promise<{ signature, name }[]> {
        let SKIP = [
            null,
            '08c379a0', // Error(string)
            '4e487b71', // Panic(uint256)
            'ffffffff'
        ];
        let opcodes = this.getOpcodes();

        /** Select PUSH4 opcodes in first calldataload block to filter any other method calls within the bytecode */
        let opcodeCalldataLoadIdx = $array.findIndex(opcodes, x => x.name === 'CALLDATALOAD');
        let opcodeCalldataLoad = opcodes[opcodeCalldataLoadIdx];
        let jumpDestIdx = $array.findIndex(opcodes, x => x?.name === 'JUMPDEST', opcodeCalldataLoadIdx);
        let jumpDest = opcodes[jumpDestIdx];
        let rangeStart = opcodeCalldataLoadIdx === -1 ? 0 : opcodeCalldataLoad.pc;
        let rangeEnd = opcodeCalldataLoadIdx === -1 ? Infinity : (jumpDest?.pc ?? Infinity);

        let hashes = opcodes
            .filter(opcode => opcode.name === 'PUSH4')
            .map((opcode, i) => {
                if (opcode.pc < rangeStart || opcode.pc > rangeEnd) {
                    return null;
                }
                return opcode.pushData?.toString('hex') ?? null
            })
            .filter(x => SKIP.includes(x) === false);

        let fns = await this.resolveFunctions(hashes);
        return fns;
    }

    async checkInterfaceOf (iface: (TAbiItem | string)[]): Promise<{ ok: boolean, missing?: string }> {
        if (iface == null || iface.length === 0) {
            return { ok: false };
        }
        let methods = await this.getFunctions();
        for (let item of iface) {
            if (typeof item === 'string') {
                item = $abiParser.parseMethod(item);
            }
            if (item.type !== 'function') {
                continue;
            }
            let inAbi = methods.some(x => x.signature === $abiUtils.getMethodSignature(item));
            if (inAbi === false) {
                return { ok: false, missing: item.name };
            }
        }
        return { ok: true };
    }

    private async resolveFunctions(hashes: string[]) {
        let fns = await this.store.functions.get();
        return alot(hashes)
            .distinct()
            .map(hash => {
                return {
                    signature: `0x` + hash,
                    name: fns[hash] ?? null
                };
            })
            .toArray();
    }

    async getEvents(): Promise<{ signature, name }[]> {
        let hashes = this.getOpcodes()
            .filter(opcode => opcode.name === 'PUSH32')
            .map(opcode => opcode.pushData?.toString('hex') ?? null)
            .filter(x => x != null);

        let events = await this.resolveEvents(hashes);
        return events;
    }

    clone(): EvmBytecode {
        const clone = new EvmBytecode(this.code);
        clone.pc = this.pc;
        clone.opcodes = this.opcodes;
        clone.stack = this.stack.clone();
        clone.memory = { ...this.memory };
        clone.storage = this.storage;
        clone.jumps = { ...this.jumps };
        clone.mappings = this.mappings;
        clone.layer = this.layer + 1;
        clone.functions = this.functions;
        clone.variables = this.variables;
        clone.events = this.events;
        clone.gasUsed = this.gasUsed;
        clone.store = this.store;
        return clone;
    }


    async prepare (): Promise<this> {
        await this.store.readAll();
        return this;
    }

    getMethodOpcodes (abi: string)
    getMethodOpcodes (opts: { sig: string })
    getMethodOpcodes (mix: string | { sig: string }): { opcodes: IOpcode[], exit } {
        this.stack.reset();

        let opcodes = this.getOpcodes();
        let walker = new OpcodesWalker(this, opcodes);
        return walker.getMethodOpcodes(mix);
    }

    private async resolveEvents(hashes: string[]) {
        let events = await this.store.events.get();
        return alot(hashes)
            .distinct()
            .map(hash => {
                return {
                    signature: `0x` + hash,
                    name: events[hash] ?? null
                };
            })
            .toArray();
    }

}


namespace $opcodes {
    export function isReadOnly(opcodes: IOpcode[]) {
        let writes = [
            'SSTORE',
            'LOG'
        ];
        let hasWrite = opcodes.some(opcode => writes.includes(opcode.name));
        if (hasWrite) {
            return false;
        }

        // Read methods usually have RETURN code
        let hasStop = opcodes.some(opcode => 'STOP' === opcode.name);
        if (hasStop) {
            return false;
        }
        return true;
    }
}
