/**
 *  AUTO-Generated Class: 2023-12-26 12:42
 *  Implementation: https://bscscan.com/address/0xa80240Eb5d7E05d3F250cF000eEc0891d00b51CC#code
 */
import di from 'a-di';
import { TAddress } from '@dequanto/models/TAddress';
import { TAccount } from '@dequanto/models/TAccount';
import { TBufferLike } from '@dequanto/models/TBufferLike';
import { ClientEventsStream, TClientEventsStreamData } from '@dequanto/clients/ClientEventsStream';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { ContractBaseUtils } from '@dequanto/contracts/utils/ContractBaseUtils';
import { ContractStorageReaderBase } from '@dequanto/contracts/ContractStorageReaderBase';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { ITxLogItem } from '@dequanto/txs/receipt/ITxLogItem';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IBlockChainExplorer } from '@dequanto/explorer/IBlockChainExplorer';
import { SubjectStream } from '@dequanto/class/SubjectStream';


import type { ContractWriter } from '@dequanto/contracts/ContractWriter';
import type { TAbiItem } from '@dequanto/types/TAbi';
import type { TEth } from '@dequanto/models/TEth';
import type { TOverrideReturns } from '@dequanto/utils/types';


import { Bscscan } from '@dequanto/explorer/Bscscan'
import { BscWeb3Client } from '@dequanto/clients/BscWeb3Client'



export class AmmVaultV2Contract extends ContractBase {
    constructor(
        public address: TEth.Address = '0xa80240Eb5d7E05d3F250cF000eEc0891d00b51CC',
        public client: Web3Client = di.resolve(BscWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Bscscan, ),
    ) {
        super(address, client, explorer)

        this.storage = new AmmVaultV2ContractStorageReader(this.address, this.client, this.explorer);
    }

    $meta = {
    "class": "./contracts/amm/AmmVaultV2Contract/AmmVaultV2Contract.ts"
}

    async $constructor (deployer: TSender, _token: TAddress, _receiptToken: TAddress, _masterchef: TAddress, _admin: TAddress, _treasury: TAddress): Promise<TxWriter> {
        throw new Error('Not implemented. Typing purpose. Use the ContractDeployer class to deploy the contract');
    }

