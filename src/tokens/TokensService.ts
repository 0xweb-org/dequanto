import di from 'a-di';
import memd from 'memd';
import { TAddress } from '@dequanto/models/TAddress';
import { IBlockChainExplorer } from '@dequanto/explorer/IBlockChainExplorer';
import { TPlatform } from '@dequanto/models/TPlatform';
import { IToken } from '@dequanto/models/IToken';
import { ITokenProvider } from './TokenProviders/ITokenProvider';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { BlockChainExplorerProvider } from '@dequanto/explorer/BlockChainExplorerProvider';
import { TokenDataProvider } from './TokenDataProvider';
import { ERC20 } from '@dequanto/prebuilt/openzeppelin/ERC20';


export class TokensService {


    provider: TokenDataProvider

    constructor(private platform: TPlatform, private explorer?: IBlockChainExplorer, private forked?: TokenDataProvider) {
        this.provider = new TokenDataProvider(this.platform, this.explorer, null, this.forked);
    }

    async getTokenOrDefault (symbol: string, chainLookup?: boolean): Promise<IToken>
    async getTokenOrDefault (address: TAddress, chainLookup?: boolean): Promise<IToken>
    async getTokenOrDefault (mix: TAddress | string, chainLookup: boolean = true): Promise<IToken> {
        return this.provider.getTokenOrDefault(mix, chainLookup);
    }


    async getToken (symbol: string, chainLookup?: boolean): Promise<IToken>
    async getToken (address: TAddress, chainLookup?: boolean): Promise<IToken>
    async getToken (mix: string, chainLookup: boolean = true): Promise<IToken> {
        return this.provider.getToken(mix, chainLookup);
    }


    async getKnownToken (mix: string): Promise<IToken> {
        return this.provider.getKnownToken(mix);
    }
    async addKnownToken (token: IToken): Promise<void> {
        await this.provider.addKnownToken(token);
    }

    isNative (token: IToken): boolean
    isNative (address: TAddress): boolean
    isNative (symbol: string): boolean
    isNative (mix): boolean {
        return this.provider.isNative(mix);
    }

    getNative (platform: TPlatform = this.platform): IToken {
        return this.provider.getNative(platform);
    }

    /** Download tokens with various exchange/swap providers and merge them into one collection. */
    async redownload () {
        return this.provider.redownload();
    }

    async getTokenByAddress (address: TAddress, chainLookup: boolean = true): Promise<[IToken, ITokenProvider]> {
        return this.provider.getTokenByAddress(address, chainLookup);
    }
    async getTokenBySymbol (symbol: string, chainLookup: boolean = true): Promise<[IToken, ITokenProvider]> {
        return this.provider.getTokenBySymbol(symbol, chainLookup);
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
            throw new Error(`Token not found ${arguments[0]} in ${platform}`);
        }
        return new ERC20(token.address, client, explorer);
    }

    @memd.deco.memoize()
    async erc20 (token: string | IToken): Promise<ERC20> {

        return TokensService.erc20(token, this.platform);
        // let client = Web3ClientFactory.get(this.platform);
        // let explorer = BlockChainExplorerProvider.get(this.platform);

        // let t = typeof token === 'string'
        //     ? await this.getToken(token)
        //     : token;
        // if (t == null) {
        //     if (typeof token === 'string' && $address.isValid(token)) {
        //         t = {
        //             address: token,
        //             decimals: 18,
        //             platform: this.platform
        //         };
        //     }
        //     throw new Error(`Token not found: ${arguments[0]}`);
        // }
        // return new ERC20(t.address, client, explorer);
    }
}
