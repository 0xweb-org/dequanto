import { ContractBase } from '@dequanto/contracts/ContractBase';
import { IAccount } from '@dequanto/models/TAccount'
import { TAddress } from '@dequanto/models/TAddress'
import { TEth } from '@dequanto/models/TEth'
import { TxWriter } from '@dequanto/txs/TxWriter';
import { TTxWriteMethodKeys } from '@dequanto/utils/types';

export interface ITimelockService {

    getPendingByTitle (title: string): Promise<{
        status: ETimelockTxStatus;
        schedule: ITimelockTx;
    }>

    executePendingByTitle (sender: IAccount, title: string): Promise<{
        tx: TxWriter;
        schedule: ITimelockTx;
    }>

    executePending (sender: IAccount, txParams: ITimelockTx): Promise<{
        tx: TxWriter;
        schedule: ITimelockTx;
    }>
    /** Schedules-Wait-Execute a task distinguished by the unique task name
     *
     * 1. if schedule doesn't exist, create it
     * 2. if schedule date NOT yet ready, exit
     * 3. if schedule date IS ready, execute it
     * 4. if executed, exit
    */
    process <
        T extends ContractBase,
        TMethodName extends TTxWriteMethodKeys<T>,
    > (
        uniqueTaskName: string,
        sender: IAccount,
        contract: T,
        method: TMethodName,
        ...params: T[TMethodName] extends (sender: IAccount, ...args: infer A) => any ? A : never
    ): Promise<{
        prevStatus: ETimelockTxStatus
        status: ETimelockTxStatus
        schedule: ITimelockTx
        tx?: TEth.Hex
    }>

    /** Schedules-Wait-Execute a task distinguished by the unique task name
     *
     * 1. if schedule doesn't exist, create it
     * 2. if schedule date NOT yet ready, exit
     * 3. if schedule date IS ready, execute it
     * 4. if executed, exit
    */
    processBatch <
        T extends ContractBase,
        TMethodName extends TTxWriteMethodKeys<T>,
    > (
        uniqueTaskName: string,
        sender: IAccount,
        batch: Pick<TEth.TxLike, 'to' | 'data' | 'value'>[],
    ): Promise<{
        prevStatus: ETimelockTxStatus
        status: ETimelockTxStatus
        schedule: ITimelockTx
        tx?: TEth.Hex
    }>
}

export interface ITimelockTx {
    // operation hash, unique as includes random salt
    id: TEth.Hex
    // operation key, should be unique only within pending operations
    key: TEth.Hex

    salt: TEth.Hex

    title?: string
    sender: string | TAddress

    to: TAddress | TAddress[]
    data: TEth.Hex | TEth.Hex[]
    value?: TEth.Hex | TEth.Hex[]
    predecessor?: TEth.Hex

    createdAt: number
    validAt: number

    status: 'pending' | 'completed' | 'canceled'
    txSchedule: TEth.Hex
    txExecute?: TEth.Hex
    txCancel?: TEth.Hex
}

export interface ITimelockTxParams {
    title?: string

    sender: IAccount
    to: TAddress | TAddress[]
    data: TEth.Hex | TEth.Hex[]

    value?: bigint | bigint[]
    predecessor?: TEth.Hex
    delay?: bigint
}

export interface ITimelockTxParamsNormalized {
    sender: IAccount
    to: TAddress | TAddress[]
    data: TEth.Hex | TEth.Hex[]

    title: string
    value: bigint | bigint[]
    predecessor: TEth.Hex
    delay: bigint
}


export enum ETimelockTxStatus {
    None = 'none',
    Pending = 'pending',
    Ready = 'ready',
    Executed = 'completed',
}
