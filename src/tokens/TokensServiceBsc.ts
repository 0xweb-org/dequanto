import di from 'a-di';
import { TokensService } from './TokensService';
import { Bscscan } from '@dequanto/BlockchainExplorer/Bscscan';
import { ERC20 } from '@dequanto/contracts/common/ERC20';
import { TAddress } from '@dequanto/models/TAddress';

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
