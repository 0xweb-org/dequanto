import { IContractDetails } from '@dequanto/models/IContractDetails';
import { ITokenGlob } from '@dequanto/models/ITokenGlob';
import { TAddress } from '@dequanto/models/TAddress';
import { TPlatform } from '@dequanto/models/TPlatform';
import { IRpcConfig } from '@dequanto/clients/ClientPool';
import { TChain } from '@dequanto/models/TChain';
import { TEth } from '@dequanto/models/TEth';


export interface IConfigData {
    settings: {
        /** Root path of the dequanto library */
        base?: string;

        /** Default generator options */
        generate?: {
            target?: 'js' | 'mjs' | 'ts'
        }
    };
    accounts: {
        [platform in TPlatform]: {
            [name: string]: {
                address: string;
                key?: string;
            };
        };
    };
    tokens: ITokenGlob[];

    blockchainExplorer: {
        [platform in TPlatform]: {
            key?: string;
            host?: string;
            api?: string
            www?: string
        };
    };

    chains: TChain[]

    web3: {
        [platform in TPlatform]: {
            chainId?: number
            chainToken?: string
            aliases?: string[]
            endpoints: IRpcConfig[]
        };
    };
    contracts?: {
        [platform in TPlatform]: IContractDetails[];
    };
    erc4337?: {
        name: string;
        contracts: {
            entryPoint: TAddress;
            accountFactory: TAddress;
        };
        platforms: TPlatform[];
    }[];

    safe?: {
        transactionService: Record<TPlatform, `https://${string}`>;
        contracts: Record<TPlatform, {
            Safe: TAddress;
            SafeL2?: TAddress;
            SafeProxyFactory: TAddress;
            MultiSend: TAddress;
            MultiSendCallOnly?: TAddress;
            CreateCall?: TAddress;
        }>;
    };
    flashbots?: {
        [platform in TPlatform]: {
            url: string;
        };
    };
    spotPriceAggregator?: {
        [platform in TPlatform]: TAddress
    };

    ns: {
        [service: string]: {
            [platform: string]: {
                registry: TEth.Address
                resolver?: TEth.Address
            }
        }
    }

    oracles: {
        [service: string]: any
    }
}
