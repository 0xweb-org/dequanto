import { EntryPoint } from '@dequanto-contracts/ERC4337/EntryPoint/EntryPoint';
import { SimpleAccount } from '@dequanto-contracts/ERC4337/SimpleAccount/SimpleAccount';
import { SimpleAccountFactory } from '@dequanto-contracts/ERC4337/SimpleAccountFactory/SimpleAccountFactory';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { TAddress } from '@dequanto/models/TAddress';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { $address } from '@dequanto/utils/$address';
import type { TransactionConfig } from 'web3-core';
import { UserOperation, UserOperationDefaults } from './models/UserOperation';
import { ChainAccount } from '@dequanto/models/TAccount';
import { $sign } from '@dequanto/utils/$sign';
import { obj_extendDefaults } from 'atma-utils';

export class Erc4337Service {


    private accountFactoryContract = new SimpleAccountFactory(this.info.addresses.accountFactory, this.client);
    private accountContract = new SimpleAccount(this.info.addresses.accountImplementation, this.client);
    private entryPointContract = new EntryPoint(this.info.addresses.entryPoint, this.client);

    constructor (public client: Web3Client, public info: {
        addresses: {
            entryPoint: TAddress
            accountFactory: TAddress
            accountImplementation: TAddress
        }
    }) {

    }

    async prepareAccountCreation (owner: TAddress, salt = 0n) {
        let { accountFactoryContract, entryPointContract } = this;

        let createAccountTx = await accountFactoryContract.$data().createAccount({ address: owner }, owner, salt);
        let initCode = $abiUtils.encodePacked(['address', 'bytes'], [ accountFactoryContract.address, createAccountTx.data ]);
        let initCodeGas = await this.client.getGasEstimation(entryPointContract.address, createAccountTx);

        return {
            initCode,
            initCodeGas
        };
    }

    async existsAccount (erc4337Account: TAddress) {
        let code = await this.client.getCode(erc4337Account);
        return code != null && code.length > 5;
    }

    async getAccountAddress (owner: TAddress, initCode: string) {
        let { error, result } = await this.entryPointContract.$call().getSenderAddress({ address: owner }, initCode);
        let senderAddress = error.data.params.sender;
        return senderAddress;
    }

    async prepareAccountCallData (targetAddress: TAddress, targetValue: bigint, targetCallData: string) {
        let accountCallData: TransactionConfig = await this.accountContract.$data().execute(
            { address: $address.ZERO},
            targetAddress,
            targetValue,
            targetCallData
        );
        // let accountCallGas = await this.client.getGasEstimation(entryPoint.address, accountCallData)
        return { callData: accountCallData }
    }

    async prepareCallData <
        TContract extends ContractBase,
        TMethod extends keyof Methods<TContract>,

    > (contract: TContract, method: TMethod, sender: { address: TAddress }, ...args: MethodArguments<TContract[TMethod]>) {
        let callData: TransactionConfig = await contract.$data()[method](sender, ...args);
        let callGas = await this.client.getGasEstimation(sender.address, callData);
        return {
            callData,
            callGas
        };
    }

    async getNonce(address: TAddress, salt: bigint = 0n) {
        let nonce = await this.entryPointContract.getNonce(address, salt);
        return nonce;
    }
    async getUserOpHash (op: UserOperation): Promise<string> {
        return await this.entryPointContract.getUserOpHash(op) as string;
    }
    async getSignedUserOp (op: Partial<UserOperation>, owner: ChainAccount): Promise<{ op: UserOperation, opHash: string }> {

        let userOp: UserOperation = obj_extendDefaults(op, UserOperationDefaults);

        let opHash = await this.getUserOpHash(userOp);
        let sig = await $sign.signEIPHashed(this.client, opHash as string, owner);
        return {
            opHash,
            op: {
                ...userOp,
                signature: sig.signature
            }
        }
    }


    async submitUserOpViaEntryPoint (sender: ChainAccount, op: UserOperation | UserOperation[]) {
        let tx = await this.entryPointContract.handleOps(sender, Array.isArray(op) ? op : [op], sender.address);
        let receipt = await tx.wait();
        return receipt;
    }
}

type Methods<T> = {
    [P in keyof T as T[P] extends (...args: any) => any ? P : never]: T[P]
}
type MethodArguments<T> = T extends (x, ...args: infer U ) => infer _ ? U : never[];
