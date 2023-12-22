/**
 *  AUTO-Generated Class: 2023-12-22 01:26
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



export class IERC3156FlashLender extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        
    }

    

    // 0xd9d98ce4
    async flashFee (token: TAddress, amount: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'flashFee'), token, amount);
    }

    // 0x5cffe9de
    async flashLoan (sender: TSender, receiver: TAddress, token: TAddress, amount: bigint, data: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'flashLoan'), sender, receiver, token, amount, data);
    }

    // 0x613255ab
    async maxFlashLoan (token: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'maxFlashLoan'), token);
    }

    $call () {
        return super.$call() as IIERC3156FlashLenderTxCaller;
    }
    $signed (): TOverrideReturns<IIERC3156FlashLenderTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IIERC3156FlashLenderTxData {
        return super.$data() as IIERC3156FlashLenderTxData;
    }
    $gas (): TOverrideReturns<IIERC3156FlashLenderTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
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







    abi: TAbiItem[] = [{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"flashFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC3156FlashBorrower","name":"receiver","type":"address"},{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"flashLoan","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"maxFlashLoan","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}



interface IEvents {
  '*': any[] 
}



interface IMethodFlashFee {
  method: "flashFee"
  arguments: [ token: TAddress, amount: bigint ]
}

interface IMethodFlashLoan {
  method: "flashLoan"
  arguments: [ receiver: TAddress, token: TAddress, amount: bigint, data: TBufferLike ]
}

interface IMethodMaxFlashLoan {
  method: "maxFlashLoan"
  arguments: [ token: TAddress ]
}

interface IMethods {
  flashFee: IMethodFlashFee
  flashLoan: IMethodFlashLoan
  maxFlashLoan: IMethodMaxFlashLoan
  '*': { method: string, arguments: any[] } 
}






interface IIERC3156FlashLenderTxCaller {
    flashLoan (sender: TSender, receiver: TAddress, token: TAddress, amount: bigint, data: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IIERC3156FlashLenderTxData {
    flashLoan (sender: TSender, receiver: TAddress, token: TAddress, amount: bigint, data: TBufferLike): Promise<TEth.TxLike>
}


