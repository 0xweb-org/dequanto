import { TAddress } from '@dequanto/models/TAddress';
import { IContractDetails } from '@dequanto/models/IContractDetails';
import { Transaction } from 'web3-core';
import { IAbiProvider } from './IAbiProvider';

export interface IBlockChainExplorer extends IAbiProvider {
    localDb: IContractDetails[]
    getContractMeta(q: string): Promise<IContractDetails>;
    getContractAbi (address: TAddress, opts?: { implementation: string }): Promise<{ abi: string, implementation: TAddress }>
    getContractSource (address: string): Promise<{
        SourceCode: string
        ContractName: string
        ABI: string
    }>

    getTransactions (address: TAddress, params?: { fromBlockNumber?: number, page?: number, size?: number }): Promise<Transaction[]>
    getTransactionsAll (address: TAddress): Promise<Transaction[]>

    getInternalTransactions (address: TAddress, params?: { fromBlockNumber?: number, page?: number, size?: number }): Promise<Transaction[]>
    getInternalTransactionsAll (address: TAddress): Promise<Transaction[]>

    getErc20Transfers(address: TAddress, fromBlockNumber?: number): Promise<IBlockChainTransferEvent[]>
    getErc20TransfersAll(address: TAddress, fromBlockNumber?: number): Promise<IBlockChainTransferEvent[]>
}

export interface IBlockChainTransferEvent {
    blockNumber: number,
    timeStamp: Date,
    hash: string
    from: string
    contractAddress: string
    to: string
    value: bigint,
    tokenName: string
    tokenSymbol: string
    tokenDecimal: number
}
