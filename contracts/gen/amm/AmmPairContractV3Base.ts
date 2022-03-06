import di from 'a-di';
import { TAddress } from '@dequanto/models/TAddress';

import { Etherscan } from '@dequanto/BlockchainExplorer/Etherscan';
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client';

import { ContractBase } from '@dequanto/contracts/ContractBase';
import { AbiItem } from 'web3-utils';
import { TxWriter } from '@dequanto/txs/TxWriter';

export class AmmPairContractV3Base extends ContractBase {
    constructor(
        public address: TAddress = '0x8f8ef111b67c04eb1641f5ff19ee54cda062f163',
        public client = di.resolve(EthWeb3Client),
        public explorer = di.resolve(Etherscan)
    ) {
        super(address, client, explorer)
    }

    async burn (eoa: {address: TAddress, key: string}, tickLower: number, tickUpper: number, amount: bigint): Promise<TxWriter> {
        return this.$write('function burn(int24, int24, uint128) returns (uint256 amount0,uint256 amount1)', eoa, tickLower, tickUpper, amount);
    }

    async collect (eoa: {address: TAddress, key: string}, recipient: TAddress, tickLower: number, tickUpper: number, amount0Requested: bigint, amount1Requested: bigint): Promise<TxWriter> {
        return this.$write('function collect(address, int24, int24, uint128, uint128) returns (uint128 amount0,uint128 amount1)', eoa, recipient, tickLower, tickUpper, amount0Requested, amount1Requested);
    }

    async collectProtocol (eoa: {address: TAddress, key: string}, recipient: TAddress, amount0Requested: bigint, amount1Requested: bigint): Promise<TxWriter> {
        return this.$write('function collectProtocol(address, uint128, uint128) returns (uint128 amount0,uint128 amount1)', eoa, recipient, amount0Requested, amount1Requested);
    }

    async factory (): Promise<TAddress> {
        return this.$read('function factory() returns address');
    }

    async fee (): Promise<number> {
        return this.$read('function fee() returns uint24');
    }

    async feeGrowthGlobal0X128 (): Promise<bigint> {
        return this.$read('function feeGrowthGlobal0X128() returns uint256');
    }

    async feeGrowthGlobal1X128 (): Promise<bigint> {
        return this.$read('function feeGrowthGlobal1X128() returns uint256');
    }

    async flash (eoa: {address: TAddress, key: string}, recipient: TAddress, amount0: bigint, amount1: bigint, data: Buffer | string): Promise<TxWriter> {
        return this.$write('function flash(address, uint256, uint256, bytes)', eoa, recipient, amount0, amount1, data);
    }

    async increaseObservationCardinalityNext (eoa: {address: TAddress, key: string}, observationCardinalityNext: number): Promise<TxWriter> {
        return this.$write('function increaseObservationCardinalityNext(uint16)', eoa, observationCardinalityNext);
    }

    async initialize (eoa: {address: TAddress, key: string}, sqrtPriceX96: bigint): Promise<TxWriter> {
        return this.$write('function initialize(uint160)', eoa, sqrtPriceX96);
    }

    async liquidity (): Promise<bigint> {
        return this.$read('function liquidity() returns uint128');
    }

    async maxLiquidityPerTick (): Promise<bigint> {
        return this.$read('function maxLiquidityPerTick() returns uint128');
    }

    async mint (eoa: {address: TAddress, key: string}, recipient: TAddress, tickLower: number, tickUpper: number, amount: bigint, data: Buffer | string): Promise<TxWriter> {
        return this.$write('function mint(address, int24, int24, uint128, bytes) returns (uint256 amount0,uint256 amount1)', eoa, recipient, tickLower, tickUpper, amount, data);
    }

    async observations (input0: bigint): Promise<{ blockTimestamp: number, tickCumulative: number, secondsPerLiquidityCumulativeX128: bigint, initialized: boolean }> {
        return this.$read('function observations(uint256) returns (uint32 blockTimestamp,int56 tickCumulative,uint160 secondsPerLiquidityCumulativeX128,bool initialized)', input0);
    }

    async observe (secondsAgos: number[]): Promise<{ tickCumulatives: number[], secondsPerLiquidityCumulativeX128s: bigint[] }> {
        return this.$read('function observe(uint32[]) returns (int56[] tickCumulatives,uint160[] secondsPerLiquidityCumulativeX128s)', secondsAgos);
    }

    async positions (input0: Buffer | string): Promise<{ liquidity: bigint, feeGrowthInside0LastX128: bigint, feeGrowthInside1LastX128: bigint, tokensOwed0: bigint, tokensOwed1: bigint }> {
        return this.$read('function positions(bytes32) returns (uint128 liquidity,uint256 feeGrowthInside0LastX128,uint256 feeGrowthInside1LastX128,uint128 tokensOwed0,uint128 tokensOwed1)', input0);
    }

    async protocolFees (): Promise<{ token0: bigint, token1: bigint }> {
        return this.$read('function protocolFees() returns (uint128 token0,uint128 token1)');
    }

