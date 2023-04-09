"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$web3Abi = void 0;
const _abiParser_1 = require("@dequanto/utils/$abiParser");
var $web3Abi;
(function ($web3Abi) {
    function ensureAbis(abi) {
        let arr;
        if (typeof abi === 'string') {
            arr = [_abiParser_1.$abiParser.parseMethod(abi)];
        }
        else if (Array.isArray(abi)) {
            arr = abi;
        }
        else {
            arr = [abi];
        }
        let first = abi[0];
        if (first.outputs == null || first.outputs.length === 0) {
            // Normalize outputs, to read at least bytes if nothing set
            first.outputs = [
                {
                    type: 'bytes32',
                    name: '',
                }
            ];
        }
        return arr;
    }
    $web3Abi.ensureAbis = ensureAbis;
})($web3Abi = exports.$web3Abi || (exports.$web3Abi = {}));
