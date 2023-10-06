import di from 'a-di';

import { ChainAccount, SafeAccount, TAccount } from "@dequanto/models/TAccount";
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IToken } from '@dequanto/models/IToken';
import { TAddress } from '@dequanto/models/TAddress';
import { TxDataBuilder } from '@dequanto/txs/TxDataBuilder';
import { ITxWriterOptions, TxWriter } from '@dequanto/txs/TxWriter';
import { $bigint } from '@dequanto/utils/$bigint';
import { $is } from '@dequanto/utils/$is';
import { TokensService } from './TokensService';
import { $address } from '@dequanto/utils/$address';
import { ITxConfig } from '@dequanto/txs/ITxConfig';
import { $promise } from '@dequanto/utils/$promise';
import { LoggerService } from '@dequanto/loggers/LoggerService';
import { $logger } from '@dequanto/utils/$logger';
import { $account } from '@dequanto/utils/$account';
import { TEth } from '@dequanto/models/TEth';


export class TokenTransferService {

    private gasPriorityFee?: number
    private builderConfig: ITxConfig
    private writerConfig: ITxWriterOptions
    private tokenService = di.resolve(TokensService, this.client.platform)

    constructor (public client: Web3Client, private logger = di.resolve(LoggerService)) {

    }

    $config (builderConfig: ITxConfig): this {
        this.builderConfig = builderConfig;
        return this;
    }

    $configWriter (writerConfig: ITxWriterOptions): this {
        this.writerConfig = writerConfig;
        return this;
    }


    async getBalance(address: TAddress, token: string | IToken): Promise<bigint> {
        token = await this.getToken(token);
        let isNative = this.tokenService.isNative(token.address);
        if (isNative) {
            return this.client.getBalance(address);
        }

        let erc20 = await TokensService.erc20(token, this.client.platform);
        let balance = await erc20.balanceOf(address);
        return balance;
    }
    async getReceived(receipt: TEth.TxReceipt): Promise<bigint> {
        let receiver = receipt.from;
        let ANYTOKEN = 'USDC';
        let erc20 = await TokensService.erc20(ANYTOKEN, this.client.platform);
        let transfers = erc20.extractLogsTransfer(receipt)
        let transfer = transfers.find(x => $address.eq(x.params.to, receiver));
        return transfer?.params.value ?? 0n;
    }

    /** Returns NULL for transaction, if no balance to transfer */
    async transferAll (from: ChainAccount, to: TAddress, token: string | IToken) : Promise<TxWriter> {
        token = await this.getToken(token);

        let isNative = this.tokenService.isNative(token.address);
        if (isNative) {
            return this.transferNativeAll(from, to);
        }
        return this.transferErc20All(from, to, token);
    }
    async transferAllWithRemainder (from: ChainAccount, to: TAddress, token: string | IToken, remainder: number | bigint) : Promise<TxWriter> {
        token = await this.getToken(token);

        let isNative = this.tokenService.isNative(token.address);
        if (isNative) {
            return this.transferNativeAll(from, to, { remainder });
        }
        return this.transferErc20All(from, to, token, { remainder });
    }
    async transfer (from: TAccount, to: TAddress, token: string | IToken, amount: number | bigint) : Promise<TxWriter> {
        token = await this.getToken(token);
        amount = this.getAmount(amount, token);

        let isNative = this.tokenService.isNative(token.address);
        if (isNative) {
            return this.transferNative(from, to, amount);
        }
        return this.transferErc20(from, to, token, amount);
    }

    async getToken (token: string | IToken): Promise<IToken> {
        if (typeof token === 'string') {
            token = await this.tokenService.getKnownToken(token);
        }
        $is.notNull(token, 'Token is undefined to transfer');
        return token;
    }
    isNativeToken (token: string | IToken): boolean {
        return this.tokenService.isNative(typeof token === 'string' ? token : token.address);
    }

