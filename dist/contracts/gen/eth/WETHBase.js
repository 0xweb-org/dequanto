"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WETHBase = void 0;
/**
 *  AUTO-Generated Class: 2022-01-21 17:15
 *  Implementation: https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2#code
 */
const a_di_1 = __importDefault(require("a-di"));
const ContractBase_1 = require("@dequanto/contracts/ContractBase");
const Etherscan_1 = require("@dequanto/BlockchainExplorer/Etherscan");
const EthWeb3Client_1 = require("@dequanto/clients/EthWeb3Client");
class WETHBase extends ContractBase_1.ContractBase {
    constructor(address = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', client = a_di_1.default.resolve(EthWeb3Client_1.EthWeb3Client), explorer = a_di_1.default.resolve(Etherscan_1.Etherscan)) {
        super(address, client, explorer);
        this.address = address;
        this.client = client;
        this.explorer = explorer;
        this.abi = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "guy", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "src", "type": "address" }, { "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "wad", "type": "uint256" }], "name": "withdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "deposit", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": true, "name": "guy", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": true, "name": "dst", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "dst", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Deposit", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Withdrawal", "type": "event" }];
    }
    // 0x06fdde03
    async name() {
        return this.$read('function name() returns string');
    }
    // 0x095ea7b3
    async approve(eoa, guy, wad) {
        return this.$write(this.$getAbiItem('function', 'approve'), eoa, guy, wad);
    }
    // 0x18160ddd
    async totalSupply() {
        return this.$read('function totalSupply() returns uint256');
    }
    // 0x23b872dd
    async transferFrom(eoa, src, dst, wad) {
        return this.$write(this.$getAbiItem('function', 'transferFrom'), eoa, src, dst, wad);
    }
    // 0x2e1a7d4d
    async withdraw(eoa, wad) {
        return this.$write(this.$getAbiItem('function', 'withdraw'), eoa, wad);
    }
    // 0x313ce567
    async decimals() {
        return this.$read('function decimals() returns uint8');
    }
    // 0x70a08231
    async balanceOf(input0) {
        return this.$read('function balanceOf(address) returns uint256', input0);
    }
    // 0x95d89b41
    async symbol() {
        return this.$read('function symbol() returns string');
    }
    // 0xa9059cbb
    async transfer(eoa, dst, wad) {
        return this.$write(this.$getAbiItem('function', 'transfer'), eoa, dst, wad);
    }
    // 0xd0e30db0
    async deposit(eoa) {
        return this.$write(this.$getAbiItem('function', 'deposit'), eoa);
    }
    // 0xdd62ed3e
    async allowance(input0, input1) {
        return this.$read('function allowance(address, address) returns uint256', input0, input1);
    }
    onApproval(fn) {
        return this.$on('Approval', fn);
    }
    onTransfer(fn) {
        return this.$on('Transfer', fn);
    }
    onDeposit(fn) {
        return this.$on('Deposit', fn);
    }
    onWithdrawal(fn) {
        return this.$on('Withdrawal', fn);
    }
    extractLogsApproval(tx) {
        let abi = this.$getAbiItem('event', 'Approval');
        return this.$extractLogs(tx, abi);
    }
    extractLogsTransfer(tx) {
        let abi = this.$getAbiItem('event', 'Transfer');
        return this.$extractLogs(tx, abi);
    }
    extractLogsDeposit(tx) {
        let abi = this.$getAbiItem('event', 'Deposit');
        return this.$extractLogs(tx, abi);
    }
    extractLogsWithdrawal(tx) {
        let abi = this.$getAbiItem('event', 'Withdrawal');
        return this.$extractLogs(tx, abi);
    }
}
exports.WETHBase = WETHBase;