    async setFeeProtocol (eoa: {address: TAddress, key: string}, feeProtocol0: number, feeProtocol1: number): Promise<TxWriter> {
        return this.$write('function setFeeProtocol(uint8, uint8)', eoa, feeProtocol0, feeProtocol1);
    }

    async slot0 (): Promise<{ sqrtPriceX96: bigint, tick: number, observationIndex: number, observationCardinality: number, observationCardinalityNext: number, feeProtocol: number, unlocked: boolean }> {
        return this.$read('function slot0() returns (uint160 sqrtPriceX96,int24 tick,uint16 observationIndex,uint16 observationCardinality,uint16 observationCardinalityNext,uint8 feeProtocol,bool unlocked)');
    }

    async snapshotCumulativesInside (tickLower: number, tickUpper: number): Promise<{ tickCumulativeInside: number, secondsPerLiquidityInsideX128: bigint, secondsInside: number }> {
        return this.$read('function snapshotCumulativesInside(int24, int24) returns (int56 tickCumulativeInside,uint160 secondsPerLiquidityInsideX128,uint32 secondsInside)', tickLower, tickUpper);
    }

    async swap (eoa: {address: TAddress, key: string}, recipient: TAddress, zeroForOne: boolean, amountSpecified: bigint, sqrtPriceLimitX96: bigint, data: Buffer | string): Promise<TxWriter> {
        return this.$write('function swap(address, bool, int256, uint160, bytes) returns (int256 amount0,int256 amount1)', eoa, recipient, zeroForOne, amountSpecified, sqrtPriceLimitX96, data);
    }

    async tickBitmap (input0: number): Promise<bigint> {
        return this.$read('function tickBitmap(int16) returns uint256', input0);
    }

    async tickSpacing (): Promise<number> {
        return this.$read('function tickSpacing() returns int24');
    }

    async ticks (input0: number): Promise<{ liquidityGross: bigint, liquidityNet: bigint, feeGrowthOutside0X128: bigint, feeGrowthOutside1X128: bigint, tickCumulativeOutside: number, secondsPerLiquidityOutsideX128: bigint, secondsOutside: number, initialized: boolean }> {
        return this.$read('function ticks(int24) returns (uint128 liquidityGross,int128 liquidityNet,uint256 feeGrowthOutside0X128,uint256 feeGrowthOutside1X128,int56 tickCumulativeOutside,uint160 secondsPerLiquidityOutsideX128,uint32 secondsOutside,bool initialized)', input0);
    }

    async token0 (): Promise<TAddress> {
        return this.$read('function token0() returns address');
    }

    async token1 (): Promise<TAddress> {
        return this.$read('function token1() returns address');
    }

    abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"int24","name":"tickLower","type":"int24"},{"indexed":true,"internalType":"int24","name":"tickUpper","type":"int24"},{"indexed":false,"internalType":"uint128","name":"amount","type":"uint128"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"address","name":"recipient","type":"address"},{"indexed":true,"internalType":"int24","name":"tickLower","type":"int24"},{"indexed":true,"internalType":"int24","name":"tickUpper","type":"int24"},{"indexed":false,"internalType":"uint128","name":"amount0","type":"uint128"},{"indexed":false,"internalType":"uint128","name":"amount1","type":"uint128"}],"name":"Collect","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"uint128","name":"amount0","type":"uint128"},{"indexed":false,"internalType":"uint128","name":"amount1","type":"uint128"}],"name":"CollectProtocol","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"paid0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"paid1","type":"uint256"}],"name":"Flash","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint16","name":"observationCardinalityNextOld","type":"uint16"},{"indexed":false,"internalType":"uint16","name":"observationCardinalityNextNew","type":"uint16"}],"name":"IncreaseObservationCardinalityNext","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint160","name":"sqrtPriceX96","type":"uint160"},{"indexed":false,"internalType":"int24","name":"tick","type":"int24"}],"name":"Initialize","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"int24","name":"tickLower","type":"int24"},{"indexed":true,"internalType":"int24","name":"tickUpper","type":"int24"},{"indexed":false,"internalType":"uint128","name":"amount","type":"uint128"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"feeProtocol0Old","type":"uint8"},{"indexed":false,"internalType":"uint8","name":"feeProtocol1Old","type":"uint8"},{"indexed":false,"internalType":"uint8","name":"feeProtocol0New","type":"uint8"},{"indexed":false,"internalType":"uint8","name":"feeProtocol1New","type":"uint8"}],"name":"SetFeeProtocol","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"int256","name":"amount0","type":"int256"},{"indexed":false,"internalType":"int256","name":"amount1","type":"int256"},{"indexed":false,"internalType":"uint160","name":"sqrtPriceX96","type":"uint160"},{"indexed":false,"internalType":"uint128","name":"liquidity","type":"uint128"},{"indexed":false,"internalType":"int24","name":"tick","type":"int24"}],"name":"Swap","type":"event"},{"inputs":[{"internalType":"int24","name":"tickLower","type":"int24"},{"internalType":"int24","name":"tickUpper","type":"int24"},{"internalType":"uint128","name":"amount","type":"uint128"}],"name":"burn","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"int24","name":"tickLower","type":"int24"},{"internalType":"int24","name":"tickUpper","type":"int24"},{"internalType":"uint128","name":"amount0Requested","type":"uint128"},{"internalType":"uint128","name":"amount1Requested","type":"uint128"}],"name":"collect","outputs":[{"internalType":"uint128","name":"amount0","type":"uint128"},{"internalType":"uint128","name":"amount1","type":"uint128"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint128","name":"amount0Requested","type":"uint128"},{"internalType":"uint128","name":"amount1Requested","type":"uint128"}],"name":"collectProtocol","outputs":[{"internalType":"uint128","name":"amount0","type":"uint128"},{"internalType":"uint128","name":"amount1","type":"uint128"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fee","outputs":[{"internalType":"uint24","name":"","type":"uint24"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"feeGrowthGlobal0X128","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"feeGrowthGlobal1X128","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"flash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint16","name":"observationCardinalityNext","type":"uint16"}],"name":"increaseObservationCardinalityNext","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint160","name":"sqrtPriceX96","type":"uint160"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"liquidity","outputs":[{"internalType":"uint128","name":"","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxLiquidityPerTick","outputs":[{"internalType":"uint128","name":"","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"int24","name":"tickLower","type":"int24"},{"internalType":"int24","name":"tickUpper","type":"int24"},{"internalType":"uint128","name":"amount","type":"uint128"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"mint","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"observations","outputs":[{"internalType":"uint32","name":"blockTimestamp","type":"uint32"},{"internalType":"int56","name":"tickCumulative","type":"int56"},{"internalType":"uint160","name":"secondsPerLiquidityCumulativeX128","type":"uint160"},{"internalType":"bool","name":"initialized","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32[]","name":"secondsAgos","type":"uint32[]"}],"name":"observe","outputs":[{"internalType":"int56[]","name":"tickCumulatives","type":"int56[]"},{"internalType":"uint160[]","name":"secondsPerLiquidityCumulativeX128s","type":"uint160[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"positions","outputs":[{"internalType":"uint128","name":"liquidity","type":"uint128"},{"internalType":"uint256","name":"feeGrowthInside0LastX128","type":"uint256"},{"internalType":"uint256","name":"feeGrowthInside1LastX128","type":"uint256"},{"internalType":"uint128","name":"tokensOwed0","type":"uint128"},{"internalType":"uint128","name":"tokensOwed1","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"protocolFees","outputs":[{"internalType":"uint128","name":"token0","type":"uint128"},{"internalType":"uint128","name":"token1","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"feeProtocol0","type":"uint8"},{"internalType":"uint8","name":"feeProtocol1","type":"uint8"}],"name":"setFeeProtocol","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"slot0","outputs":[{"internalType":"uint160","name":"sqrtPriceX96","type":"uint160"},{"internalType":"int24","name":"tick","type":"int24"},{"internalType":"uint16","name":"observationIndex","type":"uint16"},{"internalType":"uint16","name":"observationCardinality","type":"uint16"},{"internalType":"uint16","name":"observationCardinalityNext","type":"uint16"},{"internalType":"uint8","name":"feeProtocol","type":"uint8"},{"internalType":"bool","name":"unlocked","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"int24","name":"tickLower","type":"int24"},{"internalType":"int24","name":"tickUpper","type":"int24"}],"name":"snapshotCumulativesInside","outputs":[{"internalType":"int56","name":"tickCumulativeInside","type":"int56"},{"internalType":"uint160","name":"secondsPerLiquidityInsideX128","type":"uint160"},{"internalType":"uint32","name":"secondsInside","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"bool","name":"zeroForOne","type":"bool"},{"internalType":"int256","name":"amountSpecified","type":"int256"},{"internalType":"uint160","name":"sqrtPriceLimitX96","type":"uint160"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[{"internalType":"int256","name":"amount0","type":"int256"},{"internalType":"int256","name":"amount1","type":"int256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"int16","name":"","type":"int16"}],"name":"tickBitmap","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tickSpacing","outputs":[{"internalType":"int24","name":"","type":"int24"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"int24","name":"","type":"int24"}],"name":"ticks","outputs":[{"internalType":"uint128","name":"liquidityGross","type":"uint128"},{"internalType":"int128","name":"liquidityNet","type":"int128"},{"internalType":"uint256","name":"feeGrowthOutside0X128","type":"uint256"},{"internalType":"uint256","name":"feeGrowthOutside1X128","type":"uint256"},{"internalType":"int56","name":"tickCumulativeOutside","type":"int56"},{"internalType":"uint160","name":"secondsPerLiquidityOutsideX128","type":"uint160"},{"internalType":"uint32","name":"secondsOutside","type":"uint32"},{"internalType":"bool","name":"initialized","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]
}
