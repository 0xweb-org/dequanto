/**
 *  AUTO-Generated Class: 2026-09-14 00:25
 *  Implementation: https://etherscan.io/address/0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2#code
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


import { Evmscan } from '@dequanto/explorer/Evmscan';
import { EvmWeb3Client } from '@dequanto/clients/EvmWeb3Client';

export namespace AavePoolErrors {
    export interface AddressEmptyCode {
        type: 'AddressEmptyCode'
        params: {
            target: TAddress
        }
    }
    export interface AssetNotListed {
        type: 'AssetNotListed'
        params: {
        }
    }
    export interface CallerNotAToken {
        type: 'CallerNotAToken'
        params: {
        }
    }
    export interface CallerNotPoolAdmin {
        type: 'CallerNotPoolAdmin'
        params: {
        }
    }
    export interface CallerNotPoolConfigurator {
        type: 'CallerNotPoolConfigurator'
        params: {
        }
    }
    export interface CallerNotPositionManager {
        type: 'CallerNotPositionManager'
        params: {
        }
    }
    export interface CallerNotUmbrella {
        type: 'CallerNotUmbrella'
        params: {
        }
    }
    export interface EModeCategoryReserved {
        type: 'EModeCategoryReserved'
        params: {
        }
    }
    export interface FailedCall {
        type: 'FailedCall'
        params: {
        }
    }
    export interface InvalidAddressesProvider {
        type: 'InvalidAddressesProvider'
        params: {
        }
    }
    export interface ZeroAddressNotValid {
        type: 'ZeroAddressNotValid'
        params: {
        }
    }
    export type Error = AddressEmptyCode | AssetNotListed | CallerNotAToken | CallerNotPoolAdmin | CallerNotPoolConfigurator | CallerNotPositionManager | CallerNotUmbrella | EModeCategoryReserved | FailedCall | InvalidAddressesProvider | ZeroAddressNotValid
}

export class AavePool extends ContractBase {
    constructor(
        public address: TEth.Address = '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
        public client: Web3Client = di.resolve(EvmWeb3Client, { platform: 'eth' }),
        public explorer: IBlockchainExplorer = di.resolve(Evmscan, { platform: 'eth' }),
    ) {
        super(address, client, explorer)

        this.storage = new AavePoolStorageReader(this.address, this.client, this.explorer);
    }

    Types: TAavePoolTypes;

    $meta = {
        "class": "./0xc/eth/AavePool/AavePool.ts"
    }

    async $constructor (deployer: TSender, provider: TAddress, interestRateStrategy_: TAddress): Promise<TxWriter> {
        throw new Error('Not implemented. Typing purpose. Use the ContractDeployer class to deploy the contract');
    }

    // 0x0542975c
    async ADDRESSES_PROVIDER (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'ADDRESSES_PROVIDER'));
    }

    // 0x074b2e43
    async FLASHLOAN_PREMIUM_TOTAL (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'FLASHLOAN_PREMIUM_TOTAL'));
    }

    // 0x6a99c036
    async FLASHLOAN_PREMIUM_TO_PROTOCOL (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'FLASHLOAN_PREMIUM_TO_PROTOCOL'));
    }

    // 0xf8119d51
    async MAX_NUMBER_RESERVES (): Promise<number> {
        return this.$read(this.$getAbiItem('function', 'MAX_NUMBER_RESERVES'));
    }

    // 0x0148170e
    async POOL_REVISION (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'POOL_REVISION'));
    }

    // 0x1b8feb0e
    async RESERVE_INTEREST_RATE_STRATEGY (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'RESERVE_INTEREST_RATE_STRATEGY'));
    }

    // 0x71459c15
    async UMBRELLA (): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'UMBRELLA'));
    }

    // 0xb8caa7c5
    async approvePositionManager (sender: TSender, positionManager: TAddress, approve: boolean): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'approvePositionManager'), sender, positionManager, approve);
    }

    // 0xa415bcad
    async borrow (sender: TSender, asset: TAddress, amount: bigint, interestRateMode: bigint, referralCode: number, onBehalfOf: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'borrow'), sender, asset, amount, interestRateMode, referralCode, onBehalfOf);
    }

    // 0x6302e0e4
    async configureEModeCategory (sender: TSender, id: number, category: { ltv: number, liquidationThreshold: number, liquidationBonus: number, isolated: boolean, label: string }): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'configureEModeCategory'), sender, id, category);
    }

    // 0xff72158a
    async configureEModeCategoryBorrowableBitmap (sender: TSender, id: number, borrowableBitmap: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'configureEModeCategoryBorrowableBitmap'), sender, id, borrowableBitmap);
    }

    // 0x92380ecb
    async configureEModeCategoryCollateralBitmap (sender: TSender, id: number, collateralBitmap: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'configureEModeCategoryCollateralBitmap'), sender, id, collateralBitmap);
    }

    // 0xad57f436
    async configureEModeCategoryIsolated (sender: TSender, id: number, isolated: boolean): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'configureEModeCategoryIsolated'), sender, id, isolated);
    }

    // 0x10870f75
    async configureEModeCategoryLtvzeroBitmap (sender: TSender, id: number, ltvzeroBitmap: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'configureEModeCategoryLtvzeroBitmap'), sender, id, ltvzeroBitmap);
    }

    // 0xe8eda9df
    async deposit (sender: TSender, asset: TAddress, amount: bigint, onBehalfOf: TAddress, referralCode: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'deposit'), sender, asset, amount, onBehalfOf, referralCode);
    }

    // 0xa1d2f3c4
    async eliminateReserveDeficit (sender: TSender, asset: TAddress, amount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'eliminateReserveDeficit'), sender, asset, amount);
    }

    // 0x12772993
    async finalizeTransfer (sender: TSender, asset: TAddress, from: TAddress, to: TAddress, scaledAmount: bigint, scaledBalanceFromBefore: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'finalizeTransfer'), sender, asset, from, to, scaledAmount, scaledBalanceFromBefore);
    }

    // 0xab9c4b5d
    async flashLoan (sender: TSender, receiverAddress: TAddress, assets: TAddress[], amounts: bigint[], interestRateModes: bigint[], onBehalfOf: TAddress, params: TEth.Hex, referralCode: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'flashLoan'), sender, receiverAddress, assets, amounts, interestRateModes, onBehalfOf, params, referralCode);
    }

    // 0x42b0b77c
    async flashLoanSimple (sender: TSender, receiverAddress: TAddress, asset: TAddress, amount: bigint, params: TEth.Hex, referralCode: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'flashLoanSimple'), sender, receiverAddress, asset, amount, params, referralCode);
    }

    // 0x2be29fa7
    async getBorrowLogic (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'getBorrowLogic'));
    }

    // 0xc44b11f7
    async getConfiguration (asset: TAddress): Promise<{ data: bigint }> {
        return this.$read(this.$getAbiItem('function', 'getConfiguration'), asset);
    }

    // 0x903a2c71
    async getEModeCategoryBorrowableBitmap (id: number): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getEModeCategoryBorrowableBitmap'), id);
    }

    // 0xb0771dba
    async getEModeCategoryCollateralBitmap (id: number): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getEModeCategoryCollateralBitmap'), id);
    }

    // 0xb286f467
    async getEModeCategoryCollateralConfig (id: number): Promise<{ ltv: number, liquidationThreshold: number, liquidationBonus: number }> {
        return this.$read(this.$getAbiItem('function', 'getEModeCategoryCollateralConfig'), id);
    }

    // 0x6c6f6ae1
    async getEModeCategoryData (id: number): Promise<{ ltv: number, liquidationThreshold: number, liquidationBonus: number, priceSource: TAddress, label: string }> {
        return this.$read(this.$getAbiItem('function', 'getEModeCategoryData'), id);
    }

    // 0x2083e183
    async getEModeCategoryLabel (id: number): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'getEModeCategoryLabel'), id);
    }

    // 0xfd89dee5
    async getEModeCategoryLtvzeroBitmap (id: number): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getEModeCategoryLtvzeroBitmap'), id);
    }

    // 0x348fde0f
    async getFlashLoanLogic (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'getFlashLoanLogic'));
    }

    // 0x05f68acb
    async getIsEModeCategoryIsolated (id: number): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'getIsEModeCategoryIsolated'), id);
    }

    // 0x5c9a8b18
    async getLiquidationGracePeriod (asset: TAddress): Promise<number> {
        return this.$read(this.$getAbiItem('function', 'getLiquidationGracePeriod'), asset);
    }

    // 0x911a3413
    async getLiquidationLogic (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'getLiquidationLogic'));
    }

    // 0xd3350155
    async getPoolLogic (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'getPoolLogic'));
    }

    // 0xcff027d9
    async getReserveAToken (asset: TAddress): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'getReserveAToken'), asset);
    }

    // 0x52751797
    async getReserveAddressById (id: number): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'getReserveAddressById'), id);
    }

    // 0x35ea6a75
    async getReserveData (asset: TAddress): Promise<{ configuration: { data: bigint }, liquidityIndex: bigint, currentLiquidityRate: bigint, variableBorrowIndex: bigint, currentVariableBorrowRate: bigint, currentStableBorrowRate: bigint, lastUpdateTimestamp: number, id: number, aTokenAddress: TAddress, stableDebtTokenAddress: TAddress, variableDebtTokenAddress: TAddress, interestRateStrategyAddress: TAddress, accruedToTreasury: bigint, unbacked: bigint, isolationModeTotalDebt: bigint }> {
        return this.$read(this.$getAbiItem('function', 'getReserveData'), asset);
    }

    // 0xc952485d
    async getReserveDeficit (asset: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getReserveDeficit'), asset);
    }

    // 0xd15e0053
    async getReserveNormalizedIncome (asset: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getReserveNormalizedIncome'), asset);
    }

    // 0x386497fd
    async getReserveNormalizedVariableDebt (asset: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getReserveNormalizedVariableDebt'), asset);
    }

    // 0x365090a0
    async getReserveVariableDebtToken (asset: TAddress): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'getReserveVariableDebtToken'), asset);
    }

    // 0x72218d04
    async getReservesCount (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getReservesCount'));
    }

    // 0xd1946dbc
    async getReservesList (): Promise<TAddress[]> {
        return this.$read(this.$getAbiItem('function', 'getReservesList'));
    }

    // 0x870e7744
    async getSupplyLogic (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'getSupplyLogic'));
    }

    // 0xbf92857c
    async getUserAccountData (user: TAddress): Promise<{ totalCollateralBase: bigint, totalDebtBase: bigint, availableBorrowsBase: bigint, currentLiquidationThreshold: bigint, ltv: bigint, healthFactor: bigint }> {
        return this.$read(this.$getAbiItem('function', 'getUserAccountData'), user);
    }

    // 0x4417a583
    async getUserConfiguration (user: TAddress): Promise<{ data: bigint }> {
        return this.$read(this.$getAbiItem('function', 'getUserConfiguration'), user);
    }

    // 0xeddf1b79
    async getUserEMode (user: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getUserEMode'), user);
    }

    // 0x6fb07f96
    async getVirtualUnderlyingBalance (asset: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getVirtualUnderlyingBalance'), asset);
    }

    // 0x932f12c8
    async initReserve (sender: TSender, asset: TAddress, aTokenAddress: TAddress, variableDebtAddress: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'initReserve'), sender, asset, aTokenAddress, variableDebtAddress);
    }

    // 0xc4d66de8
    async initialize (sender: TSender, provider: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'initialize'), sender, provider);
    }

    // 0xf9c2bd87
    async isApprovedPositionManager (user: TAddress, positionManager: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'isApprovedPositionManager'), user, positionManager);
    }

    // 0x00a718a9
    async liquidationCall (sender: TSender, collateralAsset: TAddress, debtAsset: TAddress, borrower: TAddress, debtToCover: bigint, receiveAToken: boolean): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'liquidationCall'), sender, collateralAsset, debtAsset, borrower, debtToCover, receiveAToken);
    }

    // 0x9cd19996
    async mintToTreasury (sender: TSender, assets: TAddress[]): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'mintToTreasury'), sender, assets);
    }

    // 0xac9650d8
    async multicall (sender: TSender, data: TEth.Hex[]): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'multicall'), sender, data);
    }

    // 0xfea149a6
    async renouncePositionManagerRole (sender: TSender, user: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'renouncePositionManagerRole'), sender, user);
    }

    // 0x573ade81
    async repay (sender: TSender, asset: TAddress, amount: bigint, interestRateMode: bigint, onBehalfOf: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'repay'), sender, asset, amount, interestRateMode, onBehalfOf);
    }

    // 0x2dad97d4
    async repayWithATokens (sender: TSender, asset: TAddress, amount: bigint, interestRateMode: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'repayWithATokens'), sender, asset, amount, interestRateMode);
    }

    // 0xee3e210b
    async repayWithPermit (sender: TSender, asset: TAddress, amount: bigint, interestRateMode: bigint, onBehalfOf: TAddress, deadline: bigint, permitV: number, permitR: TEth.Hex, permitS: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'repayWithPermit'), sender, asset, amount, interestRateMode, onBehalfOf, deadline, permitV, permitR, permitS);
    }

    // 0xcea9d26f
    async rescueTokens (sender: TSender, token: TAddress, to: TAddress, amount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'rescueTokens'), sender, token, to, amount);
    }

    // 0xf51e435b
    async setConfiguration (sender: TSender, asset: TAddress, configuration: { data: bigint }): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setConfiguration'), sender, asset, configuration);
    }

    // 0xb1a99e26
    async setLiquidationGracePeriod (sender: TSender, asset: TAddress, until: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setLiquidationGracePeriod'), sender, asset, until);
    }

    // 0x28530a47
    async setUserEMode (sender: TSender, categoryId: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setUserEMode'), sender, categoryId);
    }

    // 0x4ba06814
    async setUserEModeOnBehalfOf (sender: TSender, categoryId: number, onBehalfOf: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setUserEModeOnBehalfOf'), sender, categoryId, onBehalfOf);
    }

    // 0x5a3b74b9
    async setUserUseReserveAsCollateral (sender: TSender, asset: TAddress, useAsCollateral: boolean): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setUserUseReserveAsCollateral'), sender, asset, useAsCollateral);
    }

    // 0x972b35fa
    async setUserUseReserveAsCollateralOnBehalfOf (sender: TSender, asset: TAddress, useAsCollateral: boolean, onBehalfOf: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setUserUseReserveAsCollateralOnBehalfOf'), sender, asset, useAsCollateral, onBehalfOf);
    }

    // 0x617ba037
    async supply (sender: TSender, asset: TAddress, amount: bigint, onBehalfOf: TAddress, referralCode: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'supply'), sender, asset, amount, onBehalfOf, referralCode);
    }

    // 0x02c205f0
    async supplyWithPermit (sender: TSender, asset: TAddress, amount: bigint, onBehalfOf: TAddress, referralCode: number, deadline: bigint, permitV: number, permitR: TEth.Hex, permitS: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'supplyWithPermit'), sender, asset, amount, onBehalfOf, referralCode, deadline, permitV, permitR, permitS);
    }

    // 0xab2b51f6
    async syncIndexesState (sender: TSender, asset: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'syncIndexesState'), sender, asset);
    }

    // 0x98c7da4e
    async syncRatesState (sender: TSender, asset: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'syncRatesState'), sender, asset);
    }

    // 0x9c1d5f00
    async updateFlashloanPremium (sender: TSender, flashLoanPremium: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'updateFlashloanPremium'), sender, flashLoanPremium);
    }

    // 0x69328dec
    async withdraw (sender: TSender, asset: TAddress, amount: bigint, to: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'withdraw'), sender, asset, amount, to);
    }

    $call () {
        return super.$call() as IAavePoolTxCaller;
    }
    $signed (): TOverrideReturns<IAavePoolTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IAavePoolTxData {
        return super.$data() as IAavePoolTxData;
    }
    $gas (): TOverrideReturns<IAavePoolTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TAavePoolTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TAavePoolTypes['Methods'][TMethod]['arguments']
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

    onBorrow (fn?: (event: TClientEventsStreamData<TEventArguments<'Borrow'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Borrow'>>> {
        return this.$onLog('Borrow', fn);
    }

    onDeficitCovered (fn?: (event: TClientEventsStreamData<TEventArguments<'DeficitCovered'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'DeficitCovered'>>> {
        return this.$onLog('DeficitCovered', fn);
    }

    onDeficitCreated (fn?: (event: TClientEventsStreamData<TEventArguments<'DeficitCreated'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'DeficitCreated'>>> {
        return this.$onLog('DeficitCreated', fn);
    }

    onFlashLoan (fn?: (event: TClientEventsStreamData<TEventArguments<'FlashLoan'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'FlashLoan'>>> {
        return this.$onLog('FlashLoan', fn);
    }

    onLiquidationCall (fn?: (event: TClientEventsStreamData<TEventArguments<'LiquidationCall'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'LiquidationCall'>>> {
        return this.$onLog('LiquidationCall', fn);
    }

    onMintedToTreasury (fn?: (event: TClientEventsStreamData<TEventArguments<'MintedToTreasury'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'MintedToTreasury'>>> {
        return this.$onLog('MintedToTreasury', fn);
    }

    onPositionManagerApproved (fn?: (event: TClientEventsStreamData<TEventArguments<'PositionManagerApproved'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'PositionManagerApproved'>>> {
        return this.$onLog('PositionManagerApproved', fn);
    }

    onPositionManagerRevoked (fn?: (event: TClientEventsStreamData<TEventArguments<'PositionManagerRevoked'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'PositionManagerRevoked'>>> {
        return this.$onLog('PositionManagerRevoked', fn);
    }

    onRepay (fn?: (event: TClientEventsStreamData<TEventArguments<'Repay'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Repay'>>> {
        return this.$onLog('Repay', fn);
    }

    onReserveDataUpdated (fn?: (event: TClientEventsStreamData<TEventArguments<'ReserveDataUpdated'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'ReserveDataUpdated'>>> {
        return this.$onLog('ReserveDataUpdated', fn);
    }

    onReserveUsedAsCollateralDisabled (fn?: (event: TClientEventsStreamData<TEventArguments<'ReserveUsedAsCollateralDisabled'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'ReserveUsedAsCollateralDisabled'>>> {
        return this.$onLog('ReserveUsedAsCollateralDisabled', fn);
    }

    onReserveUsedAsCollateralEnabled (fn?: (event: TClientEventsStreamData<TEventArguments<'ReserveUsedAsCollateralEnabled'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'ReserveUsedAsCollateralEnabled'>>> {
        return this.$onLog('ReserveUsedAsCollateralEnabled', fn);
    }

    onSupply (fn?: (event: TClientEventsStreamData<TEventArguments<'Supply'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Supply'>>> {
        return this.$onLog('Supply', fn);
    }

    onUserEModeSet (fn?: (event: TClientEventsStreamData<TEventArguments<'UserEModeSet'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'UserEModeSet'>>> {
        return this.$onLog('UserEModeSet', fn);
    }

    onWithdraw (fn?: (event: TClientEventsStreamData<TEventArguments<'Withdraw'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Withdraw'>>> {
        return this.$onLog('Withdraw', fn);
    }

    extractLogsBorrow (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Borrow'>>[] {
        let abi = this.$getAbiItem('event', 'Borrow');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Borrow'>>[];
    }

    extractLogsDeficitCovered (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'DeficitCovered'>>[] {
        let abi = this.$getAbiItem('event', 'DeficitCovered');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'DeficitCovered'>>[];
    }

    extractLogsDeficitCreated (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'DeficitCreated'>>[] {
        let abi = this.$getAbiItem('event', 'DeficitCreated');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'DeficitCreated'>>[];
    }

    extractLogsFlashLoan (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'FlashLoan'>>[] {
        let abi = this.$getAbiItem('event', 'FlashLoan');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'FlashLoan'>>[];
    }

    extractLogsLiquidationCall (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'LiquidationCall'>>[] {
        let abi = this.$getAbiItem('event', 'LiquidationCall');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'LiquidationCall'>>[];
    }

    extractLogsMintedToTreasury (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'MintedToTreasury'>>[] {
        let abi = this.$getAbiItem('event', 'MintedToTreasury');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'MintedToTreasury'>>[];
    }

    extractLogsPositionManagerApproved (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'PositionManagerApproved'>>[] {
        let abi = this.$getAbiItem('event', 'PositionManagerApproved');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'PositionManagerApproved'>>[];
    }

    extractLogsPositionManagerRevoked (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'PositionManagerRevoked'>>[] {
        let abi = this.$getAbiItem('event', 'PositionManagerRevoked');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'PositionManagerRevoked'>>[];
    }

    extractLogsRepay (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Repay'>>[] {
        let abi = this.$getAbiItem('event', 'Repay');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Repay'>>[];
    }

    extractLogsReserveDataUpdated (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ReserveDataUpdated'>>[] {
        let abi = this.$getAbiItem('event', 'ReserveDataUpdated');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ReserveDataUpdated'>>[];
    }

    extractLogsReserveUsedAsCollateralDisabled (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ReserveUsedAsCollateralDisabled'>>[] {
        let abi = this.$getAbiItem('event', 'ReserveUsedAsCollateralDisabled');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ReserveUsedAsCollateralDisabled'>>[];
    }

    extractLogsReserveUsedAsCollateralEnabled (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ReserveUsedAsCollateralEnabled'>>[] {
        let abi = this.$getAbiItem('event', 'ReserveUsedAsCollateralEnabled');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ReserveUsedAsCollateralEnabled'>>[];
    }

    extractLogsSupply (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Supply'>>[] {
        let abi = this.$getAbiItem('event', 'Supply');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Supply'>>[];
    }

    extractLogsUserEModeSet (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'UserEModeSet'>>[] {
        let abi = this.$getAbiItem('event', 'UserEModeSet');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'UserEModeSet'>>[];
    }

    extractLogsWithdraw (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Withdraw'>>[] {
        let abi = this.$getAbiItem('event', 'Withdraw');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Withdraw'>>[];
    }

    async getPastLogsBorrow (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { reserve?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'Borrow'>>[]> {
        return await this.$getPastLogsParsed('Borrow', options) as any;
    }

    async getPastLogsDeficitCovered (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { reserve?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'DeficitCovered'>>[]> {
        return await this.$getPastLogsParsed('DeficitCovered', options) as any;
    }

    async getPastLogsDeficitCreated (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { user?: TAddress,debtAsset?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'DeficitCreated'>>[]> {
        return await this.$getPastLogsParsed('DeficitCreated', options) as any;
    }

    async getPastLogsFlashLoan (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { target?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'FlashLoan'>>[]> {
        return await this.$getPastLogsParsed('FlashLoan', options) as any;
    }

    async getPastLogsLiquidationCall (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { collateralAsset?: TAddress,debtAsset?: TAddress,user?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'LiquidationCall'>>[]> {
        return await this.$getPastLogsParsed('LiquidationCall', options) as any;
    }

    async getPastLogsMintedToTreasury (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { reserve?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'MintedToTreasury'>>[]> {
        return await this.$getPastLogsParsed('MintedToTreasury', options) as any;
    }

    async getPastLogsPositionManagerApproved (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { user?: TAddress,positionManager?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'PositionManagerApproved'>>[]> {
        return await this.$getPastLogsParsed('PositionManagerApproved', options) as any;
    }

    async getPastLogsPositionManagerRevoked (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { user?: TAddress,positionManager?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'PositionManagerRevoked'>>[]> {
        return await this.$getPastLogsParsed('PositionManagerRevoked', options) as any;
    }

    async getPastLogsRepay (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { reserve?: TAddress,user?: TAddress,repayer?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'Repay'>>[]> {
        return await this.$getPastLogsParsed('Repay', options) as any;
    }

    async getPastLogsReserveDataUpdated (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { reserve?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'ReserveDataUpdated'>>[]> {
        return await this.$getPastLogsParsed('ReserveDataUpdated', options) as any;
    }

    async getPastLogsReserveUsedAsCollateralDisabled (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { reserve?: TAddress,user?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'ReserveUsedAsCollateralDisabled'>>[]> {
        return await this.$getPastLogsParsed('ReserveUsedAsCollateralDisabled', options) as any;
    }

    async getPastLogsReserveUsedAsCollateralEnabled (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { reserve?: TAddress,user?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'ReserveUsedAsCollateralEnabled'>>[]> {
        return await this.$getPastLogsParsed('ReserveUsedAsCollateralEnabled', options) as any;
    }

    async getPastLogsSupply (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { reserve?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'Supply'>>[]> {
        return await this.$getPastLogsParsed('Supply', options) as any;
    }

    async getPastLogsUserEModeSet (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { user?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'UserEModeSet'>>[]> {
        return await this.$getPastLogsParsed('UserEModeSet', options) as any;
    }

    async getPastLogsWithdraw (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { reserve?: TAddress,user?: TAddress,to?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'Withdraw'>>[]> {
        return await this.$getPastLogsParsed('Withdraw', options) as any;
    }

    abi: TAbiItem[] = [{"inputs":[{"internalType":"contract IPoolAddressesProvider","name":"provider","type":"address"},{"internalType":"contract IReserveInterestRateStrategy","name":"interestRateStrategy_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"target","type":"address"}],"name":"AddressEmptyCode","type":"error"},{"inputs":[],"name":"AssetNotListed","type":"error"},{"inputs":[],"name":"CallerNotAToken","type":"error"},{"inputs":[],"name":"CallerNotPoolAdmin","type":"error"},{"inputs":[],"name":"CallerNotPoolConfigurator","type":"error"},{"inputs":[],"name":"CallerNotPositionManager","type":"error"},{"inputs":[],"name":"CallerNotUmbrella","type":"error"},{"inputs":[],"name":"EModeCategoryReserved","type":"error"},{"inputs":[],"name":"FailedCall","type":"error"},{"inputs":[],"name":"InvalidAddressesProvider","type":"error"},{"inputs":[],"name":"ZeroAddressNotValid","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"reserve","type":"address"},{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"onBehalfOf","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"enum DataTypes.InterestRateMode","name":"interestRateMode","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"borrowRate","type":"uint256"},{"indexed":true,"internalType":"uint16","name":"referralCode","type":"uint16"}],"name":"Borrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"reserve","type":"address"},{"indexed":false,"internalType":"address","name":"caller","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountCovered","type":"uint256"}],"name":"DeficitCovered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"debtAsset","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountCreated","type":"uint256"}],"name":"DeficitCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"target","type":"address"},{"indexed":false,"internalType":"address","name":"initiator","type":"address"},{"indexed":true,"internalType":"address","name":"asset","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"enum DataTypes.InterestRateMode","name":"interestRateMode","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"premium","type":"uint256"},{"indexed":true,"internalType":"uint16","name":"referralCode","type":"uint16"}],"name":"FlashLoan","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"collateralAsset","type":"address"},{"indexed":true,"internalType":"address","name":"debtAsset","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"debtToCover","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"liquidatedCollateralAmount","type":"uint256"},{"indexed":false,"internalType":"address","name":"liquidator","type":"address"},{"indexed":false,"internalType":"bool","name":"receiveAToken","type":"bool"}],"name":"LiquidationCall","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"reserve","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountMinted","type":"uint256"}],"name":"MintedToTreasury","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"positionManager","type":"address"}],"name":"PositionManagerApproved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"positionManager","type":"address"}],"name":"PositionManagerRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"reserve","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"repayer","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"bool","name":"useATokens","type":"bool"}],"name":"Repay","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"reserve","type":"address"},{"indexed":false,"internalType":"uint256","name":"liquidityRate","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"stableBorrowRate","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"variableBorrowRate","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"liquidityIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"variableBorrowIndex","type":"uint256"}],"name":"ReserveDataUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"reserve","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"}],"name":"ReserveUsedAsCollateralDisabled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"reserve","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"}],"name":"ReserveUsedAsCollateralEnabled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"reserve","type":"address"},{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"onBehalfOf","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":true,"internalType":"uint16","name":"referralCode","type":"uint16"}],"name":"Supply","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint8","name":"categoryId","type":"uint8"}],"name":"UserEModeSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"reserve","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"ADDRESSES_PROVIDER","outputs":[{"internalType":"contract IPoolAddressesProvider","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"FLASHLOAN_PREMIUM_TOTAL","outputs":[{"internalType":"uint128","name":"","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"FLASHLOAN_PREMIUM_TO_PROTOCOL","outputs":[{"internalType":"uint128","name":"","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_NUMBER_RESERVES","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"POOL_REVISION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"RESERVE_INTEREST_RATE_STRATEGY","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"UMBRELLA","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"positionManager","type":"address"},{"internalType":"bool","name":"approve","type":"bool"}],"name":"approvePositionManager","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"interestRateMode","type":"uint256"},{"internalType":"uint16","name":"referralCode","type":"uint16"},{"internalType":"address","name":"onBehalfOf","type":"address"}],"name":"borrow","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint8","name":"id","type":"uint8"},{"components":[{"internalType":"uint16","name":"ltv","type":"uint16"},{"internalType":"uint16","name":"liquidationThreshold","type":"uint16"},{"internalType":"uint16","name":"liquidationBonus","type":"uint16"},{"internalType":"bool","name":"isolated","type":"bool"},{"internalType":"string","name":"label","type":"string"}],"internalType":"struct DataTypes.EModeCategoryBaseConfiguration","name":"category","type":"tuple"}],"name":"configureEModeCategory","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint8","name":"id","type":"uint8"},{"internalType":"uint128","name":"borrowableBitmap","type":"uint128"}],"name":"configureEModeCategoryBorrowableBitmap","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint8","name":"id","type":"uint8"},{"internalType":"uint128","name":"collateralBitmap","type":"uint128"}],"name":"configureEModeCategoryCollateralBitmap","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint8","name":"id","type":"uint8"},{"internalType":"bool","name":"isolated","type":"bool"}],"name":"configureEModeCategoryIsolated","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint8","name":"id","type":"uint8"},{"internalType":"uint128","name":"ltvzeroBitmap","type":"uint128"}],"name":"configureEModeCategoryLtvzeroBitmap","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"onBehalfOf","type":"address"},{"internalType":"uint16","name":"referralCode","type":"uint16"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"eliminateReserveDeficit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"scaledAmount","type":"uint256"},{"internalType":"uint256","name":"scaledBalanceFromBefore","type":"uint256"}],"name":"finalizeTransfer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"receiverAddress","type":"address"},{"internalType":"address[]","name":"assets","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"uint256[]","name":"interestRateModes","type":"uint256[]"},{"internalType":"address","name":"onBehalfOf","type":"address"},{"internalType":"bytes","name":"params","type":"bytes"},{"internalType":"uint16","name":"referralCode","type":"uint16"}],"name":"flashLoan","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"receiverAddress","type":"address"},{"internalType":"address","name":"asset","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"params","type":"bytes"},{"internalType":"uint16","name":"referralCode","type":"uint16"}],"name":"flashLoanSimple","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getBorrowLogic","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"}],"name":"getConfiguration","outputs":[{"components":[{"internalType":"uint256","name":"data","type":"uint256"}],"internalType":"struct DataTypes.ReserveConfigurationMap","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"id","type":"uint8"}],"name":"getEModeCategoryBorrowableBitmap","outputs":[{"internalType":"uint128","name":"","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"id","type":"uint8"}],"name":"getEModeCategoryCollateralBitmap","outputs":[{"internalType":"uint128","name":"","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"id","type":"uint8"}],"name":"getEModeCategoryCollateralConfig","outputs":[{"components":[{"internalType":"uint16","name":"ltv","type":"uint16"},{"internalType":"uint16","name":"liquidationThreshold","type":"uint16"},{"internalType":"uint16","name":"liquidationBonus","type":"uint16"}],"internalType":"struct DataTypes.CollateralConfig","name":"res","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"id","type":"uint8"}],"name":"getEModeCategoryData","outputs":[{"components":[{"internalType":"uint16","name":"ltv","type":"uint16"},{"internalType":"uint16","name":"liquidationThreshold","type":"uint16"},{"internalType":"uint16","name":"liquidationBonus","type":"uint16"},{"internalType":"address","name":"priceSource","type":"address"},{"internalType":"string","name":"label","type":"string"}],"internalType":"struct DataTypes.EModeCategoryLegacy","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"id","type":"uint8"}],"name":"getEModeCategoryLabel","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"id","type":"uint8"}],"name":"getEModeCategoryLtvzeroBitmap","outputs":[{"internalType":"uint128","name":"","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getFlashLoanLogic","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint8","name":"id","type":"uint8"}],"name":"getIsEModeCategoryIsolated","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"}],"name":"getLiquidationGracePeriod","outputs":[{"internalType":"uint40","name":"","type":"uint40"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLiquidationLogic","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"getPoolLogic","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"}],"name":"getReserveAToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint16","name":"id","type":"uint16"}],"name":"getReserveAddressById","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"}],"name":"getReserveData","outputs":[{"components":[{"components":[{"internalType":"uint256","name":"data","type":"uint256"}],"internalType":"struct DataTypes.ReserveConfigurationMap","name":"configuration","type":"tuple"},{"internalType":"uint128","name":"liquidityIndex","type":"uint128"},{"internalType":"uint128","name":"currentLiquidityRate","type":"uint128"},{"internalType":"uint128","name":"variableBorrowIndex","type":"uint128"},{"internalType":"uint128","name":"currentVariableBorrowRate","type":"uint128"},{"internalType":"uint128","name":"currentStableBorrowRate","type":"uint128"},{"internalType":"uint40","name":"lastUpdateTimestamp","type":"uint40"},{"internalType":"uint16","name":"id","type":"uint16"},{"internalType":"address","name":"aTokenAddress","type":"address"},{"internalType":"address","name":"stableDebtTokenAddress","type":"address"},{"internalType":"address","name":"variableDebtTokenAddress","type":"address"},{"internalType":"address","name":"interestRateStrategyAddress","type":"address"},{"internalType":"uint128","name":"accruedToTreasury","type":"uint128"},{"internalType":"uint128","name":"unbacked","type":"uint128"},{"internalType":"uint128","name":"isolationModeTotalDebt","type":"uint128"}],"internalType":"struct DataTypes.ReserveDataLegacy","name":"res","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"}],"name":"getReserveDeficit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"}],"name":"getReserveNormalizedIncome","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"}],"name":"getReserveNormalizedVariableDebt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"}],"name":"getReserveVariableDebtToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getReservesCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getReservesList","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSupplyLogic","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserAccountData","outputs":[{"internalType":"uint256","name":"totalCollateralBase","type":"uint256"},{"internalType":"uint256","name":"totalDebtBase","type":"uint256"},{"internalType":"uint256","name":"availableBorrowsBase","type":"uint256"},{"internalType":"uint256","name":"currentLiquidationThreshold","type":"uint256"},{"internalType":"uint256","name":"ltv","type":"uint256"},{"internalType":"uint256","name":"healthFactor","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserConfiguration","outputs":[{"components":[{"internalType":"uint256","name":"data","type":"uint256"}],"internalType":"struct DataTypes.UserConfigurationMap","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserEMode","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"}],"name":"getVirtualUnderlyingBalance","outputs":[{"internalType":"uint128","name":"","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"},{"internalType":"address","name":"aTokenAddress","type":"address"},{"internalType":"address","name":"variableDebtAddress","type":"address"}],"name":"initReserve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IPoolAddressesProvider","name":"provider","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"address","name":"positionManager","type":"address"}],"name":"isApprovedPositionManager","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"collateralAsset","type":"address"},{"internalType":"address","name":"debtAsset","type":"address"},{"internalType":"address","name":"borrower","type":"address"},{"internalType":"uint256","name":"debtToCover","type":"uint256"},{"internalType":"bool","name":"receiveAToken","type":"bool"}],"name":"liquidationCall","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"assets","type":"address[]"}],"name":"mintToTreasury","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes[]","name":"data","type":"bytes[]"}],"name":"multicall","outputs":[{"internalType":"bytes[]","name":"results","type":"bytes[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"renouncePositionManagerRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"interestRateMode","type":"uint256"},{"internalType":"address","name":"onBehalfOf","type":"address"}],"name":"repay","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"interestRateMode","type":"uint256"}],"name":"repayWithATokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"interestRateMode","type":"uint256"},{"internalType":"address","name":"onBehalfOf","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"permitV","type":"uint8"},{"internalType":"bytes32","name":"permitR","type":"bytes32"},{"internalType":"bytes32","name":"permitS","type":"bytes32"}],"name":"repayWithPermit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"rescueTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"},{"components":[{"internalType":"uint256","name":"data","type":"uint256"}],"internalType":"struct DataTypes.ReserveConfigurationMap","name":"configuration","type":"tuple"}],"name":"setConfiguration","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"},{"internalType":"uint40","name":"until","type":"uint40"}],"name":"setLiquidationGracePeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint8","name":"categoryId","type":"uint8"}],"name":"setUserEMode","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint8","name":"categoryId","type":"uint8"},{"internalType":"address","name":"onBehalfOf","type":"address"}],"name":"setUserEModeOnBehalfOf","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"},{"internalType":"bool","name":"useAsCollateral","type":"bool"}],"name":"setUserUseReserveAsCollateral","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"},{"internalType":"bool","name":"useAsCollateral","type":"bool"},{"internalType":"address","name":"onBehalfOf","type":"address"}],"name":"setUserUseReserveAsCollateralOnBehalfOf","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"onBehalfOf","type":"address"},{"internalType":"uint16","name":"referralCode","type":"uint16"}],"name":"supply","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"onBehalfOf","type":"address"},{"internalType":"uint16","name":"referralCode","type":"uint16"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"permitV","type":"uint8"},{"internalType":"bytes32","name":"permitR","type":"bytes32"},{"internalType":"bytes32","name":"permitS","type":"bytes32"}],"name":"supplyWithPermit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"}],"name":"syncIndexesState","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"}],"name":"syncRatesState","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint128","name":"flashLoanPremium","type":"uint128"}],"name":"updateFlashloanPremium","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"to","type":"address"}],"name":"withdraw","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"}]

    declare storage: AavePoolStorageReader
}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TAavePoolTypes = {
    Events: {
        Borrow: {
            outputParams: { reserve: TAddress, user: TAddress, onBehalfOf: TAddress, amount: bigint, interestRateMode: number, borrowRate: bigint, referralCode: number },
            outputArgs:   [ reserve: TAddress, user: TAddress, onBehalfOf: TAddress, amount: bigint, interestRateMode: number, borrowRate: bigint, referralCode: number ],
        }
        DeficitCovered: {
            outputParams: { reserve: TAddress, caller: TAddress, amountCovered: bigint },
            outputArgs:   [ reserve: TAddress, caller: TAddress, amountCovered: bigint ],
        }
        DeficitCreated: {
            outputParams: { user: TAddress, debtAsset: TAddress, amountCreated: bigint },
            outputArgs:   [ user: TAddress, debtAsset: TAddress, amountCreated: bigint ],
        }
        FlashLoan: {
            outputParams: { target: TAddress, initiator: TAddress, asset: TAddress, amount: bigint, interestRateMode: number, premium: bigint, referralCode: number },
            outputArgs:   [ target: TAddress, initiator: TAddress, asset: TAddress, amount: bigint, interestRateMode: number, premium: bigint, referralCode: number ],
        }
        LiquidationCall: {
            outputParams: { collateralAsset: TAddress, debtAsset: TAddress, user: TAddress, debtToCover: bigint, liquidatedCollateralAmount: bigint, liquidator: TAddress, receiveAToken: boolean },
            outputArgs:   [ collateralAsset: TAddress, debtAsset: TAddress, user: TAddress, debtToCover: bigint, liquidatedCollateralAmount: bigint, liquidator: TAddress, receiveAToken: boolean ],
        }
        MintedToTreasury: {
            outputParams: { reserve: TAddress, amountMinted: bigint },
            outputArgs:   [ reserve: TAddress, amountMinted: bigint ],
        }
        PositionManagerApproved: {
            outputParams: { user: TAddress, positionManager: TAddress },
            outputArgs:   [ user: TAddress, positionManager: TAddress ],
        }
        PositionManagerRevoked: {
            outputParams: { user: TAddress, positionManager: TAddress },
            outputArgs:   [ user: TAddress, positionManager: TAddress ],
        }
        Repay: {
            outputParams: { reserve: TAddress, user: TAddress, repayer: TAddress, amount: bigint, useATokens: boolean },
            outputArgs:   [ reserve: TAddress, user: TAddress, repayer: TAddress, amount: bigint, useATokens: boolean ],
        }
        ReserveDataUpdated: {
            outputParams: { reserve: TAddress, liquidityRate: bigint, stableBorrowRate: bigint, variableBorrowRate: bigint, liquidityIndex: bigint, variableBorrowIndex: bigint },
            outputArgs:   [ reserve: TAddress, liquidityRate: bigint, stableBorrowRate: bigint, variableBorrowRate: bigint, liquidityIndex: bigint, variableBorrowIndex: bigint ],
        }
        ReserveUsedAsCollateralDisabled: {
            outputParams: { reserve: TAddress, user: TAddress },
            outputArgs:   [ reserve: TAddress, user: TAddress ],
        }
        ReserveUsedAsCollateralEnabled: {
            outputParams: { reserve: TAddress, user: TAddress },
            outputArgs:   [ reserve: TAddress, user: TAddress ],
        }
        Supply: {
            outputParams: { reserve: TAddress, user: TAddress, onBehalfOf: TAddress, amount: bigint, referralCode: number },
            outputArgs:   [ reserve: TAddress, user: TAddress, onBehalfOf: TAddress, amount: bigint, referralCode: number ],
        }
        UserEModeSet: {
            outputParams: { user: TAddress, categoryId: number },
            outputArgs:   [ user: TAddress, categoryId: number ],
        }
        Withdraw: {
            outputParams: { reserve: TAddress, user: TAddress, to: TAddress, amount: bigint },
            outputArgs:   [ reserve: TAddress, user: TAddress, to: TAddress, amount: bigint ],
        }
    },
    Methods: {
        ADDRESSES_PROVIDER: {
          method: "ADDRESSES_PROVIDER"
          arguments: [  ]
        }
        FLASHLOAN_PREMIUM_TOTAL: {
          method: "FLASHLOAN_PREMIUM_TOTAL"
          arguments: [  ]
        }
        FLASHLOAN_PREMIUM_TO_PROTOCOL: {
          method: "FLASHLOAN_PREMIUM_TO_PROTOCOL"
          arguments: [  ]
        }
        MAX_NUMBER_RESERVES: {
          method: "MAX_NUMBER_RESERVES"
          arguments: [  ]
        }
        POOL_REVISION: {
          method: "POOL_REVISION"
          arguments: [  ]
        }
        RESERVE_INTEREST_RATE_STRATEGY: {
          method: "RESERVE_INTEREST_RATE_STRATEGY"
          arguments: [  ]
        }
        UMBRELLA: {
          method: "UMBRELLA"
          arguments: [  ]
        }
        approvePositionManager: {
          method: "approvePositionManager"
          arguments: [ positionManager: TAddress, approve: boolean ]
        }
        borrow: {
          method: "borrow"
          arguments: [ asset: TAddress, amount: bigint, interestRateMode: bigint, referralCode: number, onBehalfOf: TAddress ]
        }
        configureEModeCategory: {
          method: "configureEModeCategory"
          arguments: [ id: number, category: { ltv: number, liquidationThreshold: number, liquidationBonus: number, isolated: boolean, label: string } ]
        }
        configureEModeCategoryBorrowableBitmap: {
          method: "configureEModeCategoryBorrowableBitmap"
          arguments: [ id: number, borrowableBitmap: bigint ]
        }
        configureEModeCategoryCollateralBitmap: {
          method: "configureEModeCategoryCollateralBitmap"
          arguments: [ id: number, collateralBitmap: bigint ]
        }
        configureEModeCategoryIsolated: {
          method: "configureEModeCategoryIsolated"
          arguments: [ id: number, isolated: boolean ]
        }
        configureEModeCategoryLtvzeroBitmap: {
          method: "configureEModeCategoryLtvzeroBitmap"
          arguments: [ id: number, ltvzeroBitmap: bigint ]
        }
        deposit: {
          method: "deposit"
          arguments: [ asset: TAddress, amount: bigint, onBehalfOf: TAddress, referralCode: number ]
        }
        eliminateReserveDeficit: {
          method: "eliminateReserveDeficit"
          arguments: [ asset: TAddress, amount: bigint ]
        }
        finalizeTransfer: {
          method: "finalizeTransfer"
          arguments: [ asset: TAddress, from: TAddress, to: TAddress, scaledAmount: bigint, scaledBalanceFromBefore: bigint ]
        }
        flashLoan: {
          method: "flashLoan"
          arguments: [ receiverAddress: TAddress, assets: TAddress[], amounts: bigint[], interestRateModes: bigint[], onBehalfOf: TAddress, params: TEth.Hex, referralCode: number ]
        }
        flashLoanSimple: {
          method: "flashLoanSimple"
          arguments: [ receiverAddress: TAddress, asset: TAddress, amount: bigint, params: TEth.Hex, referralCode: number ]
        }
        getBorrowLogic: {
          method: "getBorrowLogic"
          arguments: [  ]
        }
        getConfiguration: {
          method: "getConfiguration"
          arguments: [ asset: TAddress ]
        }
        getEModeCategoryBorrowableBitmap: {
          method: "getEModeCategoryBorrowableBitmap"
          arguments: [ id: number ]
        }
        getEModeCategoryCollateralBitmap: {
          method: "getEModeCategoryCollateralBitmap"
          arguments: [ id: number ]
        }
        getEModeCategoryCollateralConfig: {
          method: "getEModeCategoryCollateralConfig"
          arguments: [ id: number ]
        }
        getEModeCategoryData: {
          method: "getEModeCategoryData"
          arguments: [ id: number ]
        }
        getEModeCategoryLabel: {
          method: "getEModeCategoryLabel"
          arguments: [ id: number ]
        }
        getEModeCategoryLtvzeroBitmap: {
          method: "getEModeCategoryLtvzeroBitmap"
          arguments: [ id: number ]
        }
        getFlashLoanLogic: {
          method: "getFlashLoanLogic"
          arguments: [  ]
        }
        getIsEModeCategoryIsolated: {
          method: "getIsEModeCategoryIsolated"
          arguments: [ id: number ]
        }
        getLiquidationGracePeriod: {
          method: "getLiquidationGracePeriod"
          arguments: [ asset: TAddress ]
        }
        getLiquidationLogic: {
          method: "getLiquidationLogic"
          arguments: [  ]
        }
        getPoolLogic: {
          method: "getPoolLogic"
          arguments: [  ]
        }
        getReserveAToken: {
          method: "getReserveAToken"
          arguments: [ asset: TAddress ]
        }
        getReserveAddressById: {
          method: "getReserveAddressById"
          arguments: [ id: number ]
        }
        getReserveData: {
          method: "getReserveData"
          arguments: [ asset: TAddress ]
        }
        getReserveDeficit: {
          method: "getReserveDeficit"
          arguments: [ asset: TAddress ]
        }
        getReserveNormalizedIncome: {
          method: "getReserveNormalizedIncome"
          arguments: [ asset: TAddress ]
        }
        getReserveNormalizedVariableDebt: {
          method: "getReserveNormalizedVariableDebt"
          arguments: [ asset: TAddress ]
        }
        getReserveVariableDebtToken: {
          method: "getReserveVariableDebtToken"
          arguments: [ asset: TAddress ]
        }
        getReservesCount: {
          method: "getReservesCount"
          arguments: [  ]
        }
        getReservesList: {
          method: "getReservesList"
          arguments: [  ]
        }
        getSupplyLogic: {
          method: "getSupplyLogic"
          arguments: [  ]
        }
        getUserAccountData: {
          method: "getUserAccountData"
          arguments: [ user: TAddress ]
        }
        getUserConfiguration: {
          method: "getUserConfiguration"
          arguments: [ user: TAddress ]
        }
        getUserEMode: {
          method: "getUserEMode"
          arguments: [ user: TAddress ]
        }
        getVirtualUnderlyingBalance: {
          method: "getVirtualUnderlyingBalance"
          arguments: [ asset: TAddress ]
        }
        initReserve: {
          method: "initReserve"
          arguments: [ asset: TAddress, aTokenAddress: TAddress, variableDebtAddress: TAddress ]
        }
        initialize: {
          method: "initialize"
          arguments: [ provider: TAddress ]
        }
        isApprovedPositionManager: {
          method: "isApprovedPositionManager"
          arguments: [ user: TAddress, positionManager: TAddress ]
        }
        liquidationCall: {
          method: "liquidationCall"
          arguments: [ collateralAsset: TAddress, debtAsset: TAddress, borrower: TAddress, debtToCover: bigint, receiveAToken: boolean ]
        }
        mintToTreasury: {
          method: "mintToTreasury"
          arguments: [ assets: TAddress[] ]
        }
        multicall: {
          method: "multicall"
          arguments: [ data: TEth.Hex[] ]
        }
        renouncePositionManagerRole: {
          method: "renouncePositionManagerRole"
          arguments: [ user: TAddress ]
        }
        repay: {
          method: "repay"
          arguments: [ asset: TAddress, amount: bigint, interestRateMode: bigint, onBehalfOf: TAddress ]
        }
        repayWithATokens: {
          method: "repayWithATokens"
          arguments: [ asset: TAddress, amount: bigint, interestRateMode: bigint ]
        }
        repayWithPermit: {
          method: "repayWithPermit"
          arguments: [ asset: TAddress, amount: bigint, interestRateMode: bigint, onBehalfOf: TAddress, deadline: bigint, permitV: number, permitR: TEth.Hex, permitS: TEth.Hex ]
        }
        rescueTokens: {
          method: "rescueTokens"
          arguments: [ token: TAddress, to: TAddress, amount: bigint ]
        }
        setConfiguration: {
          method: "setConfiguration"
          arguments: [ asset: TAddress, configuration: { data: bigint } ]
        }
        setLiquidationGracePeriod: {
          method: "setLiquidationGracePeriod"
          arguments: [ asset: TAddress, until: number ]
        }
        setUserEMode: {
          method: "setUserEMode"
          arguments: [ categoryId: number ]
        }
        setUserEModeOnBehalfOf: {
          method: "setUserEModeOnBehalfOf"
          arguments: [ categoryId: number, onBehalfOf: TAddress ]
        }
        setUserUseReserveAsCollateral: {
          method: "setUserUseReserveAsCollateral"
          arguments: [ asset: TAddress, useAsCollateral: boolean ]
        }
        setUserUseReserveAsCollateralOnBehalfOf: {
          method: "setUserUseReserveAsCollateralOnBehalfOf"
          arguments: [ asset: TAddress, useAsCollateral: boolean, onBehalfOf: TAddress ]
        }
        supply: {
          method: "supply"
          arguments: [ asset: TAddress, amount: bigint, onBehalfOf: TAddress, referralCode: number ]
        }
        supplyWithPermit: {
          method: "supplyWithPermit"
          arguments: [ asset: TAddress, amount: bigint, onBehalfOf: TAddress, referralCode: number, deadline: bigint, permitV: number, permitR: TEth.Hex, permitS: TEth.Hex ]
        }
        syncIndexesState: {
          method: "syncIndexesState"
          arguments: [ asset: TAddress ]
        }
        syncRatesState: {
          method: "syncRatesState"
          arguments: [ asset: TAddress ]
        }
        updateFlashloanPremium: {
          method: "updateFlashloanPremium"
          arguments: [ flashLoanPremium: bigint ]
        }
        withdraw: {
          method: "withdraw"
          arguments: [ asset: TAddress, amount: bigint, to: TAddress ]
        }
    }
}



class AavePoolStorageReader extends ContractStorageReaderBase {
    constructor(
        public address: TAddress,
        public client: Web3Client,
        public explorer: IBlockchainExplorer,
    ) {
        super(address, client, explorer);

        this.$createHandler(this.$slots);
    }

    async lastInitializedRevision(): Promise<bigint> {
        return this.$storage.get(['lastInitializedRevision', ]);
    }

    async initializing(): Promise<boolean> {
        return this.$storage.get(['initializing', ]);
    }

    async ______gap(): Promise<bigint[]> {
        return this.$storage.get(['______gap', ]);
    }

    async _reserves(key: TAddress): Promise<{ configuration: { data: bigint }, liquidityIndex: bigint, currentLiquidityRate: bigint, variableBorrowIndex: bigint, currentVariableBorrowRate: bigint, deficit: bigint, lastUpdateTimestamp: number, id: number, liquidationGracePeriodUntil: number, aTokenAddress: TAddress, __deprecatedStableDebtTokenAddress: TAddress, variableDebtTokenAddress: TAddress, __deprecatedInterestRateStrategyAddress: TAddress, accruedToTreasury: bigint, virtualUnderlyingBalance: bigint, __deprecatedIsolationModeTotalDebt: bigint, __deprecatedVirtualUnderlyingBalance: bigint }> {
        return this.$storage.get(['_reserves', key]);
    }

    async _usersConfig(key: TAddress): Promise<{ data: bigint }> {
        return this.$storage.get(['_usersConfig', key]);
    }

    async _reservesList(key: bigint): Promise<TAddress> {
        return this.$storage.get(['_reservesList', key]);
    }

    async _eModeCategories(key: number): Promise<{ ltv: number, liquidationThreshold: number, liquidationBonus: number, collateralBitmap: bigint, isolated: boolean, label: string, borrowableBitmap: bigint, ltvzeroBitmap: bigint }> {
        return this.$storage.get(['_eModeCategories', key]);
    }

    async _usersEModeCategory(key: TAddress): Promise<number> {
        return this.$storage.get(['_usersEModeCategory', key]);
    }

    async __DEPRECATED_bridgeProtocolFee(): Promise<bigint> {
        return this.$storage.get(['__DEPRECATED_bridgeProtocolFee', ]);
    }

    async _flashLoanPremium(): Promise<bigint> {
        return this.$storage.get(['_flashLoanPremium', ]);
    }

    async __DEPRECATED_flashLoanPremiumToProtocol(): Promise<bigint> {
        return this.$storage.get(['__DEPRECATED_flashLoanPremiumToProtocol', ]);
    }

    async __DEPRECATED_maxStableRateBorrowSizePercent(): Promise<number> {
        return this.$storage.get(['__DEPRECATED_maxStableRateBorrowSizePercent', ]);
    }

    async _reservesCount(): Promise<number> {
        return this.$storage.get(['_reservesCount', ]);
    }

    async _positionManager(key: TAddress): Promise<Record<string | number, boolean>> {
        return this.$storage.get(['_positionManager', key]);
    }

    $slots = [
    {
        "slot": 0,
        "position": 0,
        "name": "lastInitializedRevision",
        "size": 256,
        "type": "uint256"
    },
    {
        "slot": 1,
        "position": 0,
        "name": "initializing",
        "size": 8,
        "type": "bool"
    },
    {
        "slot": 2,
        "position": 0,
        "name": "______gap",
        "size": 12800,
        "type": "uint256[50]"
    },
    {
        "slot": 52,
        "position": 0,
        "name": "_reserves",
        "size": null,
        "type": "mapping(address => ((uint256 data) configuration, uint128 liquidityIndex, uint128 currentLiquidityRate, uint128 variableBorrowIndex, uint128 currentVariableBorrowRate, uint128 deficit, uint40 lastUpdateTimestamp, uint16 id, uint40 liquidationGracePeriodUntil, address aTokenAddress, address __deprecatedStableDebtTokenAddress, address variableDebtTokenAddress, address __deprecatedInterestRateStrategyAddress, uint128 accruedToTreasury, uint128 virtualUnderlyingBalance, uint128 __deprecatedIsolationModeTotalDebt, uint128 __deprecatedVirtualUnderlyingBalance))"
    },
    {
        "slot": 53,
        "position": 0,
        "name": "_usersConfig",
        "size": null,
        "type": "mapping(address => (uint256 data))"
    },
    {
        "slot": 54,
        "position": 0,
        "name": "_reservesList",
        "size": null,
        "type": "mapping(uint256 => address)"
    },
    {
        "slot": 55,
        "position": 0,
        "name": "_eModeCategories",
        "size": null,
        "type": "mapping(uint8 => (uint16 ltv, uint16 liquidationThreshold, uint16 liquidationBonus, uint128 collateralBitmap, bool isolated, string label, uint128 borrowableBitmap, uint128 ltvzeroBitmap))"
    },
    {
        "slot": 56,
        "position": 0,
        "name": "_usersEModeCategory",
        "size": null,
        "type": "mapping(address => uint8)"
    },
    {
        "slot": 57,
        "position": 0,
        "name": "__DEPRECATED_bridgeProtocolFee",
        "size": 256,
        "type": "uint256"
    },
    {
        "slot": 58,
        "position": 0,
        "name": "_flashLoanPremium",
        "size": 128,
        "type": "uint128"
    },
    {
        "slot": 58,
        "position": 128,
        "name": "__DEPRECATED_flashLoanPremiumToProtocol",
        "size": 128,
        "type": "uint128"
    },
    {
        "slot": 59,
        "position": 0,
        "name": "__DEPRECATED_maxStableRateBorrowSizePercent",
        "size": 64,
        "type": "uint64"
    },
    {
        "slot": 59,
        "position": 64,
        "name": "_reservesCount",
        "size": 16,
        "type": "uint16"
    },
    {
        "slot": 60,
        "position": 0,
        "name": "_positionManager",
        "size": null,
        "type": "mapping(address => mapping(address => bool))"
    }
]

}


interface IAavePoolTxCaller {
    approvePositionManager (sender: TSender, positionManager: TAddress, approve: boolean): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    borrow (sender: TSender, asset: TAddress, amount: bigint, interestRateMode: bigint, referralCode: number, onBehalfOf: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    configureEModeCategory (sender: TSender, id: number, category: { ltv: number, liquidationThreshold: number, liquidationBonus: number, isolated: boolean, label: string }): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    configureEModeCategoryBorrowableBitmap (sender: TSender, id: number, borrowableBitmap: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    configureEModeCategoryCollateralBitmap (sender: TSender, id: number, collateralBitmap: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    configureEModeCategoryIsolated (sender: TSender, id: number, isolated: boolean): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    configureEModeCategoryLtvzeroBitmap (sender: TSender, id: number, ltvzeroBitmap: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    deposit (sender: TSender, asset: TAddress, amount: bigint, onBehalfOf: TAddress, referralCode: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    eliminateReserveDeficit (sender: TSender, asset: TAddress, amount: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    finalizeTransfer (sender: TSender, asset: TAddress, from: TAddress, to: TAddress, scaledAmount: bigint, scaledBalanceFromBefore: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    flashLoan (sender: TSender, receiverAddress: TAddress, assets: TAddress[], amounts: bigint[], interestRateModes: bigint[], onBehalfOf: TAddress, params: TEth.Hex, referralCode: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    flashLoanSimple (sender: TSender, receiverAddress: TAddress, asset: TAddress, amount: bigint, params: TEth.Hex, referralCode: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    initReserve (sender: TSender, asset: TAddress, aTokenAddress: TAddress, variableDebtAddress: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    initialize (sender: TSender, provider: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    liquidationCall (sender: TSender, collateralAsset: TAddress, debtAsset: TAddress, borrower: TAddress, debtToCover: bigint, receiveAToken: boolean): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    mintToTreasury (sender: TSender, assets: TAddress[]): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    multicall (sender: TSender, data: TEth.Hex[]): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    renouncePositionManagerRole (sender: TSender, user: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    repay (sender: TSender, asset: TAddress, amount: bigint, interestRateMode: bigint, onBehalfOf: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    repayWithATokens (sender: TSender, asset: TAddress, amount: bigint, interestRateMode: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    repayWithPermit (sender: TSender, asset: TAddress, amount: bigint, interestRateMode: bigint, onBehalfOf: TAddress, deadline: bigint, permitV: number, permitR: TEth.Hex, permitS: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    rescueTokens (sender: TSender, token: TAddress, to: TAddress, amount: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setConfiguration (sender: TSender, asset: TAddress, configuration: { data: bigint }): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setLiquidationGracePeriod (sender: TSender, asset: TAddress, until: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setUserEMode (sender: TSender, categoryId: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setUserEModeOnBehalfOf (sender: TSender, categoryId: number, onBehalfOf: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setUserUseReserveAsCollateral (sender: TSender, asset: TAddress, useAsCollateral: boolean): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setUserUseReserveAsCollateralOnBehalfOf (sender: TSender, asset: TAddress, useAsCollateral: boolean, onBehalfOf: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    supply (sender: TSender, asset: TAddress, amount: bigint, onBehalfOf: TAddress, referralCode: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    supplyWithPermit (sender: TSender, asset: TAddress, amount: bigint, onBehalfOf: TAddress, referralCode: number, deadline: bigint, permitV: number, permitR: TEth.Hex, permitS: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    syncIndexesState (sender: TSender, asset: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    syncRatesState (sender: TSender, asset: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    updateFlashloanPremium (sender: TSender, flashLoanPremium: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    withdraw (sender: TSender, asset: TAddress, amount: bigint, to: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IAavePoolTxData {
    approvePositionManager (sender: TSender, positionManager: TAddress, approve: boolean): Promise<TEth.TxLike>
    borrow (sender: TSender, asset: TAddress, amount: bigint, interestRateMode: bigint, referralCode: number, onBehalfOf: TAddress): Promise<TEth.TxLike>
    configureEModeCategory (sender: TSender, id: number, category: { ltv: number, liquidationThreshold: number, liquidationBonus: number, isolated: boolean, label: string }): Promise<TEth.TxLike>
    configureEModeCategoryBorrowableBitmap (sender: TSender, id: number, borrowableBitmap: bigint): Promise<TEth.TxLike>
    configureEModeCategoryCollateralBitmap (sender: TSender, id: number, collateralBitmap: bigint): Promise<TEth.TxLike>
    configureEModeCategoryIsolated (sender: TSender, id: number, isolated: boolean): Promise<TEth.TxLike>
    configureEModeCategoryLtvzeroBitmap (sender: TSender, id: number, ltvzeroBitmap: bigint): Promise<TEth.TxLike>
    deposit (sender: TSender, asset: TAddress, amount: bigint, onBehalfOf: TAddress, referralCode: number): Promise<TEth.TxLike>
    eliminateReserveDeficit (sender: TSender, asset: TAddress, amount: bigint): Promise<TEth.TxLike>
    finalizeTransfer (sender: TSender, asset: TAddress, from: TAddress, to: TAddress, scaledAmount: bigint, scaledBalanceFromBefore: bigint): Promise<TEth.TxLike>
    flashLoan (sender: TSender, receiverAddress: TAddress, assets: TAddress[], amounts: bigint[], interestRateModes: bigint[], onBehalfOf: TAddress, params: TEth.Hex, referralCode: number): Promise<TEth.TxLike>
    flashLoanSimple (sender: TSender, receiverAddress: TAddress, asset: TAddress, amount: bigint, params: TEth.Hex, referralCode: number): Promise<TEth.TxLike>
    initReserve (sender: TSender, asset: TAddress, aTokenAddress: TAddress, variableDebtAddress: TAddress): Promise<TEth.TxLike>
    initialize (sender: TSender, provider: TAddress): Promise<TEth.TxLike>
    liquidationCall (sender: TSender, collateralAsset: TAddress, debtAsset: TAddress, borrower: TAddress, debtToCover: bigint, receiveAToken: boolean): Promise<TEth.TxLike>
    mintToTreasury (sender: TSender, assets: TAddress[]): Promise<TEth.TxLike>
    multicall (sender: TSender, data: TEth.Hex[]): Promise<TEth.TxLike>
    renouncePositionManagerRole (sender: TSender, user: TAddress): Promise<TEth.TxLike>
    repay (sender: TSender, asset: TAddress, amount: bigint, interestRateMode: bigint, onBehalfOf: TAddress): Promise<TEth.TxLike>
    repayWithATokens (sender: TSender, asset: TAddress, amount: bigint, interestRateMode: bigint): Promise<TEth.TxLike>
    repayWithPermit (sender: TSender, asset: TAddress, amount: bigint, interestRateMode: bigint, onBehalfOf: TAddress, deadline: bigint, permitV: number, permitR: TEth.Hex, permitS: TEth.Hex): Promise<TEth.TxLike>
    rescueTokens (sender: TSender, token: TAddress, to: TAddress, amount: bigint): Promise<TEth.TxLike>
    setConfiguration (sender: TSender, asset: TAddress, configuration: { data: bigint }): Promise<TEth.TxLike>
    setLiquidationGracePeriod (sender: TSender, asset: TAddress, until: number): Promise<TEth.TxLike>
    setUserEMode (sender: TSender, categoryId: number): Promise<TEth.TxLike>
    setUserEModeOnBehalfOf (sender: TSender, categoryId: number, onBehalfOf: TAddress): Promise<TEth.TxLike>
    setUserUseReserveAsCollateral (sender: TSender, asset: TAddress, useAsCollateral: boolean): Promise<TEth.TxLike>
    setUserUseReserveAsCollateralOnBehalfOf (sender: TSender, asset: TAddress, useAsCollateral: boolean, onBehalfOf: TAddress): Promise<TEth.TxLike>
    supply (sender: TSender, asset: TAddress, amount: bigint, onBehalfOf: TAddress, referralCode: number): Promise<TEth.TxLike>
    supplyWithPermit (sender: TSender, asset: TAddress, amount: bigint, onBehalfOf: TAddress, referralCode: number, deadline: bigint, permitV: number, permitR: TEth.Hex, permitS: TEth.Hex): Promise<TEth.TxLike>
    syncIndexesState (sender: TSender, asset: TAddress): Promise<TEth.TxLike>
    syncRatesState (sender: TSender, asset: TAddress): Promise<TEth.TxLike>
    updateFlashloanPremium (sender: TSender, flashLoanPremium: bigint): Promise<TEth.TxLike>
    withdraw (sender: TSender, asset: TAddress, amount: bigint, to: TAddress): Promise<TEth.TxLike>
}


type TEvents = TAavePoolTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;
