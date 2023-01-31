"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$abiUtils = void 0;
const web3_1 = __importDefault(require("web3"));
const ethers_1 = require("ethers");
const _contract_1 = require("./$contract");
const _abiParser_1 = require("./$abiParser");
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
    function getMethodHash(mix) {
        let abi = typeof mix === 'string'
            ? _abiParser_1.$abiParser.parseMethod(mix)
            : mix;
        let types = abi.inputs?.map(serializeMethodSignatureArgumentType) ?? [];
        let signature = `${abi.name}(${types.join(',')})`;
        let hash = _contract_1.$contract.keccak256(signature);
        return hash;
    }
    $abiUtils.getMethodHash = getMethodHash;
    function getMethodSignature(mix) {
        let abi = typeof mix === 'string'
            ? _abiParser_1.$abiParser.parseMethod(mix)
            : mix;
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
    function checkInterfaceOf(abi, iface) {
        if (iface == null || iface.length === 0) {
            return { ok: false };
        }
        for (let item of iface) {
            if (item.type === 'constructor') {
                continue;
            }
            let inAbi = abi.some(x => abiEquals(x, item));
            if (inAbi === false) {
                return { ok: false, missing: item.name };
            }
        }
        return { ok: true };
    }
    $abiUtils.checkInterfaceOf = checkInterfaceOf;
    function abiEquals(a, b) {
        if (a.name !== b.name) {
            return false;
        }
        let aInputs = a.inputs ?? [];
        let bInputs = b.inputs ?? [];
        if (aInputs.length !== bInputs.length) {
            return false;
        }
        //@TODO: may be better AbiInput comparison?
        for (let i = 0; i < aInputs.length; i++) {
            let aInput = aInputs[i];
            let bInput = bInputs[i];
            if (aInput?.type !== bInput?.type) {
                return false;
            }
        }
        return true;
    }
    function serializeMethodSignatureArgumentType(input) {
        if (input.type === 'tuple') {
            let types = input.components.map(x => serializeMethodSignatureArgumentType(x));
            return `(${types.join(',')})`;
        }
        return input.type;
    }
})($abiUtils = exports.$abiUtils || (exports.$abiUtils = {}));
