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

export namespace GovernorTimelockControlErrors {
    export interface Empty {
        type: 'Empty'
        params: {
        }
    }
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
    export type Error = Empty | InvalidShortString | StringTooLong
}

export class GovernorTimelockControl extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)
    }

    // 0xdeaaa7cc
    async BALLOT_TYPEHASH (): Promise<TBufferLike> {
        return this.$read(this.$getAbiItem('function', 'BALLOT_TYPEHASH'));
    }

    // 0x4bf5d7e9
    async CLOCK_MODE (): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'CLOCK_MODE'));
    }

    // 0xdd4e2ba5
    async COUNTING_MODE (): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'COUNTING_MODE'));
    }

    // 0x2fe3e261
    async EXTENDED_BALLOT_TYPEHASH (): Promise<TBufferLike> {
        return this.$read(this.$getAbiItem('function', 'EXTENDED_BALLOT_TYPEHASH'));
    }

    // 0x452115d6
    async cancel (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TBufferLike[], descriptionHash: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'cancel'), sender, targets, values, calldatas, descriptionHash);
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

    // 0x91ddadf4
    async clock (): Promise<number> {
        return this.$read(this.$getAbiItem('function', 'clock'));
    }

    // 0x84b0196e
    async eip712Domain (): Promise<{ fields: TBufferLike, name: string, version: string, chainId: bigint, verifyingContract: TAddress, salt: TBufferLike, extensions: bigint[] }> {
        return this.$read(this.$getAbiItem('function', 'eip712Domain'));
    }

    // 0x2656227d
    async execute (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TBufferLike[], descriptionHash: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'execute'), sender, targets, values, calldatas, descriptionHash);
    }

    // 0xeb9019d4
    async getVotes (account: TAddress, timepoint: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getVotes'), account, timepoint);
    }

    // 0x9a802a6d
    async getVotesWithParams (account: TAddress, timepoint: bigint, params: TBufferLike): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getVotesWithParams'), account, timepoint, params);
    }

    // 0x43859632
    async hasVoted (proposalId: bigint, account: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'hasVoted'), proposalId, account);
    }

    // 0xc59057e4
    async hashProposal (targets: TAddress[], values: bigint[], calldatas: TBufferLike[], descriptionHash: TBufferLike): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'hashProposal'), targets, values, calldatas, descriptionHash);
    }

    // 0x06fdde03
    async name (): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'name'));
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
        return this.$read(this.$getAbiItem('function', 'proposalDeadline'), proposalId);
    }

    // 0xab58fb8e
    async proposalEta (proposalId: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'proposalEta'), proposalId);
    }

    // 0x143489d0
    async proposalProposer (proposalId: bigint): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'proposalProposer'), proposalId);
    }

    // 0x2d63f693
    async proposalSnapshot (proposalId: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'proposalSnapshot'), proposalId);
    }

    // 0xb58131b0
    async proposalThreshold (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'proposalThreshold'));
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
    async quorum (timepoint: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'quorum'), timepoint);
    }

    // 0xc28bc2fa
    async relay (sender: TSender, target: TAddress, value: bigint, data: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'relay'), sender, target, value, data);
    }

    // 0x3e4f49e6
    async state (proposalId: bigint): Promise<number> {
        return this.$read(this.$getAbiItem('function', 'state'), proposalId);
    }

    // 0x01ffc9a7
    async supportsInterface (interfaceId: TBufferLike): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'supportsInterface'), interfaceId);
    }

    // 0xd33219b4
    async timelock (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'timelock'));
    }

    // 0xa890c910
    async updateTimelock (sender: TSender, newTimelock: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'updateTimelock'), sender, newTimelock);
    }

    // 0x54fd4d50
    async version (): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'version'));
    }

    // 0x3932abb1
    async votingDelay (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'votingDelay'));
    }

    // 0x02a251a3
    async votingPeriod (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'votingPeriod'));
    }

    $call () {
        return super.$call() as IGovernorTimelockControlTxCaller;;
    }

    $data (): IGovernorTimelockControlTxData {
        return super.$data() as IGovernorTimelockControlTxData;
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

    extractLogsEIP712DomainChanged (tx: TEth.TxReceipt): ITxLogItem<TLogEIP712DomainChanged>[] {
        let abi = this.$getAbiItem('event', 'EIP712DomainChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogEIP712DomainChanged>[];
    }

    extractLogsProposalCanceled (tx: TEth.TxReceipt): ITxLogItem<TLogProposalCanceled>[] {
        let abi = this.$getAbiItem('event', 'ProposalCanceled');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogProposalCanceled>[];
    }

    extractLogsProposalCreated (tx: TEth.TxReceipt): ITxLogItem<TLogProposalCreated>[] {
        let abi = this.$getAbiItem('event', 'ProposalCreated');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogProposalCreated>[];
    }

    extractLogsProposalExecuted (tx: TEth.TxReceipt): ITxLogItem<TLogProposalExecuted>[] {
        let abi = this.$getAbiItem('event', 'ProposalExecuted');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogProposalExecuted>[];
    }

    extractLogsProposalQueued (tx: TEth.TxReceipt): ITxLogItem<TLogProposalQueued>[] {
        let abi = this.$getAbiItem('event', 'ProposalQueued');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogProposalQueued>[];
    }

    extractLogsTimelockChange (tx: TEth.TxReceipt): ITxLogItem<TLogTimelockChange>[] {
        let abi = this.$getAbiItem('event', 'TimelockChange');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogTimelockChange>[];
    }

    extractLogsVoteCast (tx: TEth.TxReceipt): ITxLogItem<TLogVoteCast>[] {
        let abi = this.$getAbiItem('event', 'VoteCast');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogVoteCast>[];
    }

    extractLogsVoteCastWithParams (tx: TEth.TxReceipt): ITxLogItem<TLogVoteCastWithParams>[] {
        let abi = this.$getAbiItem('event', 'VoteCastWithParams');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogVoteCastWithParams>[];
    }

    async getPastLogsEIP712DomainChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogEIP712DomainChanged>[]> {
        return await this.$getPastLogsParsed('EIP712DomainChanged', options) as any;
    }

    async getPastLogsProposalCanceled (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogProposalCanceled>[]> {
        return await this.$getPastLogsParsed('ProposalCanceled', options) as any;
    }

    async getPastLogsProposalCreated (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogProposalCreated>[]> {
        return await this.$getPastLogsParsed('ProposalCreated', options) as any;
    }

    async getPastLogsProposalExecuted (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogProposalExecuted>[]> {
        return await this.$getPastLogsParsed('ProposalExecuted', options) as any;
    }

    async getPastLogsProposalQueued (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogProposalQueued>[]> {
        return await this.$getPastLogsParsed('ProposalQueued', options) as any;
    }

    async getPastLogsTimelockChange (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogTimelockChange>[]> {
        return await this.$getPastLogsParsed('TimelockChange', options) as any;
    }

    async getPastLogsVoteCast (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { voter?: TAddress }
    }): Promise<ITxLogItem<TLogVoteCast>[]> {
        return await this.$getPastLogsParsed('VoteCast', options) as any;
    }

    async getPastLogsVoteCastWithParams (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { voter?: TAddress }
    }): Promise<ITxLogItem<TLogVoteCastWithParams>[]> {
        return await this.$getPastLogsParsed('VoteCastWithParams', options) as any;
    }

    abi: TAbiItem[] = [{"inputs":[],"name":"Empty","type":"error"},{"inputs":[],"name":"InvalidShortString","type":"error"},{"inputs":[{"internalType":"string","name":"str","type":"string"}],"name":"StringTooLong","type":"error"},{"anonymous":false,"inputs":[],"name":"EIP712DomainChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"ProposalCanceled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"proposalId","type":"uint256"},{"indexed":false,"internalType":"address","name":"proposer","type":"address"},{"indexed":false,"internalType":"address[]","name":"targets","type":"address[]"},{"indexed":false,"internalType":"uint256[]","name":"values","type":"uint256[]"},{"indexed":false,"internalType":"string[]","name":"signatures","type":"string[]"},{"indexed":false,"internalType":"bytes[]","name":"calldatas","type":"bytes[]"},{"indexed":false,"internalType":"uint256","name":"voteStart","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"voteEnd","type":"uint256"},{"indexed":false,"internalType":"string","name":"description","type":"string"}],"name":"ProposalCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"ProposalExecuted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"proposalId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"eta","type":"uint256"}],"name":"ProposalQueued","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"oldTimelock","type":"address"},{"indexed":false,"internalType":"address","name":"newTimelock","type":"address"}],"name":"TimelockChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"voter","type":"address"},{"indexed":false,"internalType":"uint256","name":"proposalId","type":"uint256"},{"indexed":false,"internalType":"uint8","name":"support","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"weight","type":"uint256"},{"indexed":false,"internalType":"string","name":"reason","type":"string"}],"name":"VoteCast","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"voter","type":"address"},{"indexed":false,"internalType":"uint256","name":"proposalId","type":"uint256"},{"indexed":false,"internalType":"uint8","name":"support","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"weight","type":"uint256"},{"indexed":false,"internalType":"string","name":"reason","type":"string"},{"indexed":false,"internalType":"bytes","name":"params","type":"bytes"}],"name":"VoteCastWithParams","type":"event"},{"inputs":[],"name":"BALLOT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"CLOCK_MODE","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"COUNTING_MODE","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"EXTENDED_BALLOT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"targets","type":"address[]"},{"internalType":"uint256[]","name":"values","type":"uint256[]"},{"internalType":"bytes[]","name":"calldatas","type":"bytes[]"},{"internalType":"bytes32","name":"descriptionHash","type":"bytes32"}],"name":"cancel","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"},{"internalType":"uint8","name":"support","type":"uint8"}],"name":"castVote","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"},{"internalType":"uint8","name":"support","type":"uint8"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"castVoteBySig","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"},{"internalType":"uint8","name":"support","type":"uint8"},{"internalType":"string","name":"reason","type":"string"}],"name":"castVoteWithReason","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"},{"internalType":"uint8","name":"support","type":"uint8"},{"internalType":"string","name":"reason","type":"string"},{"internalType":"bytes","name":"params","type":"bytes"}],"name":"castVoteWithReasonAndParams","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"},{"internalType":"uint8","name":"support","type":"uint8"},{"internalType":"string","name":"reason","type":"string"},{"internalType":"bytes","name":"params","type":"bytes"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"castVoteWithReasonAndParamsBySig","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"clock","outputs":[{"internalType":"uint48","name":"","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"eip712Domain","outputs":[{"internalType":"bytes1","name":"fields","type":"bytes1"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"version","type":"string"},{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"verifyingContract","type":"address"},{"internalType":"bytes32","name":"salt","type":"bytes32"},{"internalType":"uint256[]","name":"extensions","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"targets","type":"address[]"},{"internalType":"uint256[]","name":"values","type":"uint256[]"},{"internalType":"bytes[]","name":"calldatas","type":"bytes[]"},{"internalType":"bytes32","name":"descriptionHash","type":"bytes32"}],"name":"execute","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"timepoint","type":"uint256"}],"name":"getVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"timepoint","type":"uint256"},{"internalType":"bytes","name":"params","type":"bytes"}],"name":"getVotesWithParams","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"},{"internalType":"address","name":"account","type":"address"}],"name":"hasVoted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"targets","type":"address[]"},{"internalType":"uint256[]","name":"values","type":"uint256[]"},{"internalType":"bytes[]","name":"calldatas","type":"bytes[]"},{"internalType":"bytes32","name":"descriptionHash","type":"bytes32"}],"name":"hashProposal","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC1155BatchReceived","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC1155Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC721Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"proposalDeadline","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"proposalEta","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"proposalProposer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"proposalSnapshot","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proposalThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"targets","type":"address[]"},{"internalType":"uint256[]","name":"values","type":"uint256[]"},{"internalType":"bytes[]","name":"calldatas","type":"bytes[]"},{"internalType":"string","name":"description","type":"string"}],"name":"propose","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"targets","type":"address[]"},{"internalType":"uint256[]","name":"values","type":"uint256[]"},{"internalType":"bytes[]","name":"calldatas","type":"bytes[]"},{"internalType":"bytes32","name":"descriptionHash","type":"bytes32"}],"name":"queue","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"timepoint","type":"uint256"}],"name":"quorum","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"target","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"relay","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"state","outputs":[{"internalType":"enum IGovernor.ProposalState","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"timelock","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract TimelockController","name":"newTimelock","type":"address"}],"name":"updateTimelock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"votingDelay","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"votingPeriod","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}]


}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogEIP712DomainChanged = {

    };
    type TLogEIP712DomainChangedParameters = [  ];
    type TLogProposalCanceled = {
        proposalId: bigint
    };
    type TLogProposalCanceledParameters = [ proposalId: bigint ];
    type TLogProposalCreated = {
        proposalId: bigint, proposer: TAddress, targets: TAddress[], values: bigint[], signatures: string[], calldatas: TBufferLike[], voteStart: bigint, voteEnd: bigint, description: string
    };
    type TLogProposalCreatedParameters = [ proposalId: bigint, proposer: TAddress, targets: TAddress[], values: bigint[], signatures: string[], calldatas: TBufferLike[], voteStart: bigint, voteEnd: bigint, description: string ];
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
  EIP712DomainChanged: TLogEIP712DomainChangedParameters
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

