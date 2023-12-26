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



export class ERC777 extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        
    }

    $meta = {
    "class": "./contracts/openzeppelin/ERC777.ts"
}

    async $constructor (deployer: TSender, name_: string, symbol_: string, defaultOperators_: TAddress[]): Promise<TxWriter> {
        throw new Error('Not implemented. Typing purpose. Use the ContractDeployer class to deploy the contract');
    }

    // 0xdd62ed3e
    async allowance (holder: TAddress, spender: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'allowance'), holder, spender);
    }

    // 0x095ea7b3
    async approve (sender: TSender, spender: TAddress, value: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'approve'), sender, spender, value);
    }

    // 0x959b8c3f
    async authorizeOperator (sender: TSender, operator: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'authorizeOperator'), sender, operator);
    }

    // 0x70a08231
    async balanceOf (tokenHolder: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'balanceOf'), tokenHolder);
    }

    // 0xfe9d9303
    async burn (sender: TSender, amount: bigint, data: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'burn'), sender, amount, data);
    }

    // 0x313ce567
    async decimals (): Promise<number> {
        return this.$read(this.$getAbiItem('function', 'decimals'));
    }

    // 0x06e48538
    async defaultOperators (): Promise<TAddress[]> {
        return this.$read(this.$getAbiItem('function', 'defaultOperators'));
    }

    // 0x556f0dc7
    async granularity (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'granularity'));
    }

    // 0xd95b6371
    async isOperatorFor (operator: TAddress, tokenHolder: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'isOperatorFor'), operator, tokenHolder);
    }

    // 0x06fdde03
    async name (): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'name'));
    }

    // 0xfc673c4f
    async operatorBurn (sender: TSender, account: TAddress, amount: bigint, data: TEth.Hex, operatorData: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'operatorBurn'), sender, account, amount, data, operatorData);
    }

    // 0x62ad1b83
    async operatorSend (sender: TSender, _sender: TAddress, recipient: TAddress, amount: bigint, data: TEth.Hex, operatorData: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'operatorSend'), sender, _sender, recipient, amount, data, operatorData);
    }

    // 0xfad8b32a
    async revokeOperator (sender: TSender, operator: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'revokeOperator'), sender, operator);
    }

    // 0x9bd9bbc6
    async send (sender: TSender, recipient: TAddress, amount: bigint, data: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'send'), sender, recipient, amount, data);
    }

    // 0x95d89b41
    async symbol (): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'symbol'));
    }

    // 0x18160ddd
    async totalSupply (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'totalSupply'));
    }

    // 0xa9059cbb
    async transfer (sender: TSender, recipient: TAddress, amount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'transfer'), sender, recipient, amount);
    }

    // 0x23b872dd
    async transferFrom (sender: TSender, holder: TAddress, recipient: TAddress, amount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'transferFrom'), sender, holder, recipient, amount);
    }

    $call () {
        return super.$call() as IERC777TxCaller;
    }
    $signed (): TOverrideReturns<IERC777TxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IERC777TxData {
        return super.$data() as IERC777TxData;
    }
    $gas (): TOverrideReturns<IERC777TxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
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

    onApproval (fn?: (event: TClientEventsStreamData<TLogApprovalParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogApprovalParameters>> {
        return this.$onLog('Approval', fn);
    }

    onAuthorizedOperator (fn?: (event: TClientEventsStreamData<TLogAuthorizedOperatorParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogAuthorizedOperatorParameters>> {
        return this.$onLog('AuthorizedOperator', fn);
    }

    onBurned (fn?: (event: TClientEventsStreamData<TLogBurnedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogBurnedParameters>> {
        return this.$onLog('Burned', fn);
    }

    onMinted (fn?: (event: TClientEventsStreamData<TLogMintedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogMintedParameters>> {
        return this.$onLog('Minted', fn);
    }

    onRevokedOperator (fn?: (event: TClientEventsStreamData<TLogRevokedOperatorParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogRevokedOperatorParameters>> {
        return this.$onLog('RevokedOperator', fn);
    }

    onSent (fn?: (event: TClientEventsStreamData<TLogSentParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogSentParameters>> {
        return this.$onLog('Sent', fn);
    }

    onTransfer (fn?: (event: TClientEventsStreamData<TLogTransferParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogTransferParameters>> {
        return this.$onLog('Transfer', fn);
    }

    extractLogsApproval (tx: TEth.TxReceipt): ITxLogItem<TLogApproval>[] {
        let abi = this.$getAbiItem('event', 'Approval');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogApproval>[];
    }

    extractLogsAuthorizedOperator (tx: TEth.TxReceipt): ITxLogItem<TLogAuthorizedOperator>[] {
        let abi = this.$getAbiItem('event', 'AuthorizedOperator');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogAuthorizedOperator>[];
    }

    extractLogsBurned (tx: TEth.TxReceipt): ITxLogItem<TLogBurned>[] {
        let abi = this.$getAbiItem('event', 'Burned');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogBurned>[];
    }

    extractLogsMinted (tx: TEth.TxReceipt): ITxLogItem<TLogMinted>[] {
        let abi = this.$getAbiItem('event', 'Minted');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogMinted>[];
    }

    extractLogsRevokedOperator (tx: TEth.TxReceipt): ITxLogItem<TLogRevokedOperator>[] {
        let abi = this.$getAbiItem('event', 'RevokedOperator');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogRevokedOperator>[];
    }

    extractLogsSent (tx: TEth.TxReceipt): ITxLogItem<TLogSent>[] {
        let abi = this.$getAbiItem('event', 'Sent');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogSent>[];
    }

    extractLogsTransfer (tx: TEth.TxReceipt): ITxLogItem<TLogTransfer>[] {
        let abi = this.$getAbiItem('event', 'Transfer');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogTransfer>[];
    }

    async getPastLogsApproval (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { owner?: TAddress,spender?: TAddress }
    }): Promise<ITxLogItem<TLogApproval>[]> {
        return await this.$getPastLogsParsed('Approval', options) as any;
    }

    async getPastLogsAuthorizedOperator (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { operator?: TAddress,tokenHolder?: TAddress }
    }): Promise<ITxLogItem<TLogAuthorizedOperator>[]> {
        return await this.$getPastLogsParsed('AuthorizedOperator', options) as any;
    }

    async getPastLogsBurned (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { operator?: TAddress,from?: TAddress }
    }): Promise<ITxLogItem<TLogBurned>[]> {
        return await this.$getPastLogsParsed('Burned', options) as any;
    }

    async getPastLogsMinted (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { operator?: TAddress,to?: TAddress }
    }): Promise<ITxLogItem<TLogMinted>[]> {
        return await this.$getPastLogsParsed('Minted', options) as any;
    }

    async getPastLogsRevokedOperator (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { operator?: TAddress,tokenHolder?: TAddress }
    }): Promise<ITxLogItem<TLogRevokedOperator>[]> {
        return await this.$getPastLogsParsed('RevokedOperator', options) as any;
    }

    async getPastLogsSent (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { operator?: TAddress,from?: TAddress,to?: TAddress }
    }): Promise<ITxLogItem<TLogSent>[]> {
        return await this.$getPastLogsParsed('Sent', options) as any;
    }

    async getPastLogsTransfer (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { from?: TAddress,to?: TAddress }
    }): Promise<ITxLogItem<TLogTransfer>[]> {
        return await this.$getPastLogsParsed('Transfer', options) as any;
    }

    abi: TAbiItem[] = [{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"address[]","name":"defaultOperators_","type":"address[]"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"tokenHolder","type":"address"}],"name":"AuthorizedOperator","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"operatorData","type":"bytes"}],"name":"Burned","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"operatorData","type":"bytes"}],"name":"Minted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"tokenHolder","type":"address"}],"name":"RevokedOperator","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"operatorData","type":"bytes"}],"name":"Sent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"}],"name":"authorizeOperator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenHolder","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"defaultOperators","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"granularity","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"address","name":"tokenHolder","type":"address"}],"name":"isOperatorFor","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"bytes","name":"operatorData","type":"bytes"}],"name":"operatorBurn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"bytes","name":"operatorData","type":"bytes"}],"name":"operatorSend","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"}],"name":"revokeOperator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"send","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogApproval = {
        owner: TAddress, spender: TAddress, value: bigint
    };
    type TLogApprovalParameters = [ owner: TAddress, spender: TAddress, value: bigint ];
    type TLogAuthorizedOperator = {
        operator: TAddress, tokenHolder: TAddress
    };
    type TLogAuthorizedOperatorParameters = [ operator: TAddress, tokenHolder: TAddress ];
    type TLogBurned = {
        operator: TAddress, from: TAddress, amount: bigint, data: TEth.Hex, operatorData: TEth.Hex
    };
    type TLogBurnedParameters = [ operator: TAddress, from: TAddress, amount: bigint, data: TEth.Hex, operatorData: TEth.Hex ];
    type TLogMinted = {
        operator: TAddress, to: TAddress, amount: bigint, data: TEth.Hex, operatorData: TEth.Hex
    };
    type TLogMintedParameters = [ operator: TAddress, to: TAddress, amount: bigint, data: TEth.Hex, operatorData: TEth.Hex ];
    type TLogRevokedOperator = {
        operator: TAddress, tokenHolder: TAddress
    };
    type TLogRevokedOperatorParameters = [ operator: TAddress, tokenHolder: TAddress ];
    type TLogSent = {
        operator: TAddress, from: TAddress, to: TAddress, amount: bigint, data: TEth.Hex, operatorData: TEth.Hex
    };
    type TLogSentParameters = [ operator: TAddress, from: TAddress, to: TAddress, amount: bigint, data: TEth.Hex, operatorData: TEth.Hex ];
    type TLogTransfer = {
        from: TAddress, to: TAddress, value: bigint
    };
    type TLogTransferParameters = [ from: TAddress, to: TAddress, value: bigint ];

