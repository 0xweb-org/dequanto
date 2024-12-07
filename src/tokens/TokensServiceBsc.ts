import di from 'a-di';
import { TokensService } from './TokensService';
import { Bscscan } from '@dequanto/explorer/Bscscan';
import { TAddress } from '@dequanto/models/TAddress';
import { ERC20 } from '@dequanto/prebuilt/openzeppelin/ERC20';

export class TokensServiceBsc extends TokensService {
    constructor () {
        super('bsc', di.resolve(Bscscan))
    }

    static async erc20 (address: TAddress): Promise<ERC20>
    static async erc20 (symbol: string): Promise<ERC20>
    static async erc20 (mix: string): Promise<ERC20> {
        return TokensService.erc20(mix, 'bsc');
    }
}
