"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERC20PolygonBase = void 0;
const a_di_1 = __importDefault(require("a-di"));
const Polyscan_1 = require("@dequanto/BlockchainExplorer/Polyscan");
const PolyWeb3Client_1 = require("@dequanto/clients/PolyWeb3Client");
const ContractBase_1 = require("@dequanto/contracts/ContractBase");
class ERC20PolygonBase extends ContractBase_1.ContractBase {
    constructor(address = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', client = a_di_1.default.resolve(PolyWeb3Client_1.PolyWeb3Client), explorer = a_di_1.default.resolve(Polyscan_1.Polyscan)) {
        super(address, client, explorer);
        this.address = address;
        this.client = client;
        this.explorer = explorer;
        this.abi = [{ "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "authorizer", "type": "address" }, { "indexed": true, "internalType": "bytes32", "name": "nonce", "type": "bytes32" }], "name": "AuthorizationCanceled", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "authorizer", "type": "address" }, { "indexed": true, "internalType": "bytes32", "name": "nonce", "type": "bytes32" }], "name": "AuthorizationUsed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }], "name": "Blacklisted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "userAddress", "type": "address" }, { "indexed": false, "internalType": "address payable", "name": "relayerAddress", "type": "address" }, { "indexed": false, "internalType": "bytes", "name": "functionSignature", "type": "bytes" }], "name": "MetaTransactionExecuted", "type": "event" }, { "anonymous": false, "inputs": [], "name": "Pause", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "newRescuer", "type": "address" }], "name": "RescuerChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "previousAdminRole", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "newAdminRole", "type": "bytes32" }], "name": "RoleAdminChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleGranted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleRevoked", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }], "name": "UnBlacklisted", "type": "event" }, { "anonymous": false, "inputs": [], "name": "Unpause", "type": "event" }, { "inputs": [], "name": "APPROVE_WITH_AUTHORIZATION_TYPEHASH", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "BLACKLISTER_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "CANCEL_AUTHORIZATION_TYPEHASH", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "DECREASE_ALLOWANCE_WITH_AUTHORIZATION_TYPEHASH", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "DEFAULT_ADMIN_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "DEPOSITOR_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "DOMAIN_SEPARATOR", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "EIP712_VERSION", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "INCREASE_ALLOWANCE_WITH_AUTHORIZATION_TYPEHASH", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "META_TRANSACTION_TYPEHASH", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "PAUSER_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "PERMIT_TYPEHASH", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "RESCUER_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "TRANSFER_WITH_AUTHORIZATION_TYPEHASH", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "WITHDRAW_WITH_AUTHORIZATION_TYPEHASH", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "validAfter", "type": "uint256" }, { "internalType": "uint256", "name": "validBefore", "type": "uint256" }, { "internalType": "bytes32", "name": "nonce", "type": "bytes32" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "approveWithAuthorization", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "authorizer", "type": "address" }, { "internalType": "bytes32", "name": "nonce", "type": "bytes32" }], "name": "authorizationState", "outputs": [{ "internalType": "enum GasAbstraction.AuthorizationState", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "blacklist", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "blacklisters", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "authorizer", "type": "address" }, { "internalType": "bytes32", "name": "nonce", "type": "bytes32" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "cancelAuthorization", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "decrement", "type": "uint256" }, { "internalType": "uint256", "name": "validAfter", "type": "uint256" }, { "internalType": "uint256", "name": "validBefore", "type": "uint256" }, { "internalType": "bytes32", "name": "nonce", "type": "bytes32" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "decreaseAllowanceWithAuthorization", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }, { "internalType": "bytes", "name": "depositData", "type": "bytes" }], "name": "deposit", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "userAddress", "type": "address" }, { "internalType": "bytes", "name": "functionSignature", "type": "bytes" }, { "internalType": "bytes32", "name": "sigR", "type": "bytes32" }, { "internalType": "bytes32", "name": "sigS", "type": "bytes32" }, { "internalType": "uint8", "name": "sigV", "type": "uint8" }], "name": "executeMetaTransaction", "outputs": [{ "internalType": "bytes", "name": "", "type": "bytes" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }], "name": "getRoleAdmin", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "getRoleMember", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }], "name": "getRoleMemberCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "grantRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "hasRole", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "increment", "type": "uint256" }, { "internalType": "uint256", "name": "validAfter", "type": "uint256" }, { "internalType": "uint256", "name": "validBefore", "type": "uint256" }, { "internalType": "bytes32", "name": "nonce", "type": "bytes32" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "increaseAllowanceWithAuthorization", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "newName", "type": "string" }, { "internalType": "string", "name": "newSymbol", "type": "string" }, { "internalType": "uint8", "name": "newDecimals", "type": "uint8" }, { "internalType": "address", "name": "childChainManager", "type": "address" }], "name": "initialize", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "initialized", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "isBlacklisted", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "nonces", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "paused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pausers", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "permit", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "renounceRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "contract IERC20", "name": "tokenContract", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "rescueERC20", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "rescuers", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "revokeRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "validAfter", "type": "uint256" }, { "internalType": "uint256", "name": "validBefore", "type": "uint256" }, { "internalType": "bytes32", "name": "nonce", "type": "bytes32" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "transferWithAuthorization", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "unBlacklist", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "unpause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "newName", "type": "string" }, { "internalType": "string", "name": "newSymbol", "type": "string" }], "name": "updateMetadata", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "validAfter", "type": "uint256" }, { "internalType": "uint256", "name": "validBefore", "type": "uint256" }, { "internalType": "bytes32", "name": "nonce", "type": "bytes32" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "withdrawWithAuthorization", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];
    }
    async APPROVE_WITH_AUTHORIZATION_TYPEHASH() {
        return this.$read('function APPROVE_WITH_AUTHORIZATION_TYPEHASH() returns bytes32');
    }
    async BLACKLISTER_ROLE() {
        return this.$read('function BLACKLISTER_ROLE() returns bytes32');
    }
    async CANCEL_AUTHORIZATION_TYPEHASH() {
        return this.$read('function CANCEL_AUTHORIZATION_TYPEHASH() returns bytes32');
    }
    async DECREASE_ALLOWANCE_WITH_AUTHORIZATION_TYPEHASH() {
        return this.$read('function DECREASE_ALLOWANCE_WITH_AUTHORIZATION_TYPEHASH() returns bytes32');
    }
    async DEFAULT_ADMIN_ROLE() {
        return this.$read('function DEFAULT_ADMIN_ROLE() returns bytes32');
    }
    async DEPOSITOR_ROLE() {
        return this.$read('function DEPOSITOR_ROLE() returns bytes32');
    }
    async DOMAIN_SEPARATOR() {
        return this.$read('function DOMAIN_SEPARATOR() returns bytes32');
    }
    async EIP712_VERSION() {
        return this.$read('function EIP712_VERSION() returns string');
    }
    async INCREASE_ALLOWANCE_WITH_AUTHORIZATION_TYPEHASH() {
        return this.$read('function INCREASE_ALLOWANCE_WITH_AUTHORIZATION_TYPEHASH() returns bytes32');
    }
    async META_TRANSACTION_TYPEHASH() {
        return this.$read('function META_TRANSACTION_TYPEHASH() returns bytes32');
    }
    async PAUSER_ROLE() {
        return this.$read('function PAUSER_ROLE() returns bytes32');
    }
    async PERMIT_TYPEHASH() {
        return this.$read('function PERMIT_TYPEHASH() returns bytes32');
    }
    async RESCUER_ROLE() {
        return this.$read('function RESCUER_ROLE() returns bytes32');
    }
    async TRANSFER_WITH_AUTHORIZATION_TYPEHASH() {
        return this.$read('function TRANSFER_WITH_AUTHORIZATION_TYPEHASH() returns bytes32');
    }
    async WITHDRAW_WITH_AUTHORIZATION_TYPEHASH() {
        return this.$read('function WITHDRAW_WITH_AUTHORIZATION_TYPEHASH() returns bytes32');
    }
    async allowance(owner, spender) {
        return this.$read('function allowance(address, address) returns uint256', owner, spender);
    }
    async approve(eoa, spender, amount) {
        return this.$write('function approve(address, uint256) returns bool', eoa, spender, amount);
    }
    async approveWithAuthorization(eoa, owner, spender, value, validAfter, validBefore, nonce, v, r, s) {
        return this.$write('function approveWithAuthorization(address, address, uint256, uint256, uint256, bytes32, uint8, bytes32, bytes32)', eoa, owner, spender, value, validAfter, validBefore, nonce, v, r, s);
    }
    async authorizationState(authorizer, nonce) {
        return this.$read('function authorizationState(address, bytes32) returns uint8', authorizer, nonce);
    }
    async balanceOf(account) {
        return this.$read('function balanceOf(address) returns uint256', account);
    }
    async blacklist(eoa, account) {
        return this.$write('function blacklist(address)', eoa, account);
    }
    async blacklisters() {
        return this.$read('function blacklisters() returns address[]');
    }
    async cancelAuthorization(eoa, authorizer, nonce, v, r, s) {
        return this.$write('function cancelAuthorization(address, bytes32, uint8, bytes32, bytes32)', eoa, authorizer, nonce, v, r, s);
    }
    async decimals() {
        return this.$read('function decimals() returns uint8');
    }
    async decreaseAllowance(eoa, spender, subtractedValue) {
        return this.$write('function decreaseAllowance(address, uint256) returns bool', eoa, spender, subtractedValue);
    }
    async decreaseAllowanceWithAuthorization(eoa, owner, spender, decrement, validAfter, validBefore, nonce, v, r, s) {
        return this.$write('function decreaseAllowanceWithAuthorization(address, address, uint256, uint256, uint256, bytes32, uint8, bytes32, bytes32)', eoa, owner, spender, decrement, validAfter, validBefore, nonce, v, r, s);
    }
    async deposit(eoa, user, depositData) {
        return this.$write('function deposit(address, bytes)', eoa, user, depositData);
    }
    async executeMetaTransaction(eoa, userAddress, functionSignature, sigR, sigS, sigV) {
        return this.$write('function executeMetaTransaction(address, bytes, bytes32, bytes32, uint8) returns bytes', eoa, userAddress, functionSignature, sigR, sigS, sigV);
    }
    async getRoleAdmin(role) {
        return this.$read('function getRoleAdmin(bytes32) returns bytes32', role);
    }
    async getRoleMember(role, index) {
        return this.$read('function getRoleMember(bytes32, uint256) returns address', role, index);
    }
    async getRoleMemberCount(role) {
        return this.$read('function getRoleMemberCount(bytes32) returns uint256', role);
    }
    async grantRole(eoa, role, account) {
        return this.$write('function grantRole(bytes32, address)', eoa, role, account);
    }
    async hasRole(role, account) {
        return this.$read('function hasRole(bytes32, address) returns bool', role, account);
    }
    async increaseAllowance(eoa, spender, addedValue) {
        return this.$write('function increaseAllowance(address, uint256) returns bool', eoa, spender, addedValue);
    }
    async increaseAllowanceWithAuthorization(eoa, owner, spender, increment, validAfter, validBefore, nonce, v, r, s) {
        return this.$write('function increaseAllowanceWithAuthorization(address, address, uint256, uint256, uint256, bytes32, uint8, bytes32, bytes32)', eoa, owner, spender, increment, validAfter, validBefore, nonce, v, r, s);
    }
    async initialize(eoa, newName, newSymbol, newDecimals, childChainManager) {
        return this.$write('function initialize(string, string, uint8, address)', eoa, newName, newSymbol, newDecimals, childChainManager);
    }
    async initialized() {
        return this.$read('function initialized() returns bool');
    }
    async isBlacklisted(account) {
        return this.$read('function isBlacklisted(address) returns bool', account);
    }
    async name() {
        return this.$read('function name() returns string');
    }
    async nonces(owner) {
        return this.$read('function nonces(address) returns uint256', owner);
    }
    async pause(eoa) {
        return this.$write('function pause()', eoa);
    }
    async paused() {
        return this.$read('function paused() returns bool');
    }
    async pausers() {
        return this.$read('function pausers() returns address[]');
    }
    async permit(eoa, owner, spender, value, deadline, v, r, s) {
        return this.$write('function permit(address, address, uint256, uint256, uint8, bytes32, bytes32)', eoa, owner, spender, value, deadline, v, r, s);
    }
    async renounceRole(eoa, role, account) {
        return this.$write('function renounceRole(bytes32, address)', eoa, role, account);
    }
    async rescueERC20(eoa, tokenContract, to, amount) {
        return this.$write('function rescueERC20(address, address, uint256)', eoa, tokenContract, to, amount);
    }
    async rescuers() {
        return this.$read('function rescuers() returns address[]');
    }
    async revokeRole(eoa, role, account) {
        return this.$write('function revokeRole(bytes32, address)', eoa, role, account);
    }
    async symbol() {
        return this.$read('function symbol() returns string');
    }
    async totalSupply() {
        return this.$read('function totalSupply() returns uint256');
    }
    async transfer(eoa, recipient, amount) {
        return this.$write('function transfer(address, uint256) returns bool', eoa, recipient, amount);
    }
    async transferFrom(eoa, sender, recipient, amount) {
        return this.$write('function transferFrom(address, address, uint256) returns bool', eoa, sender, recipient, amount);
    }
    async transferWithAuthorization(eoa, from, to, value, validAfter, validBefore, nonce, v, r, s) {
        return this.$write('function transferWithAuthorization(address, address, uint256, uint256, uint256, bytes32, uint8, bytes32, bytes32)', eoa, from, to, value, validAfter, validBefore, nonce, v, r, s);
    }
    async unBlacklist(eoa, account) {
        return this.$write('function unBlacklist(address)', eoa, account);
    }
    async unpause(eoa) {
        return this.$write('function unpause()', eoa);
    }
    async updateMetadata(eoa, newName, newSymbol) {
        return this.$write('function updateMetadata(string, string)', eoa, newName, newSymbol);
    }
    async withdraw(eoa, amount) {
        return this.$write('function withdraw(uint256)', eoa, amount);
    }
    async withdrawWithAuthorization(eoa, owner, value, validAfter, validBefore, nonce, v, r, s) {
        return this.$write('function withdrawWithAuthorization(address, uint256, uint256, uint256, bytes32, uint8, bytes32, bytes32)', eoa, owner, value, validAfter, validBefore, nonce, v, r, s);
    }
    onApproval(fn) {
        return this.$on('Approval', fn);
    }
    onAuthorizationCanceled(fn) {
        return this.$on('AuthorizationCanceled', fn);
    }
    onAuthorizationUsed(fn) {
        return this.$on('AuthorizationUsed', fn);
    }
    onBlacklisted(fn) {
        return this.$on('Blacklisted', fn);
    }
    onMetaTransactionExecuted(fn) {
        return this.$on('MetaTransactionExecuted', fn);
    }
    onPause(fn) {
        return this.$on('Pause', fn);
    }
    onRescuerChanged(fn) {
        return this.$on('RescuerChanged', fn);
    }
    onRoleAdminChanged(fn) {
        return this.$on('RoleAdminChanged', fn);
    }
    onRoleGranted(fn) {
        return this.$on('RoleGranted', fn);
    }
    onRoleRevoked(fn) {
        return this.$on('RoleRevoked', fn);
    }
    onTransfer(fn) {
        return this.$on('Transfer', fn);
    }
    onUnBlacklisted(fn) {
        return this.$on('UnBlacklisted', fn);
    }
    onUnpause(fn) {
        return this.$on('Unpause', fn);
    }
}
exports.ERC20PolygonBase = ERC20PolygonBase;
