"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxTopicInMemoryProvider = void 0;
const _abiParser_1 = require("@dequanto/utils/$abiParser");
const _abiUtils_1 = require("@dequanto/utils/$abiUtils");
class TxTopicInMemoryProvider {
    constructor() {
        this.hash = Object.create(null);
    }
    register(mix) {
        if (mix == null) {
            return this;
        }
        if (Array.isArray(mix)) {
            mix.forEach(x => this.register(x));
            return this;
        }
        let abi;
        let formatter;
        if (typeof mix !== 'string' && 'abi' in mix && 'formatter' in mix) {
            abi = mix.abi;
            formatter = mix.formatter;
        }
        else {
            abi = mix;
        }
        if (typeof abi === 'string') {
            abi = _abiParser_1.$abiParser.parseMethod(abi);
        }
        let hash = _abiUtils_1.$abiUtils.getMethodHash(abi);
        this.hash[hash] = {
            abi,
            formatter
        };
        return this;
    }
    async get(topicHash) {
        return this.hash[topicHash];
    }
}
exports.TxTopicInMemoryProvider = TxTopicInMemoryProvider;
