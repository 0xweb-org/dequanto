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

export class AmmVaultV2ContractBase extends ContractBase {
    constructor(
        public address: TAddress = '0xa80240Eb5d7E05d3F250cF000eEc0891d00b51CC',
        public client: Web3Client = di.resolve(BscWeb3Client),
        public explorer: IBlockChainExplorer = di.resolve(Bscscan)
    ) {
        super(address, client, explorer)
    }

    async MAX_CALL_FEE (): Promise<bigint> {
        return this.$read('function MAX_CALL_FEE() returns uint256');
    }

    async MAX_PERFORMANCE_FEE (): Promise<bigint> {
        return this.$read('function MAX_PERFORMANCE_FEE() returns uint256');
    }

    async MAX_WITHDRAW_FEE (): Promise<bigint> {
        return this.$read('function MAX_WITHDRAW_FEE() returns uint256');
    }

    async MAX_WITHDRAW_FEE_PERIOD (): Promise<bigint> {
        return this.$read('function MAX_WITHDRAW_FEE_PERIOD() returns uint256');
    }

    async admin (): Promise<TAddress> {
        return this.$read('function admin() returns address');
    }

    async available (): Promise<bigint> {
        return this.$read('function available() returns uint256');
    }

    async balanceOf (): Promise<bigint> {
        return this.$read('function balanceOf() returns uint256');
    }

    async calculateHarvestCakeRewards (): Promise<bigint> {
        return this.$read('function calculateHarvestCakeRewards() returns uint256');
    }

    async calculateTotalPendingCakeRewards (): Promise<bigint> {
        return this.$read('function calculateTotalPendingCakeRewards() returns uint256');
    }

    async callFee (): Promise<bigint> {
        return this.$read('function callFee() returns uint256');
    }

    async deposit (eoa: {address: TAddress, key: string}, _amount: bigint): Promise<TxWriter> {
        return this.$write('function deposit(uint256)', eoa, _amount);
    }

    async emergencyWithdraw (eoa: {address: TAddress, key: string}, ): Promise<TxWriter> {
        return this.$write('function emergencyWithdraw()', eoa);
    }

    async getPricePerFullShare (): Promise<bigint> {
        return this.$read('function getPricePerFullShare() returns uint256');
    }

    async harvest (eoa: {address: TAddress, key: string}, ): Promise<TxWriter> {
        return this.$write('function harvest()', eoa);
    }

    async inCaseTokensGetStuck (eoa: {address: TAddress, key: string}, _token: TAddress): Promise<TxWriter> {
        return this.$write('function inCaseTokensGetStuck(address)', eoa, _token);
    }

    async lastHarvestedTime (): Promise<bigint> {
        return this.$read('function lastHarvestedTime() returns uint256');
    }

    async masterchef (): Promise<TAddress> {
        return this.$read('function masterchef() returns address');
    }

    async owner (): Promise<TAddress> {
        return this.$read('function owner() returns address');
    }

    async pause (eoa: {address: TAddress, key: string}, ): Promise<TxWriter> {
        return this.$write('function pause()', eoa);
    }

    async paused (): Promise<boolean> {
        return this.$read('function paused() returns bool');
    }

    async performanceFee (): Promise<bigint> {
        return this.$read('function performanceFee() returns uint256');
    }

    async receiptToken (): Promise<TAddress> {
        return this.$read('function receiptToken() returns address');
    }

    async renounceOwnership (eoa: {address: TAddress, key: string}, ): Promise<TxWriter> {
        return this.$write('function renounceOwnership()', eoa);
    }

    async setAdmin (eoa: {address: TAddress, key: string}, _admin: TAddress): Promise<TxWriter> {
        return this.$write('function setAdmin(address)', eoa, _admin);
    }

    async setCallFee (eoa: {address: TAddress, key: string}, _callFee: bigint): Promise<TxWriter> {
        return this.$write('function setCallFee(uint256)', eoa, _callFee);
    }

    async setPerformanceFee (eoa: {address: TAddress, key: string}, _performanceFee: bigint): Promise<TxWriter> {
        return this.$write('function setPerformanceFee(uint256)', eoa, _performanceFee);
    }

    async setTreasury (eoa: {address: TAddress, key: string}, _treasury: TAddress): Promise<TxWriter> {
        return this.$write('function setTreasury(address)', eoa, _treasury);
    }

    async setWithdrawFee (eoa: {address: TAddress, key: string}, _withdrawFee: bigint): Promise<TxWriter> {
        return this.$write('function setWithdrawFee(uint256)', eoa, _withdrawFee);
    }

