import { TimelockController } from '@dequanto-contracts/openzeppelin/TimelockController';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { JsonArrayStore } from '@dequanto/json/JsonArrayStore';
import { IAccount } from '@dequanto/models/TAccount';
import { TAddress } from '@dequanto/models/TAddress';
import { TEth } from '@dequanto/models/TEth';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { $contract } from '@dequanto/utils/$contract';
import { $date } from '@dequanto/utils/$date';
import { $hex } from '@dequanto/utils/$hex';
import { $number } from '@dequanto/utils/$number';
import { $platform } from '@dequanto/utils/$platform';
import { $require } from '@dequanto/utils/$require';
import memd from 'memd';


interface ITimelockTx {
    // operation hash, unique as includes random salt
    id: TEth.Hex
    // operation key, should be unique only within pending operations
    key: TEth.Hex

    salt: TEth.Hex

    title?: string
    sender: string | TAddress

    to: TAddress
    data: TEth.Hex
    value?: TEth.Hex
    createdAt: number
    validAt: number

    status: 'pending' | 'completed'
    txSchedule: TEth.Hex
    txExecute?: TEth.Hex
}

interface ITimelockTxParams {
    sender: IAccount
    to: TAddress
    data: TEth.Hex

    title?: string
    value?: bigint
    predecessor?: TEth.Hex
    delay?: bigint
}

interface ITimelockTxParamsNormalized {
    sender: IAccount
    to: TAddress
    data: TEth.Hex

    title: string
    value: bigint
    predecessor: TEth.Hex
    delay: bigint
}

type TTimelockController = ContractBase & Pick<TimelockController, 'schedule' | 'execute' | 'getMinDelay'>;

export class TimelockService {

    public store: JsonArrayStore<ITimelockTx>;

    constructor(
        private timelock: TTimelockController,
    ) {
        this.store = new JsonArrayStore<ITimelockTx>({
            path: `/cache/${ $platform.toPath(timelock.client.platform) }/timelock-tx.json`,
            key: x => x.id
        });
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

        let txData = await contract.$data()[method](sender, ...params);

        let abi = contract.abi?.find(x => x.name === method);
        let methodCallStr = $contract.formatCallFromAbi(abi, params);
        let title = `${contract.constructor.name}.${methodCallStr}`

        let tx = await this.schedule({
            title,
            sender,
            to: txData.to,
            data: txData.data,
        });
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
        let txData = await contract.$data()[method](sender, ...params);
        let abi = contract.abi?.find(x => x.name === method);
        let methodCallStr = $contract.formatCallFromAbi(abi, params);
        let title = `${contract.constructor.name}.${methodCallStr}`

        let tx = await this.execute({
            title,
            sender,
            to: txData.to,
            data: txData.data,
        });
        return tx;
    }

    @memd.deco.queued()
    async schedule (params: ITimelockTxParams) {

        let txParams = await this.getTxParamsNormalized(params);
        let salt = this.getOperationSalt(txParams);
        let key = this.getOperationKey(txParams);
        let pendingTx = await this.getPendingByKey(key);
        $require.eq(pendingTx?.key, null, `Operation is already scheduled`);

        let delay = params.delay ?? await this.getMinDelay();
        let timelock = this.timelock;

        let tx  = await timelock.$receipt().schedule(
            txParams.sender,
            txParams.to,
            txParams.value,
            txParams.data,
            txParams.predecessor,
            salt,
            txParams.delay,
        );

        let block = await this.timelock.client.getBlock(tx.receipt.blockNumber);

        await this.store.upsert({
            id: salt,
            key: key,
            salt: salt,
            title: txParams.title,
            to: txParams.to,
            data: txParams.data,
            value: $hex.ensure(txParams.value),

            createdAt: block.timestamp,
            validAt: block.timestamp + Number(delay),

            status: 'pending',
            txSchedule: tx.receipt.transactionHash
        });
        return tx;
    }

    async execute (params: ITimelockTxParams) {
        let txParams = await this.getTxParamsNormalized(params);
        let key = this.getOperationKey(txParams);
        let pendingTx = await this.getPendingByKey(key);
        $require.notNull(pendingTx, `Tx not scheduled: ${ params.to } ${ params.data }`);

        $require.gt(
            $date.toUnixTimestamp()
            , pendingTx.validAt
            , `Tx not valid yet. Scheduled for ${ $date.fromUnixTimestamp(pendingTx.validAt).toISOString() }`
        );
        let timelock = this.timelock;
        let salt = pendingTx.salt;
        let id = this.getOperationHash({ ...txParams, salt });

        let tx = await timelock.$receipt().execute(
            txParams.sender,
            txParams.to,
            txParams.value,
            txParams.data,
            txParams.predecessor,
            salt
        );
        await this.store.upsert({
            id,
            status: 'completed',
            txExecute: tx.receipt.transactionHash,
        });
        return tx;
    }

    public async clearStorage () {
        await this.store.saveAll([]);
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
        to: TAddress,
        value: bigint,
        data: TEth.Hex,
        predecessor: TEth.Hex,
        salt: TEth.Hex,
    }): TEth.Hex{
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
        to: TAddress,
        value: bigint,
        data: TEth.Hex,
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
        to: TAddress
        value: bigint
        data: TEth.Hex
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
        let all = await this.store.getAll();
        return all.find(x => x.key === key && x.status === 'pending');
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
}


// type TWriteMethods<T extends ContractBase> = {
//     [P in keyof T]: T[P] extends ((sender: IAccount, ...args) => (Promise<TxWriter>)) ? P : never;
// };

// type NoneMethodKeys<T> = {
//     [P in keyof T]: T[P] extends ((sender: IAccount, ...args) => (Promise<TxWriter>)) ? P : never;
// }[keyof T];
//type TWriteMethods<T> = Omit<T, Exclude<keyof T, NoneMethodKeys<T>>>;

// type MethodKeys<T> = {
//     [P in keyof T]: T[P] extends ((sender: IAccount, ...args) => (Promise<TxWriter>)) ? P : never;
// };
// type TWriteMethods<T> = Omit<T, Exclude<keyof T, keyof MethodKeys<T>>>;

let foo = {
    name () {
        return 1;
    },
    bob: 1
};


type WriteMethodKeys<T> = {
    [P in keyof T]: T[P] extends ((sender: IAccount, ...args) => (Promise<TxWriter>)) ? P : never;
}[keyof T];

