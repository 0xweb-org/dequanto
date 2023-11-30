/**
 *  AUTO-Generated Class: 2023-11-24 00:53
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
import type { TOverrideReturns } from '@dequanto/utils/types';


import { Etherscan } from '@dequanto/explorer/Etherscan'
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client'



export class CreateCall extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        
    }

    

    // 0x4c8c9ea1
    async performCreate (sender: TSender, value: bigint, deploymentData: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'performCreate'), sender, value, deploymentData);
    }

    // 0x4847be6f
    async performCreate2 (sender: TSender, value: bigint, deploymentData: TBufferLike, salt: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'performCreate2'), sender, value, deploymentData, salt);
    }

    $call () {
        return super.$call() as ICreateCallTxCaller;
    }

    $data (): ICreateCallTxData {
        return super.$data() as ICreateCallTxData;
    }
    $gas (): TOverrideReturns<ICreateCallTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
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

    onContractCreation (fn?: (event: TClientEventsStreamData<TLogContractCreationParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogContractCreationParameters>> {
        return this.$onLog('ContractCreation', fn);
    }

    extractLogsContractCreation (tx: TEth.TxReceipt): ITxLogItem<TLogContractCreation>[] {
        let abi = this.$getAbiItem('event', 'ContractCreation');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogContractCreation>[];
    }

    async getPastLogsContractCreation (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { newContract?: TAddress }
    }): Promise<ITxLogItem<TLogContractCreation>[]> {
        return await this.$getPastLogsParsed('ContractCreation', options) as any;
    }

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"newContract","type":"address"}],"name":"ContractCreation","type":"event"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"deploymentData","type":"bytes"}],"name":"performCreate","outputs":[{"internalType":"address","name":"newContract","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"deploymentData","type":"bytes"},{"internalType":"bytes32","name":"salt","type":"bytes32"}],"name":"performCreate2","outputs":[{"internalType":"address","name":"newContract","type":"address"}],"stateMutability":"nonpayable","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogContractCreation = {
        newContract: TAddress
    };
    type TLogContractCreationParameters = [ newContract: TAddress ];

interface IEvents {
  ContractCreation: TLogContractCreationParameters
  '*': any[] 
}



interface IMethodPerformCreate {
  method: "performCreate"
  arguments: [ value: bigint, deploymentData: TBufferLike ]
}

interface IMethodPerformCreate2 {
  method: "performCreate2"
  arguments: [ value: bigint, deploymentData: TBufferLike, salt: TBufferLike ]
}

interface IMethods {
  performCreate: IMethodPerformCreate
  performCreate2: IMethodPerformCreate2
  '*': { method: string, arguments: any[] } 
}






interface ICreateCallTxCaller {
    performCreate (sender: TSender, value: bigint, deploymentData: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    performCreate2 (sender: TSender, value: bigint, deploymentData: TBufferLike, salt: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface ICreateCallTxData {
    performCreate (sender: TSender, value: bigint, deploymentData: TBufferLike): Promise<TEth.TxLike>
    performCreate2 (sender: TSender, value: bigint, deploymentData: TBufferLike, salt: TBufferLike): Promise<TEth.TxLike>
}

