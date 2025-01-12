import di from 'a-di';
import alot from 'alot';
import memd from 'memd';
import { env } from 'atma-io';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { ITokenBase } from '@dequanto/models/IToken';
import { IOracle, IOracleResult, ISwapOptions } from '../IOracle';
import { TResultAsync } from '@dequanto/models/TResult';

import { $require } from '@dequanto/utils/$require';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { AmmV2PriceQuote } from '@dequanto/tokens/TokenExchanges/AmmV2PriceQuote';
import { BlockchainExplorerFactory } from '@dequanto/explorer/BlockchainExplorerFactory';
import { TokensServiceFactory } from '@dequanto/tokens/TokensServiceFactory';
import { $cache } from '@dequanto/utils/$cache';


const CACHE_PATH = $cache.file(`amm-pairs.json`);

export class AmmV2Oracle implements IOracle {

    private quoter: AmmV2PriceQuote

    public constructor (private clients?: Web3Client[]) {
        let client = clients?.[0] ?? Web3ClientFactory.get('eth');
        let explorer = BlockchainExplorerFactory.get(client.platform);
        this.quoter = new AmmV2PriceQuote(client, explorer);
    }


    public async getPrice(token: ITokenBase, opts?: ISwapOptions): TResultAsync<IOracleResult> {
        opts ??= {};

        $require.notNull(token.symbol, `Chainlink gets the feed by token's symbol, but it is empty`);

        let platform = this.quoter.client.platform;
        let t = token.symbol ?? token.address;
        let tokenService = TokensServiceFactory.get(platform);
        let tokenData = await tokenService.getKnownToken(t);
        if (tokenData == null) {
            throw new Error(`AmmV2Oracle: Token not found ${t} for ${platform}`);
        }

        let { error, result: route } = await this.quoter.getRoute(tokenData);
        if (error) {
            return { error };
        }

        return {
            result: {
                quote: route.outToken,
                price: route.outUsd,
                date: new Date(),
            }
        };
    }
}
