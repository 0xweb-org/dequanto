import { ChainAccount } from "@dequanto/models/TAccount";
import { IToken } from '@dequanto/models/IToken';
import { TxWriter } from '@dequanto/txs/TxWriter';

export interface ISwapService {
    swap (account: ChainAccount, params: {
        from: string | IToken
        to: string | IToken
        fromAmount: number | bigint
        slippage?: number
    }): Promise<TxWriter>
}
