import { EoAccount } from "@dequanto/models/TAccount";
import { TAddress } from '@dequanto/models/TAddress';
import { TEth } from '@dequanto/models/TEth';
import { TPlatform } from '@dequanto/models/TPlatform';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { class_Dfr } from 'atma-utils';


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
        account: EoAccount,
        amount: number | bigint,
        symbol: string,
        fromPlatform: TPlatform,
        toPlatform: TPlatform
    ): Promise<{
        txWriter: TxWriter;
        txReceipt: class_Dfr<TEth.TxReceipt>;
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
