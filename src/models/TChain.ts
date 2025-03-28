import { IRpcConfig } from '@dequanto/clients/ClientPool'
import { TEth } from './TEth'
import { IToken } from './IToken'
import { TExplorer } from './TExplorer'

export interface TChain {
    name?: string
    icon?: string
    wwww?: string

    platform: TEth.Platform
    aliases?: string[]

    chainId?: number
    chainToken?: string

    endpoints: IRpcConfig[]

    explorers: TExplorer[]

    tokens?: IToken[]

    defaultTxType?: 0 | 1 | 2;
    defaultGasPriceRatio?: number;

    // block time in ms
    blockTimeAvg?: number;

    erc4337?: {
        name: string;
        contracts: {
            entryPoint: TEth.Address;
            accountFactory: TEth.Address;
        };
    }[];

    safe?: {
        transactionService: `https://${string}`
        contracts: {
            Safe: TEth.Address;
            SafeL2?: TEth.Address;
            SafeProxyFactory: TEth.Address;
            MultiSend: TEth.Address;
            CreateCall?: TEth.Address;
        };
    };
    flashbots?: {
        url: string;
    };
    spotPriceAggregator?: {
        aggregator: TEth.Address
    };
    ens?: {
        registry: TEth.Address
    }
}
