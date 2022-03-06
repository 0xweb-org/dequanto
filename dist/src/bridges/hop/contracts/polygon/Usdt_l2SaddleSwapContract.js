"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usdt_l2SaddleSwapContract = void 0;
/**
 *  AUTO-Generated Class: 2022-01-08 23:50
 *  Implementation: https://polygonscan.com/address/0xB2f7d27B21a69a033f85C42d5EB079043BAadC81#code
 */
const a_di_1 = __importDefault(require("a-di"));
const ContractBase_1 = require("@dequanto/contracts/ContractBase");
const Polyscan_1 = require("@dequanto/BlockchainExplorer/Polyscan");
const PolyWeb3Client_1 = require("@dequanto/clients/PolyWeb3Client");
class Usdt_l2SaddleSwapContract extends ContractBase_1.ContractBase {
    constructor(address = '0xB2f7d27B21a69a033f85C42d5EB079043BAadC81', client = a_di_1.default.resolve(PolyWeb3Client_1.PolyWeb3Client), explorer = a_di_1.default.resolve(Polyscan_1.Polyscan)) {
        super(address, client, explorer);
        this.address = address;
        this.client = client;
        this.explorer = explorer;
        this.abi = [{ "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "provider", "type": "address" }, { "indexed": false, "internalType": "uint256[]", "name": "tokenAmounts", "type": "uint256[]" }, { "indexed": false, "internalType": "uint256[]", "name": "fees", "type": "uint256[]" }, { "indexed": false, "internalType": "uint256", "name": "invariant", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "lpTokenSupply", "type": "uint256" }], "name": "AddLiquidity", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "newAdminFee", "type": "uint256" }], "name": "NewAdminFee", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "newSwapFee", "type": "uint256" }], "name": "NewSwapFee", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "newWithdrawFee", "type": "uint256" }], "name": "NewWithdrawFee", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "oldA", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "newA", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "initialTime", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "futureTime", "type": "uint256" }], "name": "RampA", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "provider", "type": "address" }, { "indexed": false, "internalType": "uint256[]", "name": "tokenAmounts", "type": "uint256[]" }, { "indexed": false, "internalType": "uint256", "name": "lpTokenSupply", "type": "uint256" }], "name": "RemoveLiquidity", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "provider", "type": "address" }, { "indexed": false, "internalType": "uint256[]", "name": "tokenAmounts", "type": "uint256[]" }, { "indexed": false, "internalType": "uint256[]", "name": "fees", "type": "uint256[]" }, { "indexed": false, "internalType": "uint256", "name": "invariant", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "lpTokenSupply", "type": "uint256" }], "name": "RemoveLiquidityImbalance", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "provider", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "lpTokenAmount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "lpTokenSupply", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "boughtId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "tokensBought", "type": "uint256" }], "name": "RemoveLiquidityOne", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "currentA", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "StopRampA", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "buyer", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "tokensSold", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "tokensBought", "type": "uint256" }, { "indexed": false, "internalType": "uint128", "name": "soldId", "type": "uint128" }, { "indexed": false, "internalType": "uint128", "name": "boughtId", "type": "uint128" }], "name": "TokenSwap", "type": "event" }, { "inputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "internalType": "uint256", "name": "minToMint", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "addLiquidity", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "calculateCurrentWithdrawFee", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "calculateRemoveLiquidity", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "tokenAmount", "type": "uint256" }, { "internalType": "uint8", "name": "tokenIndex", "type": "uint8" }], "name": "calculateRemoveLiquidityOneToken", "outputs": [{ "internalType": "uint256", "name": "availableTokenAmount", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint8", "name": "tokenIndexFrom", "type": "uint8" }, { "internalType": "uint8", "name": "tokenIndexTo", "type": "uint8" }, { "internalType": "uint256", "name": "dx", "type": "uint256" }], "name": "calculateSwap", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "internalType": "bool", "name": "deposit", "type": "bool" }], "name": "calculateTokenAmount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getA", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getAPrecise", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "getAdminBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "getDepositTimestamp", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint8", "name": "index", "type": "uint8" }], "name": "getToken", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint8", "name": "index", "type": "uint8" }], "name": "getTokenBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenAddress", "type": "address" }], "name": "getTokenIndex", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getVirtualPrice", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "contract IERC20[]", "name": "_pooledTokens", "type": "address[]" }, { "internalType": "uint8[]", "name": "decimals", "type": "uint8[]" }, { "internalType": "string", "name": "lpTokenName", "type": "string" }, { "internalType": "string", "name": "lpTokenSymbol", "type": "string" }, { "internalType": "uint256", "name": "_a", "type": "uint256" }, { "internalType": "uint256", "name": "_fee", "type": "uint256" }, { "internalType": "uint256", "name": "_adminFee", "type": "uint256" }, { "internalType": "uint256", "name": "_withdrawFee", "type": "uint256" }], "name": "initialize", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256[]", "name": "minAmounts", "type": "uint256[]" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidity", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "internalType": "uint256", "name": "maxBurnAmount", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidityImbalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenAmount", "type": "uint256" }, { "internalType": "uint8", "name": "tokenIndex", "type": "uint8" }, { "internalType": "uint256", "name": "minAmount", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidityOneToken", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint8", "name": "tokenIndexFrom", "type": "uint8" }, { "internalType": "uint8", "name": "tokenIndexTo", "type": "uint8" }, { "internalType": "uint256", "name": "dx", "type": "uint256" }, { "internalType": "uint256", "name": "minDy", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swap", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "swapStorage", "outputs": [{ "internalType": "uint256", "name": "initialA", "type": "uint256" }, { "internalType": "uint256", "name": "futureA", "type": "uint256" }, { "internalType": "uint256", "name": "initialATime", "type": "uint256" }, { "internalType": "uint256", "name": "futureATime", "type": "uint256" }, { "internalType": "uint256", "name": "swapFee", "type": "uint256" }, { "internalType": "uint256", "name": "adminFee", "type": "uint256" }, { "internalType": "uint256", "name": "defaultWithdrawFee", "type": "uint256" }, { "internalType": "contract LPToken", "name": "lpToken", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "transferAmount", "type": "uint256" }], "name": "updateUserWithdrawFee", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];
    }
    // 0x4d49e87d
    async addLiquidity(eoa, amounts, minToMint, deadline) {
        return this.$write(this.$getAbiItem('function', 'addLiquidity'), eoa, amounts, minToMint, deadline);
    }
    // 0x4a1b0d57
    async calculateCurrentWithdrawFee(user) {
        return this.$read('function calculateCurrentWithdrawFee(address) returns uint256', user);
    }
    // 0x7c61e561
    async calculateRemoveLiquidity(account, amount) {
        return this.$read('function calculateRemoveLiquidity(address, uint256) returns uint256[]', account, amount);
    }
    // 0x98899f40
    async calculateRemoveLiquidityOneToken(account, tokenAmount, tokenIndex) {
        return this.$read('function calculateRemoveLiquidityOneToken(address, uint256, uint8) returns uint256', account, tokenAmount, tokenIndex);
    }
    // 0xa95b089f
    async calculateSwap(tokenIndexFrom, tokenIndexTo, dx) {
        return this.$read('function calculateSwap(uint8, uint8, uint256) returns uint256', tokenIndexFrom, tokenIndexTo, dx);
    }
    // 0xf9273ffb
    async calculateTokenAmount(account, amounts, deposit) {
        return this.$read('function calculateTokenAmount(address, uint256[], bool) returns uint256', account, amounts, deposit);
    }
    // 0xd46300fd
    async getA() {
        return this.$read('function getA() returns uint256');
    }
    // 0x0ba81959
    async getAPrecise() {
        return this.$read('function getAPrecise() returns uint256');
    }
    // 0xef0a712f
    async getAdminBalance(index) {
        return this.$read('function getAdminBalance(uint256) returns uint256', index);
    }
    // 0xda7a77be
    async getDepositTimestamp(user) {
        return this.$read('function getDepositTimestamp(address) returns uint256', user);
    }
    // 0x82b86600
    async getToken(index) {
        return this.$read('function getToken(uint8) returns address', index);
    }
    // 0x91ceb3eb
    async getTokenBalance(index) {
        return this.$read('function getTokenBalance(uint8) returns uint256', index);
    }
    // 0x66c0bd24
    async getTokenIndex(tokenAddress) {
        return this.$read('function getTokenIndex(address) returns uint8', tokenAddress);
    }
    // 0xe25aa5fa
    async getVirtualPrice() {
        return this.$read('function getVirtualPrice() returns uint256');
    }
    // 0x6dd4480b
    async initialize(eoa, _pooledTokens, decimals, lpTokenName, lpTokenSymbol, _a, _fee, _adminFee, _withdrawFee) {
        return this.$write(this.$getAbiItem('function', 'initialize'), eoa, _pooledTokens, decimals, lpTokenName, lpTokenSymbol, _a, _fee, _adminFee, _withdrawFee);
    }
    // 0x31cd52b0
    async removeLiquidity(eoa, amount, minAmounts, deadline) {
        return this.$write(this.$getAbiItem('function', 'removeLiquidity'), eoa, amount, minAmounts, deadline);
    }
    // 0x84cdd9bc
    async removeLiquidityImbalance(eoa, amounts, maxBurnAmount, deadline) {
        return this.$write(this.$getAbiItem('function', 'removeLiquidityImbalance'), eoa, amounts, maxBurnAmount, deadline);
    }
    // 0x3e3a1560
    async removeLiquidityOneToken(eoa, tokenAmount, tokenIndex, minAmount, deadline) {
        return this.$write(this.$getAbiItem('function', 'removeLiquidityOneToken'), eoa, tokenAmount, tokenIndex, minAmount, deadline);
    }
    // 0x91695586
    async swap(eoa, tokenIndexFrom, tokenIndexTo, dx, minDy, deadline) {
        return this.$write(this.$getAbiItem('function', 'swap'), eoa, tokenIndexFrom, tokenIndexTo, dx, minDy, deadline);
    }
    // 0x5fd65f0f
    async swapStorage() {
        return this.$read('function swapStorage() returns (uint256,uint256,uint256,uint256,uint256,uint256,uint256,address)');
    }
    // 0xc00c125c
    async updateUserWithdrawFee(eoa, recipient, transferAmount) {
        return this.$write(this.$getAbiItem('function', 'updateUserWithdrawFee'), eoa, recipient, transferAmount);
    }
    onAddLiquidity(fn) {
        return this.$on('AddLiquidity', fn);
    }
    onNewAdminFee(fn) {
        return this.$on('NewAdminFee', fn);
    }
    onNewSwapFee(fn) {
        return this.$on('NewSwapFee', fn);
    }
    onNewWithdrawFee(fn) {
        return this.$on('NewWithdrawFee', fn);
    }
    onRampA(fn) {
        return this.$on('RampA', fn);
    }
    onRemoveLiquidity(fn) {
        return this.$on('RemoveLiquidity', fn);
    }
    onRemoveLiquidityImbalance(fn) {
        return this.$on('RemoveLiquidityImbalance', fn);
    }
    onRemoveLiquidityOne(fn) {
        return this.$on('RemoveLiquidityOne', fn);
    }
    onStopRampA(fn) {
        return this.$on('StopRampA', fn);
    }
    onTokenSwap(fn) {
        return this.$on('TokenSwap', fn);
    }
    extractLogsAddLiquidity(tx) {
        let abi = this.$getAbiItem('event', 'AddLiquidity');
        return this.$extractLogs(tx, abi);
    }
    extractLogsNewAdminFee(tx) {
        let abi = this.$getAbiItem('event', 'NewAdminFee');
        return this.$extractLogs(tx, abi);
    }
    extractLogsNewSwapFee(tx) {
        let abi = this.$getAbiItem('event', 'NewSwapFee');
        return this.$extractLogs(tx, abi);
    }
    extractLogsNewWithdrawFee(tx) {
        let abi = this.$getAbiItem('event', 'NewWithdrawFee');
        return this.$extractLogs(tx, abi);
    }
    extractLogsRampA(tx) {
        let abi = this.$getAbiItem('event', 'RampA');
        return this.$extractLogs(tx, abi);
    }
    extractLogsRemoveLiquidity(tx) {
        let abi = this.$getAbiItem('event', 'RemoveLiquidity');
        return this.$extractLogs(tx, abi);
    }
    extractLogsRemoveLiquidityImbalance(tx) {
        let abi = this.$getAbiItem('event', 'RemoveLiquidityImbalance');
        return this.$extractLogs(tx, abi);
    }
    extractLogsRemoveLiquidityOne(tx) {
        let abi = this.$getAbiItem('event', 'RemoveLiquidityOne');
        return this.$extractLogs(tx, abi);
    }
    extractLogsStopRampA(tx) {
        let abi = this.$getAbiItem('event', 'StopRampA');
        return this.$extractLogs(tx, abi);
    }
    extractLogsTokenSwap(tx) {
        let abi = this.$getAbiItem('event', 'TokenSwap');
        return this.$extractLogs(tx, abi);
    }
}
exports.Usdt_l2SaddleSwapContract = Usdt_l2SaddleSwapContract;
