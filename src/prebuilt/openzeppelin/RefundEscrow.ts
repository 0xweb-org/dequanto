/**
 *  AUTO-Generated Class: 2024-05-17 00:25
 *  Implementation: https://etherscan.io/address/undefined#code
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


import { Etherscan } from '@dequanto/explorer/Etherscan'
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client'



export class RefundEscrow extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        
    }

    Types: TRefundEscrowTypes;

    $meta = {
        "class": "./src/prebuilt/openzeppelin/RefundEscrow.ts"
    }

    async $constructor (deployer: TSender, beneficiary_: TAddress): Promise<TxWriter> {
        throw new Error('Not implemented. Typing purpose. Use the ContractDeployer class to deploy the contract');
    }

    // 0x38af3eed
    async beneficiary (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'beneficiary'));
    }

    // 0x9af6549a
    async beneficiaryWithdraw (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'beneficiaryWithdraw'), sender);
    }

    // 0x43d726d6
    async close (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'close'), sender);
    }

    // 0xf340fa01
    async deposit (sender: TSender, refundee: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'deposit'), sender, refundee);
    }

    // 0xe3a9db1a
    async depositsOf (payee: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'depositsOf'), payee);
    }

    // 0x8c52dc41
    async enableRefunds (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'enableRefunds'), sender);
    }

    // 0x8da5cb5b
    async owner (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'owner'));
    }

    // 0x715018a6
    async renounceOwnership (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'renounceOwnership'), sender);
    }

    // 0xc19d93fb
    async state (): Promise<number> {
        return this.$read(this.$getAbiItem('function', 'state'));
    }

    // 0xf2fde38b
    async transferOwnership (sender: TSender, newOwner: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'transferOwnership'), sender, newOwner);
    }

    // 0x51cff8d9
    async withdraw (sender: TSender, payee: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'withdraw'), sender, payee);
    }

    // 0x685ca194
    async withdrawalAllowed (input0: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'withdrawalAllowed'), input0);
    }

    $call () {
        return super.$call() as IRefundEscrowTxCaller;
    }
    $signed (): TOverrideReturns<IRefundEscrowTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IRefundEscrowTxData {
        return super.$data() as IRefundEscrowTxData;
    }
    $gas (): TOverrideReturns<IRefundEscrowTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TRefundEscrowTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TRefundEscrowTypes['Methods'][TMethod]['arguments']
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

    onDeposited (fn?: (event: TClientEventsStreamData<TEventArguments<'Deposited'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Deposited'>>> {
        return this.$onLog('Deposited', fn);
    }

    onOwnershipTransferred (fn?: (event: TClientEventsStreamData<TEventArguments<'OwnershipTransferred'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'OwnershipTransferred'>>> {
        return this.$onLog('OwnershipTransferred', fn);
    }

    onRefundsClosed (fn?: (event: TClientEventsStreamData<TEventArguments<'RefundsClosed'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'RefundsClosed'>>> {
        return this.$onLog('RefundsClosed', fn);
    }

    onRefundsEnabled (fn?: (event: TClientEventsStreamData<TEventArguments<'RefundsEnabled'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'RefundsEnabled'>>> {
        return this.$onLog('RefundsEnabled', fn);
    }

    onWithdrawn (fn?: (event: TClientEventsStreamData<TEventArguments<'Withdrawn'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Withdrawn'>>> {
        return this.$onLog('Withdrawn', fn);
    }

    extractLogsDeposited (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Deposited'>>[] {
        let abi = this.$getAbiItem('event', 'Deposited');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Deposited'>>[];
    }

    extractLogsOwnershipTransferred (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'OwnershipTransferred'>>[] {
        let abi = this.$getAbiItem('event', 'OwnershipTransferred');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'OwnershipTransferred'>>[];
    }

    extractLogsRefundsClosed (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'RefundsClosed'>>[] {
        let abi = this.$getAbiItem('event', 'RefundsClosed');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'RefundsClosed'>>[];
    }

    extractLogsRefundsEnabled (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'RefundsEnabled'>>[] {
        let abi = this.$getAbiItem('event', 'RefundsEnabled');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'RefundsEnabled'>>[];
    }

    extractLogsWithdrawn (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Withdrawn'>>[] {
        let abi = this.$getAbiItem('event', 'Withdrawn');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Withdrawn'>>[];
    }

    async getPastLogsDeposited (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { payee?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'Deposited'>>[]> {
        return await this.$getPastLogsParsed('Deposited', options) as any;
    }

    async getPastLogsOwnershipTransferred (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { previousOwner?: TAddress,newOwner?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'OwnershipTransferred'>>[]> {
        return await this.$getPastLogsParsed('OwnershipTransferred', options) as any;
    }

    async getPastLogsRefundsClosed (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'RefundsClosed'>>[]> {
        return await this.$getPastLogsParsed('RefundsClosed', options) as any;
    }

    async getPastLogsRefundsEnabled (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'RefundsEnabled'>>[]> {
        return await this.$getPastLogsParsed('RefundsEnabled', options) as any;
    }

    async getPastLogsWithdrawn (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { payee?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'Withdrawn'>>[]> {
        return await this.$getPastLogsParsed('Withdrawn', options) as any;
    }

    abi: TAbiItem[] = [{"inputs":[{"internalType":"address payable","name":"beneficiary_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"payee","type":"address"},{"indexed":false,"internalType":"uint256","name":"weiAmount","type":"uint256"}],"name":"Deposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[],"name":"RefundsClosed","type":"event"},{"anonymous":false,"inputs":[],"name":"RefundsEnabled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"payee","type":"address"},{"indexed":false,"internalType":"uint256","name":"weiAmount","type":"uint256"}],"name":"Withdrawn","type":"event"},{"inputs":[],"name":"beneficiary","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"beneficiaryWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"close","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"refundee","type":"address"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"payee","type":"address"}],"name":"depositsOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"enableRefunds","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"state","outputs":[{"internalType":"enum RefundEscrow.State","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"payee","type":"address"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"withdrawalAllowed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TRefundEscrowTypes = {
    Events: {
        Deposited: {
            outputParams: { payee: TAddress, weiAmount: bigint },
            outputArgs:   [ payee: TAddress, weiAmount: bigint ],
        }
        OwnershipTransferred: {
            outputParams: { previousOwner: TAddress, newOwner: TAddress },
            outputArgs:   [ previousOwner: TAddress, newOwner: TAddress ],
        }
        RefundsClosed: {
            outputParams: {  },
            outputArgs:   [  ],
        }
        RefundsEnabled: {
            outputParams: {  },
            outputArgs:   [  ],
        }
        Withdrawn: {
            outputParams: { payee: TAddress, weiAmount: bigint },
            outputArgs:   [ payee: TAddress, weiAmount: bigint ],
        }
    },
    Methods: {
        beneficiary: {
          method: "beneficiary"
          arguments: [  ]
        }
        beneficiaryWithdraw: {
          method: "beneficiaryWithdraw"
          arguments: [  ]
        }
        close: {
          method: "close"
          arguments: [  ]
        }
        deposit: {
          method: "deposit"
          arguments: [ refundee: TAddress ]
        }
        depositsOf: {
          method: "depositsOf"
          arguments: [ payee: TAddress ]
        }
        enableRefunds: {
          method: "enableRefunds"
          arguments: [  ]
        }
        owner: {
          method: "owner"
          arguments: [  ]
        }
        renounceOwnership: {
          method: "renounceOwnership"
          arguments: [  ]
        }
        state: {
          method: "state"
          arguments: [  ]
        }
        transferOwnership: {
          method: "transferOwnership"
          arguments: [ newOwner: TAddress ]
        }
        withdraw: {
          method: "withdraw"
          arguments: [ payee: TAddress ]
        }
        withdrawalAllowed: {
          method: "withdrawalAllowed"
          arguments: [ input0: TAddress ]
        }
    }
}



interface IRefundEscrowTxCaller {
    beneficiaryWithdraw (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    close (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    deposit (sender: TSender, refundee: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    enableRefunds (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    renounceOwnership (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    transferOwnership (sender: TSender, newOwner: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    withdraw (sender: TSender, payee: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IRefundEscrowTxData {
    beneficiaryWithdraw (sender: TSender, ): Promise<TEth.TxLike>
    close (sender: TSender, ): Promise<TEth.TxLike>
    deposit (sender: TSender, refundee: TAddress): Promise<TEth.TxLike>
    enableRefunds (sender: TSender, ): Promise<TEth.TxLike>
    renounceOwnership (sender: TSender, ): Promise<TEth.TxLike>
    transferOwnership (sender: TSender, newOwner: TAddress): Promise<TEth.TxLike>
    withdraw (sender: TSender, payee: TAddress): Promise<TEth.TxLike>
}


type TEvents = TRefundEscrowTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;
