"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GnosisSafe = void 0;
/**
 *  AUTO-Generated Class: 2022-07-07 00:45
 *  Implementation: https://etherscan.io/address/undefined#code
 */
const a_di_1 = __importDefault(require("a-di"));
const ContractBase_1 = require("@dequanto/contracts/ContractBase");
const Etherscan_1 = require("@dequanto/BlockchainExplorer/Etherscan");
const EthWeb3Client_1 = require("@dequanto/clients/EthWeb3Client");
class GnosisSafe extends ContractBase_1.ContractBase {
    constructor(address = '', client = a_di_1.default.resolve(EthWeb3Client_1.EthWeb3Client), explorer = a_di_1.default.resolve(Etherscan_1.Etherscan)) {
        super(address, client, explorer);
        this.address = address;
        this.client = client;
        this.explorer = explorer;
        this.abi = [{ "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "owner", "type": "address" }], "name": "AddedOwner", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "approvedHash", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }], "name": "ApproveHash", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "masterCopy", "type": "address" }], "name": "ChangedMasterCopy", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "threshold", "type": "uint256" }], "name": "ChangedThreshold", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "contract Module", "name": "module", "type": "address" }], "name": "DisabledModule", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "contract Module", "name": "module", "type": "address" }], "name": "EnabledModule", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "bytes32", "name": "txHash", "type": "bytes32" }, { "indexed": false, "internalType": "uint256", "name": "payment", "type": "uint256" }], "name": "ExecutionFailure", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "module", "type": "address" }], "name": "ExecutionFromModuleFailure", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "module", "type": "address" }], "name": "ExecutionFromModuleSuccess", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "bytes32", "name": "txHash", "type": "bytes32" }, { "indexed": false, "internalType": "uint256", "name": "payment", "type": "uint256" }], "name": "ExecutionSuccess", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "owner", "type": "address" }], "name": "RemovedOwner", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "msgHash", "type": "bytes32" }], "name": "SignMsg", "type": "event" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "constant": true, "inputs": [], "name": "NAME", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "VERSION", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "_threshold", "type": "uint256" }], "name": "addOwnerWithThreshold", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "bytes32", "name": "hashToApprove", "type": "bytes32" }], "name": "approveHash", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "approvedHashes", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "_masterCopy", "type": "address" }], "name": "changeMasterCopy", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "uint256", "name": "_threshold", "type": "uint256" }], "name": "changeThreshold", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "contract Module", "name": "prevModule", "type": "address" }, { "internalType": "contract Module", "name": "module", "type": "address" }], "name": "disableModule", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "domainSeparator", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "contract Module", "name": "module", "type": "address" }], "name": "enableModule", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }, { "internalType": "enum Enum.Operation", "name": "operation", "type": "uint8" }, { "internalType": "uint256", "name": "safeTxGas", "type": "uint256" }, { "internalType": "uint256", "name": "baseGas", "type": "uint256" }, { "internalType": "uint256", "name": "gasPrice", "type": "uint256" }, { "internalType": "address", "name": "gasToken", "type": "address" }, { "internalType": "address", "name": "refundReceiver", "type": "address" }, { "internalType": "uint256", "name": "_nonce", "type": "uint256" }], "name": "encodeTransactionData", "outputs": [{ "internalType": "bytes", "name": "", "type": "bytes" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }, { "internalType": "enum Enum.Operation", "name": "operation", "type": "uint8" }, { "internalType": "uint256", "name": "safeTxGas", "type": "uint256" }, { "internalType": "uint256", "name": "baseGas", "type": "uint256" }, { "internalType": "uint256", "name": "gasPrice", "type": "uint256" }, { "internalType": "address", "name": "gasToken", "type": "address" }, { "internalType": "address payable", "name": "refundReceiver", "type": "address" }, { "internalType": "bytes", "name": "signatures", "type": "bytes" }], "name": "execTransaction", "outputs": [{ "internalType": "bool", "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }, { "internalType": "enum Enum.Operation", "name": "operation", "type": "uint8" }], "name": "execTransactionFromModule", "outputs": [{ "internalType": "bool", "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }, { "internalType": "enum Enum.Operation", "name": "operation", "type": "uint8" }], "name": "execTransactionFromModuleReturnData", "outputs": [{ "internalType": "bool", "name": "success", "type": "bool" }, { "internalType": "bytes", "name": "returnData", "type": "bytes" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "bytes", "name": "message", "type": "bytes" }], "name": "getMessageHash", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getModules", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "start", "type": "address" }, { "internalType": "uint256", "name": "pageSize", "type": "uint256" }], "name": "getModulesPaginated", "outputs": [{ "internalType": "address[]", "name": "array", "type": "address[]" }, { "internalType": "address", "name": "next", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getOwners", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getThreshold", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }, { "internalType": "enum Enum.Operation", "name": "operation", "type": "uint8" }, { "internalType": "uint256", "name": "safeTxGas", "type": "uint256" }, { "internalType": "uint256", "name": "baseGas", "type": "uint256" }, { "internalType": "uint256", "name": "gasPrice", "type": "uint256" }, { "internalType": "address", "name": "gasToken", "type": "address" }, { "internalType": "address", "name": "refundReceiver", "type": "address" }, { "internalType": "uint256", "name": "_nonce", "type": "uint256" }], "name": "getTransactionHash", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "isOwner", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "bytes", "name": "_data", "type": "bytes" }, { "internalType": "bytes", "name": "_signature", "type": "bytes" }], "name": "isValidSignature", "outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "nonce", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "prevOwner", "type": "address" }, { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "_threshold", "type": "uint256" }], "name": "removeOwner", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }, { "internalType": "enum Enum.Operation", "name": "operation", "type": "uint8" }], "name": "requiredTxGas", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "handler", "type": "address" }], "name": "setFallbackHandler", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address[]", "name": "_owners", "type": "address[]" }, { "internalType": "uint256", "name": "_threshold", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "bytes", "name": "data", "type": "bytes" }, { "internalType": "address", "name": "fallbackHandler", "type": "address" }, { "internalType": "address", "name": "paymentToken", "type": "address" }, { "internalType": "uint256", "name": "payment", "type": "uint256" }, { "internalType": "address payable", "name": "paymentReceiver", "type": "address" }], "name": "setup", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "bytes", "name": "_data", "type": "bytes" }], "name": "signMessage", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "signedMessages", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "prevOwner", "type": "address" }, { "internalType": "address", "name": "oldOwner", "type": "address" }, { "internalType": "address", "name": "newOwner", "type": "address" }], "name": "swapOwner", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }];
    }
    // 0xa3f4df7e
    async NAME() {
        return this.$read('function NAME() returns string');
    }
    // 0xffa1ad74
    async VERSION() {
        return this.$read('function VERSION() returns string');
    }
    // 0x0d582f13
    async addOwnerWithThreshold(sender, owner, _threshold) {
        return this.$write(this.$getAbiItem('function', 'addOwnerWithThreshold'), sender, owner, _threshold);
    }
    // 0xd4d9bdcd
    async approveHash(sender, hashToApprove) {
        return this.$write(this.$getAbiItem('function', 'approveHash'), sender, hashToApprove);
    }
    // 0x7d832974
    async approvedHashes(input0, input1) {
        return this.$read('function approvedHashes(address, bytes32) returns uint256', input0, input1);
    }
    // 0x7de7edef
    async changeMasterCopy(sender, _masterCopy) {
        return this.$write(this.$getAbiItem('function', 'changeMasterCopy'), sender, _masterCopy);
    }
    // 0x694e80c3
    async changeThreshold(sender, _threshold) {
        return this.$write(this.$getAbiItem('function', 'changeThreshold'), sender, _threshold);
    }
    // 0xe009cfde
    async disableModule(sender, prevModule, module) {
        return this.$write(this.$getAbiItem('function', 'disableModule'), sender, prevModule, module);
    }
    // 0xf698da25
    async domainSeparator() {
        return this.$read('function domainSeparator() returns bytes32');
    }
    // 0x610b5925
    async enableModule(sender, module) {
        return this.$write(this.$getAbiItem('function', 'enableModule'), sender, module);
    }
    // 0xe86637db
    async encodeTransactionData(to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, _nonce) {
        return this.$read('function encodeTransactionData(address, uint256, bytes, uint8, uint256, uint256, uint256, address, address, uint256) returns bytes', to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, _nonce);
    }
    // 0x6a761202
    async execTransaction(sender, to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, signatures) {
        return this.$write(this.$getAbiItem('function', 'execTransaction'), sender, to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, signatures);
    }
    // 0x468721a7
    async execTransactionFromModule(sender, to, value, data, operation) {
        return this.$write(this.$getAbiItem('function', 'execTransactionFromModule'), sender, to, value, data, operation);
    }
    // 0x5229073f
    async execTransactionFromModuleReturnData(sender, to, value, data, operation) {
        return this.$write(this.$getAbiItem('function', 'execTransactionFromModuleReturnData'), sender, to, value, data, operation);
    }
    // 0x0a1028c4
    async getMessageHash(message) {
        return this.$read('function getMessageHash(bytes) returns bytes32', message);
    }
    // 0xb2494df3
    async getModules() {
        return this.$read('function getModules() returns address[]');
    }
    // 0xcc2f8452
    async getModulesPaginated(start, pageSize) {
        return this.$read('function getModulesPaginated(address, uint256) returns (address[],address)', start, pageSize);
    }
    // 0xa0e67e2b
    async getOwners() {
        return this.$read('function getOwners() returns address[]');
    }
    // 0xe75235b8
    async getThreshold() {
        return this.$read('function getThreshold() returns uint256');
    }
    // 0xd8d11f78
    async getTransactionHash(to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, _nonce) {
        return this.$read('function getTransactionHash(address, uint256, bytes, uint8, uint256, uint256, uint256, address, address, uint256) returns bytes32', to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, _nonce);
    }
    // 0x2f54bf6e
    async isOwner(owner) {
        return this.$read('function isOwner(address) returns bool', owner);
    }
    // 0x20c13b0b
    async isValidSignature(sender, _data, _signature) {
        return this.$write(this.$getAbiItem('function', 'isValidSignature'), sender, _data, _signature);
    }
    // 0xaffed0e0
    async nonce() {
        return this.$read('function nonce() returns uint256');
    }
    // 0xf8dc5dd9
    async removeOwner(sender, prevOwner, owner, _threshold) {
        return this.$write(this.$getAbiItem('function', 'removeOwner'), sender, prevOwner, owner, _threshold);
    }
    // 0xc4ca3a9c
    async requiredTxGas(sender, to, value, data, operation) {
        return this.$write(this.$getAbiItem('function', 'requiredTxGas'), sender, to, value, data, operation);
    }
    // 0xf08a0323
    async setFallbackHandler(sender, handler) {
        return this.$write(this.$getAbiItem('function', 'setFallbackHandler'), sender, handler);
    }
    // 0xb63e800d
    async setup(sender, _owners, _threshold, to, data, fallbackHandler, paymentToken, payment, paymentReceiver) {
        return this.$write(this.$getAbiItem('function', 'setup'), sender, _owners, _threshold, to, data, fallbackHandler, paymentToken, payment, paymentReceiver);
    }
    // 0x85a5affe
    async signMessage(sender, _data) {
        return this.$write(this.$getAbiItem('function', 'signMessage'), sender, _data);
    }
    // 0x5ae6bd37
    async signedMessages(input0) {
        return this.$read('function signedMessages(bytes32) returns uint256', input0);
    }
    // 0xe318b52b
    async swapOwner(sender, prevOwner, oldOwner, newOwner) {
        return this.$write(this.$getAbiItem('function', 'swapOwner'), sender, prevOwner, oldOwner, newOwner);
    }
    onAddedOwner(fn) {
        return this.$on('AddedOwner', fn);
    }
    onApproveHash(fn) {
        return this.$on('ApproveHash', fn);
    }
    onChangedMasterCopy(fn) {
        return this.$on('ChangedMasterCopy', fn);
    }
    onChangedThreshold(fn) {
        return this.$on('ChangedThreshold', fn);
    }
    onDisabledModule(fn) {
        return this.$on('DisabledModule', fn);
    }
    onEnabledModule(fn) {
        return this.$on('EnabledModule', fn);
    }
    onExecutionFailure(fn) {
        return this.$on('ExecutionFailure', fn);
    }
    onExecutionFromModuleFailure(fn) {
        return this.$on('ExecutionFromModuleFailure', fn);
    }
    onExecutionFromModuleSuccess(fn) {
        return this.$on('ExecutionFromModuleSuccess', fn);
    }
    onExecutionSuccess(fn) {
        return this.$on('ExecutionSuccess', fn);
    }
    onRemovedOwner(fn) {
        return this.$on('RemovedOwner', fn);
    }
    onSignMsg(fn) {
        return this.$on('SignMsg', fn);
    }
    extractLogsAddedOwner(tx) {
        let abi = this.$getAbiItem('event', 'AddedOwner');
        return this.$extractLogs(tx, abi);
    }
    extractLogsApproveHash(tx) {
        let abi = this.$getAbiItem('event', 'ApproveHash');
        return this.$extractLogs(tx, abi);
    }
    extractLogsChangedMasterCopy(tx) {
        let abi = this.$getAbiItem('event', 'ChangedMasterCopy');
        return this.$extractLogs(tx, abi);
    }
    extractLogsChangedThreshold(tx) {
        let abi = this.$getAbiItem('event', 'ChangedThreshold');
        return this.$extractLogs(tx, abi);
    }
    extractLogsDisabledModule(tx) {
        let abi = this.$getAbiItem('event', 'DisabledModule');
        return this.$extractLogs(tx, abi);
    }
    extractLogsEnabledModule(tx) {
        let abi = this.$getAbiItem('event', 'EnabledModule');
        return this.$extractLogs(tx, abi);
    }
    extractLogsExecutionFailure(tx) {
        let abi = this.$getAbiItem('event', 'ExecutionFailure');
        return this.$extractLogs(tx, abi);
    }
    extractLogsExecutionFromModuleFailure(tx) {
        let abi = this.$getAbiItem('event', 'ExecutionFromModuleFailure');
        return this.$extractLogs(tx, abi);
    }
    extractLogsExecutionFromModuleSuccess(tx) {
        let abi = this.$getAbiItem('event', 'ExecutionFromModuleSuccess');
        return this.$extractLogs(tx, abi);
    }
    extractLogsExecutionSuccess(tx) {
        let abi = this.$getAbiItem('event', 'ExecutionSuccess');
        return this.$extractLogs(tx, abi);
    }
    extractLogsRemovedOwner(tx) {
        let abi = this.$getAbiItem('event', 'RemovedOwner');
        return this.$extractLogs(tx, abi);
    }
    extractLogsSignMsg(tx) {
        let abi = this.$getAbiItem('event', 'SignMsg');
        return this.$extractLogs(tx, abi);
    }
    async getPastLogsAddedOwner(options) {
        let topic = '0x9465fa0c962cc76958e6373a993326400c1c94f8be2fe3a952adfa7f60b2ea26';
        let abi = this.$getAbiItem('event', 'AddedOwner');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs = await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi));
    }
    async getPastLogsApproveHash(options) {
        let topic = '0xf2a0eb156472d1440255b0d7c1e19cc07115d1051fe605b0dce69acfec884d9c';
        let abi = this.$getAbiItem('event', 'ApproveHash');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs = await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi));
    }
    async getPastLogsChangedMasterCopy(options) {
        let topic = '0x75e41bc35ff1bf14d81d1d2f649c0084a0f974f9289c803ec9898eeec4c8d0b8';
        let abi = this.$getAbiItem('event', 'ChangedMasterCopy');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs = await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi));
    }
    async getPastLogsChangedThreshold(options) {
        let topic = '0x610f7ff2b304ae8903c3de74c60c6ab1f7d6226b3f52c5161905bb5ad4039c93';
        let abi = this.$getAbiItem('event', 'ChangedThreshold');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs = await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi));
    }
    async getPastLogsDisabledModule(options) {
        let topic = '0xaab4fa2b463f581b2b32cb3b7e3b704b9ce37cc209b5fb4d77e593ace4054276';
        let abi = this.$getAbiItem('event', 'DisabledModule');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs = await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi));
    }
    async getPastLogsEnabledModule(options) {
        let topic = '0xecdf3a3effea5783a3c4c2140e677577666428d44ed9d474a0b3a4c9943f8440';
        let abi = this.$getAbiItem('event', 'EnabledModule');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs = await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi));
    }
    async getPastLogsExecutionFailure(options) {
        let topic = '0x23428b18acfb3ea64b08dc0c1d296ea9c09702c09083ca5272e64d115b687d23';
        let abi = this.$getAbiItem('event', 'ExecutionFailure');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs = await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi));
    }
    async getPastLogsExecutionFromModuleFailure(options) {
        let topic = '0xacd2c8702804128fdb0db2bb49f6d127dd0181c13fd45dbfe16de0930e2bd375';
        let abi = this.$getAbiItem('event', 'ExecutionFromModuleFailure');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs = await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi));
    }
    async getPastLogsExecutionFromModuleSuccess(options) {
        let topic = '0x6895c13664aa4f67288b25d7a21d7aaa34916e355fb9b6fae0a139a9085becb8';
        let abi = this.$getAbiItem('event', 'ExecutionFromModuleSuccess');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs = await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi));
    }
    async getPastLogsExecutionSuccess(options) {
        let topic = '0x442e715f626346e8c54381002da614f62bee8d27386535b2521ec8540898556e';
        let abi = this.$getAbiItem('event', 'ExecutionSuccess');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs = await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi));
    }
    async getPastLogsRemovedOwner(options) {
        let topic = '0xf8d49fc529812e9a7c5c50e69c20f0dccc0db8fa95c98bc58cc9a4f1c1299eaf';
        let abi = this.$getAbiItem('event', 'RemovedOwner');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs = await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi));
    }
    async getPastLogsSignMsg(options) {
        let topic = '0xe7f4675038f4f6034dfcbbb24c4dc08e4ebf10eb9d257d3d02c0f38d122ac6e4';
        let abi = this.$getAbiItem('event', 'SignMsg');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs = await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi));
    }
}
exports.GnosisSafe = GnosisSafe;
