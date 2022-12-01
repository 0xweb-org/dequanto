import { findOpcode } from './opcodes';
import Opcode from './interfaces/opcode.interface';
import Stack from './stack.class';
import Memory from './interfaces/memory.interface';
import Storage from './interfaces/storage.interface';
import Jumps from './interfaces/jumps.interface';
import { JsonObjectStore } from '@dequanto/json/JsonObjectStore';
import { $path } from '@dequanto/utils/$path';
import { $abiParser } from '@dequanto/utils/$abiParser';
import type { AbiItem } from 'web3-utils';
import alot from 'alot';


class Stores {
    functions = new JsonObjectStore<Record<string, string>>({
        path: $path.resolve(`/data/evm/functionHashes.json`)
    })
    events = new JsonObjectStore<Record<string, string>>({
        path: $path.resolve(`/data/evm/eventHashes.json`)
    })
}


export class EVM {
    private opcodes: Opcode[] = [];
    private code: Buffer;

    private store = new Stores();

    constructor(code: string | Buffer) {
        if (code instanceof Buffer) {
            this.code = code;
        } else {
            this.code = Buffer.from(code.replace('0x', ''), 'hex');
        }
    }

    private getOpcodes(): Opcode[] {
        if (this.opcodes.length === 0) {
            for (let index = 0; index < this.code.length; index++) {
                const currentOp = findOpcode(this.code[index], true);
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
        let [functions, events] = await Promise.all([
            this.getFunctions(),
            this.getEvents(),
        ]);

        let fnsAbi = functions.map(entry => {
            let str = entry.name ?? `_${entry.signature}()`;
            return $abiParser.parseMethod(str);
        });
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
        let hashes = this
            .getOpcodes()
            .filter(opcode => opcode.name === 'PUSH4')
            .map(opcode => opcode.pushData?.toString('hex') ?? null)
            .filter(x => x != null && x !== 'ffffffff');

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
