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
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { SubjectStream } from '@dequanto/class/SubjectStream';


import type { ContractWriter } from '@dequanto/contracts/ContractWriter';
import type { TAbiItem } from '@dequanto/types/TAbi';
import type { TEth } from '@dequanto/models/TEth';


import { Etherscan } from '@dequanto/BlockchainExplorer/Etherscan'
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client'

export namespace MinimalForwarderErrors {
    export interface InvalidShortString {
        type: 'InvalidShortString'
        params: {
        }
    }
    export interface StringTooLong {
        type: 'StringTooLong'
        params: {
            str: string
        }
    }
    export type Error = InvalidShortString | StringTooLong
}

export class MinimalForwarder extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)
    }

    // 0x84b0196e
    async eip712Domain (): Promise<{ fields: TBufferLike, name: string, version: string, chainId: bigint, verifyingContract: TAddress, salt: TBufferLike, extensions: bigint[] }> {
        return this.$read(this.$getAbiItem('function', 'eip712Domain'));
    }

    // 0x47153f82
    async execute (sender: TSender, req: { from: TAddress, to: TAddress, value: bigint, gas: bigint, nonce: bigint, data: TBufferLike }, signature: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'execute'), sender, req, signature);
    }

    // 0x2d0335ab
    async getNonce (from: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getNonce'), from);
    }

    // 0xbf5d3bdb
    async verify (req: { from: TAddress, to: TAddress, value: bigint, gas: bigint, nonce: bigint, data: TBufferLike }, signature: TBufferLike): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'verify'), req, signature);
    }

    $call () {
        return super.$call() as IMinimalForwarderTxCaller;;
    }

    $data (): IMinimalForwarderTxData {
        return super.$data() as IMinimalForwarderTxData;
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

    abi: TAbiItem[] = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"InvalidShortString","type":"error"},{"inputs":[{"internalType":"string","name":"str","type":"string"}],"name":"StringTooLong","type":"error"},{"anonymous":false,"inputs":[],"name":"EIP712DomainChanged","type":"event"},{"inputs":[],"name":"eip712Domain","outputs":[{"internalType":"bytes1","name":"fields","type":"bytes1"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"version","type":"string"},{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"verifyingContract","type":"address"},{"internalType":"bytes32","name":"salt","type":"bytes32"},{"internalType":"uint256[]","name":"extensions","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"gas","type":"uint256"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct MinimalForwarder.ForwardRequest","name":"req","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"execute","outputs":[{"internalType":"bool","name":"","type":"bool"},{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"}],"name":"getNonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"gas","type":"uint256"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct MinimalForwarder.ForwardRequest","name":"req","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"verify","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]

    
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

interface IMethodExecute {
  method: "execute"
  arguments: [ req: { from: TAddress, to: TAddress, value: bigint, gas: bigint, nonce: bigint, data: TBufferLike }, signature: TBufferLike ]
}

interface IMethodGetNonce {
  method: "getNonce"
  arguments: [ from: TAddress ]
}

interface IMethodVerify {
  method: "verify"
  arguments: [ req: { from: TAddress, to: TAddress, value: bigint, gas: bigint, nonce: bigint, data: TBufferLike }, signature: TBufferLike ]
}

interface IMethods {
  eip712Domain: IMethodEip712Domain
  execute: IMethodExecute
  getNonce: IMethodGetNonce
  verify: IMethodVerify
  '*': { method: string, arguments: any[] } 
}






interface IMinimalForwarderTxCaller {
    execute (sender: TSender, req: { from: TAddress, to: TAddress, value: bigint, gas: bigint, nonce: bigint, data: TBufferLike }, signature: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IMinimalForwarderTxData {
    execute (sender: TSender, req: { from: TAddress, to: TAddress, value: bigint, gas: bigint, nonce: bigint, data: TBufferLike }, signature: TBufferLike): Promise<TEth.TxLike>
}


