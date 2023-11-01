import di from 'a-di';
import alot from 'alot';
import { BlockChainExplorerProvider } from '@dequanto/BlockchainExplorer/BlockChainExplorerProvider';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { IToken } from '@dequanto/models/IToken';
import { TPlatform } from '@dequanto/models/TPlatform';
import { $bigint } from '@dequanto/utils/$bigint';
import { $is } from '@dequanto/utils/$is';
import { AmmV2ExchangeBase } from './TokenExchanges/AmmV2ExchangeBase';
import { PancakeswapExchange } from './TokenExchanges/PancakeswapExchange';
//import { UniswapExchange } from './TokenExchanges/UniswapExchange';
import { TokensService } from './TokensService';
import { TokenUtils } from './utils/TokenUtils';
import { ERC20 } from '@dequanto/contracts/common/ERC20';
import { UniswapV2Exchange } from './TokenExchanges/UniswapV2Exchange';
import { SushiswapPolygonExchange } from './TokenExchanges/SushiswapPolygonExchange';
import { $logger } from '@dequanto/utils/$logger';
import { $require } from '@dequanto/utils/$require';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';

export class TokenExchangeService {

    client: Web3Client;
    explorer: IBlockChainExplorer;

    exchange: AmmV2ExchangeBase
    stables: string[]

    constructor (public platform: TPlatform) {
        switch (platform) {
            case 'bsc':
                this.exchange = di.resolve(PancakeswapExchange, this.client, this.explorer);
                this.stables = ['BUSD', 'USDT'];
                break;
            case 'eth':
                this.exchange = di.resolve(UniswapV2Exchange, this.client, this.explorer);
                this.stables = ['USDC', 'USDT', 'DAI'];
                break;
            case 'polygon':
                this.exchange = di.resolve(SushiswapPolygonExchange, this.client, this.explorer);
                this.stables = ['USDC', 'USDT', 'DAI'];
                break;
            default:
                throw new Error(`Unsupported Platform for exchange yet: ${platform}`);
        }

        this.client = Web3ClientFactory.get(this.platform);
        this.explorer = BlockChainExplorerProvider.get(this.platform);
    }

    async calcUSD (from: string | Partial<IToken>, fromAmount: number | bigint, date?: Date): Promise<{
        from: IToken & { amount },
        to: IToken & { amount },
        priceImpact: number
    }> {
        let tokensService = di.resolve(TokensService, this.platform, this.explorer);
        let fromToken = typeof from === 'string'
            ? await tokensService.getToken(from)
            : <IToken> from;
        let $fromAmount = typeof fromAmount === 'bigint'
            ? fromAmount
            : $bigint.toWei(fromAmount, fromToken.decimals ?? 18);

        $require.Address(fromToken?.address, `Token 404 ${from}`);

        let converted = TokenUtils.isStable(fromToken.symbol) ? {
            to: {
                ...fromToken,
                amount: fromAmount,
            },
            priceImpact: 0
        } : await alot(this.stables)
            .mapAsync(async stableSymbol => {
                let toToken = await tokensService.getToken(stableSymbol);
                try {
                    let swapped = await this.exchange.calcSwap(fromToken, toToken, $fromAmount) ?? {
                        amount: 0n,
                        priceImpact: 0
                    };
                    return {
                        to: {
                            ...toToken,
                            amount: swapped.amount
                        },
                        priceImpact: swapped.priceImpact,
                    };
                } catch (error) {
                    $logger.log('CalcStable error', error);
                    return null;
                }
            })
            .filterAsync(x => x != null)
            .firstAsync();

        if (converted == null) {
            throw new Error(`Do not know how to convert ${from} Token`);
        }
        return {
            from: {
                ...fromToken,
                amount: $fromAmount,
            },
            to: converted.to,
            priceImpact: converted.priceImpact
        };
    }

    async calc (from: string, to: string, fromAmount: bigint): Promise<{
        from: IToken & { amount },
        to: IToken & { amount },
        priceImpact: number
    }> {
        let tokensService = di.resolve(TokensService, this.platform, this.explorer);
        let fromToken = await tokensService.getToken(from);
        let toToken = await tokensService.getToken(to);
        let swapped = await this.exchange.calcSwap(fromToken, toToken, fromAmount);

        return {
            from: {
                ...fromToken,
                amount: fromAmount,
            },
            to: {
                ...toToken,
                amount: swapped.amount,
            },
            priceImpact: swapped.priceImpact,
        };
    }
}
