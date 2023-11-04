import di from 'a-di';
import { TokensService } from './TokensService';
import { Etherscan } from '@dequanto/explorer/Etherscan';

export class TokensServiceEth extends TokensService {
    constructor () {
        super('eth', di.resolve(Etherscan))
    }
}
