import { Web3Client } from '@dequanto/clients/Web3Client';
import { IErc4337Info } from './models/IErc4337Info';
import type { TransactionConfig } from 'web3-core';
import { ChainAccount, Erc4337Account } from '@dequanto/models/TAccount';
import { Erc4337Service } from './Erc4337Service';
import { $require } from '@dequanto/utils/$require';
import { UserOperation } from './models/UserOperation';

export class Erc4337TxWriter {
    private service = new Erc4337Service(this.client, this.info);

    constructor(public client: Web3Client, public info: IErc4337Info) {

    }

    async getAccount (owner: ChainAccount) {
        let service = this.service;
        let { initCode, initCodeGas } = await service.prepareAccountCreation(owner.address);
        let senderAddress = await service.getAccountAddress(owner.address, initCode);
        return <Erc4337Account> {
            address: senderAddress,
            type: 'erc4337',
            provider: 'erc4337',
            operator: owner
        };
    }

    async submitUserOpViaEntryPoint(params: {
        tx: TransactionConfig,
        owner: ChainAccount,
        submitter?: ChainAccount,
    }) {
        let { tx, owner, submitter } = params
        let service = this.service;

        // 1. Prepare ERC4337 contract account via Account Factory
        let { initCode, initCodeGas } = await service.prepareAccountCreation(owner.address);
        let senderAddress = await service.getAccountAddress(owner.address, initCode);
        let senderExists = await service.existsAccount(senderAddress);
        if (senderExists) {
            initCode = '0x';
            initCodeGas = 0;
        }

        // 2. Prepare Target (Demo) contract transaction data
        let callData = tx.data;
        let callGas = await this.client.getGasEstimation(senderAddress, tx);

        // 3. Prepare contract account execution method
        $require.Address(tx.to);
        let { callData: accountCallData } = await service.prepareAccountCallData(
            tx.to,
            0n,
            callData
        );

        let gasPrice = await this.client.getGasPrice();
        let nonce = await service.getNonce(senderAddress, 0n);
        let { op, opHash } = await service.getSignedUserOp(<Partial<UserOperation>>{
            sender: senderAddress,
            initCode: initCode,
            callData: accountCallData.data,
            callGasLimit: BigInt(callGas),
            verificationGasLimit: 150000n + BigInt(initCodeGas),
            nonce: nonce,

            maxFeePerGas: gasPrice.price
        }, owner);

        let receipt = await service.submitUserOpViaEntryPoint(submitter, op);
        return { op, opHash, receipt };
    }
}
