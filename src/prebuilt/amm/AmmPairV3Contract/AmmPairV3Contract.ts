/**
 *  AUTO-Generated Class: 2024-05-17 00:25
 *  Implementation: https://etherscan.io/address/0x8f8ef111b67c04eb1641f5ff19ee54cda062f163#code
 */
import di from 'a-di';
import { TAddress } from '@dequanto/models/TAddress';
import { TAccount } from '@dequanto/models/TAccount';
import { TBufferLike } from '@dequanto/models/TBufferLike';
import { ClientEventsStream, TClientEventsStreamData } from '@dequanto/clients/ClientEventsStream';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { ContractBaseUtils } from '@dequanto/contracts/utils/ContractBaseUtils';
import { ContractStorageReaderBase } from '@dequanto/contracts/ContractStorageReaderBase';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { ITxLogItem } from '@dequanto/txs/receipt/ITxLogItem';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IBlockchainExplorer } from '@dequanto/explorer/IBlockchainExplorer';
import { SubjectStream } from '@dequanto/class/SubjectStream';


import type { ContractWriter } from '@dequanto/contracts/ContractWriter';
import type { TAbiItem } from '@dequanto/types/TAbi';
import type { TEth } from '@dequanto/models/TEth';
import type { TOverrideReturns } from '@dequanto/utils/types';


import { Etherscan } from '@dequanto/explorer/Etherscan'
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client'



export class AmmPairV3Contract extends ContractBase {
    constructor(
        public address: TEth.Address = '0x8f8ef111b67c04eb1641f5ff19ee54cda062f163',
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockchainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        this.storage = new AmmPairV3ContractStorageReader(this.address, this.client, this.explorer);
    }

    Types: TAmmPairV3ContractTypes;

    $meta = {
        "class": "./src/prebuilt/amm/AmmPairV3Contract/AmmPairV3Contract.ts"
    }

    async $constructor (deployer: TSender, ): Promise<TxWriter> {
        throw new Error('Not implemented. Typing purpose. Use the ContractDeployer class to deploy the contract');
    }

