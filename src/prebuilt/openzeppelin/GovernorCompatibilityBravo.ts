/**
 *  AUTO-Generated Class: 2024-05-17 00:25
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

export namespace GovernorCompatibilityBravoErrors {
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

export class GovernorCompatibilityBravo extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        
    }

    Types: TGovernorCompatibilityBravoTypes;

    $meta = {
        "class": "./src/prebuilt/openzeppelin/GovernorCompatibilityBravo.ts"
    }

    // 0xdeaaa7cc
    async BALLOT_TYPEHASH (): Promise<TEth.Hex> {
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
    async EXTENDED_BALLOT_TYPEHASH (): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'EXTENDED_BALLOT_TYPEHASH'));
    }

    // 0x40e58ee5
    async cancel (sender: TSender, proposalId: bigint): Promise<TxWriter>
    // 0x452115d6
    async cancel (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TEth.Hex[], descriptionHash: TEth.Hex): Promise<TxWriter>
    async cancel (sender: TSender, ...args): Promise<TxWriter> {
        let abi = this.$getAbiItemOverload([ 'function cancel(uint256)', 'function cancel(address[], uint256[], bytes[], bytes32) returns uint256' ], args);
        return this.$write(abi, sender, ...args);
    }

    // 0x56781388
    async castVote (sender: TSender, proposalId: bigint, support: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'castVote'), sender, proposalId, support);
    }

    // 0x3bccf4fd
    async castVoteBySig (sender: TSender, proposalId: bigint, support: number, v: number, r: TEth.Hex, s: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'castVoteBySig'), sender, proposalId, support, v, r, s);
    }

    // 0x7b3c71d3
    async castVoteWithReason (sender: TSender, proposalId: bigint, support: number, reason: string): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'castVoteWithReason'), sender, proposalId, support, reason);
    }

    // 0x5f398a14
    async castVoteWithReasonAndParams (sender: TSender, proposalId: bigint, support: number, reason: string, params: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'castVoteWithReasonAndParams'), sender, proposalId, support, reason, params);
    }

    // 0x03420181
    async castVoteWithReasonAndParamsBySig (sender: TSender, proposalId: bigint, support: number, reason: string, params: TEth.Hex, v: number, r: TEth.Hex, s: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'castVoteWithReasonAndParamsBySig'), sender, proposalId, support, reason, params, v, r, s);
    }

    // 0x91ddadf4
    async clock (): Promise<number> {
        return this.$read(this.$getAbiItem('function', 'clock'));
    }

    // 0x84b0196e
    async eip712Domain (): Promise<{ fields: TEth.Hex, name: string, version: string, chainId: bigint, verifyingContract: TAddress, salt: TEth.Hex, extensions: bigint[] }> {
        return this.$read(this.$getAbiItem('function', 'eip712Domain'));
    }

    // 0x2656227d
    async execute (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TEth.Hex[], descriptionHash: TEth.Hex): Promise<TxWriter>
    // 0xfe0d94c1
    async execute (sender: TSender, proposalId: bigint): Promise<TxWriter>
    async execute (sender: TSender, ...args): Promise<TxWriter> {
        let abi = this.$getAbiItemOverload([ 'function execute(address[], uint256[], bytes[], bytes32) returns uint256', 'function execute(uint256)' ], args);
        return this.$write(abi, sender, ...args);
    }

    // 0x328dd982
    async getActions (proposalId: bigint): Promise<{ targets: TAddress[], values: bigint[], signatures: string[], calldatas: TEth.Hex[] }> {
        return this.$read(this.$getAbiItem('function', 'getActions'), proposalId);
    }

    // 0xe23a9a52
    async getReceipt (proposalId: bigint, voter: TAddress): Promise<{ hasVoted: boolean, support: number, votes: bigint }> {
        return this.$read(this.$getAbiItem('function', 'getReceipt'), proposalId, voter);
    }

    // 0xeb9019d4
    async getVotes (account: TAddress, timepoint: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getVotes'), account, timepoint);
    }

    // 0x9a802a6d
    async getVotesWithParams (account: TAddress, timepoint: bigint, params: TEth.Hex): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getVotesWithParams'), account, timepoint, params);
    }

    // 0x43859632
    async hasVoted (proposalId: bigint, account: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'hasVoted'), proposalId, account);
    }

    // 0xc59057e4
    async hashProposal (targets: TAddress[], values: bigint[], calldatas: TEth.Hex[], descriptionHash: TEth.Hex): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'hashProposal'), targets, values, calldatas, descriptionHash);
    }

    // 0x06fdde03
    async name (): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'name'));
    }

    // 0xbc197c81
    async onERC1155BatchReceived (sender: TSender, input0: TAddress, input1: TAddress, input2: bigint[], input3: bigint[], input4: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'onERC1155BatchReceived'), sender, input0, input1, input2, input3, input4);
    }

    // 0xf23a6e61
    async onERC1155Received (sender: TSender, input0: TAddress, input1: TAddress, input2: bigint, input3: bigint, input4: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'onERC1155Received'), sender, input0, input1, input2, input3, input4);
    }

    // 0x150b7a02
    async onERC721Received (sender: TSender, input0: TAddress, input1: TAddress, input2: bigint, input3: TEth.Hex): Promise<TxWriter> {
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

    // 0x013cf08b
    async proposals (proposalId: bigint): Promise<{ id: bigint, proposer: TAddress, eta: bigint, startBlock: bigint, endBlock: bigint, forVotes: bigint, againstVotes: bigint, abstainVotes: bigint, canceled: boolean, executed: boolean }> {
        return this.$read(this.$getAbiItem('function', 'proposals'), proposalId);
    }

    // 0x7d5e81e2
    async propose (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TEth.Hex[], description: string): Promise<TxWriter>
    // 0xda95691a
    async propose (sender: TSender, targets: TAddress[], values: bigint[], signatures: string[], calldatas: TEth.Hex[], description: string): Promise<TxWriter>
    async propose (sender: TSender, ...args): Promise<TxWriter> {
        let abi = this.$getAbiItemOverload([ 'function propose(address[], uint256[], bytes[], string) returns uint256', 'function propose(address[], uint256[], string[], bytes[], string) returns uint256' ], args);
        return this.$write(abi, sender, ...args);
    }

    // 0x160cbed7
    async queue (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TEth.Hex[], descriptionHash: TEth.Hex): Promise<TxWriter>
    // 0xddf0b009
    async queue (sender: TSender, proposalId: bigint): Promise<TxWriter>
    async queue (sender: TSender, ...args): Promise<TxWriter> {
        let abi = this.$getAbiItemOverload([ 'function queue(address[], uint256[], bytes[], bytes32) returns uint256', 'function queue(uint256)' ], args);
        return this.$write(abi, sender, ...args);
    }

    // 0xf8ce560a
    async quorum (timepoint: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'quorum'), timepoint);
    }

    // 0x24bc1a64
    async quorumVotes (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'quorumVotes'));
    }

    // 0xc28bc2fa
    async relay (sender: TSender, target: TAddress, value: bigint, data: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'relay'), sender, target, value, data);
    }

    // 0x3e4f49e6
    async state (proposalId: bigint): Promise<number> {
        return this.$read(this.$getAbiItem('function', 'state'), proposalId);
    }

    // 0x01ffc9a7
    async supportsInterface (interfaceId: TEth.Hex): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'supportsInterface'), interfaceId);
    }

    // 0xd33219b4
    async timelock (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'timelock'));
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
        return super.$call() as IGovernorCompatibilityBravoTxCaller;
    }
    $signed (): TOverrideReturns<IGovernorCompatibilityBravoTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IGovernorCompatibilityBravoTxData {
        return super.$data() as IGovernorCompatibilityBravoTxData;
    }
    $gas (): TOverrideReturns<IGovernorCompatibilityBravoTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TGovernorCompatibilityBravoTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TGovernorCompatibilityBravoTypes['Methods'][TMethod]['arguments']
        }
    }> {
        options ??= {};
        options.filter ??= {};
        options.filter.method = method;
        return <any> this.$onTransaction(options);
    }

    onLog (event: keyof TEvents, cb?: (event: TClientEventsStreamData) => void): ClientEventsStream<TClientEventsStreamData> {
        return this.$onLog(event, cb);
    }

    async getPastLogs <TEventName extends keyof TEvents> (
        events: TEventName[]
        , options?: TEventLogOptions<TEventParams<TEventName>>
    ): Promise<ITxLogItem<TEventParams<TEventName>, TEventName>[]>
    async getPastLogs <TEventName extends keyof TEvents> (
        event: TEventName
        , options?: TEventLogOptions<TEventParams<TEventName>>
    ): Promise<ITxLogItem<TEventParams<TEventName>, TEventName>[]>
    async getPastLogs (mix: any, options?): Promise<any> {
        return await super.getPastLogs(mix, options) as any;
    }

    onEIP712DomainChanged (fn?: (event: TClientEventsStreamData<TEventArguments<'EIP712DomainChanged'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'EIP712DomainChanged'>>> {
        return this.$onLog('EIP712DomainChanged', fn);
    }

    onProposalCanceled (fn?: (event: TClientEventsStreamData<TEventArguments<'ProposalCanceled'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'ProposalCanceled'>>> {
        return this.$onLog('ProposalCanceled', fn);
    }

    onProposalCreated (fn?: (event: TClientEventsStreamData<TEventArguments<'ProposalCreated'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'ProposalCreated'>>> {
        return this.$onLog('ProposalCreated', fn);
    }

    onProposalExecuted (fn?: (event: TClientEventsStreamData<TEventArguments<'ProposalExecuted'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'ProposalExecuted'>>> {
        return this.$onLog('ProposalExecuted', fn);
    }

    onProposalQueued (fn?: (event: TClientEventsStreamData<TEventArguments<'ProposalQueued'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'ProposalQueued'>>> {
        return this.$onLog('ProposalQueued', fn);
    }

    onVoteCast (fn?: (event: TClientEventsStreamData<TEventArguments<'VoteCast'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'VoteCast'>>> {
        return this.$onLog('VoteCast', fn);
    }

    onVoteCastWithParams (fn?: (event: TClientEventsStreamData<TEventArguments<'VoteCastWithParams'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'VoteCastWithParams'>>> {
        return this.$onLog('VoteCastWithParams', fn);
    }

    extractLogsEIP712DomainChanged (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'EIP712DomainChanged'>>[] {
        let abi = this.$getAbiItem('event', 'EIP712DomainChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'EIP712DomainChanged'>>[];
    }

    extractLogsProposalCanceled (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ProposalCanceled'>>[] {
        let abi = this.$getAbiItem('event', 'ProposalCanceled');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ProposalCanceled'>>[];
    }

    extractLogsProposalCreated (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ProposalCreated'>>[] {
        let abi = this.$getAbiItem('event', 'ProposalCreated');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ProposalCreated'>>[];
    }

    extractLogsProposalExecuted (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ProposalExecuted'>>[] {
        let abi = this.$getAbiItem('event', 'ProposalExecuted');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ProposalExecuted'>>[];
    }

    extractLogsProposalQueued (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ProposalQueued'>>[] {
        let abi = this.$getAbiItem('event', 'ProposalQueued');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ProposalQueued'>>[];
    }

    extractLogsVoteCast (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'VoteCast'>>[] {
        let abi = this.$getAbiItem('event', 'VoteCast');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'VoteCast'>>[];
    }

    extractLogsVoteCastWithParams (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'VoteCastWithParams'>>[] {
        let abi = this.$getAbiItem('event', 'VoteCastWithParams');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'VoteCastWithParams'>>[];
    }

    async getPastLogsEIP712DomainChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'EIP712DomainChanged'>>[]> {
        return await this.$getPastLogsParsed('EIP712DomainChanged', options) as any;
    }

    async getPastLogsProposalCanceled (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'ProposalCanceled'>>[]> {
        return await this.$getPastLogsParsed('ProposalCanceled', options) as any;
    }

    async getPastLogsProposalCreated (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'ProposalCreated'>>[]> {
        return await this.$getPastLogsParsed('ProposalCreated', options) as any;
    }

    async getPastLogsProposalExecuted (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'ProposalExecuted'>>[]> {
        return await this.$getPastLogsParsed('ProposalExecuted', options) as any;
    }

    async getPastLogsProposalQueued (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'ProposalQueued'>>[]> {
        return await this.$getPastLogsParsed('ProposalQueued', options) as any;
    }

    async getPastLogsVoteCast (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { voter?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'VoteCast'>>[]> {
        return await this.$getPastLogsParsed('VoteCast', options) as any;
    }

    async getPastLogsVoteCastWithParams (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { voter?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'VoteCastWithParams'>>[]> {
        return await this.$getPastLogsParsed('VoteCastWithParams', options) as any;
    }

    abi: TAbiItem[] = [{"inputs":[],"name":"Empty","type":"error"},{"inputs":[],"name":"InvalidShortString","type":"error"},{"inputs":[{"internalType":"string","name":"str","type":"string"}],"name":"StringTooLong","type":"error"},{"anonymous":false,"inputs":[],"name":"EIP712DomainChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"ProposalCanceled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"proposalId","type":"uint256"},{"indexed":false,"internalType":"address","name":"proposer","type":"address"},{"indexed":false,"internalType":"address[]","name":"targets","type":"address[]"},{"indexed":false,"internalType":"uint256[]","name":"values","type":"uint256[]"},{"indexed":false,"internalType":"string[]","name":"signatures","type":"string[]"},{"indexed":false,"internalType":"bytes[]","name":"calldatas","type":"bytes[]"},{"indexed":false,"internalType":"uint256","name":"voteStart","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"voteEnd","type":"uint256"},{"indexed":false,"internalType":"string","name":"description","type":"string"}],"name":"ProposalCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"ProposalExecuted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"proposalId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"eta","type":"uint256"}],"name":"ProposalQueued","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"voter","type":"address"},{"indexed":false,"internalType":"uint256","name":"proposalId","type":"uint256"},{"indexed":false,"internalType":"uint8","name":"support","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"weight","type":"uint256"},{"indexed":false,"internalType":"string","name":"reason","type":"string"}],"name":"VoteCast","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"voter","type":"address"},{"indexed":false,"internalType":"uint256","name":"proposalId","type":"uint256"},{"indexed":false,"internalType":"uint8","name":"support","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"weight","type":"uint256"},{"indexed":false,"internalType":"string","name":"reason","type":"string"},{"indexed":false,"internalType":"bytes","name":"params","type":"bytes"}],"name":"VoteCastWithParams","type":"event"},{"inputs":[],"name":"BALLOT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"CLOCK_MODE","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"COUNTING_MODE","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"EXTENDED_BALLOT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"cancel","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"targets","type":"address[]"},{"internalType":"uint256[]","name":"values","type":"uint256[]"},{"internalType":"bytes[]","name":"calldatas","type":"bytes[]"},{"internalType":"bytes32","name":"descriptionHash","type":"bytes32"}],"name":"cancel","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"},{"internalType":"uint8","name":"support","type":"uint8"}],"name":"castVote","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"},{"internalType":"uint8","name":"support","type":"uint8"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"castVoteBySig","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"},{"internalType":"uint8","name":"support","type":"uint8"},{"internalType":"string","name":"reason","type":"string"}],"name":"castVoteWithReason","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"},{"internalType":"uint8","name":"support","type":"uint8"},{"internalType":"string","name":"reason","type":"string"},{"internalType":"bytes","name":"params","type":"bytes"}],"name":"castVoteWithReasonAndParams","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"},{"internalType":"uint8","name":"support","type":"uint8"},{"internalType":"string","name":"reason","type":"string"},{"internalType":"bytes","name":"params","type":"bytes"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"castVoteWithReasonAndParamsBySig","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"clock","outputs":[{"internalType":"uint48","name":"","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"eip712Domain","outputs":[{"internalType":"bytes1","name":"fields","type":"bytes1"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"version","type":"string"},{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"verifyingContract","type":"address"},{"internalType":"bytes32","name":"salt","type":"bytes32"},{"internalType":"uint256[]","name":"extensions","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"targets","type":"address[]"},{"internalType":"uint256[]","name":"values","type":"uint256[]"},{"internalType":"bytes[]","name":"calldatas","type":"bytes[]"},{"internalType":"bytes32","name":"descriptionHash","type":"bytes32"}],"name":"execute","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"execute","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"getActions","outputs":[{"internalType":"address[]","name":"targets","type":"address[]"},{"internalType":"uint256[]","name":"values","type":"uint256[]"},{"internalType":"string[]","name":"signatures","type":"string[]"},{"internalType":"bytes[]","name":"calldatas","type":"bytes[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"},{"internalType":"address","name":"voter","type":"address"}],"name":"getReceipt","outputs":[{"components":[{"internalType":"bool","name":"hasVoted","type":"bool"},{"internalType":"uint8","name":"support","type":"uint8"},{"internalType":"uint96","name":"votes","type":"uint96"}],"internalType":"struct IGovernorCompatibilityBravo.Receipt","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"timepoint","type":"uint256"}],"name":"getVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"timepoint","type":"uint256"},{"internalType":"bytes","name":"params","type":"bytes"}],"name":"getVotesWithParams","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"},{"internalType":"address","name":"account","type":"address"}],"name":"hasVoted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"targets","type":"address[]"},{"internalType":"uint256[]","name":"values","type":"uint256[]"},{"internalType":"bytes[]","name":"calldatas","type":"bytes[]"},{"internalType":"bytes32","name":"descriptionHash","type":"bytes32"}],"name":"hashProposal","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC1155BatchReceived","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC1155Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC721Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"proposalDeadline","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"proposalEta","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"proposalProposer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"proposalSnapshot","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proposalThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"proposals","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"proposer","type":"address"},{"internalType":"uint256","name":"eta","type":"uint256"},{"internalType":"uint256","name":"startBlock","type":"uint256"},{"internalType":"uint256","name":"endBlock","type":"uint256"},{"internalType":"uint256","name":"forVotes","type":"uint256"},{"internalType":"uint256","name":"againstVotes","type":"uint256"},{"internalType":"uint256","name":"abstainVotes","type":"uint256"},{"internalType":"bool","name":"canceled","type":"bool"},{"internalType":"bool","name":"executed","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"targets","type":"address[]"},{"internalType":"uint256[]","name":"values","type":"uint256[]"},{"internalType":"bytes[]","name":"calldatas","type":"bytes[]"},{"internalType":"string","name":"description","type":"string"}],"name":"propose","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"targets","type":"address[]"},{"internalType":"uint256[]","name":"values","type":"uint256[]"},{"internalType":"string[]","name":"signatures","type":"string[]"},{"internalType":"bytes[]","name":"calldatas","type":"bytes[]"},{"internalType":"string","name":"description","type":"string"}],"name":"propose","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"targets","type":"address[]"},{"internalType":"uint256[]","name":"values","type":"uint256[]"},{"internalType":"bytes[]","name":"calldatas","type":"bytes[]"},{"internalType":"bytes32","name":"descriptionHash","type":"bytes32"}],"name":"queue","outputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"queue","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"timepoint","type":"uint256"}],"name":"quorum","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"quorumVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"target","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"relay","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"state","outputs":[{"internalType":"enum IGovernor.ProposalState","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"timelock","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"votingDelay","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"votingPeriod","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TGovernorCompatibilityBravoTypes = {
    Events: {
        EIP712DomainChanged: {
            outputParams: {  },
            outputArgs:   [  ],
        }
        ProposalCanceled: {
            outputParams: { proposalId: bigint },
            outputArgs:   [ proposalId: bigint ],
        }
        ProposalCreated: {
            outputParams: { proposalId: bigint, proposer: TAddress, targets: TAddress[], values: bigint[], signatures: string[], calldatas: TEth.Hex[], voteStart: bigint, voteEnd: bigint, description: string },
            outputArgs:   [ proposalId: bigint, proposer: TAddress, targets: TAddress[], values: bigint[], signatures: string[], calldatas: TEth.Hex[], voteStart: bigint, voteEnd: bigint, description: string ],
        }
        ProposalExecuted: {
            outputParams: { proposalId: bigint },
            outputArgs:   [ proposalId: bigint ],
        }
        ProposalQueued: {
            outputParams: { proposalId: bigint, eta: bigint },
            outputArgs:   [ proposalId: bigint, eta: bigint ],
        }
        VoteCast: {
            outputParams: { voter: TAddress, proposalId: bigint, support: number, weight: bigint, reason: string },
            outputArgs:   [ voter: TAddress, proposalId: bigint, support: number, weight: bigint, reason: string ],
        }
        VoteCastWithParams: {
            outputParams: { voter: TAddress, proposalId: bigint, support: number, weight: bigint, reason: string, params: TEth.Hex },
            outputArgs:   [ voter: TAddress, proposalId: bigint, support: number, weight: bigint, reason: string, params: TEth.Hex ],
        }
    },
    Methods: {
        BALLOT_TYPEHASH: {
          method: "BALLOT_TYPEHASH"
          arguments: [  ]
        }
        CLOCK_MODE: {
          method: "CLOCK_MODE"
          arguments: [  ]
        }
        COUNTING_MODE: {
          method: "COUNTING_MODE"
          arguments: [  ]
        }
        EXTENDED_BALLOT_TYPEHASH: {
          method: "EXTENDED_BALLOT_TYPEHASH"
          arguments: [  ]
        }
        cancel: {
          method: "cancel"
          arguments: [ proposalId: bigint ] | [ targets: TAddress[], values: bigint[], calldatas: TEth.Hex[], descriptionHash: TEth.Hex ]
        }
        castVote: {
          method: "castVote"
          arguments: [ proposalId: bigint, support: number ]
        }
        castVoteBySig: {
          method: "castVoteBySig"
          arguments: [ proposalId: bigint, support: number, v: number, r: TEth.Hex, s: TEth.Hex ]
        }
        castVoteWithReason: {
          method: "castVoteWithReason"
          arguments: [ proposalId: bigint, support: number, reason: string ]
        }
        castVoteWithReasonAndParams: {
          method: "castVoteWithReasonAndParams"
          arguments: [ proposalId: bigint, support: number, reason: string, params: TEth.Hex ]
        }
        castVoteWithReasonAndParamsBySig: {
          method: "castVoteWithReasonAndParamsBySig"
          arguments: [ proposalId: bigint, support: number, reason: string, params: TEth.Hex, v: number, r: TEth.Hex, s: TEth.Hex ]
        }
        clock: {
          method: "clock"
          arguments: [  ]
        }
        eip712Domain: {
          method: "eip712Domain"
          arguments: [  ]
        }
        execute: {
          method: "execute"
          arguments: [ targets: TAddress[], values: bigint[], calldatas: TEth.Hex[], descriptionHash: TEth.Hex ] | [ proposalId: bigint ]
        }
        getActions: {
          method: "getActions"
          arguments: [ proposalId: bigint ]
        }
        getReceipt: {
          method: "getReceipt"
          arguments: [ proposalId: bigint, voter: TAddress ]
        }
        getVotes: {
          method: "getVotes"
          arguments: [ account: TAddress, timepoint: bigint ]
        }
        getVotesWithParams: {
          method: "getVotesWithParams"
          arguments: [ account: TAddress, timepoint: bigint, params: TEth.Hex ]
        }
        hasVoted: {
          method: "hasVoted"
          arguments: [ proposalId: bigint, account: TAddress ]
        }
        hashProposal: {
          method: "hashProposal"
          arguments: [ targets: TAddress[], values: bigint[], calldatas: TEth.Hex[], descriptionHash: TEth.Hex ]
        }
        name: {
          method: "name"
          arguments: [  ]
        }
        onERC1155BatchReceived: {
          method: "onERC1155BatchReceived"
          arguments: [ input0: TAddress, input1: TAddress, input2: bigint[], input3: bigint[], input4: TEth.Hex ]
        }
        onERC1155Received: {
          method: "onERC1155Received"
          arguments: [ input0: TAddress, input1: TAddress, input2: bigint, input3: bigint, input4: TEth.Hex ]
        }
        onERC721Received: {
          method: "onERC721Received"
          arguments: [ input0: TAddress, input1: TAddress, input2: bigint, input3: TEth.Hex ]
        }
        proposalDeadline: {
          method: "proposalDeadline"
          arguments: [ proposalId: bigint ]
        }
        proposalEta: {
          method: "proposalEta"
          arguments: [ proposalId: bigint ]
        }
        proposalProposer: {
          method: "proposalProposer"
          arguments: [ proposalId: bigint ]
        }
        proposalSnapshot: {
          method: "proposalSnapshot"
          arguments: [ proposalId: bigint ]
        }
        proposalThreshold: {
          method: "proposalThreshold"
          arguments: [  ]
        }
        proposals: {
          method: "proposals"
          arguments: [ proposalId: bigint ]
        }
        propose: {
          method: "propose"
          arguments: [ targets: TAddress[], values: bigint[], calldatas: TEth.Hex[], description: string ] | [ targets: TAddress[], values: bigint[], signatures: string[], calldatas: TEth.Hex[], description: string ]
        }
        queue: {
          method: "queue"
          arguments: [ targets: TAddress[], values: bigint[], calldatas: TEth.Hex[], descriptionHash: TEth.Hex ] | [ proposalId: bigint ]
        }
        quorum: {
          method: "quorum"
          arguments: [ timepoint: bigint ]
        }
        quorumVotes: {
          method: "quorumVotes"
          arguments: [  ]
        }
        relay: {
          method: "relay"
          arguments: [ target: TAddress, value: bigint, data: TEth.Hex ]
        }
        state: {
          method: "state"
          arguments: [ proposalId: bigint ]
        }
        supportsInterface: {
          method: "supportsInterface"
          arguments: [ interfaceId: TEth.Hex ]
        }
        timelock: {
          method: "timelock"
          arguments: [  ]
        }
        version: {
          method: "version"
          arguments: [  ]
        }
        votingDelay: {
          method: "votingDelay"
          arguments: [  ]
        }
        votingPeriod: {
          method: "votingPeriod"
          arguments: [  ]
        }
    }
}



interface IGovernorCompatibilityBravoTxCaller {
    cancel (sender: TSender, proposalId: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    cancel (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TEth.Hex[], descriptionHash: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    castVote (sender: TSender, proposalId: bigint, support: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    castVoteBySig (sender: TSender, proposalId: bigint, support: number, v: number, r: TEth.Hex, s: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    castVoteWithReason (sender: TSender, proposalId: bigint, support: number, reason: string): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    castVoteWithReasonAndParams (sender: TSender, proposalId: bigint, support: number, reason: string, params: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    castVoteWithReasonAndParamsBySig (sender: TSender, proposalId: bigint, support: number, reason: string, params: TEth.Hex, v: number, r: TEth.Hex, s: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    execute (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TEth.Hex[], descriptionHash: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    execute (sender: TSender, proposalId: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    onERC1155BatchReceived (sender: TSender, input0: TAddress, input1: TAddress, input2: bigint[], input3: bigint[], input4: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    onERC1155Received (sender: TSender, input0: TAddress, input1: TAddress, input2: bigint, input3: bigint, input4: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    onERC721Received (sender: TSender, input0: TAddress, input1: TAddress, input2: bigint, input3: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    propose (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TEth.Hex[], description: string): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    propose (sender: TSender, targets: TAddress[], values: bigint[], signatures: string[], calldatas: TEth.Hex[], description: string): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    queue (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TEth.Hex[], descriptionHash: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    queue (sender: TSender, proposalId: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    relay (sender: TSender, target: TAddress, value: bigint, data: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IGovernorCompatibilityBravoTxData {
    cancel (sender: TSender, proposalId: bigint): Promise<TEth.TxLike>
    cancel (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TEth.Hex[], descriptionHash: TEth.Hex): Promise<TEth.TxLike>
    castVote (sender: TSender, proposalId: bigint, support: number): Promise<TEth.TxLike>
    castVoteBySig (sender: TSender, proposalId: bigint, support: number, v: number, r: TEth.Hex, s: TEth.Hex): Promise<TEth.TxLike>
    castVoteWithReason (sender: TSender, proposalId: bigint, support: number, reason: string): Promise<TEth.TxLike>
    castVoteWithReasonAndParams (sender: TSender, proposalId: bigint, support: number, reason: string, params: TEth.Hex): Promise<TEth.TxLike>
    castVoteWithReasonAndParamsBySig (sender: TSender, proposalId: bigint, support: number, reason: string, params: TEth.Hex, v: number, r: TEth.Hex, s: TEth.Hex): Promise<TEth.TxLike>
    execute (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TEth.Hex[], descriptionHash: TEth.Hex): Promise<TEth.TxLike>
    execute (sender: TSender, proposalId: bigint): Promise<TEth.TxLike>
    onERC1155BatchReceived (sender: TSender, input0: TAddress, input1: TAddress, input2: bigint[], input3: bigint[], input4: TEth.Hex): Promise<TEth.TxLike>
    onERC1155Received (sender: TSender, input0: TAddress, input1: TAddress, input2: bigint, input3: bigint, input4: TEth.Hex): Promise<TEth.TxLike>
    onERC721Received (sender: TSender, input0: TAddress, input1: TAddress, input2: bigint, input3: TEth.Hex): Promise<TEth.TxLike>
    propose (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TEth.Hex[], description: string): Promise<TEth.TxLike>
    propose (sender: TSender, targets: TAddress[], values: bigint[], signatures: string[], calldatas: TEth.Hex[], description: string): Promise<TEth.TxLike>
    queue (sender: TSender, targets: TAddress[], values: bigint[], calldatas: TEth.Hex[], descriptionHash: TEth.Hex): Promise<TEth.TxLike>
    queue (sender: TSender, proposalId: bigint): Promise<TEth.TxLike>
    relay (sender: TSender, target: TAddress, value: bigint, data: TEth.Hex): Promise<TEth.TxLike>
}


type TEvents = TGovernorCompatibilityBravoTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;
