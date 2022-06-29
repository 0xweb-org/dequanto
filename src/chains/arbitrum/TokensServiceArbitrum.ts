import di from 'a-di';

import { ERC20 } from '@dequanto/contracts/common/ERC20';
import { TAddress } from '@dequanto/models/TAddress';
import { TokensService } from '@dequanto/tokens/TokensService';
import { Arbiscan } from './Arbiscan';


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
