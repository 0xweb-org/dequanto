import di from 'a-di';
import alot from 'alot';
import memd from 'memd';
import { TAddress } from '@dequanto/models/TAddress';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { TPSushiswap } from './TokenProviders/TPSushiswap';
import { TPUniswap } from './TokenProviders/TPUniswap';
import { TPCoinmarketcap } from './TokenProviders/TPCoinmarketcap';
import { TPOneInch } from './TokenProviders/TPOneInch';
import { TPlatform } from '@dequanto/models/TPlatform';
import { TPChain } from './TokenProviders/TPChain';
import { IToken } from '@dequanto/models/IToken';
import { ITokenProvider } from './TokenProviders/ITokenProvider';
import { ERC20 } from '@dequanto/contracts/common/ERC20';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { BlockChainExplorerProvider } from '@dequanto/BlockchainExplorer/BlockChainExplorerProvider';
import { $address } from '@dequanto/utils/$address';
import { ArbTokenProvider } from '@dequanto/chains/arbitrum/ArbTokenProvider';
import { $require } from '@dequanto/utils/$require';


export class TokensService {

    private providers = [
        new TPOneInch(),
        new TPSushiswap(),
        // @TODO uniswap thegraph api doesn't work any more
        // new TPUniswap(),
        new TPCoinmarketcap(),
        new ArbTokenProvider(),
        new TPChain(this.platform, this.explorer),
    ] as ITokenProvider[];


    constructor(private platform: TPlatform, private explorer?: IBlockChainExplorer) {
        $require.notNull(platform, 'Tokens service platform');
    }

    async getTokenOrDefault (address: TAddress, chainLookup: boolean = true): Promise<IToken> {
        return await this.getToken(address, chainLookup) ?? this.default(address);
    }


    async getToken (symbol: string, chainLookup?: boolean): Promise<IToken>
    async getToken (address: TAddress, chainLookup?: boolean): Promise<IToken>

    @memd.deco.memoize({ perInstance: true })
    async getToken (mix: string, chainLookup: boolean = true): Promise<IToken> {
        let [ token, provider ] = mix.startsWith('0x')
            ? await this.getTokenByAddress(mix, chainLookup)
            : await this.getTokenBySymbol(mix, chainLookup);

        return token
    }

    @memd.deco.memoize({ perInstance: true })
    async getKnownToken (mix: string): Promise<IToken> {
        let [ token, provider ] = mix.startsWith('0x')
            ? await this.getTokenByAddress(mix, false)
            : await this.getTokenBySymbol(mix, false);

        if (token == null) {
            throw new Error(`Token ${mix} not found`);
        }
        return token
    }

    isNative (token: IToken): boolean
    isNative (address: TAddress): boolean
    isNative (symbol: string): boolean
    isNative (mix): boolean {
        $require.notNull(mix, `Token is undefined`);

        if (typeof mix === 'object') {
            return this.isNative(mix.symbol ?? mix.address);
        }
        if (mix.startsWith('0x')) {
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
                if (provider instanceof TPChain && chainLookup === false) {
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
                if (provider instanceof TPChain && chainLookup === false) {
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

    @memd.deco.memoize()
    static async erc20 (
        token: string | IToken,
        platform: TPlatform
    ): Promise<ERC20> {
        let client = Web3ClientFactory.get(platform);
        let explorer = BlockChainExplorerProvider.get(platform);

        if (typeof token === 'string') {
            let service = di.resolve(TokensService, platform, explorer);
            token = await service.getToken(token);
        }
        if (token == null) {
            throw new Error(`Token not found: ${arguments[0]}`);
        }
        return new ERC20(token.address, client, explorer);
    }

    @memd.deco.memoize()
    async erc20 (token: string | IToken): Promise<ERC20> {
        let client = Web3ClientFactory.get(this.platform);
        let explorer = BlockChainExplorerProvider.get(this.platform);

        let t = typeof token === 'string'
            ? await this.getToken(token)
            : token;
        if (t == null) {
            if (typeof token === 'string' && $address.isValid(token)) {
                t = {
                    address: token,
                    decimals: 18,
                    platform: this.platform
                };
            }
            throw new Error(`Token not found: ${arguments[0]}`);
        }
        return new ERC20(t.address, client, explorer);
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
        },
    };
    const PLATFORMS = {
        'eth': 'ETH',
        'bsc': 'BNB',
        'polygon': 'MATIC',
        'xdai': 'xDAI',
    };

    export function isNativeBySymbol (platform: TPlatform, symbol: string) {
        if (symbol == null) {
            return false;
        }
        symbol = symbol.toUpperCase();
        return symbol in tokens;
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


