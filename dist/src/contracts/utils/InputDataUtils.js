"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputDataUtils = void 0;
const ethers_1 = require("ethers");
const _abiParser_1 = require("../../utils/$abiParser");
var InputDataUtils;
(function (InputDataUtils) {
    function split(inputData) {
        let str = inputData.substring(2);
        if (str === '') {
            return { method: '', args: [] };
        }
        let methodName = str.substring(0, 8);
        let params = str.substring(8);
        let args = [];
        while (params.length > 0) {
            args.push(params.substring(0, 64));
            params = params.substring(64);
        }
        return {
            method: methodName,
            args
        };
    }
    InputDataUtils.split = split;
    function decode(inputs, bytes) {
        let types = inputs.map(x => x.type);
        let args = ethers_1.utils.defaultAbiCoder.decode(types, bytes);
        let arr = Array.from(args);
        return normalizeArgs(arr);
    }
    InputDataUtils.decode = decode;
    function decodeParamsWithABI(abi, bytes) {
        if (typeof abi === 'string') {
            abi = _abiParser_1.$abiParser.parseMethod(abi);
        }
        let inputs = abi.inputs;
        let types = inputs.map(x => x.type);
        let args = ethers_1.utils.defaultAbiCoder.decode(types, bytes);
        let arr = Array.from(args);
        return normalizeArgs(arr);
    }
    InputDataUtils.decodeParamsWithABI = decodeParamsWithABI;
    function decodeWithABI(IFunctionABI, ...params) {
        let iface = new ethers_1.utils.Interface([IFunctionABI]);
        let methodName;
        if (typeof IFunctionABI === 'string') {
            methodName = /function \s*(?<methodName>[\w\d_]+)/.exec(IFunctionABI)?.groups?.methodName;
        }
        else {
            methodName = IFunctionABI.name;
        }
        if (methodName == null) {
            throw new Error(`Invalid method in ${IFunctionABI}. Expects "function foo(...)"`);
        }
        return iface.encodeFunctionData(methodName, params);
    }
    InputDataUtils.decodeWithABI = decodeWithABI;
    /**
     * function work(uint256 id, address worker, uint256 principalAmount, uint256 loan, uint256 maxReturn, bytes calldata data)
     */
    function encodeWithABI(IFunctionABI, ...params) {
        let iface = new ethers_1.utils.Interface([IFunctionABI]);
        let methodName;
        if (typeof IFunctionABI === 'string') {
            methodName = /function \s*(?<methodName>[\w\d_]+)/.exec(IFunctionABI)?.groups?.methodName;
        }
        else {
            methodName = IFunctionABI.name;
        }
        if (methodName == null) {
            throw new Error(`Invalid method in ${IFunctionABI}. Expects "function foo(...)"`);
        }
        return iface.encodeFunctionData(methodName, params);
    }
    InputDataUtils.encodeWithABI = encodeWithABI;
    function encodeWithTypes(client, types, paramaters) {
        return client.encodeParameters(types, paramaters);
    }
    InputDataUtils.encodeWithTypes = encodeWithTypes;
    function normalizeArgs(args) {
        return args.map(val => {
            if (val?._isBigNumber) {
                return BigInt(val.toString());
            }
            return val;
        });
    }
    InputDataUtils.normalizeArgs = normalizeArgs;
})(InputDataUtils = exports.InputDataUtils || (exports.InputDataUtils = {}));
