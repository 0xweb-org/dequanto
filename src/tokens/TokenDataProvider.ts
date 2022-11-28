import alot from 'alot';
import memd from 'memd';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { ArbTokenProvider } from '@dequanto/chains/arbitrum/ArbTokenProvider';
import { IToken } from '@dequanto/models/IToken';
import { TAddress } from '@dequanto/models/TAddress';
import { TPlatform } from '@dequanto/models/TPlatform';
import { $address } from '@dequanto/utils/$address';
import { $is } from '@dequanto/utils/$is';
import { $require } from '@dequanto/utils/$require';
import { ITokenProvider } from './TokenProviders/ITokenProvider';
import { TPExplorer as TPExplorer } from './TokenProviders/TPExplorer';
import { TPCoinmarketcap } from './TokenProviders/TPCoinmarketcap';
import { TPOneInch } from './TokenProviders/TPOneInch';
import { TPSushiswap } from './TokenProviders/TPSushiswap';
import { TPConfig } from './TokenProviders/TPConfig';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TPChain } from './TokenProviders/TPChain';
import { TPCoingecko } from './TokenProviders/TPCoingecko';

export class TokenDataProvider {

    private config = new TPConfig();

    private providers = [
        this.config,
        new TPOneInch(),
        new TPSushiswap(),
        // @TODO uniswap thegraph api doesn't work any more
        // new TPUniswap(),
        new TPCoinmarketcap(),
        new TPCoingecko(),
        new ArbTokenProvider(),
        new TPExplorer(this.platform, this.explorer),
        new TPChain(this.platform, this.client),
    ] as ITokenProvider[];


    constructor(private platform: TPlatform, private explorer?: IBlockChainExplorer, private client?: Web3Client) {

    }

    async getTokenOrDefault (address: TAddress, chainLookup: boolean = true): Promise<IToken> {
        return await this.getToken(address, chainLookup) ?? this.default(address);
    }


    async getToken (symbol: string, chainLookup?: boolean): Promise<IToken>
    async getToken (address: TAddress, chainLookup?: boolean): Promise<IToken>

    @memd.deco.memoize({ perInstance: true })
    async getToken (mix: string, chainLookup: boolean = true): Promise<IToken> {
        let [ token, provider ] = $is.Address(mix)
            ? await this.getTokenByAddress(mix, chainLookup)
            : await this.getTokenBySymbol(mix, chainLookup);

        return token
    }

    @memd.deco.memoize({ perInstance: true })
    async getKnownToken (mix: string): Promise<IToken> {
        let [ token, provider ] = $is.Address(mix)
            ? await this.getTokenByAddress(mix, false)
            : await this.getTokenBySymbol(mix, false);

        if (token == null) {
            throw new Error(`Token ${mix} not found`);
        }
        return token
    }

    /**
     *  Adds and saves the token to dequanto configuration.
     */
    async addKnownToken (token: IToken): Promise<any> {
        await this.config.addToken(token);
    }

    isNative (token: IToken): boolean
    isNative (address: TAddress): boolean
    isNative (symbol: string): boolean
    isNative (mix): boolean {
        $require.notNull(mix, `Token is undefined`);

        if (typeof mix === 'object') {
            return this.isNative(mix.symbol ?? mix.address);
        }
        if ($is.Address(mix)) {
            return NativeTokens.isNativeByAddress(mix);
        }
        return NativeTokens.isNativeBySymbol(this.platform, mix);
    }

    getNative (platform: TPlatform): IToken {
        return NativeTokens.getNative(platform);
    }

    /** Download tokens with various exchange/swap providers and merge them into one collection. */
    async redownload () {
        return await alot(this.providers)
            .forEachAsync(async (x, i) => {
                console.log(`Get from #${i} Provider`);
                await x.redownloadTokens();
                console.log(`Get from #${i} Provider DONE`);
            })
            .toArrayAsync()
    }

    async getTokenByAddress (address: TAddress, chainLookup: boolean = true): Promise<[IToken, ITokenProvider]> {
        let [ token, provider ] = await alot(this.providers)
            .mapAsync(async provider => {
                if (provider instanceof TPExplorer && chainLookup === false) {
                    return [null, null];;
                }
                return [await provider.getByAddress(this.platform, address), provider];
            })
            .firstAsync(([ token ]) => token != null) ?? [];

        if (!token?.symbol && NativeTokens.isNativeByAddress(address)) {
            token = NativeTokens.getNative(this.platform)
        }
        return [token, provider];
    }
    async getTokenBySymbol (symbol: string, chainLookup: boolean = true): Promise<[IToken, ITokenProvider]> {
        let [ token, provider ] = await alot(this.providers)
            .mapAsync(async provider => {
                if (provider instanceof TPExplorer && chainLookup === false) {
                    return [null, null];
                }
                return [await provider.getBySymbol(this.platform, symbol), provider];
            })
            .firstAsync(([token]) => token != null) ?? [];

        if (!token?.symbol && NativeTokens.isNativeBySymbol(this.platform, symbol)) {
            token = NativeTokens.getNative(this.platform);
        }
        return [ token, provider ];
    }

    private default (address: TAddress) {
        return {
            platform: this.platform,
            symbol: address,
            name: address,
            address: address,
            decimals: 18,
        };
    }
}

namespace NativeTokens {
    const T1 = `0x0000000000000000000000000000000000000000`;
    const T2 = `0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee`;
    const tokens = {
        'ETH': <Partial<IToken>>{
            name: 'Ethereum Native Token',
            symbol: 'ETH',
            decimals: 18,
            icon: null,
            platform: 'eth',
            address: T2,
        },
        'BNB': <Partial<IToken>>{
            name: 'BSC Native Token',
            symbol: 'BNB',
            decimals: 18,
            icon: null,
            platform: 'bsc',
            address: T1,
        },
        'MATIC': <Partial<IToken>>{
            name: 'Polygon Native Token',
            symbol: 'MATIC',
            decimals: 18,
            icon: null,
            platform: 'polygon',
            address: T2,
        },
        'XDAI': <Partial<IToken>>{
            name: 'xDai Native Token',
            symbol: 'XDAI',
            decimals: 18,
            icon: null,
            platform: 'xdai',
            address: T1,
            aliases: ['DAI']
        },
    };
    const PLATFORMS = {
        'eth': 'ETH',
        'hardhat': 'ETH',
        'bsc': 'BNB',
        'polygon': 'MATIC',
        'xdai': 'xDAI',
        'arbitrum': 'ETH',
    };
    const PLATFORM_ALIASES = {
        ['xdai']: {
            aliases: ['DAI']
        }
    } as {
        [platform in TPlatform]: {
            aliases: string[]
        }
    };

    export function isNativeBySymbol (platform: TPlatform, symbol: string) {
        if (symbol == null) {
            return false;
        }
        symbol = symbol.toUpperCase();
        if (symbol in tokens) {
            return true;
        }
        let byPlatform = PLATFORM_ALIASES[platform];
        if (byPlatform?.aliases?.includes(symbol)) {
            return true;
        }
        return false;
    }

    export function isNativeByAddress (address: TAddress) {
        const check = address.toLowerCase();
        return $address.eq(T1, check) || $address.eq(T2, check);
    }

    export function toNativeByAddress (platform: TPlatform, address: TAddress) {
        const token = tokens[platform?.toUpperCase()];
        return {
            ...token,
            address: address
        };
    }
    export function getNative (platform: TPlatform): IToken {
        let symbol = PLATFORMS[platform]
        if (symbol == null) {
            throw new Error(`${platform} platform is not support`);
        }
        return tokens[symbol.toUpperCase()];
    }
}


