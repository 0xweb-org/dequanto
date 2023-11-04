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



export class ProxyAdmin extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)
    }

    // 0x7eff275e
    async changeProxyAdmin (sender: TSender, proxy: TAddress, newAdmin: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'changeProxyAdmin'), sender, proxy, newAdmin);
    }

    // 0xf3b7dead
    async getProxyAdmin (proxy: TAddress): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'getProxyAdmin'), proxy);
    }

    // 0x204e1c7a
    async getProxyImplementation (proxy: TAddress): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'getProxyImplementation'), proxy);
    }

    // 0x8da5cb5b
    async owner (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'owner'));
    }

    // 0x715018a6
    async renounceOwnership (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'renounceOwnership'), sender);
    }

    // 0xf2fde38b
    async transferOwnership (sender: TSender, newOwner: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'transferOwnership'), sender, newOwner);
    }

    // 0x99a88ec4
    async upgrade (sender: TSender, proxy: TAddress, implementation: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'upgrade'), sender, proxy, implementation);
    }

    // 0x9623609d
    async upgradeAndCall (sender: TSender, proxy: TAddress, implementation: TAddress, data: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'upgradeAndCall'), sender, proxy, implementation, data);
    }

    $call () {
        return super.$call() as IProxyAdminTxCaller;;
    }

    $data (): IProxyAdminTxData {
        return super.$data() as IProxyAdminTxData;
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

    onOwnershipTransferred (fn?: (event: TClientEventsStreamData<TLogOwnershipTransferredParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogOwnershipTransferredParameters>> {
        return this.$onLog('OwnershipTransferred', fn);
    }

    extractLogsOwnershipTransferred (tx: TEth.TxReceipt): ITxLogItem<TLogOwnershipTransferred>[] {
        let abi = this.$getAbiItem('event', 'OwnershipTransferred');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogOwnershipTransferred>[];
    }

    async getPastLogsOwnershipTransferred (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { previousOwner?: TAddress,newOwner?: TAddress }
    }): Promise<ITxLogItem<TLogOwnershipTransferred>[]> {
        return await this.$getPastLogsParsed('OwnershipTransferred', options) as any;
    }

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"contract ITransparentUpgradeableProxy","name":"proxy","type":"address"},{"internalType":"address","name":"newAdmin","type":"address"}],"name":"changeProxyAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ITransparentUpgradeableProxy","name":"proxy","type":"address"}],"name":"getProxyAdmin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ITransparentUpgradeableProxy","name":"proxy","type":"address"}],"name":"getProxyImplementation","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ITransparentUpgradeableProxy","name":"proxy","type":"address"},{"internalType":"address","name":"implementation","type":"address"}],"name":"upgrade","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ITransparentUpgradeableProxy","name":"proxy","type":"address"},{"internalType":"address","name":"implementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeAndCall","outputs":[],"stateMutability":"payable","type":"function"}]


}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogOwnershipTransferred = {
        previousOwner: TAddress, newOwner: TAddress
    };
    type TLogOwnershipTransferredParameters = [ previousOwner: TAddress, newOwner: TAddress ];

interface IEvents {
  OwnershipTransferred: TLogOwnershipTransferredParameters
  '*': any[]
}



interface IMethodChangeProxyAdmin {
  method: "changeProxyAdmin"
  arguments: [ proxy: TAddress, newAdmin: TAddress ]
}

interface IMethodGetProxyAdmin {
  method: "getProxyAdmin"
  arguments: [ proxy: TAddress ]
}

interface IMethodGetProxyImplementation {
  method: "getProxyImplementation"
  arguments: [ proxy: TAddress ]
}

interface IMethodOwner {
  method: "owner"
  arguments: [  ]
}

interface IMethodRenounceOwnership {
  method: "renounceOwnership"
  arguments: [  ]
}

interface IMethodTransferOwnership {
  method: "transferOwnership"
  arguments: [ newOwner: TAddress ]
}

interface IMethodUpgrade {
  method: "upgrade"
  arguments: [ proxy: TAddress, implementation: TAddress ]
}

interface IMethodUpgradeAndCall {
  method: "upgradeAndCall"
  arguments: [ proxy: TAddress, implementation: TAddress, data: TBufferLike ]
}

interface IMethods {
  changeProxyAdmin: IMethodChangeProxyAdmin
  getProxyAdmin: IMethodGetProxyAdmin
  getProxyImplementation: IMethodGetProxyImplementation
  owner: IMethodOwner
  renounceOwnership: IMethodRenounceOwnership
  transferOwnership: IMethodTransferOwnership
  upgrade: IMethodUpgrade
  upgradeAndCall: IMethodUpgradeAndCall
  '*': { method: string, arguments: any[] }
}






interface IProxyAdminTxCaller {
    changeProxyAdmin (sender: TSender, proxy: TAddress, newAdmin: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    renounceOwnership (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    transferOwnership (sender: TSender, newOwner: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    upgrade (sender: TSender, proxy: TAddress, implementation: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    upgradeAndCall (sender: TSender, proxy: TAddress, implementation: TAddress, data: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IProxyAdminTxData {
    changeProxyAdmin (sender: TSender, proxy: TAddress, newAdmin: TAddress): Promise<TEth.TxLike>
    renounceOwnership (sender: TSender, ): Promise<TEth.TxLike>
    transferOwnership (sender: TSender, newOwner: TAddress): Promise<TEth.TxLike>
    upgrade (sender: TSender, proxy: TAddress, implementation: TAddress): Promise<TEth.TxLike>
    upgradeAndCall (sender: TSender, proxy: TAddress, implementation: TAddress, data: TBufferLike): Promise<TEth.TxLike>
}


