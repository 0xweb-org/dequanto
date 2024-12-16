import di from 'a-di';
import alot from 'alot';
import memd from 'memd';
import { env } from 'atma-io';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IToken, ITokenBase } from '@dequanto/models/IToken';
import { IOracle, IOracleResult, ISwapOptions } from '../IOracle';
import { TResultAsync } from '@dequanto/models/TResult';

import { $require } from '@dequanto/utils/$require';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { AmmV2PriceQuote } from '@dequanto/tokens/TokenExchanges/AmmV2PriceQuote';
import { BlockchainExplorerFactory } from '@dequanto/explorer/BlockchainExplorerFactory';
import { TokensServiceFactory } from '@dequanto/tokens/TokensServiceFactory';
import { $cache } from '@dequanto/utils/$cache';
import { TAddress } from '@dequanto/models/TAddress';
import { IBlockchainExplorer } from '@dequanto/explorer/IBlockchainExplorer';
import { ContractReader } from '@dequanto/contracts/ContractReader';
import { $config } from '@dequanto/utils/$config';
import { ERC20 } from '@dequanto/prebuilt/openzeppelin/ERC20';
import { TokensService } from '@dequanto/tokens/TokensService';
import { $bigint } from '@dequanto/utils/$bigint';
import { $block } from '@dequanto/utils/$block';
import { BlockDateResolver } from '@dequanto/blocks/BlockDateResolver';
import { $number } from '@dequanto/utils/$number';


const CACHE_PATH = $cache.file(`amm-pairs.json`);

export class AmmV1Oracle implements IOracle {

    private client: Web3Client;
    private explorer: IBlockchainExplorer;
    private reader: ContractReader;
    private tokens: TokensService;

    private config = $config.get('uniswapV1')

    private factoryAddress = $require.Address(this.config.factory, 'Factory Address')

    // https://docs.uniswap.org/contracts/v1/guides/connect-to-uniswap
    protected abi = {
        factory: {
            getExchange: `getExchange(address): address`,
            getToken: `getToken(address): address`,
        },
        exchange: {
            getEthToTokenInputPrice: `getEthToTokenInputPrice(uint256 eth_sold): uint256`,
            //getTokenToEthInputPrice: 'getTokenToEthInputPrice(uint256 tokens_sold): uint256'
        },
    }

    public constructor (private clients?: Web3Client[]) {
        let client = clients?.[0] ?? Web3ClientFactory.get('eth');
        this.explorer = BlockchainExplorerFactory.get(client.platform);
        this.client = client;
        this.reader = new ContractReader(client);
        this.tokens =  TokensServiceFactory.get(client.platform);
    }


    public async getPrice(token: ITokenBase, opts?: ISwapOptions): TResultAsync<IOracleResult> {
        opts ??= {};

        let [ blockData, tokenData ] = await Promise.all([
            this.getBlockData(opts),
            this.getTokenData(token)
        ]);


        if (this.isNativeOrWrappedToken(tokenData)) {
            // get price for wrapped token
            let result = await this.getNativePrice(blockData.number);
            return {
                result: {
                    quote: result.token,
                    price: result.price,
                    date: blockData.date ?? new Date()
                }
            }
        }

        let exchangeInfo = await this.getPair(tokenData);
        //let ethBalance = await this.client.
        let [ethBalance, ethPrice] = await Promise.all([
            this.client.getBalance(exchangeInfo.address),
            this.getNativePrice(blockData.number)
        ]);

        const THRESHOLD$ = 5_000;
        let ethLiquidity = $bigint.toEther(ethBalance) * ethPrice.price;
        if (ethLiquidity < THRESHOLD$) {
            //return { error: new Error(`LIQUIDITY: Threshold not matched ${ethLiquidity}$ < ${THRESHOLD$}$ in POOL ${exchangeInfo.address}`) };
        }

        let tokensReceivedForOneEth = await this
            .reader
            .forBlock(blockData.number)
            .readAsync(exchangeInfo.address, this.abi.exchange.getEthToTokenInputPrice, 10n**18n);

        let tokensReceived = $bigint.toEther(tokensReceivedForOneEth, exchangeInfo.tokenDecimals, 10000n);
        let tokenPrice = ethPrice.price / tokensReceived;

        return {
            result: {
                quote: ethPrice.token,
                price: $number.round(tokenPrice, 4),
                date: blockData.date ?? new Date(),
                source: {
                    name: 'uniswap-v1',
                    address: exchangeInfo.address,
                    liquidity: $number.round(ethLiquidity * 2, 2)
                }
            }
        };
    }

