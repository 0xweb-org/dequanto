import di from 'a-di';
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client';
import { type AbiItem } from 'web3-utils';
import { ITxWriterOptions, TxWriter } from '@dequanto/txs/TxWriter';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TxDataBuilder } from '@dequanto/txs/TxDataBuilder';
import { TAddress } from '@dequanto/models/TAddress';
import { $abiParser } from '../utils/$abiParser';
import { ChainAccount, SafeAccount, TAccount } from "@dequanto/models/TAccount";
import { ITxConfig } from '@dequanto/txs/ITxConfig';
import { $logger } from '@dequanto/utils/$logger';
import { $class } from '@dequanto/utils/$class';
import { ChainAccountsService } from '@dequanto/ChainAccountsService';
import { $account } from '@dequanto/utils/$account';

interface IChainAccountSender extends ChainAccount {
    value?: number | string | bigint
}


export interface IContractWriter {
    writeAsync<T = any>(eoa: { address?: string, key: string }, methodAbi: string | AbiItem, ...params: any[]): Promise<TxWriter>
}

export class ContractWriter implements IContractWriter {

    protected builderConfig?: ITxConfig;
    protected writerConfig?: ITxWriterOptions;


    constructor(public address: TAddress, public client: Web3Client = di.resolve(EthWeb3Client)) {

    }

    $config(builderConfig?: ITxConfig, writerConfig?: ITxWriterOptions): this {
        return $class.curry(this, {
            builderConfig: builderConfig ?? this.builderConfig,
            writerConfig: writerConfig ?? this.writerConfig,
        });
    }

    /**
    * We split Tx sending in two awaitable steps
    * 1. This method prepairs(gas, nonce, etc) - and sends the Tx
    * 2. With returned writer you can subscribe to events and/or wait for Tx to be mined
    * @param account
    * @param interfaceAbi
    * @param params
    * @param configs
    * @returns {TxWriter}
     */
    async writeAsync<T = any>(
        account: TAccount & {  value?: number | string | bigint },
        interfaceAbi: string | AbiItem,
        params: any[],
        configs?: {
            builderConfig?: ITxConfig
            writerConfig?: ITxWriterOptions
        }
    ): Promise<TxWriter> {


        let value = typeof account !== 'string'
            ? account.value
            : null;

        let isSafe = $account.isSafe(account);
        let sender = $account.getSender(account);
        // if (sender.key == null) {
        //     let addressOrName = sender.address ?? sender.name;
        //     let service = di.resolve(ChainAccountsService);
        //     let fromStorage = await service.get(addressOrName, this.client.platform);
        //     if (fromStorage) {
        //         account = fromStorage;
        //     }
        // }

        let txBuilder = new TxDataBuilder(this.client, sender, {
            to: this.address
        });

        let abi = typeof interfaceAbi === 'string'
            ? $abiParser.parseMethod(interfaceAbi)
            : interfaceAbi;

        let builderConfig: ITxConfig = {
            ...(this.builderConfig ?? {}),
            ...(configs?.builderConfig ?? {}),
        };

        txBuilder.setConfig(builderConfig);
        txBuilder.setValue(value);
        txBuilder.setInputDataWithABI(abi, ...params);

        if (isSafe !== true) {
            await Promise.all([
                txBuilder.setGas({
                    price: builderConfig.gasPrice,
                    priceRatio: builderConfig.gasPriceRatio,
                    gasLimit: builderConfig.gasLimit,
                    gasLimitRatio: builderConfig.gasLimitRatio,
                    gasEstimation: builderConfig.gasEstimation,
                    from: builderConfig.from ?? sender.address,
                    type: builderConfig.type ?? null,
                }),
                txBuilder.setNonce({
                    nonce: builderConfig.nonce,
                    noncePending: builderConfig.noncePending,
                }),
            ]);
        }

        let writer = TxWriter.write(
            this.client,
            txBuilder,
            account,
            configs?.writerConfig ?? this.writerConfig
        );

        writer.on('log', message => {
            $logger.log(`TxContract ${abi.name}; ${message}`);
        });
        return writer;
    }
}

