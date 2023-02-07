import { TAddress } from '@dequanto/models/TAddress';
import { IContractDetails } from '@dequanto/models/IContractDetails';
import { IAbiProvider } from './IAbiProvider';
import { type Transaction } from 'web3-core';


export interface IBlockChainExplorer extends IAbiProvider {
    localDb: IContractDetails[]
    getContractMeta(q: string): Promise<IContractDetails>;
    getContractAbi (address: TAddress, opts?: { implementation?: string }): Promise<{ abi: string, implementation: TAddress }>
    getContractSource (address: string): Promise<{
        SourceCode: {
            contractName: string
            files: {
                [filename: string]: {
                    content: string
                }
            }
        }
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
