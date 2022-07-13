"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$abiUtils = void 0;
const ethers_1 = require("ethers");
const _contract_1 = require("./$contract");
const web3_1 = __importDefault(require("web3"));
var $abiUtils;
(function ($abiUtils) {
    function encodePacked(...args) {
        return web3_1.default.utils.encodePacked(...args);
    }
    $abiUtils.encodePacked = encodePacked;
    function encode(types, values) {
        let coder = new ethers_1.utils.AbiCoder();
        return coder.encode(types, values);
    }
    $abiUtils.encode = encode;
    /** Returns complete method/event hash */
    function getMethodHash(abi) {
        let types = abi.inputs?.map(serializeMethodSignatureArgumentType) ?? [];
        let signature = `${abi.name}(${types.join(',')})`;
        let hash = _contract_1.$contract.keccak256(signature);
        return hash;
    }
    $abiUtils.getMethodHash = getMethodHash;
    function getMethodSignature(abi) {
        let types = abi.inputs?.map(serializeMethodSignatureArgumentType) ?? [];
        let signature = `${abi.name}(${types.join(',')})`;
        let hash = _contract_1.$contract.keccak256(signature);
        return hash.substring(0, 10);
    }
    $abiUtils.getMethodSignature = getMethodSignature;
    function getTopicSignature(abi) {
        let types = abi.inputs?.map(serializeMethodSignatureArgumentType) ?? [];
        let signature = `${abi.name}(${types.join(',')})`;
        let hash = _contract_1.$contract.keccak256(signature);
        return hash;
    }
    $abiUtils.getTopicSignature = getTopicSignature;
    function serializeMethodSignatureArgumentType(input) {
        if (input.type === 'tuple') {
            let types = input.components.map(x => serializeMethodSignatureArgumentType(x));
            return `(${types.join(',')})`;
        }
        return input.type;
    }
})($abiUtils = exports.$abiUtils || (exports.$abiUtils = {}));
