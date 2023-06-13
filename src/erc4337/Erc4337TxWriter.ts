import { Web3Client } from '@dequanto/clients/Web3Client';
import { IErc4337Info } from './models/IErc4337Info';
import type { TransactionConfig } from 'web3-core';
import { ChainAccount, Erc4337Account } from '@dequanto/models/TAccount';
import { Erc4337Service } from './Erc4337Service';
import { $require } from '@dequanto/utils/$require';
import { UserOperation } from './models/UserOperation';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';

export class Erc4337TxWriter {
    public service = new Erc4337Service(this.client, this.explorer, this.info);

    constructor(public client: Web3Client, public explorer: IBlockChainExplorer, public info: IErc4337Info) {

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

    async createAccount (params: {
        owner: ChainAccount,
        submitter?: ChainAccount,
    }) {
        let service = this.service;
        let { initCode, initCodeGas } = await service.prepareAccountCreation(params.owner.address);
        let senderAddress = await service.getAccountAddress(params.owner.address, initCode);
        let tx = <TransactionConfig> {
            to: senderAddress,
            value: 0,
            data: '0x'
        };
        return await this.submitUserOpViaEntryPoint({
            tx,
            ...params
        })
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

        let [ gasPrice, erc4337AccountBalance, nonce] = await Promise.all([
            this.client.getGasPrice(),
            this.client.getBalance(senderAddress),
            service.getNonce(senderAddress, 0n)
        ]);
        let maxFeePerGas = erc4337AccountBalance === 0n ? 0n : gasPrice.price;

        let { op, opHash } = await service.getSignedUserOp(<Partial<UserOperation>>{
            sender: senderAddress,
            initCode: initCode,
            callData: accountCallData.data,
            callGasLimit: BigInt(callGas),
            verificationGasLimit: 150000n + BigInt(initCodeGas),
            nonce: nonce,

            maxFeePerGas: maxFeePerGas,
            maxPriorityFeePerGas: 10n**9n,
        }, owner);

        let receipt = await service.submitUserOpViaEntryPoint(submitter, op);
        return { op, opHash, receipt };
    }
}