    async setWithdrawFeePeriod (eoa: {address: TAddress, key: string}, _withdrawFeePeriod: bigint): Promise<TxWriter> {
        return this.$write('function setWithdrawFeePeriod(uint256)', eoa, _withdrawFeePeriod);
    }

    async token (): Promise<TAddress> {
        return this.$read('function token() returns address');
    }

    async totalShares (): Promise<bigint> {
        return this.$read('function totalShares() returns uint256');
    }

    async transferOwnership (eoa: {address: TAddress, key: string}, newOwner: TAddress): Promise<TxWriter> {
        return this.$write('function transferOwnership(address)', eoa, newOwner);
    }

    async treasury (): Promise<TAddress> {
        return this.$read('function treasury() returns address');
    }

    async unpause (eoa: {address: TAddress, key: string}, ): Promise<TxWriter> {
        return this.$write('function unpause()', eoa);
    }

    async userInfo (input0: TAddress): Promise<{ shares: bigint, lastDepositedTime: bigint, cakeAtLastUserAction: bigint, lastUserActionTime: bigint }> {
        return this.$read('function userInfo(address) returns (uint256 shares,uint256 lastDepositedTime,uint256 cakeAtLastUserAction,uint256 lastUserActionTime)', input0);
    }

    async withdraw (eoa: {address: TAddress, key: string}, _shares: bigint): Promise<TxWriter> {
        return this.$write('function withdraw(uint256)', eoa, _shares);
    }

    async withdrawAll (eoa: {address: TAddress, key: string}, ): Promise<TxWriter> {
        return this.$write('function withdrawAll()', eoa);
    }

    async withdrawFee (): Promise<bigint> {
        return this.$read('function withdrawFee() returns uint256');
    }

    async withdrawFeePeriod (): Promise<bigint> {
        return this.$read('function withdrawFeePeriod() returns uint256');
    }

    onDeposit (fn: (sender: TAddress, amount: bigint, shares: bigint, lastDepositedTime: bigint) => void): ClientEventsStream<any> {
        return this.$on('Deposit', fn);
    }

    onHarvest (fn: (sender: TAddress, performanceFee: bigint, callFee: bigint) => void): ClientEventsStream<any> {
        return this.$on('Harvest', fn);
    }

    onOwnershipTransferred (fn: (previousOwner: TAddress, newOwner: TAddress) => void): ClientEventsStream<any> {
        return this.$on('OwnershipTransferred', fn);
    }

    onPause (fn: () => void): ClientEventsStream<any> {
        return this.$on('Pause', fn);
    }

    onPaused (fn: (account: TAddress) => void): ClientEventsStream<any> {
        return this.$on('Paused', fn);
    }

    onUnpause (fn: () => void): ClientEventsStream<any> {
        return this.$on('Unpause', fn);
    }

    onUnpaused (fn: (account: TAddress) => void): ClientEventsStream<any> {
        return this.$on('Unpaused', fn);
    }

    onWithdraw (fn: (sender: TAddress, amount: bigint, shares: bigint) => void): ClientEventsStream<any> {
        return this.$on('Withdraw', fn);
    }

    abi = [{"inputs":[{"internalType":"contract IERC20","name":"_token","type":"address"},{"internalType":"contract IERC20","name":"_receiptToken","type":"address"},{"internalType":"contract IMasterChef","name":"_masterchef","type":"address"},{"internalType":"address","name":"_admin","type":"address"},{"internalType":"address","name":"_treasury","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"shares","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"lastDepositedTime","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"performanceFee","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"callFee","type":"uint256"}],"name":"Harvest","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"shares","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"MAX_CALL_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_PERFORMANCE_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_WITHDRAW_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_WITHDRAW_FEE_PERIOD","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"available","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"calculateHarvestCakeRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"calculateTotalPendingCakeRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"callFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getPricePerFullShare","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"harvest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"inCaseTokensGetStuck","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"lastHarvestedTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"masterchef","outputs":[{"internalType":"contract IMasterChef","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"performanceFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"receiptToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_admin","type":"address"}],"name":"setAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_callFee","type":"uint256"}],"name":"setCallFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_performanceFee","type":"uint256"}],"name":"setPerformanceFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_treasury","type":"address"}],"name":"setTreasury","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_withdrawFee","type":"uint256"}],"name":"setWithdrawFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_withdrawFeePeriod","type":"uint256"}],"name":"setWithdrawFeePeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalShares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"treasury","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userInfo","outputs":[{"internalType":"uint256","name":"shares","type":"uint256"},{"internalType":"uint256","name":"lastDepositedTime","type":"uint256"},{"internalType":"uint256","name":"cakeAtLastUserAction","type":"uint256"},{"internalType":"uint256","name":"lastUserActionTime","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_shares","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawFeePeriod","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
}
