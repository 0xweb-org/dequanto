"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$web3Provider = void 0;
const _number_1 = require("@dequanto/utils/$number");
var $web3Provider;
(function ($web3Provider) {
    async function call(web3, json) {
        return new Promise((resolve, reject) => {
            if (json.id == null) {
                // Generate the ID, as some nodes require it
                json.id = _number_1.$number.randomInt(10 ** 5, 10 ** 11);
            }
            let provider = web3.currentProvider;
            if (provider == null || typeof provider !== 'object' || typeof provider.send !== 'function') {
                reject(new Error(`Invalid Web3 current RPC Provider. Has no "send" method`));
                return;
            }
            provider.send(json, (err, result) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                if (result.error) {
                    let err = result.error;
                    let message = err.message ?? err.details ?? JSON.stringify(err);
                    let error = new Error(message);
                    error.data = err;
                    reject(error);
                    return;
                }
                resolve(result.result);
            });
        });
    }
    $web3Provider.call = call;
})($web3Provider = exports.$web3Provider || (exports.$web3Provider = {}));
