import { TimelockController } from '@dequanto-contracts/openzeppelin/TimelockController';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { JsonArrayStore } from '@dequanto/json/JsonArrayStore';
import { IAccount } from '@dequanto/models/TAccount';
import { TAddress } from '@dequanto/models/TAddress';
import { TEth } from '@dequanto/models/TEth';
import { TPlatform } from '@dequanto/models/TPlatform';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { $contract } from '@dequanto/utils/$contract';
import { $date } from '@dequanto/utils/$date';
import { $hex } from '@dequanto/utils/$hex';
import { l } from '@dequanto/utils/$logger';
import { $number } from '@dequanto/utils/$number';
import { $platform } from '@dequanto/utils/$platform';
import { $require } from '@dequanto/utils/$require';
import { File } from 'atma-io';
import memd from 'memd';


interface ITimelockTx {
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

interface ITimelockTxParams {
    title?: string

    sender: IAccount
    to: TAddress | TAddress[]
    data: TEth.Hex | TEth.Hex[]

    value?: bigint | bigint[]
    predecessor?: TEth.Hex
    delay?: bigint
}

interface ITimelockTxParamsNormalized {
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

type TTimelockController = ContractBase & Pick<TimelockController,
    'schedule' | 'scheduleBatch' | 'execute' | 'executeBatch' | 'getMinDelay' | 'cancel'
>;

export class TimelockService {


    constructor(
        private timelock: TTimelockController,
        private options?: {
            // Only for hardhat client. Default: true
            simulate?: boolean

            // Only for hardhat client. Default: false
            execute?: boolean

            // Directory to store the submitted schedules, default: `./data/0x/`
            dir?: string
        }
    ) {

    }

    async getPendingByTitle (title: string): Promise<{
        status: ETimelockTxStatus;
        schedule: ITimelockTx;
    }> {
        let store = await this.getStore();
        let arr = await store.getAll();
        let txs = arr.filter(x => x.title === title && x.txExecute == null);
        $require.lt(txs.length, 2, `Only one pending tx must be present with same title "${title}"`);
        let schedule = txs.length === 0 ? null : txs[0];
        let status = await this.getScheduleStatus(schedule);
        return { status, schedule };
    }

    async executePendingByTitle (sender: IAccount, title: string): Promise<{
        tx: TxWriter;
        schedule: ITimelockTx;
    }> {
        let store = await this.getStore();
        let arr = await store.getAll();
        let txs = arr.filter(x => x.title === title && x.txExecute == null);
        $require.eq(txs.length, 1, `No pending tx found ${title}`);
        let [ txParams ] = txs;
        return this.executePending(sender, txParams);
    }

