/**
 *  AUTO-Generated Class: 2023-01-31 13:27
 *  Implementation: https://etherscan.io/address/undefined#code
 */
import di from 'a-di';
import { TAddress } from '@dequanto/models/TAddress';
import { TAccount } from '@dequanto/models/TAccount';
import { TBufferLike } from '@dequanto/models/TBufferLike';
import { ClientEventsStream, TClientEventsStreamData } from '@dequanto/clients/ClientEventsStream';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { ContractStorageReaderBase } from '@dequanto/contracts/ContractStorageReaderBase';
import { type AbiItem } from 'web3-utils';
import type { BlockTransactionString } from 'web3-eth';
import { TransactionReceipt, Transaction, EventLog } from 'web3-core';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { ITxLogItem } from '@dequanto/txs/receipt/ITxLogItem';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { SubjectStream } from '@dequanto/class/SubjectStream';



import { Etherscan } from '@dequanto/BlockchainExplorer/Etherscan'
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client'
export class IInbox extends ContractBase {
    constructor(
        public address: TAddress = '',
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)
    }

    // 0xe78cea92
    async bridge (): Promise<TAddress> {
        return this.$read('function bridge() returns address');
    }

    // 0x679b6ded
    async createRetryableTicket (sender: TSender, destAddr: TAddress, arbTxCallValue: bigint, maxSubmissionCost: bigint, submissionRefundAddress: TAddress, valueRefundAddress: TAddress, maxGas: bigint, gasPriceBid: bigint, data: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'createRetryableTicket'), sender, destAddr, arbTxCallValue, maxSubmissionCost, submissionRefundAddress, valueRefundAddress, maxGas, gasPriceBid, data);
    }

    // 0x1b871c8d
    async createRetryableTicketNoRefundAliasRewrite (sender: TSender, destAddr: TAddress, arbTxCallValue: bigint, maxSubmissionCost: bigint, submissionRefundAddress: TAddress, valueRefundAddress: TAddress, maxGas: bigint, gasPriceBid: bigint, data: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'createRetryableTicketNoRefundAliasRewrite'), sender, destAddr, arbTxCallValue, maxSubmissionCost, submissionRefundAddress, valueRefundAddress, maxGas, gasPriceBid, data);
    }

    // 0x0f4d14e9
    async depositEth (sender: TSender, maxSubmissionCost: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'depositEth'), sender, maxSubmissionCost);
    }

    // 0x2b40609a
    async pauseCreateRetryables (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'pauseCreateRetryables'), sender);
    }

    // 0x8a631aa6
    async sendContractTransaction (sender: TSender, maxGas: bigint, gasPriceBid: bigint, destAddr: TAddress, amount: bigint, data: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'sendContractTransaction'), sender, maxGas, gasPriceBid, destAddr, amount, data);
    }

    // 0x5e916758
    async sendL1FundedContractTransaction (sender: TSender, maxGas: bigint, gasPriceBid: bigint, destAddr: TAddress, data: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'sendL1FundedContractTransaction'), sender, maxGas, gasPriceBid, destAddr, data);
    }

    // 0x67ef3ab8
    async sendL1FundedUnsignedTransaction (sender: TSender, maxGas: bigint, gasPriceBid: bigint, nonce: bigint, destAddr: TAddress, data: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'sendL1FundedUnsignedTransaction'), sender, maxGas, gasPriceBid, nonce, destAddr, data);
    }

    // 0xb75436bb
    async sendL2Message (sender: TSender, messageData: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'sendL2Message'), sender, messageData);
    }

    // 0x5075788b
    async sendUnsignedTransaction (sender: TSender, maxGas: bigint, gasPriceBid: bigint, nonce: bigint, destAddr: TAddress, amount: bigint, data: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'sendUnsignedTransaction'), sender, maxGas, gasPriceBid, nonce, destAddr, amount, data);
    }

    // 0x7ae8d8b3
    async startRewriteAddress (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'startRewriteAddress'), sender);
    }

    // 0x794cfd51
    async stopRewriteAddress (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'stopRewriteAddress'), sender);
    }

    // 0x9fe12da5
    async unpauseCreateRetryables (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'unpauseCreateRetryables'), sender);
    }

    onTransaction <TMethod extends keyof IMethods> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: Transaction
        block: BlockTransactionString
        calldata: IMethods[TMethod]
    }> {
        options ??= {};
        options.filter ??= {};
        options.filter.method = <any> method;
        return <any> this.$onTransaction(options);
    }

    onLog (event: keyof IEvents, cb?: (event: TClientEventsStreamData) => void): ClientEventsStream<TClientEventsStreamData> {
        return this.$onLog(event, cb);
    }

    onInboxMessageDelivered (fn?: (event: TClientEventsStreamData<TLogInboxMessageDeliveredParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogInboxMessageDeliveredParameters>> {
        return this.$onLog('InboxMessageDelivered', fn);
    }

    onInboxMessageDeliveredFromOrigin (fn?: (event: TClientEventsStreamData<TLogInboxMessageDeliveredFromOriginParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogInboxMessageDeliveredFromOriginParameters>> {
        return this.$onLog('InboxMessageDeliveredFromOrigin', fn);
    }

    extractLogsInboxMessageDelivered (tx: TransactionReceipt): ITxLogItem<TLogInboxMessageDelivered>[] {
        let abi = this.$getAbiItem('event', 'InboxMessageDelivered');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogInboxMessageDelivered>[];
    }

    extractLogsInboxMessageDeliveredFromOrigin (tx: TransactionReceipt): ITxLogItem<TLogInboxMessageDeliveredFromOrigin>[] {
        let abi = this.$getAbiItem('event', 'InboxMessageDeliveredFromOrigin');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogInboxMessageDeliveredFromOrigin>[];
    }

    async getPastLogsInboxMessageDelivered (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { messageNum?: bigint }
    }): Promise<ITxLogItem<TLogInboxMessageDelivered>[]> {
        let topic = '0xff64905f73a67fb594e0f940a8075a860db489ad991e032f48c81123eb52d60b';
        let abi = this.$getAbiItem('event', 'InboxMessageDelivered');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsInboxMessageDeliveredFromOrigin (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { messageNum?: bigint }
    }): Promise<ITxLogItem<TLogInboxMessageDeliveredFromOrigin>[]> {
        let topic = '0xab532385be8f1005a4b6ba8fa20a2245facb346134ac739fe9a5198dc1580b9c';
        let abi = this.$getAbiItem('event', 'InboxMessageDeliveredFromOrigin');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    abi: AbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"messageNum","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"InboxMessageDelivered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"messageNum","type":"uint256"}],"name":"InboxMessageDeliveredFromOrigin","type":"event"},{"inputs":[],"name":"bridge","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"destAddr","type":"address"},{"internalType":"uint256","name":"arbTxCallValue","type":"uint256"},{"internalType":"uint256","name":"maxSubmissionCost","type":"uint256"},{"internalType":"address","name":"submissionRefundAddress","type":"address"},{"internalType":"address","name":"valueRefundAddress","type":"address"},{"internalType":"uint256","name":"maxGas","type":"uint256"},{"internalType":"uint256","name":"gasPriceBid","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"createRetryableTicket","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"destAddr","type":"address"},{"internalType":"uint256","name":"arbTxCallValue","type":"uint256"},{"internalType":"uint256","name":"maxSubmissionCost","type":"uint256"},{"internalType":"address","name":"submissionRefundAddress","type":"address"},{"internalType":"address","name":"valueRefundAddress","type":"address"},{"internalType":"uint256","name":"maxGas","type":"uint256"},{"internalType":"uint256","name":"gasPriceBid","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"createRetryableTicketNoRefundAliasRewrite","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"maxSubmissionCost","type":"uint256"}],"name":"depositEth","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"pauseCreateRetryables","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"maxGas","type":"uint256"},{"internalType":"uint256","name":"gasPriceBid","type":"uint256"},{"internalType":"address","name":"destAddr","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"sendContractTransaction","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"maxGas","type":"uint256"},{"internalType":"uint256","name":"gasPriceBid","type":"uint256"},{"internalType":"address","name":"destAddr","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"sendL1FundedContractTransaction","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"maxGas","type":"uint256"},{"internalType":"uint256","name":"gasPriceBid","type":"uint256"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"address","name":"destAddr","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"sendL1FundedUnsignedTransaction","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes","name":"messageData","type":"bytes"}],"name":"sendL2Message","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"maxGas","type":"uint256"},{"internalType":"uint256","name":"gasPriceBid","type":"uint256"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"address","name":"destAddr","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"sendUnsignedTransaction","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startRewriteAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"stopRewriteAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpauseCreateRetryables","outputs":[],"stateMutability":"nonpayable","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogInboxMessageDelivered = {
        messageNum: bigint, data: TBufferLike
    };
    type TLogInboxMessageDeliveredParameters = [ messageNum: bigint, data: TBufferLike ];
    type TLogInboxMessageDeliveredFromOrigin = {
        messageNum: bigint
    };
    type TLogInboxMessageDeliveredFromOriginParameters = [ messageNum: bigint ];

