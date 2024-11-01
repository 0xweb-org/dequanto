import { TimelockController } from '@dequanto-contracts/openzeppelin/TimelockController';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { IAccount } from '@dequanto/models/TAccount';
import { TAddress } from '@dequanto/models/TAddress';
import { TEth } from '@dequanto/models/TEth';
import { SafeTx } from '@dequanto/safe/SafeTx';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { $contract } from '@dequanto/utils/$contract';
import { $hex } from '@dequanto/utils/$hex';
import memd from 'memd';
import { ETimelockTxStatus, ITimelockTx, ITimelockTxParamsNormalized, ITimelockTxParams, ITimelockService } from './ITimelockService';


export class TimelockService implements ITimelockService {


    constructor(
        private safeTx: SafeTx,
        private options?: {
            // Only for hardhat client. Default: true
            simulate?: boolean

            // Only for hardhat client. Default: false
            execute?: boolean

            // Directory to store the submitted schedules, default: `./0x/data/`
            dir?: string
        }
    ) {

    }

    async getPendingByTitle(title: string): Promise<{
        status: ETimelockTxStatus;
        schedule: ITimelockTx;
    }> {
        return { status: ETimelockTxStatus.None, schedule: null };
    }

    async executePendingByTitle(sender: IAccount, title: string): Promise<{
        tx: TxWriter;
        schedule: ITimelockTx;
    }> {
        throw new Error(`No pending tx found ${title}`);
    }

    async executePending(sender: IAccount, txParams: ITimelockTx): Promise<{
        tx: TxWriter;
        schedule: ITimelockTx;
    }> {
        let result = await this.execute({
            ...txParams,
            value: util.toBigInt(txParams.value),
            sender: sender,
        });
        return result;
    }

    /** Schedules-Wait-Execute a task distinguished by the unique task name
     *
     * 1. if schedule doesn't exist, create it
     * 2. if schedule date NOT yet ready, exit
     * 3. if schedule date IS ready, execute it
     * 4. if executed, exit
    */
    async process<
        T extends ContractBase,
        TMethodName extends WriteMethodKeys<T>,
    >(
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
    }> {

        let txParams = await this.getTxParamsNormalizedFromContract(uniqueTaskName, sender, contract, method, ...params);
        return await this.processTxParams(txParams);
    }

    /** Schedules-Wait-Execute a task distinguished by the unique task name
     *
     * 1. if schedule doesn't exist, create it
     * 2. if schedule date NOT yet ready, exit
     * 3. if schedule date IS ready, execute it
     * 4. if executed, exit
    */
    async processBatch<
        T extends ContractBase,
        TMethodName extends WriteMethodKeys<T>,
    >(
        uniqueTaskName: string,
        sender: IAccount,
        batch: Pick<TEth.TxLike, 'to' | 'data' | 'value'>[],
    ): Promise<{
        prevStatus: ETimelockTxStatus
        status: ETimelockTxStatus
        schedule: ITimelockTx
        tx?: TEth.Hex
    }> {

        let txParams = await this.getTxParamsNormalizedFromContractBatch(uniqueTaskName, sender, batch);
        return await this.processTxParams(txParams);
    }

    private async processTxParams(txParams: ITimelockTxParamsNormalized): Promise<{
        prevStatus: ETimelockTxStatus
        status: ETimelockTxStatus
        schedule: ITimelockTx
        tx?: TEth.Hex
    }> {

        let result = await this.execute(txParams);
        return {
            prevStatus: ETimelockTxStatus.None,
            status: ETimelockTxStatus.Executed,
            schedule: result.schedule,
            tx: result.tx.tx?.hash
        };
    }

    async scheduleCall<
        T extends ContractBase,
        TMethodName extends WriteMethodKeys<T>,
    >(
        sender: IAccount,
        contract: T,
        method: TMethodName,
        ...params: T[TMethodName] extends (sender: IAccount, ...args: infer A) => any ? A : never
    ) {
        let txParams = await this.getTxParamsNormalizedFromContract('', sender, contract, method, ...params);
        let tx = await this.schedule(txParams);
        return tx;
    }

    /**
     *  E.g. `.scheduleCallBatch(title, sender, [ c1.$data().foo(sender), c2.$data().bar(sender, param1) ])`
     */
    async scheduleCallBatch(
        title: string,
        sender: IAccount,
        batch: Pick<TEth.TxLike, 'to' | 'data' | 'value'>[],
    ) {
        let txParams = await this.getTxParamsNormalizedFromContractBatch(title, sender, batch);
        let tx = await this.schedule(txParams);
        return tx;
    }


