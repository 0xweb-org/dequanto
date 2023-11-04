/**
 *  AUTO-Generated Class: 2021-11-09 14:26
 */
import di from 'a-di';
import { TAddress } from '@dequanto/models/TAddress';

import { Bscscan } from '@dequanto/explorer/Bscscan';
import { BscWeb3Client } from '@dequanto/clients/BscWeb3Client';
import { ClientEventsStream } from '@dequanto/clients/ClientEventsStream';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { AbiItem } from 'web3-utils';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IBlockChainExplorer } from '@dequanto/explorer/IBlockChainExplorer';

export class AmmMasterChefV2ContractBase extends ContractBase {
    constructor(
        public address: TAddress = '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
        public client: Web3Client = di.resolve(BscWeb3Client),
        public explorer: IBlockChainExplorer = di.resolve(Bscscan)
    ) {
        super(address, client, explorer)
    }

    async BONUS_MULTIPLIER (): Promise<bigint> {
        return this.$read('function BONUS_MULTIPLIER() returns uint256');
    }

    async add (eoa: {address: TAddress, key: string}, _allocPoint: bigint, _lpToken: TAddress, _withUpdate: boolean): Promise<TxWriter> {
        return this.$write('function add(uint256, address, bool)', eoa, _allocPoint, _lpToken, _withUpdate);
    }

    async cake (): Promise<TAddress> {
        return this.$read('function cake() returns address');
    }

    async cakePerBlock (): Promise<bigint> {
        return this.$read('function cakePerBlock() returns uint256');
    }

    async deposit (eoa: {address: TAddress, key: string}, _pid: bigint, _amount: bigint): Promise<TxWriter> {
        return this.$write('function deposit(uint256, uint256)', eoa, _pid, _amount);
    }

    async dev (eoa: {address: TAddress, key: string}, _devaddr: TAddress): Promise<TxWriter> {
        return this.$write('function dev(address)', eoa, _devaddr);
    }

    async devaddr (): Promise<TAddress> {
        return this.$read('function devaddr() returns address');
    }

    async emergencyWithdraw (eoa: {address: TAddress, key: string}, _pid: bigint): Promise<TxWriter> {
        return this.$write('function emergencyWithdraw(uint256)', eoa, _pid);
    }

    async enterStaking (eoa: {address: TAddress, key: string}, _amount: bigint): Promise<TxWriter> {
        return this.$write('function enterStaking(uint256)', eoa, _amount);
    }

    async getMultiplier (_from: bigint, _to: bigint): Promise<bigint> {
        return this.$read('function getMultiplier(uint256, uint256) returns uint256', _from, _to);
    }

    async leaveStaking (eoa: {address: TAddress, key: string}, _amount: bigint): Promise<TxWriter> {
        return this.$write('function leaveStaking(uint256)', eoa, _amount);
    }

    async massUpdatePools (eoa: {address: TAddress, key: string}, ): Promise<TxWriter> {
        return this.$write('function massUpdatePools()', eoa);
    }

    async migrate (eoa: {address: TAddress, key: string}, _pid: bigint): Promise<TxWriter> {
        return this.$write('function migrate(uint256)', eoa, _pid);
    }

    async migrator (): Promise<TAddress> {
        return this.$read('function migrator() returns address');
    }

    async owner (): Promise<TAddress> {
        return this.$read('function owner() returns address');
    }

    async pendingCake (_pid: bigint, _user: TAddress): Promise<bigint> {
        return this.$read('function pendingCake(uint256, address) returns uint256', _pid, _user);
    }

    async poolInfo (input0: bigint): Promise<{ lpToken: TAddress, allocPoint: bigint, lastRewardBlock: bigint, accCakePerShare: bigint }> {
        return this.$read('function poolInfo(uint256) returns (address lpToken,uint256 allocPoint,uint256 lastRewardBlock,uint256 accCakePerShare)', input0);
    }

    async poolLength (): Promise<bigint> {
        return this.$read('function poolLength() returns uint256');
    }

    async renounceOwnership (eoa: {address: TAddress, key: string}, ): Promise<TxWriter> {
        return this.$write('function renounceOwnership()', eoa);
    }

    async set (eoa: {address: TAddress, key: string}, _pid: bigint, _allocPoint: bigint, _withUpdate: boolean): Promise<TxWriter> {
        return this.$write('function set(uint256, uint256, bool)', eoa, _pid, _allocPoint, _withUpdate);
    }