    // 0x2ad5a53f
    async MAX_CALL_FEE (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'MAX_CALL_FEE'));
    }

    // 0xbdca9165
    async MAX_PERFORMANCE_FEE (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'MAX_PERFORMANCE_FEE'));
    }

    // 0xd4b0de2f
    async MAX_WITHDRAW_FEE (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'MAX_WITHDRAW_FEE'));
    }

    // 0x2cfc5f01
    async MAX_WITHDRAW_FEE_PERIOD (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'MAX_WITHDRAW_FEE_PERIOD'));
    }

    // 0xf851a440
    async admin (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'admin'));
    }

    // 0x48a0d754
    async available (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'available'));
    }

    // 0x722713f7
    async balanceOf (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'balanceOf'));
    }

    // 0x9d72596b
    async calculateHarvestCakeRewards (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'calculateHarvestCakeRewards'));
    }

    // 0x58ebceb6
    async calculateTotalPendingCakeRewards (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'calculateTotalPendingCakeRewards'));
    }

    // 0x90321e1a
    async callFee (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'callFee'));
    }

    // 0xb6b55f25
    async deposit (sender: TSender, _amount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'deposit'), sender, _amount);
    }

    // 0xdb2e21bc
    async emergencyWithdraw (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'emergencyWithdraw'), sender);
    }

    // 0x77c7b8fc
    async getPricePerFullShare (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getPricePerFullShare'));
    }

    // 0x4641257d
    async harvest (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'harvest'), sender);
    }

    // 0xdef68a9c
    async inCaseTokensGetStuck (sender: TSender, _token: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'inCaseTokensGetStuck'), sender, _token);
    }

    // 0xb60f0531
    async lastHarvestedTime (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'lastHarvestedTime'));
    }

    // 0xfb1db278
    async masterchef (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'masterchef'));
    }

    // 0x8da5cb5b
    async owner (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'owner'));
    }

    // 0x8456cb59
    async pause (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'pause'), sender);
    }

    // 0x5c975abb
    async paused (): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'paused'));
    }

    // 0x87788782
    async performanceFee (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'performanceFee'));
    }

    // 0xec78e832
    async receiptToken (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'receiptToken'));
    }

    // 0x715018a6
    async renounceOwnership (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'renounceOwnership'), sender);
    }

    // 0x704b6c02
    async setAdmin (sender: TSender, _admin: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setAdmin'), sender, _admin);
    }

    // 0x26465826
    async setCallFee (sender: TSender, _callFee: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setCallFee'), sender, _callFee);
    }

    // 0x70897b23
    async setPerformanceFee (sender: TSender, _performanceFee: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setPerformanceFee'), sender, _performanceFee);
    }

    // 0xf0f44260
    async setTreasury (sender: TSender, _treasury: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setTreasury'), sender, _treasury);
    }

    // 0xb6ac642a
    async setWithdrawFee (sender: TSender, _withdrawFee: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setWithdrawFee'), sender, _withdrawFee);
    }

    // 0x1efac1b8
    async setWithdrawFeePeriod (sender: TSender, _withdrawFeePeriod: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setWithdrawFeePeriod'), sender, _withdrawFeePeriod);
    }

    // 0xfc0c546a
    async token (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'token'));
    }

    // 0x3a98ef39
    async totalShares (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'totalShares'));
    }

    // 0xf2fde38b
    async transferOwnership (sender: TSender, newOwner: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'transferOwnership'), sender, newOwner);
    }

    // 0x61d027b3
    async treasury (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'treasury'));
    }

    // 0x3f4ba83a
    async unpause (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'unpause'), sender);
    }

    // 0x1959a002
    async userInfo (input0: TAddress): Promise<{ shares: bigint, lastDepositedTime: bigint, cakeAtLastUserAction: bigint, lastUserActionTime: bigint }> {
        return this.$read(this.$getAbiItem('function', 'userInfo'), input0);
    }

    // 0x2e1a7d4d
    async withdraw (sender: TSender, _shares: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'withdraw'), sender, _shares);
    }

    // 0x853828b6
    async withdrawAll (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'withdrawAll'), sender);
    }

    // 0xe941fa78
    async withdrawFee (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'withdrawFee'));
    }

    // 0xdf10b4e6
    async withdrawFeePeriod (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'withdrawFeePeriod'));
    }

    $call () {
        return super.$call() as IAmmVaultV2ContractTxCaller;
    }
    $signed (): TOverrideReturns<IAmmVaultV2ContractTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IAmmVaultV2ContractTxData {
        return super.$data() as IAmmVaultV2ContractTxData;
    }
    $gas (): TOverrideReturns<IAmmVaultV2ContractTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof IMethods> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: IMethods[TMethod]
    }> {
        options ??= {};
        options.filter ??= {};
        options.filter.method = method;
        return <any> this.$onTransaction(options);
    }

    onLog (event: keyof IEvents, cb?: (event: TClientEventsStreamData) => void): ClientEventsStream<TClientEventsStreamData> {
        return this.$onLog(event, cb);
    }

    onDeposit (fn?: (event: TClientEventsStreamData<TLogDepositParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogDepositParameters>> {
        return this.$onLog('Deposit', fn);
    }

    onHarvest (fn?: (event: TClientEventsStreamData<TLogHarvestParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogHarvestParameters>> {
        return this.$onLog('Harvest', fn);
    }

    onOwnershipTransferred (fn?: (event: TClientEventsStreamData<TLogOwnershipTransferredParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogOwnershipTransferredParameters>> {
        return this.$onLog('OwnershipTransferred', fn);
    }

    onPause (fn?: (event: TClientEventsStreamData<TLogPauseParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogPauseParameters>> {
        return this.$onLog('Pause', fn);
    }

    onPaused (fn?: (event: TClientEventsStreamData<TLogPausedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogPausedParameters>> {
        return this.$onLog('Paused', fn);
    }

    onUnpause (fn?: (event: TClientEventsStreamData<TLogUnpauseParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogUnpauseParameters>> {
        return this.$onLog('Unpause', fn);
    }

    onUnpaused (fn?: (event: TClientEventsStreamData<TLogUnpausedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogUnpausedParameters>> {
        return this.$onLog('Unpaused', fn);
    }

    onWithdraw (fn?: (event: TClientEventsStreamData<TLogWithdrawParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogWithdrawParameters>> {
        return this.$onLog('Withdraw', fn);
    }

    extractLogsDeposit (tx: TEth.TxReceipt): ITxLogItem<TLogDeposit>[] {
        let abi = this.$getAbiItem('event', 'Deposit');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogDeposit>[];
    }

    extractLogsHarvest (tx: TEth.TxReceipt): ITxLogItem<TLogHarvest>[] {
        let abi = this.$getAbiItem('event', 'Harvest');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogHarvest>[];
    }

    extractLogsOwnershipTransferred (tx: TEth.TxReceipt): ITxLogItem<TLogOwnershipTransferred>[] {
        let abi = this.$getAbiItem('event', 'OwnershipTransferred');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogOwnershipTransferred>[];
    }

    extractLogsPause (tx: TEth.TxReceipt): ITxLogItem<TLogPause>[] {
        let abi = this.$getAbiItem('event', 'Pause');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogPause>[];
    }

    extractLogsPaused (tx: TEth.TxReceipt): ITxLogItem<TLogPaused>[] {
        let abi = this.$getAbiItem('event', 'Paused');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogPaused>[];
    }

    extractLogsUnpause (tx: TEth.TxReceipt): ITxLogItem<TLogUnpause>[] {
        let abi = this.$getAbiItem('event', 'Unpause');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogUnpause>[];
    }

    extractLogsUnpaused (tx: TEth.TxReceipt): ITxLogItem<TLogUnpaused>[] {
        let abi = this.$getAbiItem('event', 'Unpaused');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogUnpaused>[];
    }

    extractLogsWithdraw (tx: TEth.TxReceipt): ITxLogItem<TLogWithdraw>[] {
        let abi = this.$getAbiItem('event', 'Withdraw');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogWithdraw>[];
    }

    async getPastLogsDeposit (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { sender?: TAddress }
    }): Promise<ITxLogItem<TLogDeposit>[]> {
        return await this.$getPastLogsParsed('Deposit', options) as any;
    }

    async getPastLogsHarvest (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { sender?: TAddress }
    }): Promise<ITxLogItem<TLogHarvest>[]> {
        return await this.$getPastLogsParsed('Harvest', options) as any;
    }

    async getPastLogsOwnershipTransferred (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { previousOwner?: TAddress,newOwner?: TAddress }
    }): Promise<ITxLogItem<TLogOwnershipTransferred>[]> {
        return await this.$getPastLogsParsed('OwnershipTransferred', options) as any;
    }

    async getPastLogsPause (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogPause>[]> {
        return await this.$getPastLogsParsed('Pause', options) as any;
    }

    async getPastLogsPaused (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogPaused>[]> {
        return await this.$getPastLogsParsed('Paused', options) as any;
    }

    async getPastLogsUnpause (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogUnpause>[]> {
        return await this.$getPastLogsParsed('Unpause', options) as any;
    }

    async getPastLogsUnpaused (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogUnpaused>[]> {
        return await this.$getPastLogsParsed('Unpaused', options) as any;
    }

    async getPastLogsWithdraw (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { sender?: TAddress }
    }): Promise<ITxLogItem<TLogWithdraw>[]> {
        return await this.$getPastLogsParsed('Withdraw', options) as any;
    }

    abi: TAbiItem[] = [{"inputs":[{"internalType":"contract IERC20","name":"_token","type":"address"},{"internalType":"contract IERC20","name":"_receiptToken","type":"address"},{"internalType":"contract IMasterChef","name":"_masterchef","type":"address"},{"internalType":"address","name":"_admin","type":"address"},{"internalType":"address","name":"_treasury","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"shares","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"lastDepositedTime","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"performanceFee","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"callFee","type":"uint256"}],"name":"Harvest","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"shares","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"MAX_CALL_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_PERFORMANCE_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_WITHDRAW_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_WITHDRAW_FEE_PERIOD","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"available","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"calculateHarvestCakeRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"calculateTotalPendingCakeRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"callFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getPricePerFullShare","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"harvest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"inCaseTokensGetStuck","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"lastHarvestedTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"masterchef","outputs":[{"internalType":"contract IMasterChef","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"performanceFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"receiptToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_admin","type":"address"}],"name":"setAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_callFee","type":"uint256"}],"name":"setCallFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_performanceFee","type":"uint256"}],"name":"setPerformanceFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_treasury","type":"address"}],"name":"setTreasury","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_withdrawFee","type":"uint256"}],"name":"setWithdrawFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_withdrawFeePeriod","type":"uint256"}],"name":"setWithdrawFeePeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalShares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"treasury","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userInfo","outputs":[{"internalType":"uint256","name":"shares","type":"uint256"},{"internalType":"uint256","name":"lastDepositedTime","type":"uint256"},{"internalType":"uint256","name":"cakeAtLastUserAction","type":"uint256"},{"internalType":"uint256","name":"lastUserActionTime","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_shares","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawFeePeriod","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]

    declare storage: AmmVaultV2ContractStorageReader
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogDeposit = {
        _sender: TAddress, amount: bigint, shares: bigint, lastDepositedTime: bigint
    };
    type TLogDepositParameters = [ _sender: TAddress, amount: bigint, shares: bigint, lastDepositedTime: bigint ];
    type TLogHarvest = {
        _sender: TAddress, performanceFee: bigint, callFee: bigint
    };
    type TLogHarvestParameters = [ _sender: TAddress, performanceFee: bigint, callFee: bigint ];
    type TLogOwnershipTransferred = {
        previousOwner: TAddress, newOwner: TAddress
    };
    type TLogOwnershipTransferredParameters = [ previousOwner: TAddress, newOwner: TAddress ];
    type TLogPause = {
        
    };
    type TLogPauseParameters = [  ];
    type TLogPaused = {
        account: TAddress
    };
    type TLogPausedParameters = [ account: TAddress ];
    type TLogUnpause = {
        
    };
    type TLogUnpauseParameters = [  ];
    type TLogUnpaused = {
        account: TAddress
    };
    type TLogUnpausedParameters = [ account: TAddress ];
    type TLogWithdraw = {
        _sender: TAddress, amount: bigint, shares: bigint
    };
    type TLogWithdrawParameters = [ _sender: TAddress, amount: bigint, shares: bigint ];

interface IEvents {
  Deposit: TLogDepositParameters
  Harvest: TLogHarvestParameters
  OwnershipTransferred: TLogOwnershipTransferredParameters
  Pause: TLogPauseParameters
  Paused: TLogPausedParameters
  Unpause: TLogUnpauseParameters
  Unpaused: TLogUnpausedParameters
  Withdraw: TLogWithdrawParameters
  '*': any[] 
}



interface IMethodMAX_CALL_FEE {
  method: "MAX_CALL_FEE"
  arguments: [  ]
}

interface IMethodMAX_PERFORMANCE_FEE {
  method: "MAX_PERFORMANCE_FEE"
  arguments: [  ]
}

interface IMethodMAX_WITHDRAW_FEE {
  method: "MAX_WITHDRAW_FEE"
  arguments: [  ]
}

interface IMethodMAX_WITHDRAW_FEE_PERIOD {
  method: "MAX_WITHDRAW_FEE_PERIOD"
  arguments: [  ]
}

interface IMethodAdmin {
  method: "admin"
  arguments: [  ]
}

interface IMethodAvailable {
  method: "available"
  arguments: [  ]
}

interface IMethodBalanceOf {
  method: "balanceOf"
  arguments: [  ]
}

interface IMethodCalculateHarvestCakeRewards {
  method: "calculateHarvestCakeRewards"
  arguments: [  ]
}

interface IMethodCalculateTotalPendingCakeRewards {
  method: "calculateTotalPendingCakeRewards"
  arguments: [  ]
}

interface IMethodCallFee {
  method: "callFee"
  arguments: [  ]
}

interface IMethodDeposit {
  method: "deposit"
  arguments: [ _amount: bigint ]
}

interface IMethodEmergencyWithdraw {
  method: "emergencyWithdraw"
  arguments: [  ]
}

interface IMethodGetPricePerFullShare {
  method: "getPricePerFullShare"
  arguments: [  ]
}

interface IMethodHarvest {
  method: "harvest"
  arguments: [  ]
}

interface IMethodInCaseTokensGetStuck {
  method: "inCaseTokensGetStuck"
  arguments: [ _token: TAddress ]
}

interface IMethodLastHarvestedTime {
  method: "lastHarvestedTime"
  arguments: [  ]
}

interface IMethodMasterchef {
  method: "masterchef"
  arguments: [  ]
}

interface IMethodOwner {
  method: "owner"
  arguments: [  ]
}

interface IMethodPause {
  method: "pause"
  arguments: [  ]
}

interface IMethodPaused {
  method: "paused"
  arguments: [  ]
}

interface IMethodPerformanceFee {
  method: "performanceFee"
  arguments: [  ]
}

interface IMethodReceiptToken {
  method: "receiptToken"
  arguments: [  ]
}

interface IMethodRenounceOwnership {
  method: "renounceOwnership"
  arguments: [  ]
}

interface IMethodSetAdmin {
  method: "setAdmin"
  arguments: [ _admin: TAddress ]
}

interface IMethodSetCallFee {
  method: "setCallFee"
  arguments: [ _callFee: bigint ]
}

interface IMethodSetPerformanceFee {
  method: "setPerformanceFee"
  arguments: [ _performanceFee: bigint ]
}

interface IMethodSetTreasury {
  method: "setTreasury"
  arguments: [ _treasury: TAddress ]
}

interface IMethodSetWithdrawFee {
  method: "setWithdrawFee"
  arguments: [ _withdrawFee: bigint ]
}

interface IMethodSetWithdrawFeePeriod {
  method: "setWithdrawFeePeriod"
  arguments: [ _withdrawFeePeriod: bigint ]
}

interface IMethodToken {
  method: "token"
  arguments: [  ]
}

interface IMethodTotalShares {
  method: "totalShares"
  arguments: [  ]
}

interface IMethodTransferOwnership {
  method: "transferOwnership"
  arguments: [ newOwner: TAddress ]
}

interface IMethodTreasury {
  method: "treasury"
  arguments: [  ]
}

interface IMethodUnpause {
  method: "unpause"
  arguments: [  ]
}

interface IMethodUserInfo {
  method: "userInfo"
  arguments: [ input0: TAddress ]
}

interface IMethodWithdraw {
  method: "withdraw"
  arguments: [ _shares: bigint ]
}

interface IMethodWithdrawAll {
  method: "withdrawAll"
  arguments: [  ]
}

interface IMethodWithdrawFee {
  method: "withdrawFee"
  arguments: [  ]
}

interface IMethodWithdrawFeePeriod {
  method: "withdrawFeePeriod"
  arguments: [  ]
}

interface IMethods {
  MAX_CALL_FEE: IMethodMAX_CALL_FEE
  MAX_PERFORMANCE_FEE: IMethodMAX_PERFORMANCE_FEE
  MAX_WITHDRAW_FEE: IMethodMAX_WITHDRAW_FEE
  MAX_WITHDRAW_FEE_PERIOD: IMethodMAX_WITHDRAW_FEE_PERIOD
  admin: IMethodAdmin
  available: IMethodAvailable
  balanceOf: IMethodBalanceOf
  calculateHarvestCakeRewards: IMethodCalculateHarvestCakeRewards
  calculateTotalPendingCakeRewards: IMethodCalculateTotalPendingCakeRewards
  callFee: IMethodCallFee
  deposit: IMethodDeposit
  emergencyWithdraw: IMethodEmergencyWithdraw
  getPricePerFullShare: IMethodGetPricePerFullShare
  harvest: IMethodHarvest
  inCaseTokensGetStuck: IMethodInCaseTokensGetStuck
  lastHarvestedTime: IMethodLastHarvestedTime
  masterchef: IMethodMasterchef
  owner: IMethodOwner
  pause: IMethodPause
  paused: IMethodPaused
  performanceFee: IMethodPerformanceFee
  receiptToken: IMethodReceiptToken
  renounceOwnership: IMethodRenounceOwnership
  setAdmin: IMethodSetAdmin
  setCallFee: IMethodSetCallFee
  setPerformanceFee: IMethodSetPerformanceFee
  setTreasury: IMethodSetTreasury
  setWithdrawFee: IMethodSetWithdrawFee
  setWithdrawFeePeriod: IMethodSetWithdrawFeePeriod
  token: IMethodToken
  totalShares: IMethodTotalShares
  transferOwnership: IMethodTransferOwnership
  treasury: IMethodTreasury
  unpause: IMethodUnpause
  userInfo: IMethodUserInfo
  withdraw: IMethodWithdraw
  withdrawAll: IMethodWithdrawAll
  withdrawFee: IMethodWithdrawFee
  withdrawFeePeriod: IMethodWithdrawFeePeriod
  '*': { method: string, arguments: any[] } 
}





class AmmVaultV2ContractStorageReader extends ContractStorageReaderBase {
    constructor(
        public address: TAddress,
        public client: Web3Client,
        public explorer: IBlockChainExplorer,
    ) {
        super(address, client, explorer);

        this.$createHandler(this.$slots);
    }

    async _owner(): Promise<TAddress> {
        return this.$storage.get(['_owner', ]);
    }

    async _paused(): Promise<boolean> {
        return this.$storage.get(['_paused', ]);
    }

    async userInfo(key: TAddress): Promise<{ shares: bigint, lastDepositedTime: bigint, cakeAtLastUserAction: bigint, lastUserActionTime: bigint }> {
        return this.$storage.get(['userInfo', key]);
    }

    async totalShares(): Promise<bigint> {
        return this.$storage.get(['totalShares', ]);
    }

    async lastHarvestedTime(): Promise<bigint> {
        return this.$storage.get(['lastHarvestedTime', ]);
    }

    async admin(): Promise<TAddress> {
        return this.$storage.get(['admin', ]);
    }

    async treasury(): Promise<TAddress> {
        return this.$storage.get(['treasury', ]);
    }

    async performanceFee(): Promise<bigint> {
        return this.$storage.get(['performanceFee', ]);
    }

    async callFee(): Promise<bigint> {
        return this.$storage.get(['callFee', ]);
    }

    async withdrawFee(): Promise<bigint> {
        return this.$storage.get(['withdrawFee', ]);
    }

    async withdrawFeePeriod(): Promise<bigint> {
        return this.$storage.get(['withdrawFeePeriod', ]);
    }

    $slots = [
    {
        "slot": 0,
        "position": 0,
        "name": "_owner",
        "size": 160,
        "type": "address"
    },
    {
        "slot": 0,
        "position": 160,
        "name": "_paused",
        "size": 8,
        "type": "bool"
    },
    {
        "slot": 1,
        "position": 0,
        "name": "userInfo",
        "size": null,
        "type": "mapping(address => (uint256 shares, uint256 lastDepositedTime, uint256 cakeAtLastUserAction, uint256 lastUserActionTime))"
    },
    {
        "slot": 2,
        "position": 0,
        "name": "totalShares",
        "size": 256,
        "type": "uint256"
    },
    {
        "slot": 3,
        "position": 0,
        "name": "lastHarvestedTime",
        "size": 256,
        "type": "uint256"
    },
    {
        "slot": 4,
        "position": 0,
        "name": "admin",
        "size": 160,
        "type": "address"
    },
    {
        "slot": 5,
        "position": 0,
        "name": "treasury",
        "size": 160,
        "type": "address"
    },
    {
        "slot": 6,
        "position": 0,
        "name": "performanceFee",
        "size": 256,
        "type": "uint256"
    },
    {
        "slot": 7,
        "position": 0,
        "name": "callFee",
        "size": 256,
        "type": "uint256"
    },
    {
        "slot": 8,
        "position": 0,
        "name": "withdrawFee",
        "size": 256,
        "type": "uint256"
    },
    {
        "slot": 9,
        "position": 0,
        "name": "withdrawFeePeriod",
        "size": 256,
        "type": "uint256"
    }
]

}



interface IAmmVaultV2ContractTxCaller {
    deposit (sender: TSender, _amount: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    emergencyWithdraw (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    harvest (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    inCaseTokensGetStuck (sender: TSender, _token: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    pause (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    renounceOwnership (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setAdmin (sender: TSender, _admin: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setCallFee (sender: TSender, _callFee: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setPerformanceFee (sender: TSender, _performanceFee: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setTreasury (sender: TSender, _treasury: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setWithdrawFee (sender: TSender, _withdrawFee: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setWithdrawFeePeriod (sender: TSender, _withdrawFeePeriod: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    transferOwnership (sender: TSender, newOwner: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    unpause (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    withdraw (sender: TSender, _shares: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    withdrawAll (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IAmmVaultV2ContractTxData {
    deposit (sender: TSender, _amount: bigint): Promise<TEth.TxLike>
    emergencyWithdraw (sender: TSender, ): Promise<TEth.TxLike>
    harvest (sender: TSender, ): Promise<TEth.TxLike>
    inCaseTokensGetStuck (sender: TSender, _token: TAddress): Promise<TEth.TxLike>
    pause (sender: TSender, ): Promise<TEth.TxLike>
    renounceOwnership (sender: TSender, ): Promise<TEth.TxLike>
    setAdmin (sender: TSender, _admin: TAddress): Promise<TEth.TxLike>
    setCallFee (sender: TSender, _callFee: bigint): Promise<TEth.TxLike>
    setPerformanceFee (sender: TSender, _performanceFee: bigint): Promise<TEth.TxLike>
    setTreasury (sender: TSender, _treasury: TAddress): Promise<TEth.TxLike>
    setWithdrawFee (sender: TSender, _withdrawFee: bigint): Promise<TEth.TxLike>
    setWithdrawFeePeriod (sender: TSender, _withdrawFeePeriod: bigint): Promise<TEth.TxLike>
    transferOwnership (sender: TSender, newOwner: TAddress): Promise<TEth.TxLike>
    unpause (sender: TSender, ): Promise<TEth.TxLike>
    withdraw (sender: TSender, _shares: bigint): Promise<TEth.TxLike>
    withdrawAll (sender: TSender, ): Promise<TEth.TxLike>
}


