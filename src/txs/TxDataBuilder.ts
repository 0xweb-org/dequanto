import { ChainAccount } from '@dequanto/ChainAccounts';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { InputDataUtils } from '@dequanto/contracts/utils/InputDataUtils';
import { TAddress } from '@dequanto/models/TAddress';
import { $bigint } from '@dequanto/utils/$bigint';
import { FeeMarketEIP1559TxData, TxData } from '@ethereumjs/tx'
import { AbiItem } from 'web3-utils';
import { ITxConfig } from './ITxConfig';

export class TxDataBuilder {
    protected static nonce: number = -1

    constructor(
        public client: Web3Client,
        public account: { address?: TAddress, key: string },
        public data: Partial<Omit<FeeMarketEIP1559TxData, 'gasPrice'> & TxData>,
        public config: ITxConfig = null,
    ) {
        this.data.value = this.data.value ?? 0;
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
        overriding?: boolean
        noncePending?: number
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
        // let count = opts?.nonce ?? (
        //     opts?.overriding === true
        //     ? await this.client.getTransactionCount(this.account.address)
        //     : await this.client.getTransactionCount(this.account.address, 'pending')
        // );
        //let nonce = count;

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

        pricePriority?: bigint

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
                ? this.client.getGasEstimation(from, this.data)
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
            this.data.type = '0x02';
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
        let gasPrice = this.data.gasPrice as string;
        if (gasPrice == null) {
            throw new Error(`Not possible to increase the gas price, the price not set yet`);
        }
        let price = BigInt(this.data.gasPrice as string);
        let priceNew = $bigint.multWithFloat(price, ratio);
        this.data.gasPrice = $bigint.toHex(priceNew);
    }

    signToBuffer(privateKey: string) {
        return this.client.sign(this.data, privateKey);
    }

    signToString(privateKey: string) {
        if (privateKey.startsWith('0x')) {
            privateKey = privateKey.substring(2);
        }
        let buffer = this.signToBuffer(privateKey);
        return '0x' + buffer.toString('hex');
    }

    toJSON () {
        return {
            config: this.config,
            data: this.data,
        }
    }

    static fromJSON (client: Web3Client, account: ChainAccount, json: {
        config: ITxConfig,
        data: TxData,
    }) {
        return new TxDataBuilder(
            client,
            account,
            json.data,
            json.config
        );
    }

    static normalize(data: Partial<TxData>) {
        for (let key in data) {
            let v = data[key];
            if (typeof v === 'string' && /^\d+$/.test(v)) {
                data[key] = BigInt(v);
            }
        }
        return data;
    }
}
