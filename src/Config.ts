import { IContractDetails } from './models/IContractDetails';
import { TPlatform } from './models/TPlatform';

export interface IProviderEndpoint {
    url: string
    private?: boolean
    safe?: boolean
}
export class Config {
    accounts: {
        [platform in TPlatform]: {
            [name: string]: {
                address: string
                key: string
            }
        }
    }
    blockchainExplorer: {
        [platform in TPlatform]: {
            key: string
            host: string
        }
    }
    web3: {
        [platform in TPlatform]: {
            endpoints: IProviderEndpoint[]
        }
    }
    contracts?: {
        [platform in TPlatform]: IContractDetails[]
    }
}

export const config = new Config();
