import type { IAccount, IAccountTx, TAccount } from "@dequanto/models/TAccount";
import type { TAbiItem } from '@dequanto/types/TAbi';
import { $contract } from '@dequanto/utils/$contract';
import { ContractWriter } from '../ContractWriter';
import { TEth } from '@dequanto/models/TEth';
import { TxDataBuilder } from '@dequanto/txs/TxDataBuilder';
import { $promise } from '@dequanto/utils/$promise';


export namespace ContractBaseUtils {
    export function $getAbiItem(abi: TAbiItem[], type: 'event' | 'function' | 'string', name: string, argsCount?: number) {
        let arr = abi.filter(x => x.type === type && x.name === name);
        if (arr.length === 0) {
            throw new Error(`TAbiItem ${name} not found`);
        }
        if (arr.length === 1) {
            return arr[0];
        }
        if (argsCount == null) {
            throw new Error(`Found multiple TAbiItems for ${name}. Args count not specified to pick one`);
        }
        return arr.find(x => (x.inputs?.length ?? 0) === argsCount);
    }

    export async function $call(writer: ContractWriter,
        abi: string | TAbiItem,
        abiArr: TAbiItem[],
        account: TAccount & { value?: number | string | bigint; },
        ...params
    ): Promise<{ error?; result?; }> {
        let tx = await writer.writeAsync(account, abi, params, {
            builderConfig: {
                send: 'manual',
                gasEstimation: false,
                nonce: 0,
                ...(this.builderConfig ?? {})
            },
            writerConfig: this.writerConfig,
        });
        try {
            let result = await tx.call();
            return {
                result
            };
        } catch (error) {
            if (error.data) {
                error.data = $contract.decodeCustomError(error.data, abiArr);
            }
            return {
                error
            };
        }
    }
    export async function $gas(writer: ContractWriter,
        abi: string | TAbiItem,
        abiArr: TAbiItem[],
        account: IAccount & { value?: number | string | bigint; },
        ...params
    ): Promise<{ error?; gas?: bigint; price?: bigint; }> {

        let txBuilder = new TxDataBuilder(writer.client, account, {
            to: writer.address
        });

        txBuilder.setInputDataWithABI(abi, ...params);
        txBuilder.abi = abiArr;

        try {
            txBuilder = await txBuilder.setGas({
                gasEstimation: true,
                gasLimitRatio: 1,
            });
            return {
                gas: BigInt(txBuilder.data.gas),
                price: BigInt(txBuilder.data.gasPrice ?? txBuilder.data.maxFeePerGas),
            };
        } catch (error) {
            if (error.data) {
                error.data = $contract.decodeCustomError(error.data, abiArr);
            }
            return {
                error
            };
        }
    }

    export async function $signed(writer: ContractWriter,
        abi: string | TAbiItem,
        abiArr: TAbiItem[],
        account: IAccountTx,
        ...params
    ): Promise<{ error?; signed?: TEth.Hex; hash?: TEth.Hex; }> {

        writer = writer.$config(null, {
            signOnly: true
        });

        let tx = await writer.writeAsync(account, abi, params);
        let { error, result } = await $promise.caught(tx.onSigned);

        // get TransactionHash
        let hash = result != null ? $contract.keccak256(result) : null;
        return { error, signed: result, hash };
    }
}
