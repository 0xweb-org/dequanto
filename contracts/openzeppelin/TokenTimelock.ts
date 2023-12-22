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



export class TokenTimelock extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        
    }

    

    async $constructor (deployer: TSender, token_: TAddress, beneficiary_: TAddress, releaseTime_: bigint): Promise<TxWriter> {
        throw new Error('Not implemented. Typing purpose. Use the ContractDeployer class to deploy the contract');
    }

    // 0x38af3eed
    async beneficiary (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'beneficiary'));
    }

    // 0x86d1a69f
    async release (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'release'), sender);
    }

    // 0xb91d4001
    async releaseTime (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'releaseTime'));
    }

    // 0xfc0c546a
    async token (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'token'));
    }

    $call () {
        return super.$call() as ITokenTimelockTxCaller;
    }
    $signed (): TOverrideReturns<ITokenTimelockTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): ITokenTimelockTxData {
        return super.$data() as ITokenTimelockTxData;
    }
    $gas (): TOverrideReturns<ITokenTimelockTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
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







    abi: TAbiItem[] = [{"inputs":[{"internalType":"contract IERC20","name":"token_","type":"address"},{"internalType":"address","name":"beneficiary_","type":"address"},{"internalType":"uint256","name":"releaseTime_","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"beneficiary","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"release","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"releaseTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}



interface IEvents {
  '*': any[] 
}



interface IMethodBeneficiary {
  method: "beneficiary"
  arguments: [  ]
}

interface IMethodRelease {
  method: "release"
  arguments: [  ]
}

interface IMethodReleaseTime {
  method: "releaseTime"
  arguments: [  ]
}

interface IMethodToken {
  method: "token"
  arguments: [  ]
}

interface IMethods {
  beneficiary: IMethodBeneficiary
  release: IMethodRelease
  releaseTime: IMethodReleaseTime
  token: IMethodToken
  '*': { method: string, arguments: any[] } 
}






interface ITokenTimelockTxCaller {
    release (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface ITokenTimelockTxData {
    release (sender: TSender, ): Promise<TEth.TxLike>
}


