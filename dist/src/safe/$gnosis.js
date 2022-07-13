"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$gnosis = void 0;
const safe_web3_lib_1 = __importDefault(require("@gnosis.pm/safe-web3-lib"));
const _hex_1 = require("@dequanto/utils/$hex");
var $gnosis;
(function ($gnosis) {
    async function getAdapter(owner, client) {
        const web3 = await client.getWeb3();
        if (owner.key) {
            web3.eth.accounts.wallet.add(_hex_1.$hex.ensure(owner.key));
        }
        const ethAdapter = new safe_web3_lib_1.default({
            web3: web3,
            signerAddress: owner.address,
        });
        return ethAdapter;
    }
    $gnosis.getAdapter = getAdapter;
})($gnosis = exports.$gnosis || (exports.$gnosis = {}));
