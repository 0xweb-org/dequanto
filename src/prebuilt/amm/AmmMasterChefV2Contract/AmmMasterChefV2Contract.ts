/**
 *  AUTO-Generated Class: 2024-05-17 00:25
 *  Implementation: https://bscscan.com/address/0x73feaa1eE314F8c655E354234017bE2193C9E24E#code
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



export class AmmMasterChefV2Contract extends ContractBase {
    constructor(
        public address: TEth.Address = '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
        public client: Web3Client = di.resolve(BscWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Bscscan, ),
    ) {
        super(address, client, explorer)

        this.storage = new AmmMasterChefV2ContractStorageReader(this.address, this.client, this.explorer);
    }

    Types: TAmmMasterChefV2ContractTypes;

    $meta = {
        "class": "./src/prebuilt/amm/AmmMasterChefV2Contract/AmmMasterChefV2Contract.ts"
    }

    async $constructor (deployer: TSender, _cake: TAddress, _syrup: TAddress, _devaddr: TAddress, _cakePerBlock: bigint, _startBlock: bigint): Promise<TxWriter> {
        throw new Error('Not implemented. Typing purpose. Use the ContractDeployer class to deploy the contract');
    }

    // 0x8aa28550
    async BONUS_MULTIPLIER (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'BONUS_MULTIPLIER'));
    }

    // 0x1eaaa045
    async add (sender: TSender, _allocPoint: bigint, _lpToken: TAddress, _withUpdate: boolean): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'add'), sender, _allocPoint, _lpToken, _withUpdate);
    }

    // 0xdce17484
    async cake (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'cake'));
    }

    // 0x0755e0b6
    async cakePerBlock (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'cakePerBlock'));
    }

    // 0xe2bbb158
    async deposit (sender: TSender, _pid: bigint, _amount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'deposit'), sender, _pid, _amount);
    }

    // 0x8d88a90e
    async dev (sender: TSender, _devaddr: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'dev'), sender, _devaddr);
    }

    // 0xd49e77cd
    async devaddr (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'devaddr'));
    }

    // 0x5312ea8e
    async emergencyWithdraw (sender: TSender, _pid: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'emergencyWithdraw'), sender, _pid);
    }

    // 0x41441d3b
    async enterStaking (sender: TSender, _amount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'enterStaking'), sender, _amount);
    }

    // 0x8dbb1e3a
    async getMultiplier (_from: bigint, _to: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getMultiplier'), _from, _to);
    }

    // 0x1058d281
    async leaveStaking (sender: TSender, _amount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'leaveStaking'), sender, _amount);
    }

    // 0x630b5ba1
    async massUpdatePools (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'massUpdatePools'), sender);
    }

    // 0x454b0608
    async migrate (sender: TSender, _pid: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'migrate'), sender, _pid);
    }

    // 0x7cd07e47
    async migrator (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'migrator'));
    }

    // 0x8da5cb5b
    async owner (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'owner'));
    }

    // 0x1175a1dd
    async pendingCake (_pid: bigint, _user: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'pendingCake'), _pid, _user);
    }

    // 0x1526fe27
    async poolInfo (input0: bigint): Promise<{ lpToken: TAddress, allocPoint: bigint, lastRewardBlock: bigint, accCakePerShare: bigint }> {
        return this.$read(this.$getAbiItem('function', 'poolInfo'), input0);
    }

    // 0x081e3eda
    async poolLength (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'poolLength'));
    }

    // 0x715018a6
    async renounceOwnership (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'renounceOwnership'), sender);
    }

    // 0x64482f79
    async set (sender: TSender, _pid: bigint, _allocPoint: bigint, _withUpdate: boolean): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'set'), sender, _pid, _allocPoint, _withUpdate);
    }

    // 0x23cf3118
    async setMigrator (sender: TSender, _migrator: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setMigrator'), sender, _migrator);
    }

    // 0x48cd4cb1
    async startBlock (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'startBlock'));
    }

    // 0x86a952c4
    async syrup (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'syrup'));
    }

    // 0x17caf6f1
    async totalAllocPoint (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'totalAllocPoint'));
    }

    // 0xf2fde38b
    async transferOwnership (sender: TSender, newOwner: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'transferOwnership'), sender, newOwner);
    }

    // 0x5ffe6146
    async updateMultiplier (sender: TSender, multiplierNumber: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'updateMultiplier'), sender, multiplierNumber);
    }

    // 0x51eb05a6
    async updatePool (sender: TSender, _pid: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'updatePool'), sender, _pid);
    }

    // 0x93f1a40b
    async userInfo (input0: bigint, input1: TAddress): Promise<{ amount: bigint, rewardDebt: bigint }> {
        return this.$read(this.$getAbiItem('function', 'userInfo'), input0, input1);
    }

    // 0x441a3e70
    async withdraw (sender: TSender, _pid: bigint, _amount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'withdraw'), sender, _pid, _amount);
    }

    $call () {
        return super.$call() as IAmmMasterChefV2ContractTxCaller;
    }
    $signed (): TOverrideReturns<IAmmMasterChefV2ContractTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IAmmMasterChefV2ContractTxData {
        return super.$data() as IAmmMasterChefV2ContractTxData;
    }
    $gas (): TOverrideReturns<IAmmMasterChefV2ContractTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TAmmMasterChefV2ContractTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TAmmMasterChefV2ContractTypes['Methods'][TMethod]['arguments']
        }
    }> {
        options ??= {};
        options.filter ??= {};
        options.filter.method = method;
        return <any> this.$onTransaction(options);
    }

    onLog (event: keyof TEvents, cb?: (event: TClientEventsStreamData) => void): ClientEventsStream<TClientEventsStreamData> {
        return this.$onLog(event, cb);
    }

    async getPastLogs <TEventName extends keyof TEvents> (
        events: TEventName[]
        , options?: TEventLogOptions<TEventParams<TEventName>>
    ): Promise<ITxLogItem<TEventParams<TEventName>, TEventName>[]>
    async getPastLogs <TEventName extends keyof TEvents> (
        event: TEventName
        , options?: TEventLogOptions<TEventParams<TEventName>>
    ): Promise<ITxLogItem<TEventParams<TEventName>, TEventName>[]>
    async getPastLogs (mix: any, options?): Promise<any> {
        return await super.getPastLogs(mix, options) as any;
    }

    onDeposit (fn?: (event: TClientEventsStreamData<TEventArguments<'Deposit'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Deposit'>>> {
        return this.$onLog('Deposit', fn);
    }

    onEmergencyWithdraw (fn?: (event: TClientEventsStreamData<TEventArguments<'EmergencyWithdraw'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'EmergencyWithdraw'>>> {
        return this.$onLog('EmergencyWithdraw', fn);
    }

    onOwnershipTransferred (fn?: (event: TClientEventsStreamData<TEventArguments<'OwnershipTransferred'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'OwnershipTransferred'>>> {
        return this.$onLog('OwnershipTransferred', fn);
    }

    onWithdraw (fn?: (event: TClientEventsStreamData<TEventArguments<'Withdraw'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Withdraw'>>> {
        return this.$onLog('Withdraw', fn);
    }

    extractLogsDeposit (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Deposit'>>[] {
        let abi = this.$getAbiItem('event', 'Deposit');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Deposit'>>[];
    }

    extractLogsEmergencyWithdraw (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'EmergencyWithdraw'>>[] {
        let abi = this.$getAbiItem('event', 'EmergencyWithdraw');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'EmergencyWithdraw'>>[];
    }

    extractLogsOwnershipTransferred (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'OwnershipTransferred'>>[] {
        let abi = this.$getAbiItem('event', 'OwnershipTransferred');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'OwnershipTransferred'>>[];
    }

    extractLogsWithdraw (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Withdraw'>>[] {
        let abi = this.$getAbiItem('event', 'Withdraw');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Withdraw'>>[];
    }

    async getPastLogsDeposit (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { user?: TAddress,pid?: bigint }
    }): Promise<ITxLogItem<TEventParams<'Deposit'>>[]> {
        return await this.$getPastLogsParsed('Deposit', options) as any;
    }

    async getPastLogsEmergencyWithdraw (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { user?: TAddress,pid?: bigint }
    }): Promise<ITxLogItem<TEventParams<'EmergencyWithdraw'>>[]> {
        return await this.$getPastLogsParsed('EmergencyWithdraw', options) as any;
    }

    async getPastLogsOwnershipTransferred (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { previousOwner?: TAddress,newOwner?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'OwnershipTransferred'>>[]> {
        return await this.$getPastLogsParsed('OwnershipTransferred', options) as any;
    }

    async getPastLogsWithdraw (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { user?: TAddress,pid?: bigint }
    }): Promise<ITxLogItem<TEventParams<'Withdraw'>>[]> {
        return await this.$getPastLogsParsed('Withdraw', options) as any;
    }

    abi: TAbiItem[] = [{"inputs":[{"internalType":"contract CakeToken","name":"_cake","type":"address"},{"internalType":"contract SyrupBar","name":"_syrup","type":"address"},{"internalType":"address","name":"_devaddr","type":"address"},{"internalType":"uint256","name":"_cakePerBlock","type":"uint256"},{"internalType":"uint256","name":"_startBlock","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EmergencyWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"BONUS_MULTIPLIER","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_allocPoint","type":"uint256"},{"internalType":"contract IBEP20","name":"_lpToken","type":"address"},{"internalType":"bool","name":"_withUpdate","type":"bool"}],"name":"add","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"cake","outputs":[{"internalType":"contract CakeToken","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"cakePerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_devaddr","type":"address"}],"name":"dev","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"devaddr","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"enterStaking","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_from","type":"uint256"},{"internalType":"uint256","name":"_to","type":"uint256"}],"name":"getMultiplier","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"leaveStaking","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"massUpdatePools","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"migrate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"migrator","outputs":[{"internalType":"contract IMigratorChef","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_user","type":"address"}],"name":"pendingCake","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"poolInfo","outputs":[{"internalType":"contract IBEP20","name":"lpToken","type":"address"},{"internalType":"uint256","name":"allocPoint","type":"uint256"},{"internalType":"uint256","name":"lastRewardBlock","type":"uint256"},{"internalType":"uint256","name":"accCakePerShare","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"poolLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_allocPoint","type":"uint256"},{"internalType":"bool","name":"_withUpdate","type":"bool"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IMigratorChef","name":"_migrator","type":"address"}],"name":"setMigrator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"syrup","outputs":[{"internalType":"contract SyrupBar","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalAllocPoint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"multiplierNumber","type":"uint256"}],"name":"updateMultiplier","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"updatePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"userInfo","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"rewardDebt","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]

    declare storage: AmmMasterChefV2ContractStorageReader
}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TAmmMasterChefV2ContractTypes = {
    Events: {
        Deposit: {
            outputParams: { user: TAddress, pid: bigint, amount: bigint },
            outputArgs:   [ user: TAddress, pid: bigint, amount: bigint ],
        }
        EmergencyWithdraw: {
            outputParams: { user: TAddress, pid: bigint, amount: bigint },
            outputArgs:   [ user: TAddress, pid: bigint, amount: bigint ],
        }
        OwnershipTransferred: {
            outputParams: { previousOwner: TAddress, newOwner: TAddress },
            outputArgs:   [ previousOwner: TAddress, newOwner: TAddress ],
        }
        Withdraw: {
            outputParams: { user: TAddress, pid: bigint, amount: bigint },
            outputArgs:   [ user: TAddress, pid: bigint, amount: bigint ],
        }
    },
    Methods: {
        BONUS_MULTIPLIER: {
          method: "BONUS_MULTIPLIER"
          arguments: [  ]
        }
        add: {
          method: "add"
          arguments: [ _allocPoint: bigint, _lpToken: TAddress, _withUpdate: boolean ]
        }
        cake: {
          method: "cake"
          arguments: [  ]
        }
        cakePerBlock: {
          method: "cakePerBlock"
          arguments: [  ]
        }
        deposit: {
          method: "deposit"
          arguments: [ _pid: bigint, _amount: bigint ]
        }
        dev: {
          method: "dev"
          arguments: [ _devaddr: TAddress ]
        }
        devaddr: {
          method: "devaddr"
          arguments: [  ]
        }
        emergencyWithdraw: {
          method: "emergencyWithdraw"
          arguments: [ _pid: bigint ]
        }
        enterStaking: {
          method: "enterStaking"
          arguments: [ _amount: bigint ]
        }
        getMultiplier: {
          method: "getMultiplier"
          arguments: [ _from: bigint, _to: bigint ]
        }
        leaveStaking: {
          method: "leaveStaking"
          arguments: [ _amount: bigint ]
        }
        massUpdatePools: {
          method: "massUpdatePools"
          arguments: [  ]
        }
        migrate: {
          method: "migrate"
          arguments: [ _pid: bigint ]
        }
        migrator: {
          method: "migrator"
          arguments: [  ]
        }
        owner: {
          method: "owner"
          arguments: [  ]
        }
        pendingCake: {
          method: "pendingCake"
          arguments: [ _pid: bigint, _user: TAddress ]
        }
        poolInfo: {
          method: "poolInfo"
          arguments: [ input0: bigint ]
        }
        poolLength: {
          method: "poolLength"
          arguments: [  ]
        }
        renounceOwnership: {
          method: "renounceOwnership"
          arguments: [  ]
        }
        set: {
          method: "set"
          arguments: [ _pid: bigint, _allocPoint: bigint, _withUpdate: boolean ]
        }
        setMigrator: {
          method: "setMigrator"
          arguments: [ _migrator: TAddress ]
        }
        startBlock: {
          method: "startBlock"
          arguments: [  ]
        }
        syrup: {
          method: "syrup"
          arguments: [  ]
        }
        totalAllocPoint: {
          method: "totalAllocPoint"
          arguments: [  ]
        }
        transferOwnership: {
          method: "transferOwnership"
          arguments: [ newOwner: TAddress ]
        }
        updateMultiplier: {
          method: "updateMultiplier"
          arguments: [ multiplierNumber: bigint ]
        }
        updatePool: {
          method: "updatePool"
          arguments: [ _pid: bigint ]
        }
        userInfo: {
          method: "userInfo"
          arguments: [ input0: bigint, input1: TAddress ]
        }
        withdraw: {
          method: "withdraw"
          arguments: [ _pid: bigint, _amount: bigint ]
        }
    }
}



class AmmMasterChefV2ContractStorageReader extends ContractStorageReaderBase {
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

    async cake(): Promise<TAddress> {
        return this.$storage.get(['cake', ]);
    }

    async syrup(): Promise<TAddress> {
        return this.$storage.get(['syrup', ]);
    }

    async devaddr(): Promise<TAddress> {
        return this.$storage.get(['devaddr', ]);
    }

    async cakePerBlock(): Promise<bigint> {
        return this.$storage.get(['cakePerBlock', ]);
    }

    async BONUS_MULTIPLIER(): Promise<bigint> {
        return this.$storage.get(['BONUS_MULTIPLIER', ]);
    }

    async migrator(): Promise<TAddress> {
        return this.$storage.get(['migrator', ]);
    }

    async poolInfo(): Promise<{ lpToken: TAddress, allocPoint: bigint, lastRewardBlock: bigint, accCakePerShare: bigint }[]> {
        return this.$storage.get(['poolInfo', ]);
    }

    async userInfo(key: bigint): Promise<Record<string | number, { amount: bigint, rewardDebt: bigint }>> {
        return this.$storage.get(['userInfo', key]);
    }

    async totalAllocPoint(): Promise<bigint> {
        return this.$storage.get(['totalAllocPoint', ]);
    }

    async startBlock(): Promise<bigint> {
        return this.$storage.get(['startBlock', ]);
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
        "slot": 1,
        "position": 0,
        "name": "cake",
        "size": 160,
        "type": "address"
    },
    {
        "slot": 2,
        "position": 0,
        "name": "syrup",
        "size": 160,
        "type": "address"
    },
    {
        "slot": 3,
        "position": 0,
        "name": "devaddr",
        "size": 160,
        "type": "address"
    },
    {
        "slot": 4,
        "position": 0,
        "name": "cakePerBlock",
        "size": 256,
        "type": "uint256"
    },
    {
        "slot": 5,
        "position": 0,
        "name": "BONUS_MULTIPLIER",
        "size": 256,
        "type": "uint256"
    },
    {
        "slot": 6,
        "position": 0,
        "name": "migrator",
        "size": 160,
        "type": "address"
    },
    {
        "slot": 7,
        "position": 0,
        "name": "poolInfo",
        "size": null,
        "type": "(address lpToken, uint256 allocPoint, uint256 lastRewardBlock, uint256 accCakePerShare)[]"
    },
    {
        "slot": 8,
        "position": 0,
        "name": "userInfo",
        "size": null,
        "type": "mapping(uint256 => mapping(address => (uint256 amount, uint256 rewardDebt)))"
    },
    {
        "slot": 9,
        "position": 0,
        "name": "totalAllocPoint",
        "size": 256,
        "type": "uint256"
    },
    {
        "slot": 10,
        "position": 0,
        "name": "startBlock",
        "size": 256,
        "type": "uint256"
    }
]

}


interface IAmmMasterChefV2ContractTxCaller {
    add (sender: TSender, _allocPoint: bigint, _lpToken: TAddress, _withUpdate: boolean): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    deposit (sender: TSender, _pid: bigint, _amount: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    dev (sender: TSender, _devaddr: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    emergencyWithdraw (sender: TSender, _pid: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    enterStaking (sender: TSender, _amount: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    leaveStaking (sender: TSender, _amount: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    massUpdatePools (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    migrate (sender: TSender, _pid: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    renounceOwnership (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    set (sender: TSender, _pid: bigint, _allocPoint: bigint, _withUpdate: boolean): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setMigrator (sender: TSender, _migrator: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    transferOwnership (sender: TSender, newOwner: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    updateMultiplier (sender: TSender, multiplierNumber: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    updatePool (sender: TSender, _pid: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    withdraw (sender: TSender, _pid: bigint, _amount: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IAmmMasterChefV2ContractTxData {
    add (sender: TSender, _allocPoint: bigint, _lpToken: TAddress, _withUpdate: boolean): Promise<TEth.TxLike>
    deposit (sender: TSender, _pid: bigint, _amount: bigint): Promise<TEth.TxLike>
    dev (sender: TSender, _devaddr: TAddress): Promise<TEth.TxLike>
    emergencyWithdraw (sender: TSender, _pid: bigint): Promise<TEth.TxLike>
    enterStaking (sender: TSender, _amount: bigint): Promise<TEth.TxLike>
    leaveStaking (sender: TSender, _amount: bigint): Promise<TEth.TxLike>
    massUpdatePools (sender: TSender, ): Promise<TEth.TxLike>
    migrate (sender: TSender, _pid: bigint): Promise<TEth.TxLike>
    renounceOwnership (sender: TSender, ): Promise<TEth.TxLike>
    set (sender: TSender, _pid: bigint, _allocPoint: bigint, _withUpdate: boolean): Promise<TEth.TxLike>
    setMigrator (sender: TSender, _migrator: TAddress): Promise<TEth.TxLike>
    transferOwnership (sender: TSender, newOwner: TAddress): Promise<TEth.TxLike>
    updateMultiplier (sender: TSender, multiplierNumber: bigint): Promise<TEth.TxLike>
    updatePool (sender: TSender, _pid: bigint): Promise<TEth.TxLike>
    withdraw (sender: TSender, _pid: bigint, _amount: bigint): Promise<TEth.TxLike>
}


type TEvents = TAmmMasterChefV2ContractTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;