interface IEvents {
  Approval: TLogApprovalParameters
  AuthorizedOperator: TLogAuthorizedOperatorParameters
  Burned: TLogBurnedParameters
  Minted: TLogMintedParameters
  RevokedOperator: TLogRevokedOperatorParameters
  Sent: TLogSentParameters
  Transfer: TLogTransferParameters
  '*': any[] 
}



interface IMethodAllowance {
  method: "allowance"
  arguments: [ holder: TAddress, spender: TAddress ]
}

interface IMethodApprove {
  method: "approve"
  arguments: [ spender: TAddress, value: bigint ]
}

interface IMethodAuthorizeOperator {
  method: "authorizeOperator"
  arguments: [ operator: TAddress ]
}

interface IMethodBalanceOf {
  method: "balanceOf"
  arguments: [ tokenHolder: TAddress ]
}

interface IMethodBurn {
  method: "burn"
  arguments: [ amount: bigint, data: TEth.Hex ]
}

interface IMethodDecimals {
  method: "decimals"
  arguments: [  ]
}

interface IMethodDefaultOperators {
  method: "defaultOperators"
  arguments: [  ]
}

interface IMethodGranularity {
  method: "granularity"
  arguments: [  ]
}

interface IMethodIsOperatorFor {
  method: "isOperatorFor"
  arguments: [ operator: TAddress, tokenHolder: TAddress ]
}

