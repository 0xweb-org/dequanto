import alot from 'alot';
import type { AbiItem } from 'web3-utils';
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


export class EVM {
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
    private code: Buffer;

    public store = new Stores();

    constructor(code: string | Buffer) {
        if (code instanceof Buffer) {
            this.code = code;
        } else {
            // remove the constructor code, leave the runtime bytecode only;
            let initCode = code.indexOf('6080604052', 4);
            if (initCode > -1) {
                code = code.substring(initCode);
            }
            this.code = Buffer.from(code.replace('0x', ''), 'hex');
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

    async getAbi(): Promise<AbiItem[]> {
        await this.prepair();

        let [functions, events] = await Promise.all([
            this.getFunctions(),
            this.getEvents(),
        ]);

        let fnsAbi = await alot(functions).mapAsync(async entry => {
            let str = entry.name ?? `_${entry.signature}()`;
            let abi = $abiParser.parseMethod(str);

            try {
                let { opcodes } = this.getMethodOpcodes({ sig: entry.signature })
                let isReadOnly = $opcodes.isReadOnly(opcodes);
                if (isReadOnly) {
                    abi.stateMutability = 'view';
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
        let hashes = this
            .getOpcodes()
            .filter(opcode => opcode.name === 'PUSH4')
            .map((opcode, i) => {
                return opcode.pushData?.toString('hex') ?? null
            })
            .filter(x => SKIP.includes(x) === false);

        let fns = await this.resolveFunctions(hashes);
        return fns;
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

    clone(): EVM {
        const clone = new EVM(this.code);
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


    async prepair (): Promise<this> {
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