interface IEvents {
  InboxMessageDelivered: TLogInboxMessageDeliveredParameters
  InboxMessageDeliveredFromOrigin: TLogInboxMessageDeliveredFromOriginParameters
  '*': any[] 
}



interface IMethodBridge {
  method: "bridge"
  arguments: [  ]
}

interface IMethodCreateRetryableTicket {
  method: "createRetryableTicket"
  arguments: [ destAddr: TAddress, arbTxCallValue: bigint, maxSubmissionCost: bigint, submissionRefundAddress: TAddress, valueRefundAddress: TAddress, maxGas: bigint, gasPriceBid: bigint, data: TBufferLike ]
}

interface IMethodCreateRetryableTicketNoRefundAliasRewrite {
  method: "createRetryableTicketNoRefundAliasRewrite"
  arguments: [ destAddr: TAddress, arbTxCallValue: bigint, maxSubmissionCost: bigint, submissionRefundAddress: TAddress, valueRefundAddress: TAddress, maxGas: bigint, gasPriceBid: bigint, data: TBufferLike ]
}

interface IMethodDepositEth {
  method: "depositEth"
  arguments: [ maxSubmissionCost: bigint ]
}

interface IMethodPauseCreateRetryables {
  method: "pauseCreateRetryables"
  arguments: [  ]
}

