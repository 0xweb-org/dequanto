import { TAddress } from '@dequanto/models/TAddress';

export interface IAbiProvider {
    getContractAbi (address: TAddress, opts: { implementation: string }): Promise<{ abi: string, implementation: TAddress }>
}
