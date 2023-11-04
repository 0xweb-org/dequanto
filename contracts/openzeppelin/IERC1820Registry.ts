/**
 *  AUTO-Generated Class: 2023-10-05 18:18
 *  Implementation: https://etherscan.io/address/undefined#code
 */
import di from 'a-di';
import { TAddress } from '@dequanto/models/TAddress';
import { TAccount } from '@dequanto/models/TAccount';
import { TBufferLike } from '@dequanto/models/TBufferLike';
import { ClientEventsStream, TClientEventsStreamData } from '@dequanto/clients/ClientEventsStream';
import { ContractBase, ContractBaseHelper } from '@dequanto/contracts/ContractBase';
import { ContractStorageReaderBase } from '@dequanto/contracts/ContractStorageReaderBase';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { ITxLogItem } from '@dequanto/txs/receipt/ITxLogItem';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IBlockChainExplorer } from '@dequanto/explorer/IBlockChainExplorer';
import { SubjectStream } from '@dequanto/class/SubjectStream';


import type { ContractWriter } from '@dequanto/contracts/ContractWriter';
import type { TAbiItem } from '@dequanto/types/TAbi';
import type { TEth } from '@dequanto/models/TEth';


import { Etherscan } from '@dequanto/explorer/Etherscan'
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client'



export class IERC1820Registry extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)
    }

    // 0xaabbb8ca
    async getInterfaceImplementer (account: TAddress, _interfaceHash: TBufferLike): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'getInterfaceImplementer'), account, _interfaceHash);
    }

    // 0x3d584063
    async getManager (account: TAddress): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'getManager'), account);
    }

    // 0xf712f3e8
    async implementsERC165Interface (account: TAddress, interfaceId: TBufferLike): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'implementsERC165Interface'), account, interfaceId);
    }

    // 0xb7056765
    async implementsERC165InterfaceNoCache (account: TAddress, interfaceId: TBufferLike): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'implementsERC165InterfaceNoCache'), account, interfaceId);
    }

    // 0x65ba36c1
    async interfaceHash (interfaceName: string): Promise<TBufferLike> {
        return this.$read(this.$getAbiItem('function', 'interfaceHash'), interfaceName);
    }

    // 0x29965a1d
    async setInterfaceImplementer (sender: TSender, account: TAddress, _interfaceHash: TBufferLike, implementer: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setInterfaceImplementer'), sender, account, _interfaceHash, implementer);
    }

    // 0x5df8122f
    async setManager (sender: TSender, account: TAddress, newManager: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setManager'), sender, account, newManager);
    }

    // 0xa41e7d51
    async updateERC165Cache (sender: TSender, account: TAddress, interfaceId: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'updateERC165Cache'), sender, account, interfaceId);
    }

    $call () {
        return super.$call() as IIERC1820RegistryTxCaller;;
    }

    $data (): IIERC1820RegistryTxData {
        return super.$data() as IIERC1820RegistryTxData;
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

    onInterfaceImplementerSet (fn?: (event: TClientEventsStreamData<TLogInterfaceImplementerSetParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogInterfaceImplementerSetParameters>> {
        return this.$onLog('InterfaceImplementerSet', fn);
    }

    onManagerChanged (fn?: (event: TClientEventsStreamData<TLogManagerChangedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogManagerChangedParameters>> {
        return this.$onLog('ManagerChanged', fn);
    }

    extractLogsInterfaceImplementerSet (tx: TEth.TxReceipt): ITxLogItem<TLogInterfaceImplementerSet>[] {
        let abi = this.$getAbiItem('event', 'InterfaceImplementerSet');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogInterfaceImplementerSet>[];
    }

    extractLogsManagerChanged (tx: TEth.TxReceipt): ITxLogItem<TLogManagerChanged>[] {
        let abi = this.$getAbiItem('event', 'ManagerChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogManagerChanged>[];
    }

    async getPastLogsInterfaceImplementerSet (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { account?: TAddress,interfaceHash?: TBufferLike,implementer?: TAddress }
    }): Promise<ITxLogItem<TLogInterfaceImplementerSet>[]> {
        return await this.$getPastLogsParsed('InterfaceImplementerSet', options) as any;
    }

    async getPastLogsManagerChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { account?: TAddress,newManager?: TAddress }
    }): Promise<ITxLogItem<TLogManagerChanged>[]> {
        return await this.$getPastLogsParsed('ManagerChanged', options) as any;
    }

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"bytes32","name":"interfaceHash","type":"bytes32"},{"indexed":true,"internalType":"address","name":"implementer","type":"address"}],"name":"InterfaceImplementerSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"newManager","type":"address"}],"name":"ManagerChanged","type":"event"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bytes32","name":"_interfaceHash","type":"bytes32"}],"name":"getInterfaceImplementer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getManager","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"implementsERC165Interface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"implementsERC165InterfaceNoCache","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"interfaceName","type":"string"}],"name":"interfaceHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bytes32","name":"_interfaceHash","type":"bytes32"},{"internalType":"address","name":"implementer","type":"address"}],"name":"setInterfaceImplementer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"newManager","type":"address"}],"name":"setManager","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"updateERC165Cache","outputs":[],"stateMutability":"nonpayable","type":"function"}]


}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogInterfaceImplementerSet = {
        account: TAddress, interfaceHash: TBufferLike, implementer: TAddress
    };
    type TLogInterfaceImplementerSetParameters = [ account: TAddress, interfaceHash: TBufferLike, implementer: TAddress ];
    type TLogManagerChanged = {
        account: TAddress, newManager: TAddress
    };
    type TLogManagerChangedParameters = [ account: TAddress, newManager: TAddress ];

