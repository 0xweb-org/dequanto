/**
 *  AUTO-Generated Class: 2023-12-26 12:42
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



export class IERC5267 extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        
    }

    $meta = {
    "class": "./contracts/openzeppelin/IERC5267.ts"
}

    // 0x84b0196e
    async eip712Domain (): Promise<{ fields: TEth.Hex, name: string, version: string, chainId: bigint, verifyingContract: TAddress, salt: TEth.Hex, extensions: bigint[] }> {
        return this.$read(this.$getAbiItem('function', 'eip712Domain'));
    }

    $call () {
        return super.$call() as IIERC5267TxCaller;
    }
    $signed (): TOverrideReturns<IIERC5267TxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IIERC5267TxData {
        return super.$data() as IIERC5267TxData;
    }
    $gas (): TOverrideReturns<IIERC5267TxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
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

    onEIP712DomainChanged (fn?: (event: TClientEventsStreamData<TLogEIP712DomainChangedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogEIP712DomainChangedParameters>> {
        return this.$onLog('EIP712DomainChanged', fn);
    }

    extractLogsEIP712DomainChanged (tx: TEth.TxReceipt): ITxLogItem<TLogEIP712DomainChanged>[] {
        let abi = this.$getAbiItem('event', 'EIP712DomainChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogEIP712DomainChanged>[];
    }

    async getPastLogsEIP712DomainChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogEIP712DomainChanged>[]> {
        return await this.$getPastLogsParsed('EIP712DomainChanged', options) as any;
    }

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[],"name":"EIP712DomainChanged","type":"event"},{"inputs":[],"name":"eip712Domain","outputs":[{"internalType":"bytes1","name":"fields","type":"bytes1"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"version","type":"string"},{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"verifyingContract","type":"address"},{"internalType":"bytes32","name":"salt","type":"bytes32"},{"internalType":"uint256[]","name":"extensions","type":"uint256[]"}],"stateMutability":"view","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogEIP712DomainChanged = {
        
    };
    type TLogEIP712DomainChangedParameters = [  ];

interface IEvents {
  EIP712DomainChanged: TLogEIP712DomainChangedParameters
  '*': any[] 
}



interface IMethodEip712Domain {
  method: "eip712Domain"
  arguments: [  ]
}

interface IMethods {
  eip712Domain: IMethodEip712Domain
  '*': { method: string, arguments: any[] } 
}






interface IIERC5267TxCaller {

}


interface IIERC5267TxData {

}


