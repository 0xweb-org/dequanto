"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVM = void 0;
const alot_1 = __importDefault(require("alot"));
const opcodes_1 = require("./opcodes");
const JsonObjectStore_1 = require("@dequanto/json/JsonObjectStore");
const _path_1 = require("@dequanto/utils/$path");
const _abiParser_1 = require("@dequanto/utils/$abiParser");
const Stack_1 = __importDefault(require("./Stack"));
const OpcodesWalker_1 = require("./OpcodesWalker");
const _logger_1 = require("@dequanto/utils/$logger");
/**
 * Functions to SKIP
 * 08c379a0 - Error(string)
 * 4e487b71 - Panic(uint256)
 * ffffffff -
 */
class Stores {
    constructor() {
        this.functions = new JsonObjectStore_1.JsonObjectStore({
            path: _path_1.$path.resolve(`/data/evm/functionHashes.json`)
        });
        this.events = new JsonObjectStore_1.JsonObjectStore({
            path: _path_1.$path.resolve(`/data/evm/eventHashes.json`)
        });
    }
    async readAll() {
        let [functions, events] = await Promise.all([
            this.functions.get(),
            this.events.get(),
        ]);
        this.functionHashes = functions;
        this.eventHashes = events;
    }
}
class EVM {
    constructor(code) {
        this.pc = 0;
        this.stack = new Stack_1.default();
        this.memory = {};
        this.instructions = [];
        this.storage = {};
        this.jumps = {};
        this.mappings = {};
        this.layer = 0;
        this.halted = false;
        this.functions = {};
        this.variables = {};
        this.events = {};
        this.gasUsed = 0;
        this.opcodes = [];
        this.store = new Stores();
        if (code instanceof Buffer) {
            this.code = code;
        }
        else {
            // remove the constructor code, leave the runtime bytecode only;
            let initCode = code.indexOf('6080604052', 4);
            if (initCode > -1) {
                code = code.substring(initCode);
            }
            this.code = Buffer.from(code.replace('0x', ''), 'hex');
        }
    }
    getOpcodes() {
        if (this.opcodes.length === 0) {
            for (let index = 0; index < this.code.length; index++) {
                const currentOp = (0, opcodes_1.findOpcode)(this.code[index], true);
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
    async getAbi() {
        await this.prepair();
        let [functions, events] = await Promise.all([
            this.getFunctions(),
            this.getEvents(),
        ]);
        let fnsAbi = await (0, alot_1.default)(functions).mapAsync(async (entry) => {
            let str = entry.name ?? `_${entry.signature}()`;
            let abi = _abiParser_1.$abiParser.parseMethod(str);
            try {
                let { opcodes } = this.getMethodOpcodes({ sig: entry.signature });
                let isReadOnly = $opcodes.isReadOnly(opcodes);
                if (isReadOnly) {
                    abi.stateMutability = 'view';
                }
            }
            catch (error) {
                _logger_1.$logger.error(`Getting method ${str} opcodes failed: ${error.message}`);
            }
            return abi;
        }).toArrayAsync();
        let eventsAbi = events.map(entry => {
            if (entry.name == null) {
                return null;
            }
            let str = `event ${entry.name}`;
            return _abiParser_1.$abiParser.parseMethod(str);
        }).filter(Boolean);
        return [
            ...fnsAbi,
            ...eventsAbi,
        ];
    }
    async getFunctions() {
        let SKIP = [
            null,
            '08c379a0',
            '4e487b71',
            'ffffffff'
        ];
        let hashes = this
            .getOpcodes()
            .filter(opcode => opcode.name === 'PUSH4')
            .map((opcode, i) => {
            return opcode.pushData?.toString('hex') ?? null;
        })
            .filter(x => SKIP.includes(x) === false);
        let fns = await this.resolveFunctions(hashes);
        return fns;
    }
    async resolveFunctions(hashes) {
        let fns = await this.store.functions.get();
        return (0, alot_1.default)(hashes)
            .distinct()
            .map(hash => {
            return {
                signature: `0x` + hash,
                name: fns[hash] ?? null
            };
        })
            .toArray();
    }
    async getEvents() {
        let hashes = this.getOpcodes()
            .filter(opcode => opcode.name === 'PUSH32')
            .map(opcode => opcode.pushData?.toString('hex') ?? null)
            .filter(x => x != null);
        let events = await this.resolveEvents(hashes);
        return events;
    }
    clone() {
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
    async prepair() {
        await this.store.readAll();
        return this;
    }
    getMethodOpcodes(mix) {
        this.stack.reset();
        let opcodes = this.getOpcodes();
        let walker = new OpcodesWalker_1.OpcodesWalker(this, opcodes);
        return walker.getMethodOpcodes(mix);
    }
    async resolveEvents(hashes) {
        let events = await this.store.events.get();
        return (0, alot_1.default)(hashes)
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
exports.EVM = EVM;
var $opcodes;
(function ($opcodes) {
    function isReadOnly(opcodes) {
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
    $opcodes.isReadOnly = isReadOnly;
})($opcodes || ($opcodes = {}));