interface IMethodName {
  method: "name"
  arguments: [  ]
}

interface IMethodOperatorBurn {
  method: "operatorBurn"
  arguments: [ account: TAddress, amount: bigint, data: TEth.Hex, operatorData: TEth.Hex ]
}

interface IMethodOperatorSend {
  method: "operatorSend"
  arguments: [ _sender: TAddress, recipient: TAddress, amount: bigint, data: TEth.Hex, operatorData: TEth.Hex ]
}

interface IMethodRevokeOperator {
  method: "revokeOperator"
  arguments: [ operator: TAddress ]
}

interface IMethodSend {
  method: "send"
  arguments: [ recipient: TAddress, amount: bigint, data: TEth.Hex ]
}

interface IMethodSymbol {
  method: "symbol"
  arguments: [  ]
}

interface IMethodTotalSupply {
  method: "totalSupply"
  arguments: [  ]
}

interface IMethodTransfer {
  method: "transfer"
  arguments: [ recipient: TAddress, amount: bigint ]
}

interface IMethodTransferFrom {
  method: "transferFrom"
  arguments: [ holder: TAddress, recipient: TAddress, amount: bigint ]
}

interface IMethods {
  allowance: IMethodAllowance
  approve: IMethodApprove
  authorizeOperator: IMethodAuthorizeOperator
  balanceOf: IMethodBalanceOf
  burn: IMethodBurn
  decimals: IMethodDecimals
  defaultOperators: IMethodDefaultOperators
  granularity: IMethodGranularity
  isOperatorFor: IMethodIsOperatorFor
  name: IMethodName
  operatorBurn: IMethodOperatorBurn
  operatorSend: IMethodOperatorSend
  revokeOperator: IMethodRevokeOperator
  send: IMethodSend
  symbol: IMethodSymbol
  totalSupply: IMethodTotalSupply
  transfer: IMethodTransfer
  transferFrom: IMethodTransferFrom
  '*': { method: string, arguments: any[] } 
}






interface IERC777TxCaller {
    approve (sender: TSender, spender: TAddress, value: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    authorizeOperator (sender: TSender, operator: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    burn (sender: TSender, amount: bigint, data: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    operatorBurn (sender: TSender, account: TAddress, amount: bigint, data: TEth.Hex, operatorData: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    operatorSend (sender: TSender, _sender: TAddress, recipient: TAddress, amount: bigint, data: TEth.Hex, operatorData: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    revokeOperator (sender: TSender, operator: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    send (sender: TSender, recipient: TAddress, amount: bigint, data: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    transfer (sender: TSender, recipient: TAddress, amount: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    transferFrom (sender: TSender, holder: TAddress, recipient: TAddress, amount: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IERC777TxData {
    approve (sender: TSender, spender: TAddress, value: bigint): Promise<TEth.TxLike>
    authorizeOperator (sender: TSender, operator: TAddress): Promise<TEth.TxLike>
    burn (sender: TSender, amount: bigint, data: TEth.Hex): Promise<TEth.TxLike>
    operatorBurn (sender: TSender, account: TAddress, amount: bigint, data: TEth.Hex, operatorData: TEth.Hex): Promise<TEth.TxLike>
    operatorSend (sender: TSender, _sender: TAddress, recipient: TAddress, amount: bigint, data: TEth.Hex, operatorData: TEth.Hex): Promise<TEth.TxLike>
    revokeOperator (sender: TSender, operator: TAddress): Promise<TEth.TxLike>
    send (sender: TSender, recipient: TAddress, amount: bigint, data: TEth.Hex): Promise<TEth.TxLike>
    transfer (sender: TSender, recipient: TAddress, amount: bigint): Promise<TEth.TxLike>
    transferFrom (sender: TSender, holder: TAddress, recipient: TAddress, amount: bigint): Promise<TEth.TxLike>
}