    private async transferNativeAll (from: ChainAccount, to: TAddress, opts?: { remainder: number | bigint }): Promise<TxWriter> {
        let buildTxRetries = 1;

        const buildTx = async () => {
            let GAS = 21000;
            let GAS_RATIO = 1.05;
            let [ balance, gasPrice] = await Promise.all([
                this.client.getBalance(from.address),
                this.client.getGasPrice()
            ]);
            if (opts?.remainder != null) {
                let remainder = this.getAmount(opts.remainder, 18);
                balance -= remainder;
            }

            let $gasPrice = $bigint.multWithFloat(gasPrice.price, GAS_RATIO);
            $logger.log(`GasPrice ${ $bigint.toGweiFromWei($gasPrice) }gwei`);

            let gasConsumed = BigInt(GAS) * $gasPrice;
            let transferValue = balance - gasConsumed;
            if (transferValue <= 0) {
                if (--buildTxRetries > -1) {
                    $logger.log(`No balance to transfer. Retry in 5s`);
                    await $promise.wait(5000);
                    return buildTx();
                }
                // No balance to transfer
                $logger.log(`No balance to transfer in ${from.address}. ${ opts?.remainder ? ("Remainder: " + opts?.remainder) : ""}`);
                return null;
            }

            let txBuilder = new TxDataBuilder(this.client, from, {
                to: to,
                value: $bigint.toHex(transferValue)
            });

            txBuilder.data.gasPrice = $bigint.toHex($gasPrice);

            // txBuilder.data.maxFeePerGas = $bigint.toHex($gasPrice - 20n**9n);
            // txBuilder.data.maxPriorityFeePerGas = $bigint.toHex(20n**9n);
            txBuilder.data.gasLimit = GAS;
            txBuilder.data.type = 1;

            txBuilder.setConfig(this.builderConfig);

            await Promise.all([
                txBuilder.setNonce({ overriding: true }),
            ]);

            $logger.log(`TransferNative ALL. Balance ${balance}; GasConsumed ${gasConsumed}; TransferValue ${transferValue}; Nonce: ${txBuilder.data.nonce}`);
            return txBuilder;
        }
        let txBuilder = await buildTx();
        return TxWriter.write(this.client, txBuilder, from, {
            ...(this.writerConfig ?? {}),
            retries: 3,
            async onErrorRebuild (tx, error, errCount) {
                // In case we got `balance` value, but that one was outdated, then all our calculations where wrong.
                // Retry the calculation and transfer once again.
                if (/insufficient funds/.test(error.message)) {
                    const ms = 6000 * errCount;
                    $logger.log(`TokenTransfer Failed: insufficient funds. Waiting ${ms}ms to retry`);
                    await $promise.wait(ms);
                    return buildTx();
                }
                return null;
            }
        });
    }
    private async transferNative (from: TAccount, to: TAddress, amount: bigint): Promise<TxWriter> {
        let sender = $account.getSender(from);

        let txBuilder = new TxDataBuilder(this.client, sender, {
            to: to,
            value: $bigint.toHex(amount)
        });

        if (sender.address) {
            await Promise.all([
                txBuilder.setGas({ priceRatio: this.gasPriorityFee, gasEstimation: true, gasLimitRatio: 1, }),
                txBuilder.setNonce(),
            ]);
        }


        txBuilder.setConfig(this.builderConfig);
        return TxWriter.write(this.client, txBuilder, from, this.writerConfig);
    }

    private async transferErc20All (from: ChainAccount, to: TAddress, token: IToken, opts?: { remainder?: number | bigint, retryCount?: number }): Promise<TxWriter> {
        let erc20 = await TokensService.erc20(token, this.client.platform);
        let balance = await erc20.balanceOf(from.address);
        if (opts?.remainder != null) {
            let remainder = this.getAmount(opts.remainder, 18);
            balance -= remainder;
        }
        if (balance <= 0n) {
            if (opts?.retryCount == null || opts?.retryCount !== 0) {
                // re-read
                this.logger.warn(`TransferErc20All has no balance to transfer: ${token.address}. Balance re-fetch scheduled.`);
                await $promise.wait(4000);
                return this.transferErc20All(from, to, token, {
                    ...(opts ?? {}),
                    retryCount: 0
                });
            }
            if (this.builderConfig.gasFunding == null) {
                return null;
            }
        }
        return erc20
            .$config(this.builderConfig, this.writerConfig)
            .transfer(from, to, balance);
    }
    private async transferErc20 (from: TAccount, to: TAddress, token: IToken, amount: bigint): Promise<TxWriter> {
        let erc20 = await TokensService.erc20(token, this.client.platform);
        return erc20
            .$config(this.builderConfig, this.writerConfig)
            .transfer(from, to, amount);
    }
    private getAmount (amount: number | bigint, token: IToken): bigint
    private getAmount (amount: number | bigint, decimals: number): bigint
    private getAmount (amount: number | bigint, mix: number | IToken): bigint {
        if (typeof amount === 'number') {
            amount = $bigint.toWei(amount, typeof mix === 'number' ? mix : mix.decimals);
        }
        return amount;
    }
}
