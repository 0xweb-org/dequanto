"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneInchRouterV3Base = void 0;
const a_di_1 = __importDefault(require("a-di"));
const Bscscan_1 = require("@dequanto/BlockchainExplorer/Bscscan");
const BscWeb3Client_1 = require("@dequanto/clients/BscWeb3Client");
const ContractBase_1 = require("@dequanto/contracts/ContractBase");
class OneInchRouterV3Base extends ContractBase_1.ContractBase {
    constructor(address = '0x11111112542d85b3ef69ae05771c2dccff4faa26', client = a_di_1.default.resolve(BscWeb3Client_1.BscWeb3Client), explorer = a_di_1.default.resolve(Bscscan_1.Bscscan)) {
        super(address, client, explorer);
        this.address = address;
        this.client = client;
        this.explorer = explorer;
        this.abi = [{ "anonymous": false, "inputs": [{ "indexed": false, "internalType": "string", "name": "reason", "type": "string" }], "name": "Error", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "contract IERC20", "name": "srcToken", "type": "address" }, { "indexed": false, "internalType": "contract IERC20", "name": "dstToken", "type": "address" }, { "indexed": false, "internalType": "address", "name": "dstReceiver", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "spentAmount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "returnAmount", "type": "uint256" }], "name": "Swapped", "type": "event" }, { "inputs": [], "name": "destroy", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "contract IAggregationExecutor", "name": "caller", "type": "address" }, { "components": [{ "internalType": "contract IERC20", "name": "srcToken", "type": "address" }, { "internalType": "contract IERC20", "name": "dstToken", "type": "address" }, { "internalType": "address", "name": "srcReceiver", "type": "address" }, { "internalType": "address", "name": "dstReceiver", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "minReturnAmount", "type": "uint256" }, { "internalType": "uint256", "name": "flags", "type": "uint256" }, { "internalType": "bytes", "name": "permit", "type": "bytes" }], "internalType": "struct AggregationRouterV3.SwapDescription", "name": "desc", "type": "tuple" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "discountedSwap", "outputs": [{ "internalType": "uint256", "name": "returnAmount", "type": "uint256" }, { "internalType": "uint256", "name": "gasLeft", "type": "uint256" }, { "internalType": "uint256", "name": "chiSpent", "type": "uint256" }], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "rescueFunds", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "contract IAggregationExecutor", "name": "caller", "type": "address" }, { "components": [{ "internalType": "contract IERC20", "name": "srcToken", "type": "address" }, { "internalType": "contract IERC20", "name": "dstToken", "type": "address" }, { "internalType": "address", "name": "srcReceiver", "type": "address" }, { "internalType": "address", "name": "dstReceiver", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "minReturnAmount", "type": "uint256" }, { "internalType": "uint256", "name": "flags", "type": "uint256" }, { "internalType": "bytes", "name": "permit", "type": "bytes" }], "internalType": "struct AggregationRouterV3.SwapDescription", "name": "desc", "type": "tuple" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "swap", "outputs": [{ "internalType": "uint256", "name": "returnAmount", "type": "uint256" }, { "internalType": "uint256", "name": "gasLeft", "type": "uint256" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "contract IERC20", "name": "srcToken", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "minReturn", "type": "uint256" }, { "internalType": "bytes32[]", "name": "", "type": "bytes32[]" }], "name": "unoswap", "outputs": [{ "internalType": "uint256", "name": "returnAmount", "type": "uint256" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "contract IERC20", "name": "srcToken", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "minReturn", "type": "uint256" }, { "internalType": "bytes32[]", "name": "pools", "type": "bytes32[]" }, { "internalType": "bytes", "name": "permit", "type": "bytes" }], "name": "unoswapWithPermit", "outputs": [{ "internalType": "uint256", "name": "returnAmount", "type": "uint256" }], "stateMutability": "payable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }];
    }
    async destroy(eoa) {
        return this.$write('function destroy():()', eoa);
    }
    async discountedSwap(eoa, caller, desc, data) {
        return this.$write('function discountedSwap(address, tuple, bytes):(uint256 returnAmount,uint256 gasLeft,uint256 chiSpent)', eoa, caller, desc, data);
    }
    async owner() {
        return this.$read('function owner():(address)');
    }
    async renounceOwnership(eoa) {
        return this.$write('function renounceOwnership():()', eoa);
    }
    async rescueFunds(eoa, token, amount) {
        return this.$write('function rescueFunds(address, uint256):()', eoa, token, amount);
    }
    async swap(eoa, caller, desc, data) {
        return this.$write('function swap(address, tuple, bytes):(uint256 returnAmount,uint256 gasLeft)', eoa, caller, desc, data);
    }
    async transferOwnership(eoa, newOwner) {
        return this.$write('function transferOwnership(address):()', eoa, newOwner);
    }
    async unoswap(eoa, srcToken, amount, minReturn, input3) {
        return this.$write('function unoswap(address, uint256, uint256, bytes32[]):(uint256 returnAmount)', eoa, srcToken, amount, minReturn, input3);
    }
    async unoswapWithPermit(eoa, srcToken, amount, minReturn, pools, permit) {
        return this.$write('function unoswapWithPermit(address, uint256, uint256, bytes32[], bytes):(uint256 returnAmount)', eoa, srcToken, amount, minReturn, pools, permit);
    }
}
exports.OneInchRouterV3Base = OneInchRouterV3Base;
