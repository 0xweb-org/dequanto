import di from 'a-di';

import { TAddress } from '@dequanto/models/TAddress';
import { TokensService } from '@dequanto/tokens/TokensService';
import { Arbiscan } from './Arbiscan';
import { ERC20 } from '@dequanto-contracts/openzeppelin/ERC20';


export class TokensServiceArbitrum extends TokensService {
    constructor () {
        super('arbitrum', di.resolve(Arbiscan))
    }

    static async erc20 (address: TAddress): Promise<ERC20>
    static async erc20 (symbol: string): Promise<ERC20>
    static async erc20 (mix: string): Promise<ERC20> {
        return TokensService.erc20(mix, 'arbitrum');
    }
}
