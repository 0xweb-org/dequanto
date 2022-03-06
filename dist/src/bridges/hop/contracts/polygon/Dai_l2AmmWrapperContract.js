"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dai_l2AmmWrapperContract = void 0;
/**
 *  AUTO-Generated Class: 2022-01-08 23:50
 *  Implementation: https://polygonscan.com/address/0x28529fec439cfF6d7D1D5917e956dEE62Cd3BE5c#code
 */
const a_di_1 = __importDefault(require("a-di"));
const ContractBase_1 = require("@dequanto/contracts/ContractBase");
const Polyscan_1 = require("@dequanto/BlockchainExplorer/Polyscan");
const PolyWeb3Client_1 = require("@dequanto/clients/PolyWeb3Client");
class Dai_l2AmmWrapperContract extends ContractBase_1.ContractBase {
    constructor(address = '0x28529fec439cfF6d7D1D5917e956dEE62Cd3BE5c', client = a_di_1.default.resolve(PolyWeb3Client_1.PolyWeb3Client), explorer = a_di_1.default.resolve(Polyscan_1.Polyscan)) {
        super(address, client, explorer);
        this.address = address;
        this.client = client;
        this.explorer = explorer;
        this.abi = [{ "inputs": [{ "internalType": "contract L2_Bridge", "name": "_bridge", "type": "address" }, { "internalType": "contract IERC20", "name": "_l2CanonicalToken", "type": "address" }, { "internalType": "bool", "name": "_l2CanonicalTokenIsEth", "type": "bool" }, { "internalType": "contract IERC20", "name": "_hToken", "type": "address" }, { "internalType": "contract Swap", "name": "_exchangeAddress", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "attemptSwap", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "bridge", "outputs": [{ "internalType": "contract L2_Bridge", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "exchangeAddress", "outputs": [{ "internalType": "contract Swap", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "hToken", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "l2CanonicalToken", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "l2CanonicalTokenIsEth", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "chainId", "type": "uint256" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "bonderFee", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "uint256", "name": "destinationAmountOutMin", "type": "uint256" }, { "internalType": "uint256", "name": "destinationDeadline", "type": "uint256" }], "name": "swapAndSend", "outputs": [], "stateMutability": "payable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }];
    }
    // 0x676c5ef6
    async attemptSwap(eoa, recipient, amount, amountOutMin, deadline) {
        return this.$write(this.$getAbiItem('function', 'attemptSwap'), eoa, recipient, amount, amountOutMin, deadline);
    }
    // 0xe78cea92
    async bridge() {
        return this.$read('function bridge() returns address');
    }
    // 0x9cd01605
    async exchangeAddress() {
        return this.$read('function exchangeAddress() returns address');
    }
    // 0xfc6e3b3b
    async hToken() {
        return this.$read('function hToken() returns address');
    }
    // 0x1ee1bf67
    async l2CanonicalToken() {
        return this.$read('function l2CanonicalToken() returns address');
    }
    // 0x28555125
    async l2CanonicalTokenIsEth() {
        return this.$read('function l2CanonicalTokenIsEth() returns bool');
    }
    // 0xeea0d7b2
    async swapAndSend(eoa, chainId, recipient, amount, bonderFee, amountOutMin, deadline, destinationAmountOutMin, destinationDeadline) {
        return this.$write(this.$getAbiItem('function', 'swapAndSend'), eoa, chainId, recipient, amount, bonderFee, amountOutMin, deadline, destinationAmountOutMin, destinationDeadline);
    }
}
exports.Dai_l2AmmWrapperContract = Dai_l2AmmWrapperContract;
