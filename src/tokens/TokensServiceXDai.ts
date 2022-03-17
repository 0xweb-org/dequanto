import di from 'a-di';
import { TokensService } from './TokensService';
import { ERC20 } from '@dequanto/contracts/common/ERC20';
import { TAddress } from '@dequanto/models/TAddress';
import { XDaiscan } from '@dequanto/chains/xdai/XDaiscan';
import { IToken } from '@dequanto/models/IToken';
import { ITokenProvider } from './TokenProviders/ITokenProvider';

export class TokensServiceXDai extends TokensService {
    constructor () {
        super('xdai', di.resolve(XDaiscan))
    }

    static async erc20 (address: TAddress): Promise<ERC20>
    static async erc20 (symbol: string): Promise<ERC20>
    static async erc20 (mix: string): Promise<ERC20> {
        return TokensService.erc20(mix, 'xdai');
    }

    public async getTokenBySymbol (symbol: string, chainLookup: boolean = true): Promise<[IToken, ITokenProvider]> {
        if (symbol === 'DAI') {
            symbol = 'wxDAI';
        }
        return super.getTokenBySymbol(symbol, chainLookup);
    }
}
