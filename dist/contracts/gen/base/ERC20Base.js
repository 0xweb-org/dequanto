"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERC20Base = void 0;
/**
 *  AUTO-Generated Class: 2021-11-12 12:23
 */
const a_di_1 = __importDefault(require("a-di"));
const Polyscan_1 = require("@dequanto/BlockchainExplorer/Polyscan");
const PolyWeb3Client_1 = require("@dequanto/clients/PolyWeb3Client");
const ContractBase_1 = require("@dequanto/contracts/ContractBase");
class ERC20Base extends ContractBase_1.ContractBase {
    constructor(address = '', client = a_di_1.default.resolve(PolyWeb3Client_1.PolyWeb3Client), explorer = a_di_1.default.resolve(Polyscan_1.Polyscan)) {
        super(address, client, explorer);
        this.address = address;
        this.client = client;
        this.explorer = explorer;
        this.abi = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }];
    }
    async name() {
        return this.$read('function name() returns string');
    }
    async approve(eoa, _spender, _value) {
        return this.$write('function approve(address, uint256) returns bool', eoa, _spender, _value);
    }
    async totalSupply() {
        return this.$read('function totalSupply() returns uint256');
    }
    async transferFrom(eoa, _from, _to, _value) {
        return this.$write('function transferFrom(address, address, uint256) returns bool', eoa, _from, _to, _value);
    }
    async decimals() {
        return this.$read('function decimals() returns uint8');
    }
    async balanceOf(_owner) {
        return this.$read('function balanceOf(address) returns uint256', _owner);
    }
    async symbol() {
        return this.$read('function symbol() returns string');
    }
    async transfer(eoa, _to, _value) {
        return this.$write('function transfer(address, uint256) returns bool', eoa, _to, _value);
    }
    async allowance(_owner, _spender) {
        return this.$read('function allowance(address, address) returns uint256', _owner, _spender);
    }
    onApproval(fn) {
        return this.$on('Approval', fn);
    }
    onTransfer(fn) {
        return this.$on('Transfer', fn);
    }
    extractLogsApproval(tx) {
        let abi = this.$getAbiItem('event', 'Approval');
        return this.$extractLogs(tx, abi);
    }
    extractLogsTransfer(tx) {
        let abi = this.$getAbiItem('event', 'Transfer');
        return this.$extractLogs(tx, abi);
    }
}
exports.ERC20Base = ERC20Base;