interface IMethodCLOCK_MODE {
  method: "CLOCK_MODE"
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

interface IMethodCancel {
  method: "cancel"
  arguments: [ targets: TAddress[], values: bigint[], calldatas: TBufferLike[], descriptionHash: TBufferLike ]
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

interface IMethodClock {
  method: "clock"
  arguments: [  ]
}

interface IMethodEip712Domain {
  method: "eip712Domain"
  arguments: [  ]
}

interface IMethodExecute {
  method: "execute"
  arguments: [ targets: TAddress[], values: bigint[], calldatas: TBufferLike[], descriptionHash: TBufferLike ]
}

interface IMethodGetVotes {
  method: "getVotes"
  arguments: [ account: TAddress, timepoint: bigint ]
}

interface IMethodGetVotesWithParams {
  method: "getVotesWithParams"
  arguments: [ account: TAddress, timepoint: bigint, params: TBufferLike ]
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

interface IMethodProposalProposer {
  method: "proposalProposer"
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
  arguments: [ timepoint: bigint ]
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
  CLOCK_MODE: IMethodCLOCK_MODE
  COUNTING_MODE: IMethodCOUNTING_MODE
  EXTENDED_BALLOT_TYPEHASH: IMethodEXTENDED_BALLOT_TYPEHASH
  cancel: IMethodCancel
  castVote: IMethodCastVote
  castVoteBySig: IMethodCastVoteBySig
  castVoteWithReason: IMethodCastVoteWithReason
  castVoteWithReasonAndParams: IMethodCastVoteWithReasonAndParams
  castVoteWithReasonAndParamsBySig: IMethodCastVoteWithReasonAndParamsBySig
  clock: IMethodClock
  eip712Domain: IMethodEip712Domain
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
  proposalProposer: IMethodProposalProposer
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






interface IGovernorTimelockControlTxCaller {
    cancel (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TBufferLike[], descriptionHash: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    castVote (sender: TSender, proposalId: bigint, support: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    castVoteBySig (sender: TSender, proposalId: bigint, support: number, v: number, r: TBufferLike, s: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    castVoteWithReason (sender: TSender, proposalId: bigint, support: number, reason: string): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    castVoteWithReasonAndParams (sender: TSender, proposalId: bigint, support: number, reason: string, params: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    castVoteWithReasonAndParamsBySig (sender: TSender, proposalId: bigint, support: number, reason: string, params: TBufferLike, v: number, r: TBufferLike, s: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    execute (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TBufferLike[], descriptionHash: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    onERC1155BatchReceived (sender: TSender, input0: TAddress, input1: TAddress, input2: bigint[], input3: bigint[], input4: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    onERC1155Received (sender: TSender, input0: TAddress, input1: TAddress, input2: bigint, input3: bigint, input4: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    onERC721Received (sender: TSender, input0: TAddress, input1: TAddress, input2: bigint, input3: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    propose (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TBufferLike[], description: string): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    queue (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TBufferLike[], descriptionHash: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    relay (sender: TSender, target: TAddress, value: bigint, data: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    updateTimelock (sender: TSender, newTimelock: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IGovernorTimelockControlTxData {
    cancel (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TBufferLike[], descriptionHash: TBufferLike): Promise<TEth.TxLike>
    castVote (sender: TSender, proposalId: bigint, support: number): Promise<TEth.TxLike>
    castVoteBySig (sender: TSender, proposalId: bigint, support: number, v: number, r: TBufferLike, s: TBufferLike): Promise<TEth.TxLike>
    castVoteWithReason (sender: TSender, proposalId: bigint, support: number, reason: string): Promise<TEth.TxLike>
    castVoteWithReasonAndParams (sender: TSender, proposalId: bigint, support: number, reason: string, params: TBufferLike): Promise<TEth.TxLike>
    castVoteWithReasonAndParamsBySig (sender: TSender, proposalId: bigint, support: number, reason: string, params: TBufferLike, v: number, r: TBufferLike, s: TBufferLike): Promise<TEth.TxLike>
    execute (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TBufferLike[], descriptionHash: TBufferLike): Promise<TEth.TxLike>
    onERC1155BatchReceived (sender: TSender, input0: TAddress, input1: TAddress, input2: bigint[], input3: bigint[], input4: TBufferLike): Promise<TEth.TxLike>
    onERC1155Received (sender: TSender, input0: TAddress, input1: TAddress, input2: bigint, input3: bigint, input4: TBufferLike): Promise<TEth.TxLike>
    onERC721Received (sender: TSender, input0: TAddress, input1: TAddress, input2: bigint, input3: TBufferLike): Promise<TEth.TxLike>
    propose (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TBufferLike[], description: string): Promise<TEth.TxLike>
    queue (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TBufferLike[], descriptionHash: TBufferLike): Promise<TEth.TxLike>
    relay (sender: TSender, target: TAddress, value: bigint, data: TBufferLike): Promise<TEth.TxLike>
    updateTimelock (sender: TSender, newTimelock: TAddress): Promise<TEth.TxLike>
}