    async executePending (sender: IAccount, txParams: ITimelockTx): Promise<{
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
    async process <
        T extends ContractBase,
        TMethodName extends WriteMethodKeys<T>,
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
    async processBatch <
        T extends ContractBase,
        TMethodName extends WriteMethodKeys<T>,
    > (
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

    private async processTxParams (txParams: ITimelockTxParamsNormalized): Promise<{
        prevStatus: ETimelockTxStatus
        status: ETimelockTxStatus
        schedule: ITimelockTx
        tx?: TEth.Hex
    }>  {
        let key = await this.getOperationKey(txParams);
        let schedule = await this.getUniqueByKey(key);
        let status = await this.getScheduleStatus(schedule);
        l`Current schedule status: ${status}`;

        if (status == ETimelockTxStatus.None) {
            let result = await this.schedule(txParams);
            return {
                prevStatus: status,
                status: ETimelockTxStatus.Pending,
                schedule: result,
                tx: result.txSchedule
            };
        }
        if (status == ETimelockTxStatus.Ready) {
            let result = await this.execute(txParams);
            return {
                prevStatus: status,
                status: ETimelockTxStatus.Executed,
                schedule: result.schedule,
                tx: result.tx.tx?.hash
            };
        }
        // No status change
        return {
            prevStatus: status,
            status: status,
            schedule
        };
    }

    async scheduleCall <
        T extends ContractBase,
        TMethodName extends WriteMethodKeys<T>,
    > (
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


    async executeCall <
        T extends ContractBase,
        TMethodName extends WriteMethodKeys<T>,
    > (
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
    async schedule (params: ITimelockTxParams): Promise<ITimelockTx> {
        let txParams = await this.getTxParamsNormalized(params);
        let salt = this.getOperationSalt(txParams);
        let key = this.getOperationKey(txParams);
        let pendingTx = await this.getPendingByKey(key);
        if (pendingTx?.txSchedule != null) {
            return pendingTx;
        }

        let delay = params.delay ?? await this.getMinDelay();
        let timelock = this.timelock;
        let client = timelock.client;

        let isBatch = Array.isArray(txParams.to);
        let tx  = isBatch
        ? await timelock.$receipt().scheduleBatch(
            txParams.sender,
            txParams.to as TAddress[],
            txParams.value as bigint[],
            txParams.data as TEth.Hex[],
            txParams.predecessor,
            salt,
            txParams.delay,
        )
        : await timelock.$receipt().schedule(
            txParams.sender,
            txParams.to as TAddress,
            txParams.value as bigint,
            txParams.data as TEth.Hex,
            txParams.predecessor,
            salt,
            txParams.delay,
        );


        let block = await client.getBlock(tx.receipt.blockNumber);
        let store = await this.getStore();
        let id = this.getOperationHash({ ...txParams, salt });
        let timelockTx = await store.upsert({
            id,
            key,
            salt,
            title: txParams.title,
            to: txParams.to,
            data: txParams.data,
            value: isBatch ? (txParams.value as bigint[] ?? []).map($hex.ensure) : $hex.ensure(txParams.value as bigint),

            createdAt: block.timestamp,
            validAt: block.timestamp + Number(delay),

            status: 'pending',
            txSchedule: tx.receipt.transactionHash
        });

        if (client.platform === 'hardhat' && this.options?.simulate !== false) {
            // In Hardhat environment perform also the simulation check
            await client.debug.mine(delay, 1);
            let { error } = isBatch
                ? await timelock.$gas().executeBatch(
                    txParams.sender,
                    txParams.to as TAddress[],
                    txParams.value as bigint[],
                    txParams.data as TEth.Hex[],
                    txParams.predecessor,
                    salt
                )
                : await timelock.$gas().execute(
                    txParams.sender,
                    txParams.to as TAddress,
                    txParams.value as bigint,
                    txParams.data as TEth.Hex,
                    txParams.predecessor,
                    salt
                );

            if (error != null) {
                // Simulation was not successful
                error.message = `Timelock simulation failed: ${error.message}`;
                throw error;
            } else {
                l`🟢 Hardhat: Timelock(${txParams.title}) simulation succeeded`;
            }
        }

        return timelockTx;
    }

    async execute (params: ITimelockTxParams): Promise<{
        tx: TxWriter
        schedule: ITimelockTx
    }> {
        let txParams = await this.getTxParamsNormalized(params);
        let key = this.getOperationKey(txParams);
        let pendingTx = await this.getPendingByKey(key);
        $require.notNull(pendingTx, `Tx not scheduled: ${ params.to } ${ params.data }`);

        let status = await this.getScheduleStatus(pendingTx);
        $require.eq(status, ETimelockTxStatus.Ready, `Tx not ready to execute: ${status}`)

        let timelock = this.timelock;
        let store = await this.getStore();
        let salt = pendingTx.salt;
        let id = this.getOperationHash({ ...txParams, salt });

        let isBatch = Array.isArray(txParams.to);

        let tx = isBatch
        ? await timelock.$receipt().executeBatch(
            txParams.sender,
            txParams.to as TAddress[],
            txParams.value as bigint[],
            txParams.data as TEth.Hex[],
            txParams.predecessor,
            salt
        )
        : await timelock.$receipt().execute(
            txParams.sender,
            txParams.to as TAddress,
            txParams.value as bigint,
            txParams.data as TEth.Hex,
            txParams.predecessor,
            salt
        );
        let result = await store.upsert({
            id,
            status: 'completed',
            txExecute: tx.receipt.transactionHash,
        });
        return {
            tx,
            schedule: result,
        };
    }

    async cancel (sender: IAccount, id: TEth.Hex, opts?: { storage?: boolean}) {
        let store = await this.getStore();
        let schedule: ITimelockTx;
        if (opts?.storage !== false) {
            schedule = await store.getSingle(id);
            $require.notNull(schedule, `Schedule not found: ${id}`);
        }
        let tx = await this.timelock.$receipt().cancel(sender, id);
        if (opts?.storage !== false) {
            schedule = await store.upsert({
                id: id,
                status: 'canceled',
                txCancel: tx.receipt.transactionHash,
            });
        }
        return {
            tx,
            schedule
        };
    }

    public async clearSchedules () {
        let store = await this.getStore();
        await store.saveAll([]);
    }

    public async updateSchedule(txInfo: Partial<ITimelockTx>) {
        $require.notNull(txInfo.id, `ID is required`);
        let store = await this.getStore();
        await store.upsert(txInfo);
    }

    public async debugMoveToSchedule (txInfo: ITimelockTx) {
        $require.eq(this.timelock.client.platform, 'hardhat');

        let seconds = txInfo.validAt - txInfo.createdAt;
        await this.timelock.client.debug.mine(seconds + 1);
        await this.updateSchedule({
            ...txInfo,
            validAt: $date.toUnixTimestamp()
        });
    }

    @memd.deco.memoize({ perInstance: true })
    private async getMinDelay (): Promise<bigint> {
        let timelock = this.timelock;
        return timelock.getMinDelay();
    }

    /**
     * Gets the operation ID (same as the contract's method)
     */
    private getOperationHash (params: {
        to: TAddress | TAddress[]
        value: bigint | bigint[]
        data: TEth.Hex | TEth.Hex[]
        predecessor: TEth.Hex
        salt: TEth.Hex
    }): TEth.Hex{
        let isBatch = Array.isArray(params.to);
        if (isBatch) {
            return $contract.keccak256($abiUtils.encode([
                ['address[]', params.to ],
                ['uint256[]', params.value ],
                ['bytes[]', params.data ],
                ['bytes32', params.predecessor ],
                ['bytes32', params.salt]
            ]));
        }
        return $contract.keccak256($abiUtils.encode([
            ['address', params.to ],
            ['uint256', params.value ],
            ['bytes', params.data ],
            ['bytes32', params.predecessor ],
            ['bytes32', params.salt]
        ]));
    }

    /**
     * Gets the operation KEY: unique only within pending operations
     */
    private getOperationKey (params: {
        title: string
        to: TAddress | TAddress[]
        value: bigint | bigint[]
        data: TEth.Hex | TEth.Hex[]
        predecessor: TEth.Hex
    }): TEth.Hex{
        return $contract.keccak256([
            params.title,
            params.to,
            params.value,
            params.data,
            params.predecessor
        ].join('_'));
    }

    /**
     * Create operations SALT: overall unique ID
     */
    private getOperationSalt (params: {
        to: TAddress | TAddress[]
        value: bigint | bigint[]
        data: TEth.Hex | TEth.Hex[]
        predecessor: TEth.Hex
    }): TEth.Hex{
        return $contract.keccak256([
            params.to,
            params.value,
            params.data,
            params.predecessor,
            Date.now(),
            $number.randomInt(0, 1000_000),
        ].join('_'));
    }

    private async getPendingByKey (key: TEth.Hex): Promise<ITimelockTx> {
        let store = await this.getStore();
        let all = await store.getAll();
        return all.find(x => x.key === key && x.status === 'pending');
    }

    private async getUniqueByKey (key: TEth.Hex): Promise<ITimelockTx> {
        let store = await this.getStore();
        let all = await store.getAll();
        let arr = all.filter(x => x.key === key);
        $require.lt(arr.length, 2, `Timelock service expects ${key} to be unique. Found ${arr.length}`);
        return arr.length === 1 ? arr[0] : null;
    }

    private async getScheduleStatus (schedule: ITimelockTx): Promise<ETimelockTxStatus> {
        if (schedule == null || schedule.txSchedule == null) {
            return ETimelockTxStatus.None;
        }
        if (schedule.txExecute != null) {
            return ETimelockTxStatus.Executed;
        }
        $require.Number(schedule.validAt, `Unknown valid time: ${ schedule.validAt }`);
        let now = await this.getCurrentTime();
        if (now < schedule.validAt) {
            return ETimelockTxStatus.Pending;
        }
        return ETimelockTxStatus.Ready;
    }
    private async getCurrentTime (): Promise<number> {
        let client = this.timelock.client;
        let platform = client.platform;
        if (platform !== 'hardhat') {
            // Assume public blockchains are on current time
            return $date.toUnixTimestamp();
        }
        let nr = await client.getBlockNumber();
        let block = await client.getBlock(nr);
        return block.timestamp;
    }

    private async getTxParamsNormalized (params: ITimelockTxParams): Promise<ITimelockTxParamsNormalized> {
        let value = params.value ?? 0n;
        let data = params.data;
        let predecessor = params.predecessor ?? $hex.ZERO;
        let delay = params.delay ?? await this.getMinDelay();
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
    private async getTxParamsNormalizedFromContract <
        T extends ContractBase,
        TMethodName extends WriteMethodKeys<T>,
    > (
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

    @memd.deco.memoize({ perInstance: true })
    private async getStore () {
        let { platform, network } = this.timelock.client;
        let dir = this.options?.dir ?? `data/0x`;

        let path = getPath(platform, dir);
        if (platform === 'hardhat' && network !== platform) {
            // forked chain
            let sourcePath = getPath(network, dir);
            if (await File.existsAsync(sourcePath)) {
                await File.copyToAsync(sourcePath, path, { silent: true })
            }
        }
        function getPath (p: TPlatform, directory: string) {
            return `/${directory}/timelocks-${ $platform.toPath(p) }.json`
        }
        return new JsonArrayStore<ITimelockTx>({
            path,
            key: x => x.id
        });
    }
}

type WriteMethodKeys<T> = {
    [P in keyof T]: T[P] extends ((sender: IAccount, ...args) => (Promise<TxWriter>)) ? P : never;
}[keyof T];



namespace util {
    export function toBigInt (mix: string | string[]) {
        if (typeof mix === 'string') {
            return BigInt(mix);
        }
        return mix.map(BigInt);
    }
}
