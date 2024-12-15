import { IContractDetails } from '@dequanto/models/IContractDetails';
import { IAbiProvider } from './IAbiProvider';
import { TEth } from '@dequanto/models/TEth';
import { TAddress } from '@dequanto/models/TAddress';
import { IVerifier } from './verifiers/IVerifier';


export interface IBlockchainExplorer extends IAbiProvider, IVerifier {
    inMemoryDb: IContractDetails[]
    getContractMeta(q: string): Promise<IContractDetails>;
    getContractCreation(address: TEth.Address): Promise<{ creator: TEth.Address, txHash: TEth.Hex }>;
    getContractAbi (address: TEth.Address, opts?: { implementation?: string }): Promise<{ abi: string, implementation: TEth.Address }>
    getContractSource (address: TEth.Address): Promise<{
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

    submitContractVerification (contractData: {
        address: TAddress
        sourceCode: string | any
        contractName
        compilerVersion
        optimizer?: {
            enabled?: boolean
            runs: number
        }
        arguments?: TEth.Hex
    }): Promise<string>

    checkContractVerificationSubmission (submission: { guid }): Promise<string>

    submitContractProxyVerification (contractData: {
        address: TAddress
        expectedImplementation?: TAddress
    }): Promise<string>

    checkContractProxyVerificationSubmission (submission: { guid }): Promise<string>

    getTransactions (address: TEth.Address, params?: { fromBlockNumber?: number, page?: number, size?: number }): Promise<TEth.TxLike[]>
    getTransactionsAll (address: TEth.Address): Promise<TEth.TxLike[]>

    getInternalTransactions (address: TEth.Address, params?: { fromBlockNumber?: number, page?: number, size?: number }): Promise<TEth.TxLike[]>
    getInternalTransactionsAll (address: TEth.Address): Promise<TEth.TxLike[]>

    getErc20Transfers(address: TEth.Address, fromBlockNumber?: number): Promise<IBlockchainTransferEvent[]>
    getErc20TransfersAll(address: TEth.Address, fromBlockNumber?: number): Promise<IBlockchainTransferEvent[]>

    registerAbi (abis: {name, address, abi}[])
}

export interface IBlockchainTransferEvent {
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