    private async getNativePrice (blockNumber: number): Promise<{token: IToken, price: number }>  {
        let stables = [ 'USDC', 'USDT', 'DAI' ];


        let exchanges = await alot(stables)
            .mapAsync(async stable => {
                let token = await this.getTokenData({ symbol: stable });
                let exchange = await this.getPair(token);
                if (exchange == null) {
                    return null;
                }
                let balance = await this.client.getBalance(exchange.address, blockNumber);
                return {
                    eth: balance,
                    token,
                    exchange
                };
            })
            .filterAsync(x => x != null)
            .toArrayAsync({ threads: 1, errors: 'include' });

        let mostLiquidity = alot(exchanges).sortBy(x => x?.eth ?? 0n, 'desc').first();
        if (mostLiquidity == null || mostLiquidity.eth < $bigint.toWei(2)) {
            throw new Error(`ETH price can't be resolved due to NO or low-liquidity pairs: ${ exchanges.map(x => `${x.token.symbol} (${x.eth}wei)`)  }`);
        }
        let out = await this
            .reader
            .forBlock(blockNumber)
            .readAsync(mostLiquidity.exchange.address, this.abi.exchange.getEthToTokenInputPrice, 10n**18n);
        let price = $bigint.toEther(out, mostLiquidity.exchange.tokenDecimals, 10000n);
        return {
            token: mostLiquidity.token,
            price
        };
    }

    private async getTokenData(token: ITokenBase): Promise<IToken> {
        let t = token.symbol ?? token.address;
        let tokenData = await this.tokens.getKnownToken(t);
        if (tokenData == null) {
            throw new Error(`AmmV1Oracle: Token not found ${t} for ${this.client.platform}`);
        }
        return tokenData;
    }
    private async getBlockData(opts?: ISwapOptions): Promise<{ number?: number, date?: Date }> {
        if (opts == null || (opts.block == null && opts.date == null)) {
            return {};
        }
        if (opts.block != null && opts.date != null) {
            return { number: opts.block, date: opts.date };
        }
        if (opts.block != null) {
            let info = await this.client.getBlock(opts.block);
            let date = $block.getDate(info);
            opts.date = date;
            return this.getBlockData(opts);
        }
        if (opts.date != null) {
            let resolver = new BlockDateResolver(this.client);
            let number = await resolver.getBlockNumberFor(opts.date);
            opts.block = number;
            return this.getBlockData(opts);
        }
        throw new Error(`Unreachable reached`);
    }

    @memd.deco.memoize({
        perInstance: true,
        trackRef: true,
        key: (ctx, token: ITokenBase) => {
            let self = ctx.this as AmmV1Oracle;
            let key = `ammv1_pair_${self.client.platform}_${token.address}`;
            return key;
        },
        persistence: new memd.FsTransport({ path:  $cache.file(`ammv1-pairs.json`) })
    })
    private async getPair (token: ITokenBase) {
        let [ address, tokenDecimals ] = await Promise.all([
            this.reader.readAsync(this.factoryAddress, this.abi.factory.getExchange, token.address),
            token.decimals ?? new ERC20(token.address).decimals()
        ]);

        return {
            address: address,
            tokenDecimals: tokenDecimals
        };
    }


    private isNativeToken (token: ITokenBase) {
        let native = this.client.chainToken;
        return native === token.symbol;
    }
    private isWrappedToken (token: ITokenBase) {
        let native = this.client.chainToken;
        return `W${native}` === token.symbol;
    }
    private isNativeOrWrappedToken (token: ITokenBase) {
        return this.isNativeToken(token) || this.isWrappedToken(token);
    }

}
