"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ns = void 0;
const web3_1 = __importDefault(require("web3"));
var $ns;
(function ($ns) {
    function namehash(domain) {
        let labels = domain.toLowerCase().split('.');
        let node = '0x' + ''.padStart(64, '0');
        for (let i = labels.length - 1; i >= 0; i--) {
            let labelSha = web3_1.default.utils.keccak256(labels[i]).substring(2);
            node = web3_1.default.utils.keccak256(`${node}${labelSha}`);
        }
        return node;
    }
    $ns.namehash = namehash;
})($ns = exports.$ns || (exports.$ns = {}));