interface IMethodSendContractTransaction {
  method: "sendContractTransaction"
  arguments: [ maxGas: bigint, gasPriceBid: bigint, destAddr: TAddress, amount: bigint, data: TBufferLike ]
}

interface IMethodSendL1FundedContractTransaction {
  method: "sendL1FundedContractTransaction"
  arguments: [ maxGas: bigint, gasPriceBid: bigint, destAddr: TAddress, data: TBufferLike ]
}

interface IMethodSendL1FundedUnsignedTransaction {
  method: "sendL1FundedUnsignedTransaction"
  arguments: [ maxGas: bigint, gasPriceBid: bigint, nonce: bigint, destAddr: TAddress, data: TBufferLike ]
}

interface IMethodSendL2Message {
  method: "sendL2Message"
  arguments: [ messageData: TBufferLike ]
}

interface IMethodSendUnsignedTransaction {
  method: "sendUnsignedTransaction"
  arguments: [ maxGas: bigint, gasPriceBid: bigint, nonce: bigint, destAddr: TAddress, amount: bigint, data: TBufferLike ]
}

interface IMethodStartRewriteAddress {
  method: "startRewriteAddress"
  arguments: [  ]
}

interface IMethodStopRewriteAddress {
  method: "stopRewriteAddress"
  arguments: [  ]
}

interface IMethodUnpauseCreateRetryables {
  method: "unpauseCreateRetryables"
  arguments: [  ]
}

interface IMethods {
  bridge: IMethodBridge
  createRetryableTicket: IMethodCreateRetryableTicket
  createRetryableTicketNoRefundAliasRewrite: IMethodCreateRetryableTicketNoRefundAliasRewrite
  depositEth: IMethodDepositEth
  pauseCreateRetryables: IMethodPauseCreateRetryables
  sendContractTransaction: IMethodSendContractTransaction
  sendL1FundedContractTransaction: IMethodSendL1FundedContractTransaction
  sendL1FundedUnsignedTransaction: IMethodSendL1FundedUnsignedTransaction
  sendL2Message: IMethodSendL2Message
  sendUnsignedTransaction: IMethodSendUnsignedTransaction
  startRewriteAddress: IMethodStartRewriteAddress
  stopRewriteAddress: IMethodStopRewriteAddress
  unpauseCreateRetryables: IMethodUnpauseCreateRetryables
  '*': { method: string, arguments: any[] } 
}





