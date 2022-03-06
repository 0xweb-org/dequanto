"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WXDaiTokenContractBase = void 0;
/**
 *  AUTO-Generated Class: 2021-12-15 23:03
 */
const a_di_1 = __importDefault(require("a-di"));
const ContractBase_1 = require("@dequanto/contracts/ContractBase");
const XDaiscan_1 = require("@dequanto/chains/xdai/XDaiscan");
const XDaiWeb3Client_1 = require("@dequanto/chains/xdai/XDaiWeb3Client");
class WXDaiTokenContractBase extends ContractBase_1.ContractBase {
    constructor(address = '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d', client = a_di_1.default.resolve(XDaiWeb3Client_1.XDaiWeb3Client), explorer = a_di_1.default.resolve(XDaiscan_1.XDaiscan)) {
        super(address, client, explorer);
        this.address = address;
        this.client = client;
        this.explorer = explorer;
        this.abi = [{ "type": "function", "stateMutability": "view", "payable": false, "outputs": [{ "type": "string", "name": "" }], "name": "name", "inputs": [], "constant": true }, { "type": "function", "stateMutability": "nonpayable", "payable": false, "outputs": [{ "type": "bool", "name": "" }], "name": "approve", "inputs": [{ "type": "address", "name": "guy" }, { "type": "uint256", "name": "wad" }], "constant": false }, { "type": "function", "stateMutability": "view", "payable": false, "outputs": [{ "type": "uint256", "name": "" }], "name": "totalSupply", "inputs": [], "constant": true }, { "type": "function", "stateMutability": "nonpayable", "payable": false, "outputs": [{ "type": "bool", "name": "" }], "name": "transferFrom", "inputs": [{ "type": "address", "name": "src" }, { "type": "address", "name": "dst" }, { "type": "uint256", "name": "wad" }], "constant": false }, { "type": "function", "stateMutability": "nonpayable", "payable": false, "outputs": [], "name": "withdraw", "inputs": [{ "type": "uint256", "name": "wad" }], "constant": false }, { "type": "function", "stateMutability": "view", "payable": false, "outputs": [{ "type": "uint8", "name": "" }], "name": "decimals", "inputs": [], "constant": true }, { "type": "function", "stateMutability": "view", "payable": false, "outputs": [{ "type": "uint256", "name": "" }], "name": "balanceOf", "inputs": [{ "type": "address", "name": "" }], "constant": true }, { "type": "function", "stateMutability": "view", "payable": false, "outputs": [{ "type": "string", "name": "" }], "name": "symbol", "inputs": [], "constant": true }, { "type": "function", "stateMutability": "nonpayable", "payable": false, "outputs": [{ "type": "bool", "name": "" }], "name": "transfer", "inputs": [{ "type": "address", "name": "dst" }, { "type": "uint256", "name": "wad" }], "constant": false }, { "type": "function", "stateMutability": "payable", "payable": true, "outputs": [], "name": "deposit", "inputs": [], "constant": false }, { "type": "function", "stateMutability": "view", "payable": false, "outputs": [{ "type": "uint256", "name": "" }], "name": "allowance", "inputs": [{ "type": "address", "name": "" }, { "type": "address", "name": "" }], "constant": true }, { "type": "fallback", "stateMutability": "payable", "payable": true }, { "type": "event", "name": "Approval", "inputs": [{ "type": "address", "name": "src", "indexed": true }, { "type": "address", "name": "guy", "indexed": true }, { "type": "uint256", "name": "wad", "indexed": false }], "anonymous": false }, { "type": "event", "name": "Transfer", "inputs": [{ "type": "address", "name": "src", "indexed": true }, { "type": "address", "name": "dst", "indexed": true }, { "type": "uint256", "name": "wad", "indexed": false }], "anonymous": false }, { "type": "event", "name": "Deposit", "inputs": [{ "type": "address", "name": "dst", "indexed": true }, { "type": "uint256", "name": "wad", "indexed": false }], "anonymous": false }, { "type": "event", "name": "Withdrawal", "inputs": [{ "type": "address", "name": "src", "indexed": true }, { "type": "uint256", "name": "wad", "indexed": false }], "anonymous": false }];
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
        console.log('WXDaiTokenContractBase.withdraw');
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
exports.WXDaiTokenContractBase = WXDaiTokenContractBase;
