"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Matic_l2BridgeContract = void 0;
/**
 *  AUTO-Generated Class: 2022-01-08 23:50
 *  Implementation: https://polygonscan.com/address/0x553bC791D746767166fA3888432038193cEED5E2#code
 */
const a_di_1 = __importDefault(require("a-di"));
const ContractBase_1 = require("@dequanto/contracts/ContractBase");
const Polyscan_1 = require("@dequanto/BlockchainExplorer/Polyscan");
const PolyWeb3Client_1 = require("@dequanto/clients/PolyWeb3Client");
class Matic_l2BridgeContract extends ContractBase_1.ContractBase {
    constructor(address = '0x553bC791D746767166fA3888432038193cEED5E2', client = a_di_1.default.resolve(PolyWeb3Client_1.PolyWeb3Client), explorer = a_di_1.default.resolve(Polyscan_1.Polyscan)) {
        super(address, client, explorer);
        this.address = address;
        this.client = client;
        this.explorer = explorer;
        this.abi = [{ "inputs": [{ "internalType": "contract I_L2_PolygonMessengerProxy", "name": "_messengerProxy", "type": "address" }, { "internalType": "address", "name": "l1Governance", "type": "address" }, { "internalType": "contract HopBridgeToken", "name": "hToken", "type": "address" }, { "internalType": "address", "name": "l1BridgeAddress", "type": "address" }, { "internalType": "uint256[]", "name": "activeChainIds", "type": "uint256[]" }, { "internalType": "address[]", "name": "bonders", "type": "address[]" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "newBonder", "type": "address" }], "name": "BonderAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousBonder", "type": "address" }], "name": "BonderRemoved", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "L1_BridgeMessage", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "bonder", "type": "address" }, { "indexed": true, "internalType": "bytes32", "name": "rootHash", "type": "bytes32" }, { "indexed": false, "internalType": "uint256", "name": "totalBondsSettled", "type": "uint256" }], "name": "MultipleWithdrawalsSettled", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Stake", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "recipient", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "relayer", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "relayerFee", "type": "uint256" }], "name": "TransferFromL1Completed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "rootHash", "type": "bytes32" }, { "indexed": false, "internalType": "uint256", "name": "totalAmount", "type": "uint256" }], "name": "TransferRootSet", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "transferId", "type": "bytes32" }, { "indexed": true, "internalType": "uint256", "name": "chainId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "recipient", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes32", "name": "transferNonce", "type": "bytes32" }, { "indexed": false, "internalType": "uint256", "name": "bonderFee", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "TransferSent", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "destinationChainId", "type": "uint256" }, { "indexed": true, "internalType": "bytes32", "name": "rootHash", "type": "bytes32" }, { "indexed": false, "internalType": "uint256", "name": "totalAmount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "rootCommittedAt", "type": "uint256" }], "name": "TransfersCommitted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Unstake", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "bonder", "type": "address" }, { "indexed": true, "internalType": "bytes32", "name": "transferId", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "rootHash", "type": "bytes32" }], "name": "WithdrawalBondSettled", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "transferId", "type": "bytes32" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "WithdrawalBonded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "transferId", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "recipient", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes32", "name": "transferNonce", "type": "bytes32" }], "name": "Withdrew", "type": "event" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "activeChainIds", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256[]", "name": "chainIds", "type": "uint256[]" }], "name": "addActiveChainIds", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "bonder", "type": "address" }], "name": "addBonder", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "ammWrapper", "outputs": [{ "internalType": "contract I_L2_AmmWrapper", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes32", "name": "transferNonce", "type": "bytes32" }, { "internalType": "uint256", "name": "bonderFee", "type": "uint256" }], "name": "bondWithdrawal", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes32", "name": "transferNonce", "type": "bytes32" }, { "internalType": "uint256", "name": "bonderFee", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "bondWithdrawalAndDistribute", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "destinationChainId", "type": "uint256" }], "name": "commitTransfers", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "address", "name": "relayer", "type": "address" }, { "internalType": "uint256", "name": "relayerFee", "type": "uint256" }], "name": "distribute", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "bonder", "type": "address" }, { "internalType": "bytes32", "name": "transferId", "type": "bytes32" }], "name": "getBondedWithdrawalAmount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getChainId", "outputs": [{ "internalType": "uint256", "name": "chainId", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "bonder", "type": "address" }], "name": "getCredit", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "bonder", "type": "address" }], "name": "getDebitAndAdditionalDebit", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "maybeBonder", "type": "address" }], "name": "getIsBonder", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getNextTransferNonce", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "bonder", "type": "address" }], "name": "getRawDebit", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "chainId", "type": "uint256" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes32", "name": "transferNonce", "type": "bytes32" }, { "internalType": "uint256", "name": "bonderFee", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "getTransferId", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "rootHash", "type": "bytes32" }, { "internalType": "uint256", "name": "totalAmount", "type": "uint256" }], "name": "getTransferRoot", "outputs": [{ "components": [{ "internalType": "uint256", "name": "total", "type": "uint256" }, { "internalType": "uint256", "name": "amountWithdrawn", "type": "uint256" }, { "internalType": "uint256", "name": "createdAt", "type": "uint256" }], "internalType": "struct Bridge.TransferRoot", "name": "", "type": "tuple" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "rootHash", "type": "bytes32" }, { "internalType": "uint256", "name": "totalAmount", "type": "uint256" }], "name": "getTransferRootId", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "pure", "type": "function" }, { "inputs": [], "name": "hToken", "outputs": [{ "internalType": "contract HopBridgeToken", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "transferId", "type": "bytes32" }], "name": "isTransferIdSpent", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "l1BridgeAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "l1BridgeCaller", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "l1Governance", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "lastCommitTimeForChainId", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "maxPendingTransfers", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "messengerProxy", "outputs": [{ "internalType": "contract I_L2_PolygonMessengerProxy", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "minBonderBps", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "minBonderFeeAbsolute", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "minimumForceCommitDelay", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "pendingAmountForChainId", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "name": "pendingTransferIdsForChainId", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256[]", "name": "chainIds", "type": "uint256[]" }], "name": "removeActiveChainIds", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "bonder", "type": "address" }], "name": "removeBonder", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "rootHash", "type": "bytes32" }, { "internalType": "uint256", "name": "originalAmount", "type": "uint256" }, { "internalType": "address", "name": "recipient", "type": "address" }], "name": "rescueTransferRoot", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "chainId", "type": "uint256" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "bonderFee", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "send", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "contract I_L2_AmmWrapper", "name": "_ammWrapper", "type": "address" }], "name": "setAmmWrapper", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "setHopBridgeTokenOwner", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_l1BridgeAddress", "type": "address" }], "name": "setL1BridgeAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_l1BridgeCaller", "type": "address" }], "name": "setL1BridgeCaller", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_l1Governance", "type": "address" }], "name": "setL1Governance", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_maxPendingTransfers", "type": "uint256" }], "name": "setMaxPendingTransfers", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "contract I_L2_PolygonMessengerProxy", "name": "_messengerProxy", "type": "address" }], "name": "setMessengerProxy", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_minBonderBps", "type": "uint256" }, { "internalType": "uint256", "name": "_minBonderFeeAbsolute", "type": "uint256" }], "name": "setMinimumBonderFeeRequirements", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_minimumForceCommitDelay", "type": "uint256" }], "name": "setMinimumForceCommitDelay", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "rootHash", "type": "bytes32" }, { "internalType": "uint256", "name": "totalAmount", "type": "uint256" }], "name": "setTransferRoot", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "bonder", "type": "address" }, { "internalType": "bytes32", "name": "transferId", "type": "bytes32" }, { "internalType": "bytes32", "name": "rootHash", "type": "bytes32" }, { "internalType": "uint256", "name": "transferRootTotalAmount", "type": "uint256" }, { "internalType": "uint256", "name": "transferIdTreeIndex", "type": "uint256" }, { "internalType": "bytes32[]", "name": "siblings", "type": "bytes32[]" }, { "internalType": "uint256", "name": "totalLeaves", "type": "uint256" }], "name": "settleBondedWithdrawal", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "bonder", "type": "address" }, { "internalType": "bytes32[]", "name": "transferIds", "type": "bytes32[]" }, { "internalType": "uint256", "name": "totalAmount", "type": "uint256" }], "name": "settleBondedWithdrawals", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "bonder", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "stake", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "transferNonceIncrementer", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "unstake", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes32", "name": "transferNonce", "type": "bytes32" }, { "internalType": "uint256", "name": "bonderFee", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bytes32", "name": "rootHash", "type": "bytes32" }, { "internalType": "uint256", "name": "transferRootTotalAmount", "type": "uint256" }, { "internalType": "uint256", "name": "transferIdTreeIndex", "type": "uint256" }, { "internalType": "bytes32[]", "name": "siblings", "type": "bytes32[]" }, { "internalType": "uint256", "name": "totalLeaves", "type": "uint256" }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];
    }
    // 0xc97d172e
    async activeChainIds(input0) {
        return this.$read('function activeChainIds(uint256) returns bool', input0);
    }
    // 0xf8398fa4
    async addActiveChainIds(eoa, chainIds) {
        return this.$write(this.$getAbiItem('function', 'addActiveChainIds'), eoa, chainIds);
    }
    // 0x5325937f
    async addBonder(eoa, bonder) {
        return this.$write(this.$getAbiItem('function', 'addBonder'), eoa, bonder);
    }
    // 0xe9cdfe51
    async ammWrapper() {
        return this.$read('function ammWrapper() returns address');
    }
    // 0x23c452cd
    async bondWithdrawal(eoa, recipient, amount, transferNonce, bonderFee) {
        return this.$write(this.$getAbiItem('function', 'bondWithdrawal'), eoa, recipient, amount, transferNonce, bonderFee);
    }
    // 0x3d12a85a
    async bondWithdrawalAndDistribute(eoa, recipient, amount, transferNonce, bonderFee, amountOutMin, deadline) {
        return this.$write(this.$getAbiItem('function', 'bondWithdrawalAndDistribute'), eoa, recipient, amount, transferNonce, bonderFee, amountOutMin, deadline);
    }
    // 0x32b949a2
    async commitTransfers(eoa, destinationChainId) {
        return this.$write(this.$getAbiItem('function', 'commitTransfers'), eoa, destinationChainId);
    }
    // 0xcc29a306
    async distribute(eoa, recipient, amount, amountOutMin, deadline, relayer, relayerFee) {
        return this.$write(this.$getAbiItem('function', 'distribute'), eoa, recipient, amount, amountOutMin, deadline, relayer, relayerFee);
    }
    // 0x302830ab
    async getBondedWithdrawalAmount(bonder, transferId) {
        return this.$read('function getBondedWithdrawalAmount(address, bytes32) returns uint256', bonder, transferId);
    }
    // 0x3408e470
    async getChainId() {
        return this.$read('function getChainId() returns uint256');
    }
    // 0x57344e6f
    async getCredit(bonder) {
        return this.$read('function getCredit(address) returns uint256', bonder);
    }
    // 0xffa9286c
    async getDebitAndAdditionalDebit(bonder) {
        return this.$read('function getDebitAndAdditionalDebit(address) returns uint256', bonder);
    }
    // 0xd5ef7551
    async getIsBonder(maybeBonder) {
        return this.$read('function getIsBonder(address) returns bool', maybeBonder);
    }
    // 0x051e7216
    async getNextTransferNonce() {
        return this.$read('function getNextTransferNonce() returns bytes32');
    }
    // 0x13948c76
    async getRawDebit(bonder) {
        return this.$read('function getRawDebit(address) returns uint256', bonder);
    }
    // 0xaf215f94
    async getTransferId(chainId, recipient, amount, transferNonce, bonderFee, amountOutMin, deadline) {
        return this.$read('function getTransferId(uint256, address, uint256, bytes32, uint256, uint256, uint256) returns bytes32', chainId, recipient, amount, transferNonce, bonderFee, amountOutMin, deadline);
    }
    // 0xce803b4f
    async getTransferRoot(rootHash, totalAmount) {
        return this.$read('function getTransferRoot(bytes32, uint256) returns [uint256,uint256,uint256]', rootHash, totalAmount);
    }
    // 0x960a7afa
    async getTransferRootId(rootHash, totalAmount) {
        return this.$read('function getTransferRootId(bytes32, uint256) returns bytes32', rootHash, totalAmount);
    }
    // 0xfc6e3b3b
    async hToken() {
        return this.$read('function hToken() returns address');
    }
    // 0x3a7af631
    async isTransferIdSpent(transferId) {
        return this.$read('function isTransferIdSpent(bytes32) returns bool', transferId);
    }
    // 0x5ab2a558
    async l1BridgeAddress() {
        return this.$read('function l1BridgeAddress() returns address');
    }
    // 0xd2442783
    async l1BridgeCaller() {
        return this.$read('function l1BridgeCaller() returns address');
    }
    // 0x3ef23f7f
    async l1Governance() {
        return this.$read('function l1Governance() returns address');
    }
    // 0xd4e54c47
    async lastCommitTimeForChainId(input0) {
        return this.$read('function lastCommitTimeForChainId(uint256) returns uint256', input0);
    }
    // 0xbed93c84
    async maxPendingTransfers() {
        return this.$read('function maxPendingTransfers() returns uint256');
    }
    // 0xce2d280e
    async messengerProxy() {
        return this.$read('function messengerProxy() returns address');
    }
    // 0x35e2c4af
    async minBonderBps() {
        return this.$read('function minBonderBps() returns uint256');
    }
    // 0xc3035261
    async minBonderFeeAbsolute() {
        return this.$read('function minBonderFeeAbsolute() returns uint256');
    }
    // 0x8f658198
    async minimumForceCommitDelay() {
        return this.$read('function minimumForceCommitDelay() returns uint256');
    }
    // 0x0f5e09e7
    async pendingAmountForChainId(input0) {
        return this.$read('function pendingAmountForChainId(uint256) returns uint256', input0);
    }
    // 0x98445caf
    async pendingTransferIdsForChainId(input0, input1) {
        return this.$read('function pendingTransferIdsForChainId(uint256, uint256) returns bytes32', input0, input1);
    }
    // 0x9f600a0b
    async removeActiveChainIds(eoa, chainIds) {
        return this.$write(this.$getAbiItem('function', 'removeActiveChainIds'), eoa, chainIds);
    }
    // 0x04e6c2c0
    async removeBonder(eoa, bonder) {
        return this.$write(this.$getAbiItem('function', 'removeBonder'), eoa, bonder);
    }
    // 0xcbd1642e
    async rescueTransferRoot(eoa, rootHash, originalAmount, recipient) {
        return this.$write(this.$getAbiItem('function', 'rescueTransferRoot'), eoa, rootHash, originalAmount, recipient);
    }
    // 0xa6bd1b33
    async send(eoa, chainId, recipient, amount, bonderFee, amountOutMin, deadline) {
        return this.$write(this.$getAbiItem('function', 'send'), eoa, chainId, recipient, amount, bonderFee, amountOutMin, deadline);
    }
    // 0x64c6fdb4
    async setAmmWrapper(eoa, _ammWrapper) {
        return this.$write(this.$getAbiItem('function', 'setAmmWrapper'), eoa, _ammWrapper);
    }
    // 0x8295f258
    async setHopBridgeTokenOwner(eoa, newOwner) {
        return this.$write(this.$getAbiItem('function', 'setHopBridgeTokenOwner'), eoa, newOwner);
    }
    // 0xe1825d06
    async setL1BridgeAddress(eoa, _l1BridgeAddress) {
        return this.$write(this.$getAbiItem('function', 'setL1BridgeAddress'), eoa, _l1BridgeAddress);
    }
    // 0xaf33ae69
    async setL1BridgeCaller(eoa, _l1BridgeCaller) {
        return this.$write(this.$getAbiItem('function', 'setL1BridgeCaller'), eoa, _l1BridgeCaller);
    }
    // 0xe40272d7
    async setL1Governance(eoa, _l1Governance) {
        return this.$write(this.$getAbiItem('function', 'setL1Governance'), eoa, _l1Governance);
    }
    // 0x4742bbfb
    async setMaxPendingTransfers(eoa, _maxPendingTransfers) {
        return this.$write(this.$getAbiItem('function', 'setMaxPendingTransfers'), eoa, _maxPendingTransfers);
    }
    // 0x3b1c54fa
    async setMessengerProxy(eoa, _messengerProxy) {
        return this.$write(this.$getAbiItem('function', 'setMessengerProxy'), eoa, _messengerProxy);
    }
    // 0xa9fa4ed5
    async setMinimumBonderFeeRequirements(eoa, _minBonderBps, _minBonderFeeAbsolute) {
        return this.$write(this.$getAbiItem('function', 'setMinimumBonderFeeRequirements'), eoa, _minBonderBps, _minBonderFeeAbsolute);
    }
    // 0x9bf43028
    async setMinimumForceCommitDelay(eoa, _minimumForceCommitDelay) {
        return this.$write(this.$getAbiItem('function', 'setMinimumForceCommitDelay'), eoa, _minimumForceCommitDelay);
    }
    // 0xfd31c5ba
    async setTransferRoot(eoa, rootHash, totalAmount) {
        return this.$write(this.$getAbiItem('function', 'setTransferRoot'), eoa, rootHash, totalAmount);
    }
    // 0xc7525dd3
    async settleBondedWithdrawal(eoa, bonder, transferId, rootHash, transferRootTotalAmount, transferIdTreeIndex, siblings, totalLeaves) {
        return this.$write(this.$getAbiItem('function', 'settleBondedWithdrawal'), eoa, bonder, transferId, rootHash, transferRootTotalAmount, transferIdTreeIndex, siblings, totalLeaves);
    }
    // 0xb162717e
    async settleBondedWithdrawals(eoa, bonder, transferIds, totalAmount) {
        return this.$write(this.$getAbiItem('function', 'settleBondedWithdrawals'), eoa, bonder, transferIds, totalAmount);
    }
    // 0xadc9772e
    async stake(eoa, bonder, amount) {
        return this.$write(this.$getAbiItem('function', 'stake'), eoa, bonder, amount);
    }
    // 0x82c69f9d
    async transferNonceIncrementer() {
        return this.$read('function transferNonceIncrementer() returns uint256');
    }
    // 0x2e17de78
    async unstake(eoa, amount) {
        return this.$write(this.$getAbiItem('function', 'unstake'), eoa, amount);
    }
    // 0x0f7aadb7
    async withdraw(eoa, recipient, amount, transferNonce, bonderFee, amountOutMin, deadline, rootHash, transferRootTotalAmount, transferIdTreeIndex, siblings, totalLeaves) {
        return this.$write(this.$getAbiItem('function', 'withdraw'), eoa, recipient, amount, transferNonce, bonderFee, amountOutMin, deadline, rootHash, transferRootTotalAmount, transferIdTreeIndex, siblings, totalLeaves);
    }
    onBonderAdded(fn) {
        return this.$on('BonderAdded', fn);
    }
    onBonderRemoved(fn) {
        return this.$on('BonderRemoved', fn);
    }
    onL1_BridgeMessage(fn) {
        return this.$on('L1_BridgeMessage', fn);
    }
    onMultipleWithdrawalsSettled(fn) {
        return this.$on('MultipleWithdrawalsSettled', fn);
    }
    onStake(fn) {
        return this.$on('Stake', fn);
    }
    onTransferFromL1Completed(fn) {
        return this.$on('TransferFromL1Completed', fn);
    }
    onTransferRootSet(fn) {
        return this.$on('TransferRootSet', fn);
    }
    onTransferSent(fn) {
        return this.$on('TransferSent', fn);
    }
    onTransfersCommitted(fn) {
        return this.$on('TransfersCommitted', fn);
    }
    onUnstake(fn) {
        return this.$on('Unstake', fn);
    }
    onWithdrawalBondSettled(fn) {
        return this.$on('WithdrawalBondSettled', fn);
    }
    onWithdrawalBonded(fn) {
        return this.$on('WithdrawalBonded', fn);
    }
    onWithdrew(fn) {
        return this.$on('Withdrew', fn);
    }
    extractLogsBonderAdded(tx) {
        let abi = this.$getAbiItem('event', 'BonderAdded');
        return this.$extractLogs(tx, abi);
    }
    extractLogsBonderRemoved(tx) {
        let abi = this.$getAbiItem('event', 'BonderRemoved');
        return this.$extractLogs(tx, abi);
    }
    extractLogsL1_BridgeMessage(tx) {
        let abi = this.$getAbiItem('event', 'L1_BridgeMessage');
        return this.$extractLogs(tx, abi);
    }
    extractLogsMultipleWithdrawalsSettled(tx) {
        let abi = this.$getAbiItem('event', 'MultipleWithdrawalsSettled');
        return this.$extractLogs(tx, abi);
    }
    extractLogsStake(tx) {
        let abi = this.$getAbiItem('event', 'Stake');
        return this.$extractLogs(tx, abi);
    }
    extractLogsTransferFromL1Completed(tx) {
        let abi = this.$getAbiItem('event', 'TransferFromL1Completed');
        return this.$extractLogs(tx, abi);
    }
    extractLogsTransferRootSet(tx) {
        let abi = this.$getAbiItem('event', 'TransferRootSet');
        return this.$extractLogs(tx, abi);
    }
    extractLogsTransferSent(tx) {
        let abi = this.$getAbiItem('event', 'TransferSent');
        return this.$extractLogs(tx, abi);
    }
    extractLogsTransfersCommitted(tx) {
        let abi = this.$getAbiItem('event', 'TransfersCommitted');
        return this.$extractLogs(tx, abi);
    }
    extractLogsUnstake(tx) {
        let abi = this.$getAbiItem('event', 'Unstake');
        return this.$extractLogs(tx, abi);
    }
    extractLogsWithdrawalBondSettled(tx) {
        let abi = this.$getAbiItem('event', 'WithdrawalBondSettled');
        return this.$extractLogs(tx, abi);
    }
    extractLogsWithdrawalBonded(tx) {
        let abi = this.$getAbiItem('event', 'WithdrawalBonded');
        return this.$extractLogs(tx, abi);
    }
    extractLogsWithdrew(tx) {
        let abi = this.$getAbiItem('event', 'Withdrew');
        return this.$extractLogs(tx, abi);
    }
}
exports.Matic_l2BridgeContract = Matic_l2BridgeContract;