    async executeCall<
        T extends ContractBase,
        TMethodName extends WriteMethodKeys<T>,
    >(
        sender: IAccount,
        contract: T,
        method: TMethodName,
        ...params: T[TMethodName] extends (sender: IAccount, ...args: infer A) => any ? A : never
    ) {
        let txParams = await this.getTxParamsNormalizedFromContract('', sender, contract, method, ...params);
        let tx = await this.execute(txParams);
        return tx;
    }

    /**
     *  E.g. `.scheduleCallBatch(title, sender, [ c1.$data().foo(sender), c2.$data().bar(sender, param1) ])`
     */
    async executeCallBatch(
        title: string,
        sender: IAccount,
        batch: Pick<TEth.TxLike, 'to' | 'data' | 'value'>[],
    ) {
        let txParams = await this.getTxParamsNormalizedFromContractBatch(title, sender, batch);
        let tx = await this.execute(txParams);
        return tx;
    }

    @memd.deco.queued()
    async schedule(params: ITimelockTxParams): Promise<ITimelockTx> {
        let executed = await this.execute(params);
        return executed.schedule;
    }

    async execute(params: ITimelockTxParams): Promise<{
        tx: TxWriter
        schedule: ITimelockTx
    }> {
        let txParams = await this.getTxParamsNormalized(params);
        let isBatch = Array.isArray(txParams.to);
        let tx = isBatch
            ? await this.safeTx.executeBatch(
                ...(txParams.to as TAddress[]).map((to, i) => {
                    return {
                        to,
                        value: (txParams.value as bigint[])[i],
                        data: (txParams.data as TEth.Hex[])[i]
                    }
                }),
            )
            : await this.safeTx.execute(
                {
                    to: txParams.to as TAddress,
                    value: txParams.value as bigint,
                    data: txParams.data as TEth.Hex
                }
            );


        return {
            tx,
            schedule: {
                txExecute: tx.receipt.transactionHash,
                status: ETimelockTxStatus.Executed,
            } as ITimelockTx
        };
    }

    async cancel(sender: IAccount, id: TEth.Hex, opts?: { storage?: boolean }) {
        throw new Error(`Not implemented for Safe Fallback`);
    }

    public async clearSchedules() {
        // SafeFallback has no schedules
    }

    public async updateSchedule(txInfo: Partial<ITimelockTx>) {
        // SafeFallback has no schedules
    }

    public async debugMoveToSchedule(txInfo: ITimelockTx) {
        // SafeFallback has no schedules
    }

    private async getTxParamsNormalized(params: ITimelockTxParams): Promise<ITimelockTxParamsNormalized> {
        let value = params.value ?? 0n;
        let data = params.data;
        let predecessor = params.predecessor ?? $hex.ZERO;
        let delay = 0n;
        return {
            title: params.title ?? '',
            sender: params.sender,
            to: params.to,

            value,
            data,
            predecessor,
            delay
        };
    }
    private async getTxParamsNormalizedFromContract<
        T extends ContractBase,
        TMethodName extends WriteMethodKeys<T>,
    >(
        title: string | '' | null,
        sender: IAccount,
        contract: T,
        method: TMethodName,
        ...params: T[TMethodName] extends (sender: IAccount, ...args: infer A) => any ? A : never
    ): Promise<ITimelockTxParamsNormalized> {

        let txData = await contract.$data()[method](sender, ...params);
        let abi = contract.abi?.find(x => x.name === method);
        let methodCallStr = $contract.formatCallFromAbi(abi, params);

        title ??= `${contract.constructor.name}.${methodCallStr}`;

        let tx = await this.getTxParamsNormalized({
            title,
            sender,
            to: txData.to,
            data: txData.data,
        })
        return tx;
    }
    private async getTxParamsNormalizedFromContractBatch(
        title: string | '' | null,
        sender: IAccount,
        batch: Pick<TEth.TxLike, 'to' | 'data' | 'value'>[],
    ): Promise<ITimelockTxParamsNormalized> {


        let tx = await this.getTxParamsNormalized({
            title,
            sender,
            to: batch.map(x => x.to),
            data: batch.map(x => x.data),
            value: batch.map(x => BigInt(x.value)),
        })
        return tx;
    }
}

type WriteMethodKeys<T> = {
    [P in keyof T]: T[P] extends ((sender: IAccount, ...args) => (Promise<TxWriter>)) ? P : never;
}[keyof T];



namespace util {
    export function toBigInt(mix: string | string[]) {
        if (typeof mix === 'string') {
            return BigInt(mix);
        }
        return mix.map(BigInt);
    }
}
