
export namespace TEth {
    export type Hex = `0x${string}`
    export type Address = `0x${string}`
    export type BufferLike = Hex | Uint8Array

    export interface Block<TxType extends Hex | Partial<TxSigned> = Hex | Partial<TxSigned>> {
        hash: Hex
        parentHash: Hex
        sha3Uncles: Hex
        miner: Address
        stateRoot: Hex
        transactionsRoot: Hex
        receiptsRoot: Hex
        logsBloom: Hex
        difficulty: bigint
        number: number
        gasLimit: bigint
        gasUsed: bigint
        timestamp: number
        extraData: Hex
        mixHash: Hex
        nonce: Hex
        totalDifficulty: bigint
        baseFeePerGas: bigint
        withdrawalsRoot: Hex
        size: bigint
        transactions: TxType[]
        /* Withdrawals */
        withdrawals: {
            index: bigint
            validatorIndex: bigint
            address: Address
            amount: bigint
        }[]
        /* Uncles */
        uncles: Hex[]
    }

    export interface Tx {
        type?: 0 | 1 | 2 | number

        hash?: Hex
        blockNumber?: number

        nonce: bigint
        to?: Address
        from?: Address
        gas?: bigint
        value?: bigint

        input?: Hex
        data?: Hex

        gasPrice?: bigint
        maxPriorityFeePerGas?: bigint
        maxFeePerGas?: bigint
        accessList?: AccessListItem[]
        chainId: number
    }
    export type TxLike = DataLike<Tx>

    export interface TxSigned extends Tx {
        yParity?: number
        v?: number
        r: Hex
        s: Hex
    }

    export interface TxReceipt {
        status: 0 | 1 | number
        transactionHash: Hex
        transactionIndex: bigint
        blockHash: Hex
        blockNumber: number
        from: Address
        to: Address
        contractAddress?: Address
        cumulativeGasUsed: bigint
        gasUsed: bigint
        effectiveGasPrice: bigint
        logs: Log[]
        logsBloom: Hex
        events?: {
            [eventName: string]: EventLog
        }
    }

    export interface EventLog {
        event: string
        address: Address
        returnValues: any
        logIndex: number
        transactionIndex: number
        transactionHash: Hex
        blockHash: Hex
        blockNumber: number
        raw?: {
            data: string
            topics: any[]
        }
    }

    export interface Log {
        address: Address
        data: Hex
        topics: Hex[]
        logIndex: number
        transactionIndex: number
        transactionHash: Hex
        blockHash: Hex
        blockNumber: number
    }

    export interface AccessListItem {
        address: Address
        storageKeys: Hex[]
    }


    export type Platform = 'eth'
        | 'eth:goerli'
        | 'bsc'
        | 'polygon'
        | 'arbitrum'
        | 'xdai'
        | 'boba'
        | 'hardhat'
        | 'optimism'
        | 'avalanche'
        | string;


    export interface IAccount {
        type?: 'eoa' | 'safe' | 'erc4337'
        name?: string
        address?: Address
        platform?: Platform
    }


    export interface ChainAccount extends IAccount {
        type?: 'eoa'
        key?: Hex;
    }

    export interface SafeAccount extends IAccount {
        type: 'safe'
        provider?: 'gnosis',

        /**
         * @deprecated backcomp. Use `address` prop
         */
        safeAddress?: Address

        operator: ChainAccount
    }

    export interface Erc4337Account extends IAccount {
        type: 'erc4337'
        provider?: 'default' | string,

        operator: ChainAccount
    }

    export type DataLike <T> = {
        [P in keyof T]?: T[P] extends bigint
            ? bigint | number | string | TEth.Hex
            : ( T[P] extends number
                ? number | TEth.Hex
                : (T[P] extends []
                    ? DataLike<T[P][0]>[]
                    : DataLike<T[P]>
                )
            );
    }

    export namespace Abi {
        export type Type = 'function' | 'constructor' | 'event' | 'fallback';
        export type StateMutabilityType = 'pure' | 'view' | 'nonpayable' | 'payable';

        export interface Item {
            anonymous?: boolean;
            constant?: boolean;
            inputs?: Input[];
            name?: string;
            outputs?: Output[];
            payable?: boolean;
            stateMutability?: StateMutabilityType;
            type: Type;
            gas?: number;

            signature?: string
        }

        export interface Input {
            name: string;
            type: string;
            indexed?: boolean;
            components?: Input[];
            internalType?: string;
        }

        export interface Output {
            name: string;
            type: string;
            components?: Output[];
            internalType?: string;
        }
    }



}

