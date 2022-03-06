"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmmFactoryV2ContractBase = void 0;
/**
 *  AUTO-Generated Class: 2021-11-09 14:26
 */
const a_di_1 = __importDefault(require("a-di"));
const Bscscan_1 = require("@dequanto/BlockchainExplorer/Bscscan");
const BscWeb3Client_1 = require("@dequanto/clients/BscWeb3Client");
const ContractBase_1 = require("@dequanto/contracts/ContractBase");
class AmmFactoryV2ContractBase extends ContractBase_1.ContractBase {
    constructor(address = '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73', client = a_di_1.default.resolve(BscWeb3Client_1.BscWeb3Client), explorer = a_di_1.default.resolve(Bscscan_1.Bscscan)) {
        super(address, client, explorer);
        this.address = address;
        this.client = client;
        this.explorer = explorer;
        this.abi = [{ "inputs": [{ "internalType": "address", "name": "_feeToSetter", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "token0", "type": "address" }, { "indexed": true, "internalType": "address", "name": "token1", "type": "address" }, { "indexed": false, "internalType": "address", "name": "pair", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "", "type": "uint256" }], "name": "PairCreated", "type": "event" }, { "constant": true, "inputs": [], "name": "INIT_CODE_PAIR_HASH", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "allPairs", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "allPairsLength", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }], "name": "createPair", "outputs": [{ "internalType": "address", "name": "pair", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "feeTo", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "feeToSetter", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "name": "getPair", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "_feeTo", "type": "address" }], "name": "setFeeTo", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "_feeToSetter", "type": "address" }], "name": "setFeeToSetter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }];
    }
    async INIT_CODE_PAIR_HASH() {
        return this.$read('function INIT_CODE_PAIR_HASH() returns bytes32');
    }
    async allPairs(input0) {
        return this.$read('function allPairs(uint256) returns address', input0);
    }
    async allPairsLength() {
        return this.$read('function allPairsLength() returns uint256');
    }
    async createPair(eoa, tokenA, tokenB) {
        return this.$write('function createPair(address, address) returns address pair', eoa, tokenA, tokenB);
    }
    async feeTo() {
        return this.$read('function feeTo() returns address');
    }
    async feeToSetter() {
        return this.$read('function feeToSetter() returns address');
    }
    async getPair(input0, input1) {
        return this.$read('function getPair(address, address) returns address', input0, input1);
    }
    async setFeeTo(eoa, _feeTo) {
        return this.$write('function setFeeTo(address)', eoa, _feeTo);
    }
    async setFeeToSetter(eoa, _feeToSetter) {
        return this.$write('function setFeeToSetter(address)', eoa, _feeToSetter);
    }
    onPairCreated(fn) {
        return this.$on('PairCreated', fn);
    }
}
exports.AmmFactoryV2ContractBase = AmmFactoryV2ContractBase;
