import { IToken, ITokenBase } from '@dequanto/models/IToken';
import { TAddress } from '@dequanto/models/TAddress';
import { TResultAsync } from '@dequanto/models/TResult';
import { ISwapRouted } from '../TokenExchanges/AmmBase/V2/AmmPairV2Service';

export interface IOracle {
    getPrice (token: IToken, opts?: IOracleOptions): TResultAsync<IOracleResult>
}

export interface IOracleOptions {
    block?: number
    date?: Date
}
export interface IOracleResult {
    quote: ITokenBase
    price: number
    date: Date
}

export interface ISwapOptions {
    /** default: 1 */
    amount?: number

    amountWei?: bigint

    date?: Date
    block?: number
    route?: string[]
    //-store?: TokenPriceStore
    pairs?: { address: TAddress, from: IToken, to: IToken }[]
}