    async setMigrator (eoa: {address: TAddress, key: string}, _migrator: TAddress): Promise<TxWriter> {
        return this.$write('function setMigrator(address)', eoa, _migrator);
    }

    async startBlock (): Promise<bigint> {
        return this.$read('function startBlock() returns uint256');
    }

    async syrup (): Promise<TAddress> {
        return this.$read('function syrup() returns address');
    }

    async totalAllocPoint (): Promise<bigint> {
        return this.$read('function totalAllocPoint() returns uint256');
    }

    async transferOwnership (eoa: {address: TAddress, key: string}, newOwner: TAddress): Promise<TxWriter> {
        return this.$write('function transferOwnership(address)', eoa, newOwner);
    }

    async updateMultiplier (eoa: {address: TAddress, key: string}, multiplierNumber: bigint): Promise<TxWriter> {
        return this.$write('function updateMultiplier(uint256)', eoa, multiplierNumber);
    }

    async updatePool (eoa: {address: TAddress, key: string}, _pid: bigint): Promise<TxWriter> {
        return this.$write('function updatePool(uint256)', eoa, _pid);
    }

    async userInfo (input0: bigint, input1: TAddress): Promise<{ amount: bigint, rewardDebt: bigint }> {
        return this.$read('function userInfo(uint256, address) returns (uint256 amount,uint256 rewardDebt)', input0, input1);
    }

    async withdraw (eoa: {address: TAddress, key: string}, _pid: bigint, _amount: bigint): Promise<TxWriter> {
        return this.$write('function withdraw(uint256, uint256)', eoa, _pid, _amount);
    }

    onDeposit (fn: (user: TAddress, pid: bigint, amount: bigint) => void): ClientEventsStream<any> {
        return this.$on('Deposit', fn);
    }

    onEmergencyWithdraw (fn: (user: TAddress, pid: bigint, amount: bigint) => void): ClientEventsStream<any> {
        return this.$on('EmergencyWithdraw', fn);
    }

    onOwnershipTransferred (fn: (previousOwner: TAddress, newOwner: TAddress) => void): ClientEventsStream<any> {
        return this.$on('OwnershipTransferred', fn);
    }

    onWithdraw (fn: (user: TAddress, pid: bigint, amount: bigint) => void): ClientEventsStream<any> {
        return this.$on('Withdraw', fn);
    }

    abi = [{"inputs":[{"internalType":"contract CakeToken","name":"_cake","type":"address"},{"internalType":"contract SyrupBar","name":"_syrup","type":"address"},{"internalType":"address","name":"_devaddr","type":"address"},{"internalType":"uint256","name":"_cakePerBlock","type":"uint256"},{"internalType":"uint256","name":"_startBlock","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EmergencyWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"BONUS_MULTIPLIER","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_allocPoint","type":"uint256"},{"internalType":"contract IBEP20","name":"_lpToken","type":"address"},{"internalType":"bool","name":"_withUpdate","type":"bool"}],"name":"add","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"cake","outputs":[{"internalType":"contract CakeToken","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"cakePerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_devaddr","type":"address"}],"name":"dev","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"devaddr","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"enterStaking","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_from","type":"uint256"},{"internalType":"uint256","name":"_to","type":"uint256"}],"name":"getMultiplier","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"leaveStaking","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"massUpdatePools","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"migrate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"migrator","outputs":[{"internalType":"contract IMigratorChef","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_user","type":"address"}],"name":"pendingCake","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"poolInfo","outputs":[{"internalType":"contract IBEP20","name":"lpToken","type":"address"},{"internalType":"uint256","name":"allocPoint","type":"uint256"},{"internalType":"uint256","name":"lastRewardBlock","type":"uint256"},{"internalType":"uint256","name":"accCakePerShare","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"poolLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_allocPoint","type":"uint256"},{"internalType":"bool","name":"_withUpdate","type":"bool"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IMigratorChef","name":"_migrator","type":"address"}],"name":"setMigrator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"syrup","outputs":[{"internalType":"contract SyrupBar","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalAllocPoint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"multiplierNumber","type":"uint256"}],"name":"updateMultiplier","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"updatePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"userInfo","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"rewardDebt","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]
}
