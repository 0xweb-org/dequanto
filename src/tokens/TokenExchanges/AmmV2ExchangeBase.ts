import di from 'a-di';
import memd from 'memd';
import alot from 'alot';
import { IBlockchainExplorer } from '@dequanto/explorer/IBlockchainExplorer';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { ContractReader } from '@dequanto/contracts/ContractReader';
import { JsonArrayStore } from '@dequanto/json/JsonArrayStore';
import { IToken } from '@dequanto/models/IToken';
import { TAddress } from '@dequanto/models/TAddress';
import { $bigint } from '@dequanto/utils/$bigint';
import { $address } from '@dequanto/utils/$address';
import { $require } from '@dequanto/utils/$require';
import { $cache } from '@dequanto/utils/$cache';
import { AmmFactoryV2Contract } from '@dequanto/prebuilt/amm/AmmFactoryV2Contract/AmmFactoryV2Contract';
import { AmmMasterChefV2Contract } from '@dequanto/prebuilt/amm/AmmMasterChefV2Contract/AmmMasterChefV2Contract';
import { AmmVaultV2Contract } from '@dequanto/prebuilt/amm/AmmVaultV2Contract/AmmVaultV2Contract';
import { AmmPairV2Contract } from '@dequanto/prebuilt/amm/AmmPairV2Contract/AmmPairV2Contract';
import { TokensService } from '../TokensService';


interface ILPPair extends IToken {
    token0: IToken
    token1: IToken
    i: number
}
export abstract class AmmV2ExchangeBase {

    abstract name: string
    abstract factoryAddress: TAddress
    abstract masterChefAddress: TAddress
    abstract vaultAddress: TAddress

    @memd.deco.memoize({ perInstance: true })
    get pairsStore () {
        return new JsonArrayStore<ILPPair>({
            path: $cache.file(`ammv2-pairs.json`),
            key: x => x.address
        });
    }

    @memd.deco.memoize({ perInstance: true })
    get factoryContract () {
        return di.resolve(AmmFactoryV2Contract
            , this.factoryAddress
            , this.client
            , this.explorer
        );
    }

    @memd.deco.memoize({ perInstance: true })
    get masterChefContract () {
        return di.resolve(AmmMasterChefV2Contract
            , this.masterChefAddress
            , this.client
            , this.explorer
        );
    }

    @memd.deco.memoize({ perInstance: true })
    get vaultContract () {
        return di.resolve(AmmVaultV2Contract
            , this.vaultAddress
            , this.client
            , this.explorer
        );
    }

    @memd.deco.memoize({ perInstance: true })
    pairContract (pair: TAddress) {
        return di.resolve(AmmPairV2Contract
            , pair
            , this.client
            , this.explorer
        );
    }

    constructor(
        public client: Web3Client,
        public explorer: IBlockchainExplorer
    ) {

    }


    async calcSwap (from: IToken, to: IToken, fromAmount: bigint): Promise<{ amount: bigint, priceImpact: number }> {
        $require.BigInt(fromAmount);

        if (fromAmount === 0n) {
            return {
                amount: 0n,
                priceImpact: 0
            };
        }

        let lpAddress = await this.factoryContract.getPair(from.address, to.address);
        if ($address.isEmpty(lpAddress)) {
            return null;
        }

        let poolPair = this.pairContract(lpAddress);
        let lpReserves = await poolPair.getReserves();
        if (lpReserves == null || lpReserves._reserve0 < 1000n) {
            return null;
        }

        $require.BigInt(lpReserves?._reserve0, `Reserve 0 not valid for LPAddress ${lpAddress}`);
        $require.BigInt(lpReserves?._reserve1, `Reserve 1 not valid for LPAddress ${lpAddress}`);

        let [ fromI, toI] = BigInt(from.address) < BigInt(to.address) ? [0, 1] : [1, 0];

        let reserveFrom: bigint = lpReserves[`_reserve${fromI}`];
        let reserveTo: bigint = lpReserves[`_reserve${toI}`];

        let amountIdeal = fromAmount * reserveTo / reserveFrom;

        let k = reserveFrom * reserveTo;
        let reserveFromAfter = reserveFrom + fromAmount;

        let reserveToAfter = k / reserveFromAfter;

        let amountActual = reserveTo - reserveToAfter;

        let priceImpactPercents = (1 - $bigint.divToFloat(amountActual, amountIdeal)) * 100;

        return {
            amount: amountActual,
            priceImpact: priceImpactPercents,
        };
    }

    async getPairs () {
        let reader = new ContractReader(this.client);
        let addresses = await reader.readAsync(
            this.factoryAddress
            , 'allPairs() returns (address[])'
        );
        return addresses;
    }

    async redownloadPairs () {
        let pairsCached = await this.readPairs();
        let max = alot(pairsCached).max(x =>x.i);
        let i = Math.max(max - 4, 0);

        let length = await this.factoryContract.allPairsLength();
        let all = [...pairsCached ];
        let pairs = await alot
            .fromRange(i, Number(length))
            .mapAsync(async i => {
                console.log(`Loading ${i}/${length}`);

                let pair = await this.getPairInfoAtIndex(i);
                all.push(pair);
                if (i % 100 === 0) {
                    await this.savePairs(all);
                }
                return pair;
            })
            .toArrayAsync();

        await this.pairsStore.saveAll(pairs);
        return pairs;
    }

    private async getPairInfoAtIndex (i: number) {
        let factory = this.factoryContract;
        let pairAddress = await factory.allPairs(BigInt(i));
        let pairContract = this.pairContract(pairAddress);

        let [ symbol, token0Addr, token1Addr, ] = await Promise.all([
            pairContract.symbol(),
            pairContract.token0(),
            pairContract.token1(),
        ]);

        let tokensService = di.resolve(TokensService, this.client.platform );
        let [ token0, token1 ] = await Promise.all([
            tokensService.getTokenOrDefault(token0Addr),
            tokensService.getTokenOrDefault(token1Addr),
        ]);
        return <ILPPair> {
            name: symbol,
            symbol: symbol,
            platform: this.client.platform,

            address: pairAddress,

            i: Number(i),
            token0: token0,
            token1: token1,
        }
    }

    private async savePairs (pairs: ILPPair[]) {
        let jsons = pairs.map(pair => ({
            address: pair.address,
            i: pair.i,
            token0: {
                "symbol": pair.token0.symbol,
                "address": pair.token0.address,
                "decimals": (pair.token0.decimals == null || pair.token0.decimals === 18)
                    ? void 0
                    : pair.token0.decimals,
            },
            token1: {
                "symbol": pair.token1.symbol,
                "address": pair.token1.address,
                "decimals": (pair.token1.decimals == null || pair.token1.decimals === 18)
                    ? void 0
                    : pair.token1.decimals,
            },
        }));
        await this.pairsStore.saveAll(jsons as any);
    }
    private async readPairs (): Promise<ILPPair[]> {
        let jsons = await this.pairsStore.getAll();
        let pairs = jsons.map(pair => ({
            "name": "LP",
            "symbol": "LP",
            "platform": this.client.platform,

            address: pair.address,
            i: pair.i,
            token0: {
                "platform": this.client.platform,
                "symbol": pair.token0.symbol,
                "name": pair.token0.symbol,
                "address": pair.token0.address,
                "decimals": pair.token0.decimals ?? 18,
            },
            token1: {
                "platform": this.client.platform,
                "symbol": pair.token1.symbol,
                "name": pair.token1.symbol,
                "address": pair.token1.address,
                "decimals": pair.token1.decimals ?? 18,
            },
        }));
        return pairs;
    }
}

