import di from 'a-di';
import { TokensService } from './TokensService';
import { TAddress } from '@dequanto/models/TAddress';
import { Polyscan } from '@dequanto/explorer/Polyscan';
import { ERC20 } from '@dequanto-contracts/openzeppelin/ERC20';

export class TokensServicePolygon extends TokensService {
    constructor () {
        super('polygon', di.resolve(Polyscan))
    }

    static async erc20 (address: TAddress): Promise<ERC20>
    static async erc20 (symbol: string): Promise<ERC20>
    static async erc20 (mix: string): Promise<ERC20> {
        return TokensService.erc20(mix, 'polygon');
    }
}
