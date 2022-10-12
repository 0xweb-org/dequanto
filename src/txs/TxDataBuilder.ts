import { IAccount, TAccount } from "@dequanto/models/TAccount";
import { Web3Client } from '@dequanto/clients/Web3Client';
import { InputDataUtils } from '@dequanto/contracts/utils/InputDataUtils';
import { TAddress } from '@dequanto/models/TAddress';
import { $account } from '@dequanto/utils/$account';
import { $bigint } from '@dequanto/utils/$bigint';
import { type TransactionRequest } from '@ethersproject/abstract-provider';
import { type TransactionConfig } from 'web3-core';
import { type AbiItem } from 'web3-utils';
import { ITxConfig } from './ITxConfig';
import { File } from 'atma-io';

export class TxDataBuilder {
    protected static nonce: number = -1

    constructor(
        public client: Web3Client,
        public account: { address?: TAddress },
        public data: Partial<TransactionRequest>,
        public config: ITxConfig = null,
    ) {
        this.data ??= {};
        this.data.value = this.data.value ?? 0;
        this.data.chainId = client.chainId;
    }

    setInputDataWithTypes(types: any[], paramaters: any[]): this {
        this.data.data = InputDataUtils.encodeWithTypes(this.client, types, paramaters);
        return this;
    }
    setInputDataWithABI(IFunctionABI: string | AbiItem, ...params): this {
        try {
            this.data.data = InputDataUtils.encodeWithABI(IFunctionABI, ...params);
        } catch (error) {
            error.message = `${JSON.stringify(IFunctionABI)}\n${error.message}`;
            throw error;
        }
        return this;
    }

    setValue(value: number | string | bigint): this {
        if (value == null) {
            return this;
        }
        if (typeof value === 'number') {
            value = $bigint.toWei(value);
        }
        if (typeof value === 'bigint') {
            this.data.value = `0x${value.toString(16)}`;
            return this;
        }
        this.data.value = value;
        return this;
    }

    setConfig (config: ITxConfig): this {
        this.config = config;
        return this;
    }

    async setNonce(opts?: {
        // sets the nonce of the first tx in pending state
        overriding?: boolean
        // set the nonce of the N-th tx in pending state
        noncePending?: number
        // custom nonce value
        nonce?: number
    }) {
        let nonce: number;
        if (opts?.nonce != null) {
            nonce = opts.nonce
        } else if (opts?.overriding) {
            nonce = await this.client.getTransactionCount(this.account.address);
            // override first pending TX:
        } else if (opts?.noncePending != null) {
            let pendingIndex = opts.noncePending - 1;
            let submited = await this.client.getTransactionCount(this.account.address);
            let next = pendingIndex;
            if (next > 0) {
                let total = await this.client.getTransactionCount(this.account.address, 'pending');
                let pendingCount = total - submited;
                if (pendingCount > 0 && next > pendingCount - 1) {
                    next = pendingCount - 1;
                }
            }
            nonce = submited + next;
        } else {
            nonce = await this.client.getTransactionCount(this.account.address, 'pending');
        }
        this.data.nonce = nonce;
    }

    async setGas({
        price,
        priceRatio,
        gasLimitRatio,
        gasLimit,
        gasEstimation,
        from,
        type,
    }: {
        price?: bigint
        priceRatio?: number

        gasLimitRatio?: number
        gasLimit?: string | number
        gasEstimation?: boolean
        from?: TAddress
        type?: 1 | 2

    } = {}): Promise<this> {

        let [ gasPrice, gasUsage ] = await Promise.all([
            price != null ?
                { price, base: price, priority: 10n**9n }
                : this.client.getGasPrice(),
            gasEstimation
                ? this.client.getGasEstimation(from ?? this.account.address, this.data)
                : (gasLimit ?? this.client.defaultGasLimit ?? 2_000_000)
        ]);

        let hasPriceRatio = priceRatio != null;
        let hasPriceFixed = price != null;
        let $priceRatio = 1;
        if (hasPriceRatio) {
            $priceRatio = priceRatio;
        } else if (hasPriceFixed === false) {
            $priceRatio = 1.4;
        }

        type ??= this.client.defaultTxType;

        if (type === 1) {
            let $baseFee = $bigint.multWithFloat(gasPrice.price, $priceRatio);
            this.data.gasPrice = $bigint.toHex($baseFee);
        } else {
            let $baseFee = $bigint.multWithFloat(gasPrice.base ?? gasPrice.price, $priceRatio);
            let $priorityFee = gasPrice.priority ?? 10n**9n;

            this.data.maxFeePerGas = $bigint.toHex($baseFee + $priorityFee);
            this.data.maxPriorityFeePerGas = $bigint.toHex($priorityFee);
            this.data.type = 2;
        }

        let hasLimitRatio = gasLimitRatio != null;
        let hasLimitFixed = gasLimit != null;
        let $gasLimitRatio = 1;
        if (hasLimitRatio) {
            $gasLimitRatio = gasLimitRatio;
        } else if (hasLimitFixed === false) {
            $gasLimitRatio = 1.5;
        }
        this.data.gasLimit = gasLimit ?? Math.floor(Number(gasUsage) * $gasLimitRatio);

        return this;
    }

    increaseGas (ratio: number) {
        let { gasPrice, maxFeePerGas } = this.data;
        if (gasPrice != null) {
            let price = BigInt(gasPrice as any);
            let priceNew = $bigint.multWithFloat(price, ratio);
            this.data.gasPrice = $bigint.toHex(priceNew);
            return;
        }

        if (maxFeePerGas != null) {
            let price = BigInt(maxFeePerGas as any);
            let priceNew = $bigint.multWithFloat(price, ratio);
            this.data.maxFeePerGas = $bigint.toHex(priceNew);
            return;
        }

        throw new Error(`Not possible to increase the gas price, the price not set yet`);
    }

    getTxData (client?: Web3Client) {
        return <TransactionConfig> <any> {
            ...this.data,

            from: this.account?.address ?? void 0,
            chainId: this.data.chainId ?? client?.chainId ?? this.client?.chainId,
        };
    }


    /** Returns base64 string of the Tx Data */
    async signToString(privateKey: string): Promise<string> {
        if (privateKey.startsWith('0x')) {
            privateKey = privateKey.substring(2);
        }
        return this.client.sign(this.data, privateKey);
    }

    toJSON () {
        return {
            account: {
                address: this.account?.address,
            },
            tx: this.data,
            config: this.config,
        };
    }

    async save (path: string, additionalProperties?) {
        let json = this.toJSON();
        await File.writeAsync(path, {
            ...json,
            ...(additionalProperties ?? {})
        });
    }

    static fromJSON (client: Web3Client, account: TAccount, json: {
        config: ITxConfig,
        tx: TransactionRequest,
    }) {

        let sender = $account.getSender(account);
        return new TxDataBuilder(
            client,
            sender,
            json.tx,
            json.config
        );
    }

    static normalize(data: Partial<TransactionRequest>) {
        for (let key in data) {
            let v = data[key];
            if (typeof v === 'string' && /^\d+$/.test(v)) {
                data[key] = BigInt(v);
            }
        }
        return data;
    }

    static getGasPrice (builder: TxDataBuilder): bigint {
        let { gasPrice, maxFeePerGas, maxPriorityFeePerGas } = builder.data;
        if (gasPrice != null) {
            return BigInt(gasPrice as any);
        }
        if (maxFeePerGas != null) {
            return BigInt(maxFeePerGas as any) + BigInt(<any> maxPriorityFeePerGas ?? 0);
        }
        return null;
    }



}
