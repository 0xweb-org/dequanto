"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERC20Base = void 0;
/**
 *  AUTO-Generated Class: 2022-06-23 17:13
 *  Implementation: https://polygonscan.com/address/undefined#code
 */
const a_di_1 = __importDefault(require("a-di"));
const ContractBase_1 = require("@dequanto/contracts/ContractBase");
const Polyscan_1 = require("@dequanto/BlockchainExplorer/Polyscan");
const PolyWeb3Client_1 = require("@dequanto/clients/PolyWeb3Client");
class ERC20Base extends ContractBase_1.ContractBase {
    constructor(address = '', client = a_di_1.default.resolve(PolyWeb3Client_1.PolyWeb3Client), explorer = a_di_1.default.resolve(Polyscan_1.Polyscan)) {
        super(address, client, explorer);
        this.address = address;
        this.client = client;
        this.explorer = explorer;
        this.abi = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }];
    }
    // 0x06fdde03
    async name() {
        return this.$read('function name() returns string');
    }
    // 0x095ea7b3
    async approve(sender, _spender, _value) {
        return this.$write(this.$getAbiItem('function', 'approve'), sender, _spender, _value);
    }
    // 0x18160ddd
    async totalSupply() {
        return this.$read('function totalSupply() returns uint256');
    }
    // 0x23b872dd
    async transferFrom(sender, _from, _to, _value) {
        return this.$write(this.$getAbiItem('function', 'transferFrom'), sender, _from, _to, _value);
    }
    // 0x313ce567
    async decimals() {
        return this.$read('function decimals() returns uint8');
    }
    // 0x70a08231
    async balanceOf(_owner) {
        return this.$read('function balanceOf(address) returns uint256', _owner);
    }
    // 0x95d89b41
    async symbol() {
        return this.$read('function symbol() returns string');
    }
    // 0xa9059cbb
    async transfer(sender, _to, _value) {
        return this.$write(this.$getAbiItem('function', 'transfer'), sender, _to, _value);
    }
    // 0xdd62ed3e
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
    async getPastLogsApproval(options) {
        let topic = '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925';
        let abi = this.$getAbiItem('event', 'Approval');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs = await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi));
    }
    async getPastLogsTransfer(options) {
        let topic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
        let abi = this.$getAbiItem('event', 'Transfer');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs = await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi));
    }
}
exports.ERC20Base = ERC20Base;
