"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WormholeBridgeContractBase = void 0;
/**
 *  AUTO-Generated Class: 2022-01-26 09:40
 *  Implementation: https://polygonscan.com/address/0x449c258f75bef9b6840e9252706d1644a9b4983c#code
 */
const a_di_1 = __importDefault(require("a-di"));
const ContractBase_1 = require("@dequanto/contracts/ContractBase");
const Polyscan_1 = require("@dequanto/BlockchainExplorer/Polyscan");
const PolyWeb3Client_1 = require("@dequanto/clients/PolyWeb3Client");
class WormholeBridgeContractBase extends ContractBase_1.ContractBase {
    constructor(address = '0x5a58505a96d1dbf8df91cb21b54419fc36e93fde', client = a_di_1.default.resolve(PolyWeb3Client_1.PolyWeb3Client), explorer = a_di_1.default.resolve(Polyscan_1.Polyscan)) {
        super(address, client, explorer);
        this.address = address;
        this.client = client;
        this.explorer = explorer;
        this.abi = [{ "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "previousAdmin", "type": "address" }, { "indexed": false, "internalType": "address", "name": "newAdmin", "type": "address" }], "name": "AdminChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "beacon", "type": "address" }], "name": "BeaconUpgraded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "oldContract", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newContract", "type": "address" }], "name": "ContractUpgraded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "implementation", "type": "address" }], "name": "Upgraded", "type": "event" }, { "inputs": [], "name": "WETH", "outputs": [{ "internalType": "contract IWETH", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenAddress", "type": "address" }, { "internalType": "uint32", "name": "nonce", "type": "uint32" }], "name": "attestToken", "outputs": [{ "internalType": "uint64", "name": "sequence", "type": "uint64" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint16", "name": "chainId_", "type": "uint16" }], "name": "bridgeContracts", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "chainId", "outputs": [{ "internalType": "uint16", "name": "", "type": "uint16" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes", "name": "encodedVm", "type": "bytes" }], "name": "completeTransfer", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes", "name": "encodedVm", "type": "bytes" }], "name": "completeTransferAndUnwrapETH", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes", "name": "encodedVm", "type": "bytes" }], "name": "createWrapped", "outputs": [{ "internalType": "address", "name": "token", "type": "address" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "components": [{ "internalType": "uint8", "name": "payloadID", "type": "uint8" }, { "internalType": "bytes32", "name": "tokenAddress", "type": "bytes32" }, { "internalType": "uint16", "name": "tokenChain", "type": "uint16" }, { "internalType": "uint8", "name": "decimals", "type": "uint8" }, { "internalType": "bytes32", "name": "symbol", "type": "bytes32" }, { "internalType": "bytes32", "name": "name", "type": "bytes32" }], "internalType": "struct BridgeStructs.AssetMeta", "name": "meta", "type": "tuple" }], "name": "encodeAssetMeta", "outputs": [{ "internalType": "bytes", "name": "encoded", "type": "bytes" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "components": [{ "internalType": "uint8", "name": "payloadID", "type": "uint8" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes32", "name": "tokenAddress", "type": "bytes32" }, { "internalType": "uint16", "name": "tokenChain", "type": "uint16" }, { "internalType": "bytes32", "name": "to", "type": "bytes32" }, { "internalType": "uint16", "name": "toChain", "type": "uint16" }, { "internalType": "uint256", "name": "fee", "type": "uint256" }], "internalType": "struct BridgeStructs.Transfer", "name": "transfer", "type": "tuple" }], "name": "encodeTransfer", "outputs": [{ "internalType": "bytes", "name": "encoded", "type": "bytes" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "hash", "type": "bytes32" }], "name": "governanceActionIsConsumed", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "governanceChainId", "outputs": [{ "internalType": "uint16", "name": "", "type": "uint16" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "governanceContract", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "implementation", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "initialize", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "impl", "type": "address" }], "name": "isInitialized", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "hash", "type": "bytes32" }], "name": "isTransferCompleted", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }], "name": "isWrappedAsset", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }], "name": "outstandingBridged", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes", "name": "encoded", "type": "bytes" }], "name": "parseAssetMeta", "outputs": [{ "components": [{ "internalType": "uint8", "name": "payloadID", "type": "uint8" }, { "internalType": "bytes32", "name": "tokenAddress", "type": "bytes32" }, { "internalType": "uint16", "name": "tokenChain", "type": "uint16" }, { "internalType": "uint8", "name": "decimals", "type": "uint8" }, { "internalType": "bytes32", "name": "symbol", "type": "bytes32" }, { "internalType": "bytes32", "name": "name", "type": "bytes32" }], "internalType": "struct BridgeStructs.AssetMeta", "name": "meta", "type": "tuple" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "bytes", "name": "encoded", "type": "bytes" }], "name": "parseRegisterChain", "outputs": [{ "components": [{ "internalType": "bytes32", "name": "module", "type": "bytes32" }, { "internalType": "uint8", "name": "action", "type": "uint8" }, { "internalType": "uint16", "name": "chainId", "type": "uint16" }, { "internalType": "uint16", "name": "emitterChainID", "type": "uint16" }, { "internalType": "bytes32", "name": "emitterAddress", "type": "bytes32" }], "internalType": "struct BridgeStructs.RegisterChain", "name": "chain", "type": "tuple" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "bytes", "name": "encoded", "type": "bytes" }], "name": "parseTransfer", "outputs": [{ "components": [{ "internalType": "uint8", "name": "payloadID", "type": "uint8" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes32", "name": "tokenAddress", "type": "bytes32" }, { "internalType": "uint16", "name": "tokenChain", "type": "uint16" }, { "internalType": "bytes32", "name": "to", "type": "bytes32" }, { "internalType": "uint16", "name": "toChain", "type": "uint16" }, { "internalType": "uint256", "name": "fee", "type": "uint256" }], "internalType": "struct BridgeStructs.Transfer", "name": "transfer", "type": "tuple" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "bytes", "name": "encoded", "type": "bytes" }], "name": "parseUpgrade", "outputs": [{ "components": [{ "internalType": "bytes32", "name": "module", "type": "bytes32" }, { "internalType": "uint8", "name": "action", "type": "uint8" }, { "internalType": "uint16", "name": "chainId", "type": "uint16" }, { "internalType": "bytes32", "name": "newContract", "type": "bytes32" }], "internalType": "struct BridgeStructs.UpgradeContract", "name": "chain", "type": "tuple" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "bytes", "name": "encodedVM", "type": "bytes" }], "name": "registerChain", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "tokenImplementation", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint16", "name": "recipientChain", "type": "uint16" }, { "internalType": "bytes32", "name": "recipient", "type": "bytes32" }, { "internalType": "uint256", "name": "arbiterFee", "type": "uint256" }, { "internalType": "uint32", "name": "nonce", "type": "uint32" }], "name": "transferTokens", "outputs": [{ "internalType": "uint64", "name": "sequence", "type": "uint64" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "bytes", "name": "encodedVm", "type": "bytes" }], "name": "updateWrapped", "outputs": [{ "internalType": "address", "name": "token", "type": "address" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes", "name": "encodedVM", "type": "bytes" }], "name": "upgrade", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "wormhole", "outputs": [{ "internalType": "contract IWormhole", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint16", "name": "recipientChain", "type": "uint16" }, { "internalType": "bytes32", "name": "recipient", "type": "bytes32" }, { "internalType": "uint256", "name": "arbiterFee", "type": "uint256" }, { "internalType": "uint32", "name": "nonce", "type": "uint32" }], "name": "wrapAndTransferETH", "outputs": [{ "internalType": "uint64", "name": "sequence", "type": "uint64" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint16", "name": "tokenChainId", "type": "uint16" }, { "internalType": "bytes32", "name": "tokenAddress", "type": "bytes32" }], "name": "wrappedAsset", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "stateMutability": "payable", "type": "receive" }];
    }
    // 0xad5c4648
    async WETH() {
        return this.$read('function WETH() returns address');
    }
    // 0xc48fa115
    async attestToken(eoa, tokenAddress, nonce) {
        return this.$write(this.$getAbiItem('function', 'attestToken'), eoa, tokenAddress, nonce);
    }
    // 0xad66a5f1
    async bridgeContracts(chainId_) {
        return this.$read('function bridgeContracts(uint16) returns bytes32', chainId_);
    }
    // 0x9a8a0592
    async chainId() {
        return this.$read('function chainId() returns uint16');
    }
    // 0xc6878519
    async completeTransfer(eoa, encodedVm) {
        return this.$write(this.$getAbiItem('function', 'completeTransfer'), eoa, encodedVm);
    }
    // 0xff200cde
    async completeTransferAndUnwrapETH(eoa, encodedVm) {
        return this.$write(this.$getAbiItem('function', 'completeTransferAndUnwrapETH'), eoa, encodedVm);
    }
    // 0xe8059810
    async createWrapped(eoa, encodedVm) {
        return this.$write(this.$getAbiItem('function', 'createWrapped'), eoa, encodedVm);
    }
    // 0xb046223b
    async encodeAssetMeta(meta) {
        return this.$read('function encodeAssetMeta(tuple) returns bytes', meta);
    }
    // 0x5f854266
    async encodeTransfer(transfer) {
        return this.$read('function encodeTransfer(tuple) returns bytes', transfer);
    }
    // 0x2c3c02a4
    async governanceActionIsConsumed(hash) {
        return this.$read('function governanceActionIsConsumed(bytes32) returns bool', hash);
    }
    // 0xfbe3c2cd
    async governanceChainId() {
        return this.$read('function governanceChainId() returns uint16');
    }
    // 0xb172b222
    async governanceContract() {
        return this.$read('function governanceContract() returns bytes32');
    }
    // 0x5c60da1b
    async implementation() {
        return this.$read('function implementation() returns address');
    }
    // 0x8129fc1c
    async initialize(eoa) {
        return this.$write(this.$getAbiItem('function', 'initialize'), eoa);
    }
    // 0xd60b347f
    async isInitialized(impl) {
        return this.$read('function isInitialized(address) returns bool', impl);
    }
    // 0xaa4efa5b
    async isTransferCompleted(hash) {
        return this.$read('function isTransferCompleted(bytes32) returns bool', hash);
    }
    // 0x1a2be4da
    async isWrappedAsset(token) {
        return this.$read('function isWrappedAsset(address) returns bool', token);
    }
    // 0xb96c7e4d
    async outstandingBridged(token) {
        return this.$read('function outstandingBridged(address) returns uint256', token);
    }
    // 0x07dfd8fb
    async parseAssetMeta(encoded) {
        return this.$read('function parseAssetMeta(bytes) returns [uint8,bytes32,uint16,uint8,bytes32,bytes32]', encoded);
    }
    // 0x01f53255
    async parseRegisterChain(encoded) {
        return this.$read('function parseRegisterChain(bytes) returns [bytes32,uint8,uint16,uint16,bytes32]', encoded);
    }
    // 0x2b511375
    async parseTransfer(encoded) {
        return this.$read('function parseTransfer(bytes) returns [uint8,uint256,bytes32,uint16,bytes32,uint16,uint256]', encoded);
    }
    // 0xfbeeacd9
    async parseUpgrade(encoded) {
        return this.$read('function parseUpgrade(bytes) returns [bytes32,uint8,uint16,bytes32]', encoded);
    }
    // 0xa5799f93
    async registerChain(eoa, encodedVM) {
        return this.$write(this.$getAbiItem('function', 'registerChain'), eoa, encodedVM);
    }
    // 0x2f3a3d5d
    async tokenImplementation() {
        return this.$read('function tokenImplementation() returns address');
    }
    // 0x0f5287b0
    async transferTokens(eoa, token, amount, recipientChain, recipient, arbiterFee, nonce) {
        return this.$write(this.$getAbiItem('function', 'transferTokens'), eoa, token, amount, recipientChain, recipient, arbiterFee, nonce);
    }
    // 0xf768441f
    async updateWrapped(eoa, encodedVm) {
        return this.$write(this.$getAbiItem('function', 'updateWrapped'), eoa, encodedVm);
    }
    // 0x25394645
    async upgrade(eoa, encodedVM) {
        return this.$write(this.$getAbiItem('function', 'upgrade'), eoa, encodedVM);
    }
    // 0x84acd1bb
    async wormhole() {
        return this.$read('function wormhole() returns address');
    }
    // 0x9981509f
    async wrapAndTransferETH(eoa, recipientChain, recipient, arbiterFee, nonce) {
        return this.$write(this.$getAbiItem('function', 'wrapAndTransferETH'), eoa, recipientChain, recipient, arbiterFee, nonce);
    }
    // 0x1ff1e286
    async wrappedAsset(tokenChainId, tokenAddress) {
        return this.$read('function wrappedAsset(uint16, bytes32) returns address', tokenChainId, tokenAddress);
    }
    onAdminChanged(fn) {
        return this.$on('AdminChanged', fn);
    }
    onBeaconUpgraded(fn) {
        return this.$on('BeaconUpgraded', fn);
    }
    onContractUpgraded(fn) {
        return this.$on('ContractUpgraded', fn);
    }
    onUpgraded(fn) {
        return this.$on('Upgraded', fn);
    }
    extractLogsAdminChanged(tx) {
        let abi = this.$getAbiItem('event', 'AdminChanged');
        return this.$extractLogs(tx, abi);
    }
    extractLogsBeaconUpgraded(tx) {
        let abi = this.$getAbiItem('event', 'BeaconUpgraded');
        return this.$extractLogs(tx, abi);
    }
    extractLogsContractUpgraded(tx) {
        let abi = this.$getAbiItem('event', 'ContractUpgraded');
        return this.$extractLogs(tx, abi);
    }
    extractLogsUpgraded(tx) {
        let abi = this.$getAbiItem('event', 'Upgraded');
        return this.$extractLogs(tx, abi);
    }
}
exports.WormholeBridgeContractBase = WormholeBridgeContractBase;
