import { Web3Client } from '@dequanto/clients/Web3Client'
import { IContractDetails } from './IContractDetails'
import { TEth } from './TEth'

/** Blockchain explorer settings - in config */
export interface TExplorerDefinition {
    platform: TEth.Platform

    name?: string
    standard?: 'EIP3091' | string
    url?: string

    key?: string
    api?: string | { url?: string, key?: string }

    verification?: boolean | 'fs'

    ABI_CACHE?: string
    CONTRACTS?: IContractDetails[]

    getWeb3?: (platform?: TEth.Platform) => Web3Client
}

/** Blockchain explorer settings - normalized */
export interface TExplorer {
    platform: TEth.Platform

    name: string
    standard: 'EIP3091' | string
    url: string

    api: { url: string, key?: string }

    verification: boolean | 'fs'
}
