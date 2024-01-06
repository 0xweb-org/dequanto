import { type TAbiItem } from '@dequanto/types/TAbi';
import { File } from 'atma-io';
import type { TAccount } from "@dequanto/models/TAccount";
import type { Web3Client } from '@dequanto/clients/Web3Client';
import type { TAddress } from '@dequanto/models/TAddress';
import { $account } from '@dequanto/utils/$account';
import { $bigint } from '@dequanto/utils/$bigint';
import { ITxBuilderNonceOptions, ITxBuilderOptions } from './ITxBuilderOptions';
import { $number } from '@dequanto/utils/$number';
import { TEth } from '@dequanto/models/TEth';
import { $sig } from '@dequanto/utils/$sig';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { $hex } from '@dequanto/utils/$hex';
import { $contract } from '@dequanto/utils/$contract';
import { TxNonceManager } from './TxNonceManager';

export class TxDataBuilder {

    public abi: TAbiItem[] = null;

    constructor(
        public client: Web3Client,
        public account: { address?: TAddress },
        public data: TEth.TxLike,
        public config: ITxBuilderOptions = null,
    ) {
        this.data ??= {};
        this.data.value = this.data.value ?? 0;
        this.data.chainId = client.chainId;
        this.abi = config?.abi;
    }

    setInputDataWithABI(abi: string | TAbiItem, ...params): this {
        try {
            this.data.data = $abiUtils.serializeMethodCallData(abi, params);;
        } catch (error) {
            error.message = `${JSON.stringify(abi)}\n${error.message}`;
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

    setConfig (config: ITxBuilderOptions): this {
        this.config = config;
        return this;
    }

    async ensureNonce (options?: ITxBuilderNonceOptions) {
        if (this.data.nonce != null) {
            // was already set
            return;
        }
        await this.setNonce(options);
    }

    async setNonce(local?: ITxBuilderNonceOptions) {

        let opts = {
            ...(this.config ?? {}),
            ...(local ?? {})
        };

        let nonce: bigint;
        if (opts.nonce != null) {
            if (typeof opts.nonce === 'number' || typeof opts.nonce === 'bigint') {
                nonce = BigInt(opts.nonce)
            } else if (opts.nonce instanceof TxNonceManager) {
                nonce = await opts.nonce.pickNonce(this.client);
            } else {
                console.error(opts.nonce);
                throw new Error(`Invalid nonce ${typeof opts.nonce}`);
            }
        } else if (opts.overriding) {
            nonce = await this.client.getTransactionCount(this.account.address);
            // override first pending TX:
        } else if (opts.noncePending != null) {
            let pendingIndex = BigInt(opts.noncePending) - 1n;
            let submitted = await this.client.getTransactionCount(this.account.address);
            let next = pendingIndex;
            if (next > 0) {
                let total = await this.client.getTransactionCount(this.account.address, 'pending');
                let pendingCount = total - submitted;
                if (pendingCount > 0n && next > pendingCount - 1n) {
                    next = pendingCount - 1n;
                }
            }
            nonce = submitted + next;
        } else {
            nonce = await TxNonceManager.loadNonce(this.client, this.account.address);

        }
        this.data.nonce = Number(nonce);
    }

    async ensureGas () {
        if (this.data.gasPrice == null && this.data.maxFeePerGas == null) {
            await this.setGas();
        }
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
        type?: 0 | 1 | 2

    } = {}): Promise<this> {

        let [ gasPrice, gasUsage ] = await Promise.all([
            price != null ?
                { price, base: price, priority: 10n**9n }
                : this.client.getGasPrice(),
            gasEstimation == null || gasEstimation === true
                ? this.getGasEstimation(from ?? this.account.address)
                : (gasLimit ?? this.client.defaultGasLimit ?? 2_000_000)
        ]);

        let hasPriceRatio = priceRatio != null;
        let hasPriceFixed = price != null;
        let $priceRatio = 1;
        if (hasPriceRatio) {
            $priceRatio = priceRatio;
        } else if (hasPriceFixed === false) {
            $priceRatio = this.client.defaultGasPriceRatio;
        }

        type ??= this.client.defaultTxType;

        if (type === 0 || type === 1) {
            let $baseFee = $bigint.multWithFloat(gasPrice.price, $priceRatio);
            this.data.gasPrice = $bigint.toHex($baseFee);
            this.data.type = type;
        } else {
            let $baseFee = $bigint.multWithFloat(gasPrice.base ?? gasPrice.price, $priceRatio);
            let $priorityFee = gasPrice.priority;
            if ($priorityFee == null) {
                $priorityFee = await this.client.getGasPriorityFee();
                $priorityFee = $bigint.multWithFloat($priorityFee, $priceRatio);
            }

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
        this.data.gas = gasLimit ?? Math.floor(Number(gasUsage) * $gasLimitRatio);

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
        let txData = {
            ...this.data,
            from: this.account?.address ?? void 0,
            chainId: $number.toHex(this.data.chainId ?? client?.chainId ?? this.client?.chainId),
        };
        for (let key in txData) {
            if (key === 'type') {
                continue;
            }
            txData[key] = $hex.ensure(txData[key]);
        }
        return txData as TEth.TxLike;
    }


    /** Returns raw signed transaction  */
    async signToString(privateKey: TEth.EoAccount['key']): Promise<TEth.Hex> {

        let address = await $sig.$account.getAddressFromKey(privateKey);
        let rpc = await this.client.getRpc();
        let txSig = await $sig.signTx(this.data, { address, key: privateKey }, rpc);
        return txSig;
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

    private async getGasEstimation (from: TAddress) {
        try {
            return await this.client.getGasEstimation(from, this.data)
        } catch (error) {
            let message = error.message;
            if (error.data?.type != null) {
                let data = error.data;
                if (error.data.type === `Unknown` && error.data.params) {
                    let parsed = $contract.parseInputData(error.data.params, this.abi ?? $contract.store.getFlattened());
                    if (parsed) {
                        data = parsed;
                    }
                }
                message += `\nError: ` + $contract.formatCall(data);
            }

            let parsed = $contract.parseInputData(this.data.data, this.abi ?? $contract.store.getFlattened());
            if (parsed) {
                message += `\nMethod: ` + $contract.formatCall(parsed);
            }
            throw new Error(message);
        }
    }

    static fromJSON (client: Web3Client, account: TAccount, json: {
        config: ITxBuilderOptions,
        tx: TEth.TxLike,
    }) {

        let sender = $account.getSender(account);
        return new TxDataBuilder(
            client,
            sender,
            json.tx,
            json.config
        );
    }

    static normalize(data: Partial<TEth.TxLike>) {
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
