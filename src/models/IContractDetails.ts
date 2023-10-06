import type { TAbiItem } from '@dequanto/types/TAbi';
import { TEth } from './TEth';
export interface IContractDetails {
    name: string
    address: TEth.Address
    proxy?: string
    refAbi?: string

    abi?: string | TAbiItem[]
}
