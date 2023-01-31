"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOG = void 0;
const _is_1 = require("@dequanto/utils/$is");
const mload_1 = require("./mload");
class LOG {
    constructor(state, topics, items, memoryStart, memoryLength) {
        this.name = 'LOG';
        this.wrapped = true;
        this.topics = topics;
        if (this.topics.length > 0 &&
            _is_1.$is.BigInt(this.topics[0]) &&
            this.topics[0].toString(16) in state.store.eventHashes) {
            this.eventName = state.store.eventHashes[this.topics[0].toString(16)].split('(')[0];
            this.topics.shift();
        }
        if (this.memoryStart && this.memoryLength) {
            this.memoryStart = memoryStart;
            this.memoryLength = memoryLength;
        }
        else {
            this.items = items;
        }
    }
    toString() {
        if (this.eventName) {
            return ('emit ' + this.eventName + '(' + [...this.topics, ...this.items].join(', ') + ')');
        }
        else {
            return 'log(' + [...this.topics, ...this.items].join(', ') + ')';
        }
    }
}
exports.LOG = LOG;
exports.default = (opcode, state) => {
    const topicsCount = parseInt(opcode.name.replace('LOG', ''), 10);
    const memoryStart = state.stack.pop();
    const memoryLength = state.stack.pop();
    const topics = [];
    for (let i = 0; i < topicsCount; i++) {
        topics.push(state.stack.pop());
    }
    if (topics.length > 0) {
        const eventTopic = topics[0].toString(16);
        if (!(eventTopic in state.events)) {
            state.events[eventTopic] = {};
            state.events[eventTopic].indexedCount = topics.length - 1;
            if (eventTopic in state.store.eventHashes) {
                state.events[eventTopic].label = (state.store.eventHashes)[eventTopic];
            }
        }
    }
    if (_is_1.$is.BigInt(memoryStart) && _is_1.$is.BigInt(memoryLength)) {
        const items = [];
        for (let i = Number(memoryStart); i < Number(memoryStart) + Number(memoryLength); i += 32) {
            if (i in state.memory) {
                items.push(state.memory[i]);
            }
            else {
                items.push(new mload_1.MLOAD(i));
            }
        }
        if (topics.length === 0) {
            if (!('anonymous' in state.events)) {
                state.events.anonymous = [];
            }
            state.events.anonymous.push({ items });
        }
        state.instructions.push(new LOG(state, topics, items));
    }
    else {
        state.instructions.push(new LOG(state, topics, [], memoryStart, memoryLength));
    }
};
