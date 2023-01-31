"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientDebugMethods = void 0;
class ClientDebugMethods {
    constructor(client, methods) {
        this.client = client;
        this.methods = methods;
    }
    getTransactionTrace(hash) {
        return this.client.pool.call(async (web3) => {
            let eth = web3.eth;
            if (typeof eth.traceTransaction !== 'function') {
                web3.eth.extend({
                    methods: [
                        {
                            name: 'traceTransaction',
                            call: 'debug_traceTransaction',
                            params: 1,
                        }
                    ]
                });
            }
            let result = await eth.traceTransaction(hash);
            return result;
        }, {
            node: {
                traceable: true
            }
        });
    }
    setStorageAt(address, location, buffer) {
        return this.call('setStorageAt', ...arguments);
    }
    setCode(address, buffer) {
        return this.call('setCode', ...arguments);
    }
    setBalance(address, amount) {
        return this.call('setBalance', ...arguments);
    }
    call(method, ...args) {
        let meta = this.methods[method];
        if (meta?.call == null) {
            throw new Error(`RPC method for ${method} is not configurated in ${this.client.platform}`);
        }
        return this.client.pool.call(web3 => {
            let eth = web3.eth;
            if (eth[method] == null) {
                web3.eth.extend({
                    methods: [
                        {
                            name: method,
                            call: meta.call,
                            params: meta.params,
                        }
                    ]
                });
            }
            return eth[method](...args);
        });
    }
}
exports.ClientDebugMethods = ClientDebugMethods;
