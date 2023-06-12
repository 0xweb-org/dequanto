import type { AbiItem } from 'web3-utils';
export interface IContractDetails {
    name: string
    address: string
    proxy?: string
    refAbi?: string

    abi?: string | AbiItem[]
}
