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
import { IBlockchainExplorer } from '@dequanto/explorer/IBlockchainExplorer';
import { SubjectStream } from '@dequanto/class/SubjectStream';


import type { ContractWriter } from '@dequanto/contracts/ContractWriter';
import type { TAbiItem } from '@dequanto/types/TAbi';
import type { TEth } from '@dequanto/models/TEth';
import type { TOverrideReturns } from '@dequanto/utils/types';


import { Etherscan } from '@dequanto/explorer/Etherscan'
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client'



export class IERC1820Registry extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockchainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)


    }

    Types: TIERC1820RegistryTypes;

    $meta = {
        "class": "./src/prebuilt/openzeppelin/IERC1820Registry.ts"
    }

    // 0xaabbb8ca
    async getInterfaceImplementer (account: TAddress, _interfaceHash: TEth.Hex): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'getInterfaceImplementer'), account, _interfaceHash);
    }

    // 0x3d584063
    async getManager (account: TAddress): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'getManager'), account);
    }

    // 0xf712f3e8
    async implementsERC165Interface (account: TAddress, interfaceId: TEth.Hex): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'implementsERC165Interface'), account, interfaceId);
    }

    // 0xb7056765
    async implementsERC165InterfaceNoCache (account: TAddress, interfaceId: TEth.Hex): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'implementsERC165InterfaceNoCache'), account, interfaceId);
    }

    // 0x65ba36c1
    async interfaceHash (interfaceName: string): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'interfaceHash'), interfaceName);
    }

    // 0x29965a1d
    async setInterfaceImplementer (sender: TSender, account: TAddress, _interfaceHash: TEth.Hex, implementer: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setInterfaceImplementer'), sender, account, _interfaceHash, implementer);
    }

    // 0x5df8122f
    async setManager (sender: TSender, account: TAddress, newManager: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setManager'), sender, account, newManager);
    }

    // 0xa41e7d51
    async updateERC165Cache (sender: TSender, account: TAddress, interfaceId: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'updateERC165Cache'), sender, account, interfaceId);
    }

    $call () {
        return super.$call() as IIERC1820RegistryTxCaller;
    }
    $signed (): TOverrideReturns<IIERC1820RegistryTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IIERC1820RegistryTxData {
        return super.$data() as IIERC1820RegistryTxData;
    }
    $gas (): TOverrideReturns<IIERC1820RegistryTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TIERC1820RegistryTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TIERC1820RegistryTypes['Methods'][TMethod]['arguments']
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

    onInterfaceImplementerSet (fn?: (event: TClientEventsStreamData<TEventArguments<'InterfaceImplementerSet'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'InterfaceImplementerSet'>>> {
        return this.$onLog('InterfaceImplementerSet', fn);
    }

    onManagerChanged (fn?: (event: TClientEventsStreamData<TEventArguments<'ManagerChanged'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'ManagerChanged'>>> {
        return this.$onLog('ManagerChanged', fn);
    }

    extractLogsInterfaceImplementerSet (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'InterfaceImplementerSet'>>[] {
        let abi = this.$getAbiItem('event', 'InterfaceImplementerSet');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'InterfaceImplementerSet'>>[];
    }

    extractLogsManagerChanged (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ManagerChanged'>>[] {
        let abi = this.$getAbiItem('event', 'ManagerChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ManagerChanged'>>[];
    }

    async getPastLogsInterfaceImplementerSet (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { account?: TAddress,interfaceHash?: TEth.Hex,implementer?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'InterfaceImplementerSet'>>[]> {
        return await this.$getPastLogsParsed('InterfaceImplementerSet', options) as any;
    }

    async getPastLogsManagerChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { account?: TAddress,newManager?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'ManagerChanged'>>[]> {
        return await this.$getPastLogsParsed('ManagerChanged', options) as any;
    }

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"bytes32","name":"interfaceHash","type":"bytes32"},{"indexed":true,"internalType":"address","name":"implementer","type":"address"}],"name":"InterfaceImplementerSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"newManager","type":"address"}],"name":"ManagerChanged","type":"event"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bytes32","name":"_interfaceHash","type":"bytes32"}],"name":"getInterfaceImplementer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getManager","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"implementsERC165Interface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"implementsERC165InterfaceNoCache","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"interfaceName","type":"string"}],"name":"interfaceHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bytes32","name":"_interfaceHash","type":"bytes32"},{"internalType":"address","name":"implementer","type":"address"}],"name":"setInterfaceImplementer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"newManager","type":"address"}],"name":"setManager","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"updateERC165Cache","outputs":[],"stateMutability":"nonpayable","type":"function"}]


}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TIERC1820RegistryTypes = {
    Events: {
        InterfaceImplementerSet: {
            outputParams: { account: TAddress, interfaceHash: TEth.Hex, implementer: TAddress },
            outputArgs:   [ account: TAddress, interfaceHash: TEth.Hex, implementer: TAddress ],
        }
        ManagerChanged: {
            outputParams: { account: TAddress, newManager: TAddress },
            outputArgs:   [ account: TAddress, newManager: TAddress ],
        }
    },
    Methods: {
        getInterfaceImplementer: {
          method: "getInterfaceImplementer"
          arguments: [ account: TAddress, _interfaceHash: TEth.Hex ]
        }
        getManager: {
          method: "getManager"
          arguments: [ account: TAddress ]
        }
        implementsERC165Interface: {
          method: "implementsERC165Interface"
          arguments: [ account: TAddress, interfaceId: TEth.Hex ]
        }
        implementsERC165InterfaceNoCache: {
          method: "implementsERC165InterfaceNoCache"
          arguments: [ account: TAddress, interfaceId: TEth.Hex ]
        }
        interfaceHash: {
          method: "interfaceHash"
          arguments: [ interfaceName: string ]
        }
        setInterfaceImplementer: {
          method: "setInterfaceImplementer"
          arguments: [ account: TAddress, _interfaceHash: TEth.Hex, implementer: TAddress ]
        }
        setManager: {
          method: "setManager"
          arguments: [ account: TAddress, newManager: TAddress ]
        }
        updateERC165Cache: {
          method: "updateERC165Cache"
          arguments: [ account: TAddress, interfaceId: TEth.Hex ]
        }
    }
}



interface IIERC1820RegistryTxCaller {
    setInterfaceImplementer (sender: TSender, account: TAddress, _interfaceHash: TEth.Hex, implementer: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setManager (sender: TSender, account: TAddress, newManager: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    updateERC165Cache (sender: TSender, account: TAddress, interfaceId: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IIERC1820RegistryTxData {
    setInterfaceImplementer (sender: TSender, account: TAddress, _interfaceHash: TEth.Hex, implementer: TAddress): Promise<TEth.TxLike>
    setManager (sender: TSender, account: TAddress, newManager: TAddress): Promise<TEth.TxLike>
    updateERC165Cache (sender: TSender, account: TAddress, interfaceId: TEth.Hex): Promise<TEth.TxLike>
}


type TEvents = TIERC1820RegistryTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;
