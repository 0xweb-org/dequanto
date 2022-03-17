"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ns = void 0;
const web3_utils_1 = require("web3-utils");
var $ns;
(function ($ns) {
    function namehash(domain) {
        let labels = domain.toLowerCase().split('.');
        let node = '0x' + ''.padStart(64, '0');
        for (let i = labels.length - 1; i >= 0; i--) {
            let labelSha = (0, web3_utils_1.keccak256)(labels[i]).substring(2);
            node = (0, web3_utils_1.keccak256)(`${node}${labelSha}`);
        }
        return node;
    }
    $ns.namehash = namehash;
})($ns = exports.$ns || (exports.$ns = {}));
