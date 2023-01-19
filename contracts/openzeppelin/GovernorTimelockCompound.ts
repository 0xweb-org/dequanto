/**
 *  AUTO-Generated Class: 2023-01-19 12:43
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
export class GovernorTimelockCompound extends ContractBase {
    constructor(
        public address: TAddress = '',
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)
    }

    // 0xdeaaa7cc
    async BALLOT_TYPEHASH (): Promise<TBufferLike> {
        return this.$read('function BALLOT_TYPEHASH() returns bytes32');
    }

    // 0xdd4e2ba5
    async COUNTING_MODE (): Promise<string> {
        return this.$read('function COUNTING_MODE() returns string');
    }

    // 0x2fe3e261
    async EXTENDED_BALLOT_TYPEHASH (): Promise<TBufferLike> {
        return this.$read('function EXTENDED_BALLOT_TYPEHASH() returns bytes32');
    }

    // 0xb9a61961
    async __acceptAdmin (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', '__acceptAdmin'), sender);
    }

    // 0x56781388
    async castVote (sender: TSender, proposalId: bigint, support: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'castVote'), sender, proposalId, support);
    }

    // 0x3bccf4fd
    async castVoteBySig (sender: TSender, proposalId: bigint, support: number, v: number, r: TBufferLike, s: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'castVoteBySig'), sender, proposalId, support, v, r, s);
    }

    // 0x7b3c71d3
    async castVoteWithReason (sender: TSender, proposalId: bigint, support: number, reason: string): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'castVoteWithReason'), sender, proposalId, support, reason);
    }

    // 0x5f398a14
    async castVoteWithReasonAndParams (sender: TSender, proposalId: bigint, support: number, reason: string, params: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'castVoteWithReasonAndParams'), sender, proposalId, support, reason, params);
    }

    // 0x03420181
    async castVoteWithReasonAndParamsBySig (sender: TSender, proposalId: bigint, support: number, reason: string, params: TBufferLike, v: number, r: TBufferLike, s: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'castVoteWithReasonAndParamsBySig'), sender, proposalId, support, reason, params, v, r, s);
    }

    // 0x2656227d
    async execute (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TBufferLike[], descriptionHash: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'execute'), sender, targets, values, calldatas, descriptionHash);
    }

    // 0xeb9019d4
    async getVotes (account: TAddress, blockNumber: bigint): Promise<bigint> {
        return this.$read('function getVotes(address, uint256) returns uint256', account, blockNumber);
    }

    // 0x9a802a6d
    async getVotesWithParams (account: TAddress, blockNumber: bigint, params: TBufferLike): Promise<bigint> {
        return this.$read('function getVotesWithParams(address, uint256, bytes) returns uint256', account, blockNumber, params);
    }

    // 0x43859632
    async hasVoted (proposalId: bigint, account: TAddress): Promise<boolean> {
        return this.$read('function hasVoted(uint256, address) returns bool', proposalId, account);
    }

    // 0xc59057e4
    async hashProposal (targets: TAddress[], values: bigint[], calldatas: TBufferLike[], descriptionHash: TBufferLike): Promise<bigint> {
        return this.$read('function hashProposal(address[], uint256[], bytes[], bytes32) returns uint256', targets, values, calldatas, descriptionHash);
    }

    // 0x06fdde03
    async name (): Promise<string> {
        return this.$read('function name() returns string');
    }

    // 0xbc197c81
    async onERC1155BatchReceived (sender: TSender, input0: TAddress, input1: TAddress, input2: bigint[], input3: bigint[], input4: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'onERC1155BatchReceived'), sender, input0, input1, input2, input3, input4);
    }

    // 0xf23a6e61
    async onERC1155Received (sender: TSender, input0: TAddress, input1: TAddress, input2: bigint, input3: bigint, input4: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'onERC1155Received'), sender, input0, input1, input2, input3, input4);
    }

    // 0x150b7a02
    async onERC721Received (sender: TSender, input0: TAddress, input1: TAddress, input2: bigint, input3: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'onERC721Received'), sender, input0, input1, input2, input3);
    }

    // 0xc01f9e37
    async proposalDeadline (proposalId: bigint): Promise<bigint> {
        return this.$read('function proposalDeadline(uint256) returns uint256', proposalId);
    }

    // 0xab58fb8e
    async proposalEta (proposalId: bigint): Promise<bigint> {
        return this.$read('function proposalEta(uint256) returns uint256', proposalId);
    }

    // 0x2d63f693
    async proposalSnapshot (proposalId: bigint): Promise<bigint> {
        return this.$read('function proposalSnapshot(uint256) returns uint256', proposalId);
    }

    // 0xb58131b0
    async proposalThreshold (): Promise<bigint> {
        return this.$read('function proposalThreshold() returns uint256');
    }

    // 0x7d5e81e2
    async propose (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TBufferLike[], description: string): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'propose'), sender, targets, values, calldatas, description);
    }

    // 0x160cbed7
    async queue (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TBufferLike[], descriptionHash: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'queue'), sender, targets, values, calldatas, descriptionHash);
    }

    // 0xf8ce560a
    async quorum (blockNumber: bigint): Promise<bigint> {
        return this.$read('function quorum(uint256) returns uint256', blockNumber);
    }

    // 0xc28bc2fa
    async relay (sender: TSender, target: TAddress, value: bigint, data: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'relay'), sender, target, value, data);
    }

    // 0x3e4f49e6
    async state (proposalId: bigint): Promise<number> {
        return this.$read('function state(uint256) returns uint8', proposalId);
    }

    // 0x01ffc9a7
    async supportsInterface (interfaceId: TBufferLike): Promise<boolean> {
        return this.$read('function supportsInterface(bytes4) returns bool', interfaceId);
    }

    // 0xd33219b4
    async timelock (): Promise<TAddress> {
        return this.$read('function timelock() returns address');
    }

    // 0xa890c910
    async updateTimelock (sender: TSender, newTimelock: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'updateTimelock'), sender, newTimelock);
    }

    // 0x54fd4d50
    async version (): Promise<string> {
        return this.$read('function version() returns string');
    }

    // 0x3932abb1
    async votingDelay (): Promise<bigint> {
        return this.$read('function votingDelay() returns uint256');
    }

    // 0x02a251a3
    async votingPeriod (): Promise<bigint> {
        return this.$read('function votingPeriod() returns uint256');
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

    onProposalCanceled (fn?: (event: TClientEventsStreamData<TLogProposalCanceledParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogProposalCanceledParameters>> {
        return this.$onLog('ProposalCanceled', fn);
    }

    onProposalCreated (fn?: (event: TClientEventsStreamData<TLogProposalCreatedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogProposalCreatedParameters>> {
        return this.$onLog('ProposalCreated', fn);
    }

    onProposalExecuted (fn?: (event: TClientEventsStreamData<TLogProposalExecutedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogProposalExecutedParameters>> {
        return this.$onLog('ProposalExecuted', fn);
    }

    onProposalQueued (fn?: (event: TClientEventsStreamData<TLogProposalQueuedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogProposalQueuedParameters>> {
        return this.$onLog('ProposalQueued', fn);
    }

    onTimelockChange (fn?: (event: TClientEventsStreamData<TLogTimelockChangeParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogTimelockChangeParameters>> {
        return this.$onLog('TimelockChange', fn);
    }

    onVoteCast (fn?: (event: TClientEventsStreamData<TLogVoteCastParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogVoteCastParameters>> {
        return this.$onLog('VoteCast', fn);
    }

    onVoteCastWithParams (fn?: (event: TClientEventsStreamData<TLogVoteCastWithParamsParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogVoteCastWithParamsParameters>> {
        return this.$onLog('VoteCastWithParams', fn);
    }

    extractLogsProposalCanceled (tx: TransactionReceipt): ITxLogItem<TLogProposalCanceled>[] {
        let abi = this.$getAbiItem('event', 'ProposalCanceled');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogProposalCanceled>[];
    }

    extractLogsProposalCreated (tx: TransactionReceipt): ITxLogItem<TLogProposalCreated>[] {
        let abi = this.$getAbiItem('event', 'ProposalCreated');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogProposalCreated>[];
    }

    extractLogsProposalExecuted (tx: TransactionReceipt): ITxLogItem<TLogProposalExecuted>[] {
        let abi = this.$getAbiItem('event', 'ProposalExecuted');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogProposalExecuted>[];
    }

    extractLogsProposalQueued (tx: TransactionReceipt): ITxLogItem<TLogProposalQueued>[] {
        let abi = this.$getAbiItem('event', 'ProposalQueued');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogProposalQueued>[];
    }

    extractLogsTimelockChange (tx: TransactionReceipt): ITxLogItem<TLogTimelockChange>[] {
        let abi = this.$getAbiItem('event', 'TimelockChange');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogTimelockChange>[];
    }

    extractLogsVoteCast (tx: TransactionReceipt): ITxLogItem<TLogVoteCast>[] {
        let abi = this.$getAbiItem('event', 'VoteCast');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogVoteCast>[];
    }

    extractLogsVoteCastWithParams (tx: TransactionReceipt): ITxLogItem<TLogVoteCastWithParams>[] {
        let abi = this.$getAbiItem('event', 'VoteCastWithParams');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogVoteCastWithParams>[];
    }

    async getPastLogsProposalCanceled (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogProposalCanceled>[]> {
        let topic = '0x789cf55be980739dad1d0699b93b58e806b51c9d96619bfa8fe0a28abaa7b30c';
        let abi = this.$getAbiItem('event', 'ProposalCanceled');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsProposalCreated (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogProposalCreated>[]> {
        let topic = '0x7d84a6263ae0d98d3329bd7b46bb4e8d6f98cd35a7adb45c274c8b7fd5ebd5e0';
        let abi = this.$getAbiItem('event', 'ProposalCreated');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsProposalExecuted (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogProposalExecuted>[]> {
        let topic = '0x712ae1383f79ac853f8d882153778e0260ef8f03b504e2866e0593e04d2b291f';
        let abi = this.$getAbiItem('event', 'ProposalExecuted');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsProposalQueued (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogProposalQueued>[]> {
        let topic = '0x9a2e42fd6722813d69113e7d0079d3d940171428df7373df9c7f7617cfda2892';
        let abi = this.$getAbiItem('event', 'ProposalQueued');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsTimelockChange (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogTimelockChange>[]> {
        let topic = '0x08f74ea46ef7894f65eabfb5e6e695de773a000b47c529ab559178069b226401';
        let abi = this.$getAbiItem('event', 'TimelockChange');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsVoteCast (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { voter?: TAddress }
    }): Promise<ITxLogItem<TLogVoteCast>[]> {
        let topic = '0xb8e138887d0aa13bab447e82de9d5c1777041ecd21ca36ba824ff1e6c07ddda4';
        let abi = this.$getAbiItem('event', 'VoteCast');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsVoteCastWithParams (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { voter?: TAddress }
    }): Promise<ITxLogItem<TLogVoteCastWithParams>[]> {
        let topic = '0xe2babfbac5889a709b63bb7f598b324e08bc5a4fb9ec647fb3cbc9ec07eb8712';
        let abi = this.$getAbiItem('event', 'VoteCastWithParams');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    abi: AbiItem[] = [{"inputs":[],"name":"Empty","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"ProposalCanceled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"proposalId","type":"uint256"},{"indexed":false,"internalType":"address","name":"proposer","type":"address"},{"indexed":false,"internalType":"address[]","name":"targets","type":"address[]"},{"indexed":false,"internalType":"uint256[]","name":"values","type":"uint256[]"},{"indexed":false,"internalType":"string[]","name":"signatures","type":"string[]"},{"indexed":false,"internalType":"bytes[]","name":"calldatas","type":"bytes[]"},{"indexed":false,"internalType":"uint256","name":"startBlock","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"endBlock","type":"uint256"},{"indexed":false,"internalType":"string","name":"description","type":"string"}],"name":"ProposalCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"ProposalExecuted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"proposalId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"eta","type":"uint256"}],"name":"ProposalQueued","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"oldTimelock","type":"address"},{"indexed":false,"internalType":"address","name":"newTimelock","type":"address"}],"name":"TimelockChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"voter","type":"address"},{"indexed":false,"internalType":"uint256","name":"proposalId","type":"uint256"},{"indexed":false,"internalType":"uint8","name":"support","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"weight","type":"uint256"},{"indexed":false,"internalType":"string","name":"reason","type":"string"}],"name":"VoteCast","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"voter","type":"address"},{"indexed":false,"internalType":"uint256","name":"proposalId","type":"uint256"},{"indexed":false,"internalType":"uint8","name":"support","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"weight","type":"uint256"},{"indexed":false,"internalType":"string","name":"reason","type":"string"},{"indexed":false,"internalType":"bytes","name":"params","type":"bytes"}],"name":"VoteCastWithParams","type":"event"},{"inputs":[],"name":"BALLOT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"COUNTING_MODE","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"EXTENDED_BALLOT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"__acceptAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"},{"internalType":"uint8","name":"support","type":"uint8"}],"name":"castVote","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"},{"internalType":"uint8","name":"support","type":"uint8"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"castVoteBySig","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"},{"internalType":"uint8","name":"support","type":"uint8"},{"internalType":"string","name":"reason","type":"string"}],"name":"castVoteWithReason","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"},{"internalType":"uint8","name":"support","type":"uint8"},{"internalType":"string","name":"reason","type":"string"},{"internalType":"bytes","name":"params","type":"bytes"}],"name":"castVoteWithReasonAndParams","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"},{"internalType":"uint8","name":"support","type":"uint8"},{"internalType":"string","name":"reason","type":"string"},{"internalType":"bytes","name":"params","type":"bytes"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"castVoteWithReasonAndParamsBySig","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"targets","type":"address[]"},{"internalType":"uint256[]","name":"values","type":"uint256[]"},{"internalType":"bytes[]","name":"calldatas","type":"bytes[]"},{"internalType":"bytes32","name":"descriptionHash","type":"bytes32"}],"name":"execute","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"getVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"blockNumber","type":"uint256"},{"internalType":"bytes","name":"params","type":"bytes"}],"name":"getVotesWithParams","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"},{"internalType":"address","name":"account","type":"address"}],"name":"hasVoted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"targets","type":"address[]"},{"internalType":"uint256[]","name":"values","type":"uint256[]"},{"internalType":"bytes[]","name":"calldatas","type":"bytes[]"},{"internalType":"bytes32","name":"descriptionHash","type":"bytes32"}],"name":"hashProposal","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC1155BatchReceived","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC1155Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC721Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"proposalDeadline","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"proposalEta","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"proposalSnapshot","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proposalThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"targets","type":"address[]"},{"internalType":"uint256[]","name":"values","type":"uint256[]"},{"internalType":"bytes[]","name":"calldatas","type":"bytes[]"},{"internalType":"string","name":"description","type":"string"}],"name":"propose","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"targets","type":"address[]"},{"internalType":"uint256[]","name":"values","type":"uint256[]"},{"internalType":"bytes[]","name":"calldatas","type":"bytes[]"},{"internalType":"bytes32","name":"descriptionHash","type":"bytes32"}],"name":"queue","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"quorum","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"target","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"relay","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"state","outputs":[{"internalType":"enum IGovernor.ProposalState","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"timelock","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ICompoundTimelock","name":"newTimelock","type":"address"}],"name":"updateTimelock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"votingDelay","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"votingPeriod","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogProposalCanceled = {
        proposalId: bigint
    };
    type TLogProposalCanceledParameters = [ proposalId: bigint ];
    type TLogProposalCreated = {
        proposalId: bigint, proposer: TAddress, targets: TAddress[], values: bigint[], signatures: string[], calldatas: TBufferLike[], startBlock: bigint, endBlock: bigint, description: string
    };
    type TLogProposalCreatedParameters = [ proposalId: bigint, proposer: TAddress, targets: TAddress[], values: bigint[], signatures: string[], calldatas: TBufferLike[], startBlock: bigint, endBlock: bigint, description: string ];
    type TLogProposalExecuted = {
        proposalId: bigint
    };
    type TLogProposalExecutedParameters = [ proposalId: bigint ];
    type TLogProposalQueued = {
        proposalId: bigint, eta: bigint
    };
    type TLogProposalQueuedParameters = [ proposalId: bigint, eta: bigint ];
    type TLogTimelockChange = {
        oldTimelock: TAddress, newTimelock: TAddress
    };
    type TLogTimelockChangeParameters = [ oldTimelock: TAddress, newTimelock: TAddress ];
    type TLogVoteCast = {
        voter: TAddress, proposalId: bigint, support: number, weight: bigint, reason: string
    };
    type TLogVoteCastParameters = [ voter: TAddress, proposalId: bigint, support: number, weight: bigint, reason: string ];
    type TLogVoteCastWithParams = {
        voter: TAddress, proposalId: bigint, support: number, weight: bigint, reason: string, params: TBufferLike
    };
    type TLogVoteCastWithParamsParameters = [ voter: TAddress, proposalId: bigint, support: number, weight: bigint, reason: string, params: TBufferLike ];

interface IEvents {
  ProposalCanceled: TLogProposalCanceledParameters
  ProposalCreated: TLogProposalCreatedParameters
  ProposalExecuted: TLogProposalExecutedParameters
  ProposalQueued: TLogProposalQueuedParameters
  TimelockChange: TLogTimelockChangeParameters
  VoteCast: TLogVoteCastParameters
  VoteCastWithParams: TLogVoteCastWithParamsParameters
  '*': any[] 
}



interface IMethodBALLOT_TYPEHASH {
  method: "BALLOT_TYPEHASH"
  arguments: [  ]
}

interface IMethodCOUNTING_MODE {
  method: "COUNTING_MODE"
  arguments: [  ]
}

interface IMethodEXTENDED_BALLOT_TYPEHASH {
  method: "EXTENDED_BALLOT_TYPEHASH"
  arguments: [  ]
}

interface IMethod__acceptAdmin {
  method: "__acceptAdmin"
  arguments: [  ]
}

interface IMethodCastVote {
  method: "castVote"
  arguments: [ proposalId: bigint, support: number ]
}

interface IMethodCastVoteBySig {
  method: "castVoteBySig"
  arguments: [ proposalId: bigint, support: number, v: number, r: TBufferLike, s: TBufferLike ]
}

interface IMethodCastVoteWithReason {
  method: "castVoteWithReason"
  arguments: [ proposalId: bigint, support: number, reason: string ]
}

interface IMethodCastVoteWithReasonAndParams {
  method: "castVoteWithReasonAndParams"
  arguments: [ proposalId: bigint, support: number, reason: string, params: TBufferLike ]
}

interface IMethodCastVoteWithReasonAndParamsBySig {
  method: "castVoteWithReasonAndParamsBySig"
  arguments: [ proposalId: bigint, support: number, reason: string, params: TBufferLike, v: number, r: TBufferLike, s: TBufferLike ]
}

interface IMethodExecute {
  method: "execute"
  arguments: [ targets: TAddress[], values: bigint[], calldatas: TBufferLike[], descriptionHash: TBufferLike ]
}

interface IMethodGetVotes {
  method: "getVotes"
  arguments: [ account: TAddress, blockNumber: bigint ]
}

interface IMethodGetVotesWithParams {
  method: "getVotesWithParams"
  arguments: [ account: TAddress, blockNumber: bigint, params: TBufferLike ]
}

interface IMethodHasVoted {
  method: "hasVoted"
  arguments: [ proposalId: bigint, account: TAddress ]
}

interface IMethodHashProposal {
  method: "hashProposal"
  arguments: [ targets: TAddress[], values: bigint[], calldatas: TBufferLike[], descriptionHash: TBufferLike ]
}

interface IMethodName {
  method: "name"
  arguments: [  ]
}

interface IMethodOnERC1155BatchReceived {
  method: "onERC1155BatchReceived"
  arguments: [ input0: TAddress, input1: TAddress, input2: bigint[], input3: bigint[], input4: TBufferLike ]
}

interface IMethodOnERC1155Received {
  method: "onERC1155Received"
  arguments: [ input0: TAddress, input1: TAddress, input2: bigint, input3: bigint, input4: TBufferLike ]
}

interface IMethodOnERC721Received {
  method: "onERC721Received"
  arguments: [ input0: TAddress, input1: TAddress, input2: bigint, input3: TBufferLike ]
}

interface IMethodProposalDeadline {
  method: "proposalDeadline"
  arguments: [ proposalId: bigint ]
}

interface IMethodProposalEta {
  method: "proposalEta"
  arguments: [ proposalId: bigint ]
}

interface IMethodProposalSnapshot {
  method: "proposalSnapshot"
  arguments: [ proposalId: bigint ]
}

interface IMethodProposalThreshold {
  method: "proposalThreshold"
  arguments: [  ]
}

interface IMethodPropose {
  method: "propose"
  arguments: [ targets: TAddress[], values: bigint[], calldatas: TBufferLike[], description: string ]
}

interface IMethodQueue {
  method: "queue"
  arguments: [ targets: TAddress[], values: bigint[], calldatas: TBufferLike[], descriptionHash: TBufferLike ]
}

interface IMethodQuorum {
  method: "quorum"
  arguments: [ blockNumber: bigint ]
}

interface IMethodRelay {
  method: "relay"
  arguments: [ target: TAddress, value: bigint, data: TBufferLike ]
}

interface IMethodState {
  method: "state"
  arguments: [ proposalId: bigint ]
}

interface IMethodSupportsInterface {
  method: "supportsInterface"
  arguments: [ interfaceId: TBufferLike ]
}

interface IMethodTimelock {
  method: "timelock"
  arguments: [  ]
}

interface IMethodUpdateTimelock {
  method: "updateTimelock"
  arguments: [ newTimelock: TAddress ]
}

interface IMethodVersion {
  method: "version"
  arguments: [  ]
}

interface IMethodVotingDelay {
  method: "votingDelay"
  arguments: [  ]
}

interface IMethodVotingPeriod {
  method: "votingPeriod"
  arguments: [  ]
}

interface IMethods {
  BALLOT_TYPEHASH: IMethodBALLOT_TYPEHASH
  COUNTING_MODE: IMethodCOUNTING_MODE
  EXTENDED_BALLOT_TYPEHASH: IMethodEXTENDED_BALLOT_TYPEHASH
  __acceptAdmin: IMethod__acceptAdmin
  castVote: IMethodCastVote
  castVoteBySig: IMethodCastVoteBySig
  castVoteWithReason: IMethodCastVoteWithReason
  castVoteWithReasonAndParams: IMethodCastVoteWithReasonAndParams
  castVoteWithReasonAndParamsBySig: IMethodCastVoteWithReasonAndParamsBySig
  execute: IMethodExecute
  getVotes: IMethodGetVotes
  getVotesWithParams: IMethodGetVotesWithParams
  hasVoted: IMethodHasVoted
  hashProposal: IMethodHashProposal
  name: IMethodName
  onERC1155BatchReceived: IMethodOnERC1155BatchReceived
  onERC1155Received: IMethodOnERC1155Received
  onERC721Received: IMethodOnERC721Received
  proposalDeadline: IMethodProposalDeadline
  proposalEta: IMethodProposalEta
  proposalSnapshot: IMethodProposalSnapshot
  proposalThreshold: IMethodProposalThreshold
  propose: IMethodPropose
  queue: IMethodQueue
  quorum: IMethodQuorum
  relay: IMethodRelay
  state: IMethodState
  supportsInterface: IMethodSupportsInterface
  timelock: IMethodTimelock
  updateTimelock: IMethodUpdateTimelock
  version: IMethodVersion
  votingDelay: IMethodVotingDelay
  votingPeriod: IMethodVotingPeriod
  '*': { method: string, arguments: any[] } 
}





