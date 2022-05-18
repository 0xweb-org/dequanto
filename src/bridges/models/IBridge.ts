import { ChainAccount } from '@dequanto/ChainAccountProvider';
import { TAddress } from '@dequanto/models/TAddress';
import { TPlatform } from '@dequanto/models/TPlatform';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { class_Dfr } from 'atma-utils';
import { TransactionReceipt } from 'web3-core';

export interface IBridge {
    name: string

    canTransfer (
        account: TAddress,
        amount: number | bigint,
        symbol: string,
        fromPlatform: TPlatform,
        toPlatform: TPlatform
    ): Promise<{ error: Error | null }>

    transfer (
        account: ChainAccount,
        amount: number | bigint,
        symbol: string,
        fromPlatform: TPlatform,
        toPlatform: TPlatform
    ): Promise<{
        txWriter: TxWriter;
        txReceipt: class_Dfr<TransactionReceipt>;
        txTransferId: class_Dfr<string>;
    }>

    waitForTransfer (
        transferId: string,
        token: string,
        toPlatform: TPlatform,
        toAccount: TAddress
    ): Promise<void>

    status (
        transferId: string,
        token: string,
        toPlatform: TPlatform
    ): Promise<boolean>
}
