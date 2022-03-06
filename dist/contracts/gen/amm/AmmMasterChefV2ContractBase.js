"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmmMasterChefV2ContractBase = void 0;
/**
 *  AUTO-Generated Class: 2021-11-09 14:26
 */
const a_di_1 = __importDefault(require("a-di"));
const Bscscan_1 = require("@dequanto/BlockchainExplorer/Bscscan");
const BscWeb3Client_1 = require("@dequanto/clients/BscWeb3Client");
const ContractBase_1 = require("@dequanto/contracts/ContractBase");
class AmmMasterChefV2ContractBase extends ContractBase_1.ContractBase {
    constructor(address = '0x73feaa1eE314F8c655E354234017bE2193C9E24E', client = a_di_1.default.resolve(BscWeb3Client_1.BscWeb3Client), explorer = a_di_1.default.resolve(Bscscan_1.Bscscan)) {
        super(address, client, explorer);
        this.address = address;
        this.client = client;
        this.explorer = explorer;
        this.abi = [{ "inputs": [{ "internalType": "contract CakeToken", "name": "_cake", "type": "address" }, { "internalType": "contract SyrupBar", "name": "_syrup", "type": "address" }, { "internalType": "address", "name": "_devaddr", "type": "address" }, { "internalType": "uint256", "name": "_cakePerBlock", "type": "uint256" }, { "internalType": "uint256", "name": "_startBlock", "type": "uint256" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "pid", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Deposit", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "pid", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "EmergencyWithdraw", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "pid", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Withdraw", "type": "event" }, { "inputs": [], "name": "BONUS_MULTIPLIER", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_allocPoint", "type": "uint256" }, { "internalType": "contract IBEP20", "name": "_lpToken", "type": "address" }, { "internalType": "bool", "name": "_withUpdate", "type": "bool" }], "name": "add", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "cake", "outputs": [{ "internalType": "contract CakeToken", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "cakePerBlock", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_pid", "type": "uint256" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "deposit", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_devaddr", "type": "address" }], "name": "dev", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "devaddr", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_pid", "type": "uint256" }], "name": "emergencyWithdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "enterStaking", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_from", "type": "uint256" }, { "internalType": "uint256", "name": "_to", "type": "uint256" }], "name": "getMultiplier", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "leaveStaking", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "massUpdatePools", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_pid", "type": "uint256" }], "name": "migrate", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "migrator", "outputs": [{ "internalType": "contract IMigratorChef", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_pid", "type": "uint256" }, { "internalType": "address", "name": "_user", "type": "address" }], "name": "pendingCake", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "poolInfo", "outputs": [{ "internalType": "contract IBEP20", "name": "lpToken", "type": "address" }, { "internalType": "uint256", "name": "allocPoint", "type": "uint256" }, { "internalType": "uint256", "name": "lastRewardBlock", "type": "uint256" }, { "internalType": "uint256", "name": "accCakePerShare", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "poolLength", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_pid", "type": "uint256" }, { "internalType": "uint256", "name": "_allocPoint", "type": "uint256" }, { "internalType": "bool", "name": "_withUpdate", "type": "bool" }], "name": "set", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "contract IMigratorChef", "name": "_migrator", "type": "address" }], "name": "setMigrator", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "startBlock", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "syrup", "outputs": [{ "internalType": "contract SyrupBar", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalAllocPoint", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "multiplierNumber", "type": "uint256" }], "name": "updateMultiplier", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_pid", "type": "uint256" }], "name": "updatePool", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "address", "name": "", "type": "address" }], "name": "userInfo", "outputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "rewardDebt", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_pid", "type": "uint256" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];
    }
    async BONUS_MULTIPLIER() {
        return this.$read('function BONUS_MULTIPLIER() returns uint256');
    }
    async add(eoa, _allocPoint, _lpToken, _withUpdate) {
        return this.$write('function add(uint256, address, bool)', eoa, _allocPoint, _lpToken, _withUpdate);
    }
    async cake() {
        return this.$read('function cake() returns address');
    }
    async cakePerBlock() {
        return this.$read('function cakePerBlock() returns uint256');
    }
    async deposit(eoa, _pid, _amount) {
        return this.$write('function deposit(uint256, uint256)', eoa, _pid, _amount);
    }
    async dev(eoa, _devaddr) {
        return this.$write('function dev(address)', eoa, _devaddr);
    }
    async devaddr() {
        return this.$read('function devaddr() returns address');
    }
    async emergencyWithdraw(eoa, _pid) {
        return this.$write('function emergencyWithdraw(uint256)', eoa, _pid);
    }
    async enterStaking(eoa, _amount) {
        return this.$write('function enterStaking(uint256)', eoa, _amount);
    }
    async getMultiplier(_from, _to) {
        return this.$read('function getMultiplier(uint256, uint256) returns uint256', _from, _to);
    }
    async leaveStaking(eoa, _amount) {
        return this.$write('function leaveStaking(uint256)', eoa, _amount);
    }
    async massUpdatePools(eoa) {
        return this.$write('function massUpdatePools()', eoa);
    }
    async migrate(eoa, _pid) {
        return this.$write('function migrate(uint256)', eoa, _pid);
    }
    async migrator() {
        return this.$read('function migrator() returns address');
    }
    async owner() {
        return this.$read('function owner() returns address');
    }
    async pendingCake(_pid, _user) {
        return this.$read('function pendingCake(uint256, address) returns uint256', _pid, _user);
    }
    async poolInfo(input0) {
        return this.$read('function poolInfo(uint256) returns (address lpToken,uint256 allocPoint,uint256 lastRewardBlock,uint256 accCakePerShare)', input0);
    }
    async poolLength() {
        return this.$read('function poolLength() returns uint256');
    }
    async renounceOwnership(eoa) {
        return this.$write('function renounceOwnership()', eoa);
    }
    async set(eoa, _pid, _allocPoint, _withUpdate) {
        return this.$write('function set(uint256, uint256, bool)', eoa, _pid, _allocPoint, _withUpdate);
    }
    async setMigrator(eoa, _migrator) {
        return this.$write('function setMigrator(address)', eoa, _migrator);
    }
    async startBlock() {
        return this.$read('function startBlock() returns uint256');
    }
    async syrup() {
        return this.$read('function syrup() returns address');
    }
    async totalAllocPoint() {
        return this.$read('function totalAllocPoint() returns uint256');
    }
    async transferOwnership(eoa, newOwner) {
        return this.$write('function transferOwnership(address)', eoa, newOwner);
    }
    async updateMultiplier(eoa, multiplierNumber) {
        return this.$write('function updateMultiplier(uint256)', eoa, multiplierNumber);
    }
    async updatePool(eoa, _pid) {
        return this.$write('function updatePool(uint256)', eoa, _pid);
    }
    async userInfo(input0, input1) {
        return this.$read('function userInfo(uint256, address) returns (uint256 amount,uint256 rewardDebt)', input0, input1);
    }
    async withdraw(eoa, _pid, _amount) {
        return this.$write('function withdraw(uint256, uint256)', eoa, _pid, _amount);
    }
    onDeposit(fn) {
        return this.$on('Deposit', fn);
    }
    onEmergencyWithdraw(fn) {
        return this.$on('EmergencyWithdraw', fn);
    }
    onOwnershipTransferred(fn) {
        return this.$on('OwnershipTransferred', fn);
    }
    onWithdraw(fn) {
        return this.$on('Withdraw', fn);
    }
}
exports.AmmMasterChefV2ContractBase = AmmMasterChefV2ContractBase;