    // 0xa34123a7
    async burn (sender: TSender, tickLower: number, tickUpper: number, amount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'burn'), sender, tickLower, tickUpper, amount);
    }

    // 0x4f1eb3d8
    async collect (sender: TSender, recipient: TAddress, tickLower: number, tickUpper: number, amount0Requested: bigint, amount1Requested: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'collect'), sender, recipient, tickLower, tickUpper, amount0Requested, amount1Requested);
    }

    // 0x85b66729
    async collectProtocol (sender: TSender, recipient: TAddress, amount0Requested: bigint, amount1Requested: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'collectProtocol'), sender, recipient, amount0Requested, amount1Requested);
    }

    // 0xc45a0155
    async factory (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'factory'));
    }

    // 0xddca3f43
    async fee (): Promise<number> {
        return this.$read(this.$getAbiItem('function', 'fee'));
    }

    // 0xf3058399
    async feeGrowthGlobal0X128 (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'feeGrowthGlobal0X128'));
    }

    // 0x46141319
    async feeGrowthGlobal1X128 (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'feeGrowthGlobal1X128'));
    }

    // 0x490e6cbc
    async flash (sender: TSender, recipient: TAddress, amount0: bigint, amount1: bigint, data: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'flash'), sender, recipient, amount0, amount1, data);
    }

    // 0x32148f67
    async increaseObservationCardinalityNext (sender: TSender, observationCardinalityNext: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'increaseObservationCardinalityNext'), sender, observationCardinalityNext);
    }

    // 0xf637731d
    async initialize (sender: TSender, sqrtPriceX96: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'initialize'), sender, sqrtPriceX96);
    }

    // 0x1a686502
    async liquidity (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'liquidity'));
    }

    // 0x70cf754a
    async maxLiquidityPerTick (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'maxLiquidityPerTick'));
    }

    // 0x3c8a7d8d
    async mint (sender: TSender, recipient: TAddress, tickLower: number, tickUpper: number, amount: bigint, data: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'mint'), sender, recipient, tickLower, tickUpper, amount, data);
    }

    // 0x252c09d7
    async observations (input0: bigint): Promise<{ blockTimestamp: number, tickCumulative: number, secondsPerLiquidityCumulativeX128: bigint, initialized: boolean }> {
        return this.$read(this.$getAbiItem('function', 'observations'), input0);
    }

    // 0x883bdbfd
    async observe (secondsAgos: number[]): Promise<{ tickCumulatives: number[], secondsPerLiquidityCumulativeX128s: bigint[] }> {
        return this.$read(this.$getAbiItem('function', 'observe'), secondsAgos);
    }

    // 0x514ea4bf
    async positions (input0: TEth.Hex): Promise<{ liquidity: bigint, feeGrowthInside0LastX128: bigint, feeGrowthInside1LastX128: bigint, tokensOwed0: bigint, tokensOwed1: bigint }> {
        return this.$read(this.$getAbiItem('function', 'positions'), input0);
    }

    // 0x1ad8b03b
    async protocolFees (): Promise<{ token0: bigint, token1: bigint }> {
        return this.$read(this.$getAbiItem('function', 'protocolFees'));
    }

    // 0x8206a4d1
    async setFeeProtocol (sender: TSender, feeProtocol0: number, feeProtocol1: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setFeeProtocol'), sender, feeProtocol0, feeProtocol1);
    }

    // 0x3850c7bd
    async slot0 (): Promise<{ sqrtPriceX96: bigint, tick: number, observationIndex: number, observationCardinality: number, observationCardinalityNext: number, feeProtocol: number, unlocked: boolean }> {
        return this.$read(this.$getAbiItem('function', 'slot0'));
    }

    // 0xa38807f2
    async snapshotCumulativesInside (tickLower: number, tickUpper: number): Promise<{ tickCumulativeInside: number, secondsPerLiquidityInsideX128: bigint, secondsInside: number }> {
        return this.$read(this.$getAbiItem('function', 'snapshotCumulativesInside'), tickLower, tickUpper);
    }

    // 0x128acb08
    async swap (sender: TSender, recipient: TAddress, zeroForOne: boolean, amountSpecified: bigint, sqrtPriceLimitX96: bigint, data: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'swap'), sender, recipient, zeroForOne, amountSpecified, sqrtPriceLimitX96, data);
    }

    // 0x5339c296
    async tickBitmap (input0: number): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'tickBitmap'), input0);
    }

    // 0xd0c93a7c
    async tickSpacing (): Promise<number> {
        return this.$read(this.$getAbiItem('function', 'tickSpacing'));
    }

    // 0xf30dba93
    async ticks (input0: number): Promise<{ liquidityGross: bigint, liquidityNet: bigint, feeGrowthOutside0X128: bigint, feeGrowthOutside1X128: bigint, tickCumulativeOutside: number, secondsPerLiquidityOutsideX128: bigint, secondsOutside: number, initialized: boolean }> {
        return this.$read(this.$getAbiItem('function', 'ticks'), input0);
    }

    // 0x0dfe1681
    async token0 (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'token0'));
    }

    // 0xd21220a7
    async token1 (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'token1'));
    }

    $call () {
        return super.$call() as IAmmPairV3ContractTxCaller;
    }
    $signed (): TOverrideReturns<IAmmPairV3ContractTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IAmmPairV3ContractTxData {
        return super.$data() as IAmmPairV3ContractTxData;
    }
    $gas (): TOverrideReturns<IAmmPairV3ContractTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TAmmPairV3ContractTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TAmmPairV3ContractTypes['Methods'][TMethod]['arguments']
        }
    }> {
        options ??= {};
        options.filter ??= {};
        options.filter.method = method;
        return <any> this.$onTransaction(options);
    }

    onLog (event: keyof TEvents, cb?: (event: TClientEventsStreamData) => void): ClientEventsStream<TClientEventsStreamData> {
        return this.$onLog(event, cb);
    }

    async getPastLogs <TEventName extends keyof TEvents> (
        events: TEventName[]
        , options?: TEventLogOptions<TEventParams<TEventName>>
    ): Promise<ITxLogItem<TEventParams<TEventName>, TEventName>[]>
    async getPastLogs <TEventName extends keyof TEvents> (
        event: TEventName
        , options?: TEventLogOptions<TEventParams<TEventName>>
    ): Promise<ITxLogItem<TEventParams<TEventName>, TEventName>[]>
    async getPastLogs (mix: any, options?): Promise<any> {
        return await super.getPastLogs(mix, options) as any;
    }

    onBurn (fn?: (event: TClientEventsStreamData<TEventArguments<'Burn'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Burn'>>> {
        return this.$onLog('Burn', fn);
    }

    onCollect (fn?: (event: TClientEventsStreamData<TEventArguments<'Collect'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Collect'>>> {
        return this.$onLog('Collect', fn);
    }

    onCollectProtocol (fn?: (event: TClientEventsStreamData<TEventArguments<'CollectProtocol'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'CollectProtocol'>>> {
        return this.$onLog('CollectProtocol', fn);
    }

    onFlash (fn?: (event: TClientEventsStreamData<TEventArguments<'Flash'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Flash'>>> {
        return this.$onLog('Flash', fn);
    }

    onIncreaseObservationCardinalityNext (fn?: (event: TClientEventsStreamData<TEventArguments<'IncreaseObservationCardinalityNext'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'IncreaseObservationCardinalityNext'>>> {
        return this.$onLog('IncreaseObservationCardinalityNext', fn);
    }

    onInitialize (fn?: (event: TClientEventsStreamData<TEventArguments<'Initialize'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Initialize'>>> {
        return this.$onLog('Initialize', fn);
    }

    onMint (fn?: (event: TClientEventsStreamData<TEventArguments<'Mint'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Mint'>>> {
        return this.$onLog('Mint', fn);
    }

    onSetFeeProtocol (fn?: (event: TClientEventsStreamData<TEventArguments<'SetFeeProtocol'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'SetFeeProtocol'>>> {
        return this.$onLog('SetFeeProtocol', fn);
    }

    onSwap (fn?: (event: TClientEventsStreamData<TEventArguments<'Swap'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Swap'>>> {
        return this.$onLog('Swap', fn);
    }

    extractLogsBurn (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Burn'>>[] {
        let abi = this.$getAbiItem('event', 'Burn');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Burn'>>[];
    }

    extractLogsCollect (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Collect'>>[] {
        let abi = this.$getAbiItem('event', 'Collect');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Collect'>>[];
    }

    extractLogsCollectProtocol (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'CollectProtocol'>>[] {
        let abi = this.$getAbiItem('event', 'CollectProtocol');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'CollectProtocol'>>[];
    }

    extractLogsFlash (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Flash'>>[] {
        let abi = this.$getAbiItem('event', 'Flash');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Flash'>>[];
    }

    extractLogsIncreaseObservationCardinalityNext (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'IncreaseObservationCardinalityNext'>>[] {
        let abi = this.$getAbiItem('event', 'IncreaseObservationCardinalityNext');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'IncreaseObservationCardinalityNext'>>[];
    }

    extractLogsInitialize (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Initialize'>>[] {
        let abi = this.$getAbiItem('event', 'Initialize');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Initialize'>>[];
    }

    extractLogsMint (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Mint'>>[] {
        let abi = this.$getAbiItem('event', 'Mint');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Mint'>>[];
    }

    extractLogsSetFeeProtocol (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'SetFeeProtocol'>>[] {
        let abi = this.$getAbiItem('event', 'SetFeeProtocol');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'SetFeeProtocol'>>[];
    }

    extractLogsSwap (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Swap'>>[] {
        let abi = this.$getAbiItem('event', 'Swap');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Swap'>>[];
    }

    async getPastLogsBurn (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { owner?: TAddress,tickLower?: number,tickUpper?: number }
    }): Promise<ITxLogItem<TEventParams<'Burn'>>[]> {
        return await this.$getPastLogsParsed('Burn', options) as any;
    }

    async getPastLogsCollect (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { owner?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'Collect'>>[]> {
        return await this.$getPastLogsParsed('Collect', options) as any;
    }

    async getPastLogsCollectProtocol (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { sender?: TAddress,recipient?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'CollectProtocol'>>[]> {
        return await this.$getPastLogsParsed('CollectProtocol', options) as any;
    }

    async getPastLogsFlash (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { sender?: TAddress,recipient?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'Flash'>>[]> {
        return await this.$getPastLogsParsed('Flash', options) as any;
    }

    async getPastLogsIncreaseObservationCardinalityNext (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'IncreaseObservationCardinalityNext'>>[]> {
        return await this.$getPastLogsParsed('IncreaseObservationCardinalityNext', options) as any;
    }

    async getPastLogsInitialize (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'Initialize'>>[]> {
        return await this.$getPastLogsParsed('Initialize', options) as any;
    }

    async getPastLogsMint (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'Mint'>>[]> {
        return await this.$getPastLogsParsed('Mint', options) as any;
    }

    async getPastLogsSetFeeProtocol (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'SetFeeProtocol'>>[]> {
        return await this.$getPastLogsParsed('SetFeeProtocol', options) as any;
    }

    async getPastLogsSwap (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { sender?: TAddress,recipient?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'Swap'>>[]> {
        return await this.$getPastLogsParsed('Swap', options) as any;
    }

    abi: TAbiItem[] = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"int24","name":"tickLower","type":"int24"},{"indexed":true,"internalType":"int24","name":"tickUpper","type":"int24"},{"indexed":false,"internalType":"uint128","name":"amount","type":"uint128"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"address","name":"recipient","type":"address"},{"indexed":true,"internalType":"int24","name":"tickLower","type":"int24"},{"indexed":true,"internalType":"int24","name":"tickUpper","type":"int24"},{"indexed":false,"internalType":"uint128","name":"amount0","type":"uint128"},{"indexed":false,"internalType":"uint128","name":"amount1","type":"uint128"}],"name":"Collect","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"uint128","name":"amount0","type":"uint128"},{"indexed":false,"internalType":"uint128","name":"amount1","type":"uint128"}],"name":"CollectProtocol","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"paid0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"paid1","type":"uint256"}],"name":"Flash","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint16","name":"observationCardinalityNextOld","type":"uint16"},{"indexed":false,"internalType":"uint16","name":"observationCardinalityNextNew","type":"uint16"}],"name":"IncreaseObservationCardinalityNext","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint160","name":"sqrtPriceX96","type":"uint160"},{"indexed":false,"internalType":"int24","name":"tick","type":"int24"}],"name":"Initialize","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"int24","name":"tickLower","type":"int24"},{"indexed":true,"internalType":"int24","name":"tickUpper","type":"int24"},{"indexed":false,"internalType":"uint128","name":"amount","type":"uint128"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"feeProtocol0Old","type":"uint8"},{"indexed":false,"internalType":"uint8","name":"feeProtocol1Old","type":"uint8"},{"indexed":false,"internalType":"uint8","name":"feeProtocol0New","type":"uint8"},{"indexed":false,"internalType":"uint8","name":"feeProtocol1New","type":"uint8"}],"name":"SetFeeProtocol","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"int256","name":"amount0","type":"int256"},{"indexed":false,"internalType":"int256","name":"amount1","type":"int256"},{"indexed":false,"internalType":"uint160","name":"sqrtPriceX96","type":"uint160"},{"indexed":false,"internalType":"uint128","name":"liquidity","type":"uint128"},{"indexed":false,"internalType":"int24","name":"tick","type":"int24"}],"name":"Swap","type":"event"},{"inputs":[{"internalType":"int24","name":"tickLower","type":"int24"},{"internalType":"int24","name":"tickUpper","type":"int24"},{"internalType":"uint128","name":"amount","type":"uint128"}],"name":"burn","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"int24","name":"tickLower","type":"int24"},{"internalType":"int24","name":"tickUpper","type":"int24"},{"internalType":"uint128","name":"amount0Requested","type":"uint128"},{"internalType":"uint128","name":"amount1Requested","type":"uint128"}],"name":"collect","outputs":[{"internalType":"uint128","name":"amount0","type":"uint128"},{"internalType":"uint128","name":"amount1","type":"uint128"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint128","name":"amount0Requested","type":"uint128"},{"internalType":"uint128","name":"amount1Requested","type":"uint128"}],"name":"collectProtocol","outputs":[{"internalType":"uint128","name":"amount0","type":"uint128"},{"internalType":"uint128","name":"amount1","type":"uint128"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fee","outputs":[{"internalType":"uint24","name":"","type":"uint24"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"feeGrowthGlobal0X128","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"feeGrowthGlobal1X128","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"flash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint16","name":"observationCardinalityNext","type":"uint16"}],"name":"increaseObservationCardinalityNext","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint160","name":"sqrtPriceX96","type":"uint160"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"liquidity","outputs":[{"internalType":"uint128","name":"","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxLiquidityPerTick","outputs":[{"internalType":"uint128","name":"","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"int24","name":"tickLower","type":"int24"},{"internalType":"int24","name":"tickUpper","type":"int24"},{"internalType":"uint128","name":"amount","type":"uint128"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"mint","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"observations","outputs":[{"internalType":"uint32","name":"blockTimestamp","type":"uint32"},{"internalType":"int56","name":"tickCumulative","type":"int56"},{"internalType":"uint160","name":"secondsPerLiquidityCumulativeX128","type":"uint160"},{"internalType":"bool","name":"initialized","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32[]","name":"secondsAgos","type":"uint32[]"}],"name":"observe","outputs":[{"internalType":"int56[]","name":"tickCumulatives","type":"int56[]"},{"internalType":"uint160[]","name":"secondsPerLiquidityCumulativeX128s","type":"uint160[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"positions","outputs":[{"internalType":"uint128","name":"liquidity","type":"uint128"},{"internalType":"uint256","name":"feeGrowthInside0LastX128","type":"uint256"},{"internalType":"uint256","name":"feeGrowthInside1LastX128","type":"uint256"},{"internalType":"uint128","name":"tokensOwed0","type":"uint128"},{"internalType":"uint128","name":"tokensOwed1","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"protocolFees","outputs":[{"internalType":"uint128","name":"token0","type":"uint128"},{"internalType":"uint128","name":"token1","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"feeProtocol0","type":"uint8"},{"internalType":"uint8","name":"feeProtocol1","type":"uint8"}],"name":"setFeeProtocol","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"slot0","outputs":[{"internalType":"uint160","name":"sqrtPriceX96","type":"uint160"},{"internalType":"int24","name":"tick","type":"int24"},{"internalType":"uint16","name":"observationIndex","type":"uint16"},{"internalType":"uint16","name":"observationCardinality","type":"uint16"},{"internalType":"uint16","name":"observationCardinalityNext","type":"uint16"},{"internalType":"uint8","name":"feeProtocol","type":"uint8"},{"internalType":"bool","name":"unlocked","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"int24","name":"tickLower","type":"int24"},{"internalType":"int24","name":"tickUpper","type":"int24"}],"name":"snapshotCumulativesInside","outputs":[{"internalType":"int56","name":"tickCumulativeInside","type":"int56"},{"internalType":"uint160","name":"secondsPerLiquidityInsideX128","type":"uint160"},{"internalType":"uint32","name":"secondsInside","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"bool","name":"zeroForOne","type":"bool"},{"internalType":"int256","name":"amountSpecified","type":"int256"},{"internalType":"uint160","name":"sqrtPriceLimitX96","type":"uint160"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[{"internalType":"int256","name":"amount0","type":"int256"},{"internalType":"int256","name":"amount1","type":"int256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"int16","name":"","type":"int16"}],"name":"tickBitmap","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tickSpacing","outputs":[{"internalType":"int24","name":"","type":"int24"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"int24","name":"","type":"int24"}],"name":"ticks","outputs":[{"internalType":"uint128","name":"liquidityGross","type":"uint128"},{"internalType":"int128","name":"liquidityNet","type":"int128"},{"internalType":"uint256","name":"feeGrowthOutside0X128","type":"uint256"},{"internalType":"uint256","name":"feeGrowthOutside1X128","type":"uint256"},{"internalType":"int56","name":"tickCumulativeOutside","type":"int56"},{"internalType":"uint160","name":"secondsPerLiquidityOutsideX128","type":"uint160"},{"internalType":"uint32","name":"secondsOutside","type":"uint32"},{"internalType":"bool","name":"initialized","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]

    declare storage: AmmPairV3ContractStorageReader
}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TAmmPairV3ContractTypes = {
    Events: {
        Burn: {
            outputParams: { owner: TAddress, tickLower: number, tickUpper: number, amount: bigint, amount0: bigint, amount1: bigint },
            outputArgs:   [ owner: TAddress, tickLower: number, tickUpper: number, amount: bigint, amount0: bigint, amount1: bigint ],
        }
        Collect: {
            outputParams: { owner: TAddress, recipient: TAddress, tickLower: number, tickUpper: number, amount0: bigint, amount1: bigint },
            outputArgs:   [ owner: TAddress, recipient: TAddress, tickLower: number, tickUpper: number, amount0: bigint, amount1: bigint ],
        }
        CollectProtocol: {
            outputParams: { _sender: TAddress, recipient: TAddress, amount0: bigint, amount1: bigint },
            outputArgs:   [ _sender: TAddress, recipient: TAddress, amount0: bigint, amount1: bigint ],
        }
        Flash: {
            outputParams: { _sender: TAddress, recipient: TAddress, amount0: bigint, amount1: bigint, paid0: bigint, paid1: bigint },
            outputArgs:   [ _sender: TAddress, recipient: TAddress, amount0: bigint, amount1: bigint, paid0: bigint, paid1: bigint ],
        }
        IncreaseObservationCardinalityNext: {
            outputParams: { observationCardinalityNextOld: number, observationCardinalityNextNew: number },
            outputArgs:   [ observationCardinalityNextOld: number, observationCardinalityNextNew: number ],
        }
        Initialize: {
            outputParams: { sqrtPriceX96: bigint, tick: number },
            outputArgs:   [ sqrtPriceX96: bigint, tick: number ],
        }
        Mint: {
            outputParams: { _sender: TAddress, owner: TAddress, tickLower: number, tickUpper: number, amount: bigint, amount0: bigint, amount1: bigint },
            outputArgs:   [ _sender: TAddress, owner: TAddress, tickLower: number, tickUpper: number, amount: bigint, amount0: bigint, amount1: bigint ],
        }
        SetFeeProtocol: {
            outputParams: { feeProtocol0Old: number, feeProtocol1Old: number, feeProtocol0New: number, feeProtocol1New: number },
            outputArgs:   [ feeProtocol0Old: number, feeProtocol1Old: number, feeProtocol0New: number, feeProtocol1New: number ],
        }
        Swap: {
            outputParams: { _sender: TAddress, recipient: TAddress, amount0: bigint, amount1: bigint, sqrtPriceX96: bigint, liquidity: bigint, tick: number },
            outputArgs:   [ _sender: TAddress, recipient: TAddress, amount0: bigint, amount1: bigint, sqrtPriceX96: bigint, liquidity: bigint, tick: number ],
        }
    },
    Methods: {
        burn: {
          method: "burn"
          arguments: [ tickLower: number, tickUpper: number, amount: bigint ]
        }
        collect: {
          method: "collect"
          arguments: [ recipient: TAddress, tickLower: number, tickUpper: number, amount0Requested: bigint, amount1Requested: bigint ]
        }
        collectProtocol: {
          method: "collectProtocol"
          arguments: [ recipient: TAddress, amount0Requested: bigint, amount1Requested: bigint ]
        }
        factory: {
          method: "factory"
          arguments: [  ]
        }
        fee: {
          method: "fee"
          arguments: [  ]
        }
        feeGrowthGlobal0X128: {
          method: "feeGrowthGlobal0X128"
          arguments: [  ]
        }
        feeGrowthGlobal1X128: {
          method: "feeGrowthGlobal1X128"
          arguments: [  ]
        }
        flash: {
          method: "flash"
          arguments: [ recipient: TAddress, amount0: bigint, amount1: bigint, data: TEth.Hex ]
        }
        increaseObservationCardinalityNext: {
          method: "increaseObservationCardinalityNext"
          arguments: [ observationCardinalityNext: number ]
        }
        initialize: {
          method: "initialize"
          arguments: [ sqrtPriceX96: bigint ]
        }
        liquidity: {
          method: "liquidity"
          arguments: [  ]
        }
        maxLiquidityPerTick: {
          method: "maxLiquidityPerTick"
          arguments: [  ]
        }
        mint: {
          method: "mint"
          arguments: [ recipient: TAddress, tickLower: number, tickUpper: number, amount: bigint, data: TEth.Hex ]
        }
        observations: {
          method: "observations"
          arguments: [ input0: bigint ]
        }
        observe: {
          method: "observe"
          arguments: [ secondsAgos: number[] ]
        }
        positions: {
          method: "positions"
          arguments: [ input0: TEth.Hex ]
        }
        protocolFees: {
          method: "protocolFees"
          arguments: [  ]
        }
        setFeeProtocol: {
          method: "setFeeProtocol"
          arguments: [ feeProtocol0: number, feeProtocol1: number ]
        }
        slot0: {
          method: "slot0"
          arguments: [  ]
        }
        snapshotCumulativesInside: {
          method: "snapshotCumulativesInside"
          arguments: [ tickLower: number, tickUpper: number ]
        }
        swap: {
          method: "swap"
          arguments: [ recipient: TAddress, zeroForOne: boolean, amountSpecified: bigint, sqrtPriceLimitX96: bigint, data: TEth.Hex ]
        }
        tickBitmap: {
          method: "tickBitmap"
          arguments: [ input0: number ]
        }
        tickSpacing: {
          method: "tickSpacing"
          arguments: [  ]
        }
        ticks: {
          method: "ticks"
          arguments: [ input0: number ]
        }
        token0: {
          method: "token0"
          arguments: [  ]
        }
        token1: {
          method: "token1"
          arguments: [  ]
        }
    }
}



class AmmPairV3ContractStorageReader extends ContractStorageReaderBase {
    constructor(
        public address: TAddress,
        public client: Web3Client,
        public explorer: IBlockchainExplorer,
    ) {
        super(address, client, explorer);

        this.$createHandler(this.$slots);
    }

    async slot0(): Promise<{ sqrtPriceX96: bigint, tick: number, observationIndex: number, observationCardinality: number, observationCardinalityNext: number, feeProtocol: number, unlocked: boolean }> {
        return this.$storage.get(['slot0', ]);
    }

    async feeGrowthGlobal0X128(): Promise<bigint> {
        return this.$storage.get(['feeGrowthGlobal0X128', ]);
    }

    async feeGrowthGlobal1X128(): Promise<bigint> {
        return this.$storage.get(['feeGrowthGlobal1X128', ]);
    }

    async protocolFees(): Promise<{ token0: bigint, token1: bigint }> {
        return this.$storage.get(['protocolFees', ]);
    }

    async liquidity(): Promise<bigint> {
        return this.$storage.get(['liquidity', ]);
    }

    async ticks(key: number): Promise<{ liquidityGross: bigint, liquidityNet: bigint, feeGrowthOutside0X128: bigint, feeGrowthOutside1X128: bigint, tickCumulativeOutside: number, secondsPerLiquidityOutsideX128: bigint, secondsOutside: number, initialized: boolean }> {
        return this.$storage.get(['ticks', key]);
    }

    async tickBitmap(key: number): Promise<bigint> {
        return this.$storage.get(['tickBitmap', key]);
    }

    async positions(key: TEth.Hex): Promise<{ liquidity: bigint, feeGrowthInside0LastX128: bigint, feeGrowthInside1LastX128: bigint, tokensOwed0: bigint, tokensOwed1: bigint }> {
        return this.$storage.get(['positions', key]);
    }

    async observations(): Promise<{ blockTimestamp: number, tickCumulative: number, secondsPerLiquidityCumulativeX128: bigint, initialized: boolean }[]> {
        return this.$storage.get(['observations', ]);
    }

    $slots = [
    {
        "slot": 0,
        "position": 0,
        "name": "slot0",
        "size": 248,
        "type": "(uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)"
    },
    {
        "slot": 1,
        "position": 0,
        "name": "feeGrowthGlobal0X128",
        "size": 256,
        "type": "uint256"
    },
    {
        "slot": 2,
        "position": 0,
        "name": "feeGrowthGlobal1X128",
        "size": 256,
        "type": "uint256"
    },
    {
        "slot": 3,
        "position": 0,
        "name": "protocolFees",
        "size": 256,
        "type": "(uint128 token0, uint128 token1)"
    },
    {
        "slot": 4,
        "position": 0,
        "name": "liquidity",
        "size": 128,
        "type": "uint128"
    },
    {
        "slot": 5,
        "position": 0,
        "name": "ticks",
        "size": null,
        "type": "mapping(int24 => (uint128 liquidityGross, int128 liquidityNet, uint256 feeGrowthOutside0X128, uint256 feeGrowthOutside1X128, int56 tickCumulativeOutside, uint160 secondsPerLiquidityOutsideX128, uint32 secondsOutside, bool initialized))"
    },
    {
        "slot": 6,
        "position": 0,
        "name": "tickBitmap",
        "size": null,
        "type": "mapping(int16 => uint256)"
    },
    {
        "slot": 7,
        "position": 0,
        "name": "positions",
        "size": null,
        "type": "mapping(bytes32 => (uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1))"
    },
    {
        "slot": 8,
        "position": 0,
        "name": "observations",
        "size": 16776960,
        "type": "(uint32 blockTimestamp, int56 tickCumulative, uint160 secondsPerLiquidityCumulativeX128, bool initialized)[65535]"
    }
]

}


interface IAmmPairV3ContractTxCaller {
    burn (sender: TSender, tickLower: number, tickUpper: number, amount: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    collect (sender: TSender, recipient: TAddress, tickLower: number, tickUpper: number, amount0Requested: bigint, amount1Requested: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    collectProtocol (sender: TSender, recipient: TAddress, amount0Requested: bigint, amount1Requested: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    flash (sender: TSender, recipient: TAddress, amount0: bigint, amount1: bigint, data: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    increaseObservationCardinalityNext (sender: TSender, observationCardinalityNext: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    initialize (sender: TSender, sqrtPriceX96: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    mint (sender: TSender, recipient: TAddress, tickLower: number, tickUpper: number, amount: bigint, data: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setFeeProtocol (sender: TSender, feeProtocol0: number, feeProtocol1: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    swap (sender: TSender, recipient: TAddress, zeroForOne: boolean, amountSpecified: bigint, sqrtPriceLimitX96: bigint, data: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IAmmPairV3ContractTxData {
    burn (sender: TSender, tickLower: number, tickUpper: number, amount: bigint): Promise<TEth.TxLike>
    collect (sender: TSender, recipient: TAddress, tickLower: number, tickUpper: number, amount0Requested: bigint, amount1Requested: bigint): Promise<TEth.TxLike>
    collectProtocol (sender: TSender, recipient: TAddress, amount0Requested: bigint, amount1Requested: bigint): Promise<TEth.TxLike>
    flash (sender: TSender, recipient: TAddress, amount0: bigint, amount1: bigint, data: TEth.Hex): Promise<TEth.TxLike>
    increaseObservationCardinalityNext (sender: TSender, observationCardinalityNext: number): Promise<TEth.TxLike>
    initialize (sender: TSender, sqrtPriceX96: bigint): Promise<TEth.TxLike>
    mint (sender: TSender, recipient: TAddress, tickLower: number, tickUpper: number, amount: bigint, data: TEth.Hex): Promise<TEth.TxLike>
    setFeeProtocol (sender: TSender, feeProtocol0: number, feeProtocol1: number): Promise<TEth.TxLike>
    swap (sender: TSender, recipient: TAddress, zeroForOne: boolean, amountSpecified: bigint, sqrtPriceLimitX96: bigint, data: TEth.Hex): Promise<TEth.TxLike>
}


type TEvents = TAmmPairV3ContractTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;
