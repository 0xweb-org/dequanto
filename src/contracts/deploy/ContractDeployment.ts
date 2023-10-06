import { $abiCoder } from '@dequanto/abi/$abiCoder';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IAccount } from '@dequanto/models/TAccount';
import { TEth } from '@dequanto/models/TEth';
import { TxDataBuilder } from '@dequanto/txs/TxDataBuilder';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { TAbiItem } from '@dequanto/types/TAbi';
import { $hex } from '@dequanto/utils/$hex';
import { $require } from '@dequanto/utils/$require';

export class ContractDeployment {

    constructor (private ctx: {
        client: Web3Client
        account: IAccount
        bytecode: TEth.Hex

        abi?: TAbiItem[]
        params?: any[]
    }) {

    }

    createTx (): TxWriter {
        let { account, abi, bytecode, params, client } = this.ctx;
        let ctorAbi = abi?.find(x => x.type === 'constructor');
        if (ctorAbi) {
            $require.eq(ctorAbi.inputs.length, params?.length);

            let encoded = $abiCoder.encode(ctorAbi.inputs, params);
            bytecode += $hex.raw(encoded);
        }
        let builder = new TxDataBuilder(client, account, {
            type: 2,
            data: bytecode
        })
        let tx = TxWriter.create(client, builder, account);
        return tx;
    }

    async deploy(): Promise<TEth.TxReceipt> {

        try {
            let tx = this.createTx().send();
            let receipt = await tx.wait();
            return receipt;

        } catch (error) {
            error.message = `Failed to deploy the contract: ${error.message}`;
            throw error;
        }

    }
}