interface IEvents {
  InterfaceImplementerSet: TLogInterfaceImplementerSetParameters
  ManagerChanged: TLogManagerChangedParameters
  '*': any[]
}



interface IMethodGetInterfaceImplementer {
  method: "getInterfaceImplementer"
  arguments: [ account: TAddress, _interfaceHash: TBufferLike ]
}

interface IMethodGetManager {
  method: "getManager"
  arguments: [ account: TAddress ]
}

interface IMethodImplementsERC165Interface {
  method: "implementsERC165Interface"
  arguments: [ account: TAddress, interfaceId: TBufferLike ]
}

interface IMethodImplementsERC165InterfaceNoCache {
  method: "implementsERC165InterfaceNoCache"
  arguments: [ account: TAddress, interfaceId: TBufferLike ]
}

interface IMethodInterfaceHash {
  method: "interfaceHash"
  arguments: [ interfaceName: string ]
}

interface IMethodSetInterfaceImplementer {
  method: "setInterfaceImplementer"
  arguments: [ account: TAddress, _interfaceHash: TBufferLike, implementer: TAddress ]
}

interface IMethodSetManager {
  method: "setManager"
  arguments: [ account: TAddress, newManager: TAddress ]
}

interface IMethodUpdateERC165Cache {
  method: "updateERC165Cache"
  arguments: [ account: TAddress, interfaceId: TBufferLike ]
}

interface IMethods {
  getInterfaceImplementer: IMethodGetInterfaceImplementer
  getManager: IMethodGetManager
  implementsERC165Interface: IMethodImplementsERC165Interface
  implementsERC165InterfaceNoCache: IMethodImplementsERC165InterfaceNoCache
  interfaceHash: IMethodInterfaceHash
  setInterfaceImplementer: IMethodSetInterfaceImplementer
  setManager: IMethodSetManager
  updateERC165Cache: IMethodUpdateERC165Cache
  '*': { method: string, arguments: any[] }
}






interface IIERC1820RegistryTxCaller {
    setInterfaceImplementer (sender: TSender, account: TAddress, _interfaceHash: TBufferLike, implementer: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setManager (sender: TSender, account: TAddress, newManager: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    updateERC165Cache (sender: TSender, account: TAddress, interfaceId: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IIERC1820RegistryTxData {
    setInterfaceImplementer (sender: TSender, account: TAddress, _interfaceHash: TBufferLike, implementer: TAddress): Promise<TEth.TxLike>
    setManager (sender: TSender, account: TAddress, newManager: TAddress): Promise<TEth.TxLike>
    updateERC165Cache (sender: TSender, account: TAddress, interfaceId: TBufferLike): Promise<TEth.TxLike>
}


