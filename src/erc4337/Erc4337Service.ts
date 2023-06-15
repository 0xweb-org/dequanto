import alot from 'alot';
import type { TransactionConfig } from 'web3-core';

import { Web3Client } from '@dequanto/clients/Web3Client';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { TAddress } from '@dequanto/models/TAddress';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { $address } from '@dequanto/utils/$address';
import { UserOperation, UserOperationDefaults } from './models/UserOperation';
import { ChainAccount } from '@dequanto/models/TAccount';
import { $sign } from '@dequanto/utils/$sign';
import { obj_extendDefaults } from 'atma-utils';
import { $contract } from '@dequanto/utils/$contract';
import { $require } from '@dequanto/utils/$require';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { ContractAbiProvider } from '@dequanto/contracts/ContractAbiProvider';
import { $erc4337 } from './utils/$erc4337';
import { $hex } from '@dequanto/utils/$hex';
import { ContractFactory } from '@dequanto/contracts/ContractFactory';
import { Erc4337Abi } from './models/Erc4337Abi';


export class Erc4337Service {


    private accountFactoryContract = ContractFactory.fromAbi(this.info.addresses.accountFactory, Erc4337Abi.AccountFactory, this.client, this.explorer);
    private accountContract = ContractFactory.fromAbi($address.ZERO, Erc4337Abi.Account, this.client, this.explorer);
    private entryPointContract = ContractFactory.fromAbi(this.info.addresses.entryPoint, Erc4337Abi.EntryPoint, this.client, this.explorer);

    constructor(public client: Web3Client, public explorer: IBlockChainExplorer, public info: {
        addresses: {
            entryPoint: TAddress
            accountFactory: TAddress
        }
    }) {

    }

    async decodeUserOperations(dataHex: string, options?: { decodeContractCall: boolean }) {
        let abi = this.entryPointContract.abi;
        let entryPointCall = $contract.decodeMethodCall(dataHex, abi);
        $require.notNull(entryPointCall, `Entry Point input can not be parsed`);
        $require.True(entryPointCall.method === 'handleOps', `${entryPointCall.method} is not handleOps`);

        let userOps = entryPointCall.arguments[0] as UserOperation[];
        let contractCalls = [];
        let contractCallsParsed = [];
        if (options?.decodeContractCall) {
            contractCalls = userOps.map(userOp => {
                let callData = userOp.callData as string;

                let accountCall = $contract.decodeMethodCall(callData, this.accountContract.abi);
                $require.notNull(accountCall, `Account input can not be parsed`);
                $require.True(accountCall.method === 'execute', `${entryPointCall.method} is not execute`);

                let [address, value, data] = accountCall.arguments;
                return {
                    address,
                    value,
                    data
                };
            });

            let resolver = new ContractAbiProvider(this.client, this.explorer);
            contractCallsParsed = await alot(contractCalls).mapAsync(async (call, i) => {
                if ($hex.isEmpty(call.data)) {
                    return {
                        address: call.address,
                        value: call.value,
                        method: '',
                        arguments: []
                    };
                }
                let result = await resolver.getAbi(call.address);
                if (result?.abiJson == null) {
                    return null;
                }
                let abi = result.abiJson;
                let innerCall = $contract.decodeMethodCall(call.data, abi);

                return {
                    method: innerCall.method,
                    arguments: innerCall.arguments,
                    value: call.value,
                    address: call.address,
                };
            }).toArrayAsync();
        }

        return userOps.map((userOp, i) => {
            return {
                userOperation: userOp,
                contractCallRaw: contractCalls[i],
                contractCall: contractCallsParsed[i]
            };
        });
    }

    async prepareAccountCreation(owner: TAddress, salt = 0n) {
        let { accountFactoryContract, entryPointContract } = this;

        let createAccountTx = await accountFactoryContract.$data().createAccount({ address: owner }, owner, salt);
        let initCode = $abiUtils.encodePacked(['address', 'bytes'], [accountFactoryContract.address, createAccountTx.data]);
        let initCodeGas = await this.client.getGasEstimation(entryPointContract.address, createAccountTx);

        return {
            initCode,
            initCodeGas
        };
    }

    async existsAccount(erc4337Account: TAddress) {
        let code = await this.client.getCode(erc4337Account);
        return $hex.isEmpty(code) === false;
    }

    async getAccountAddress(owner: TAddress, initCode: string) {
        let { error, result } = await this.entryPointContract.$call().getSenderAddress({ address: owner }, initCode);
        let senderAddress = error.data.params.sender;
        return senderAddress;
    }

    async prepareAccountCallData(targetAddress: TAddress, targetValue: bigint, targetCallData: string) {
        let accountCallData: TransactionConfig = await this.accountContract.$data().execute(
            { address: $address.ZERO },
            targetAddress,
            targetValue,
            targetCallData
        );
        // let accountCallGas = await this.client.getGasEstimation(entryPoint.address, accountCallData)
        return { callData: accountCallData }
    }

    async prepareCallData<
        TContract extends ContractBase,
        TMethod extends keyof Methods<TContract>,

    >(contract: TContract, method: TMethod, sender: { address: TAddress }, ...args: MethodArguments<TContract[TMethod]>) {
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
    async getUserOpHash(op: UserOperation): Promise<string> {
        let hash = await this.entryPointContract.getUserOpHash(op) as string;
        return hash;
    }
    async getSignedUserOp(op: Partial<UserOperation>, owner: ChainAccount): Promise<{ op: UserOperation, opHash: string }> {

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

    async getUserOperation(opHash: string, options?: { decodeContractCall: boolean }) {
        let userOperationEvents = await this.entryPointContract.$getPastLogsParsed('UserOperationEvent', {
            params: { userOpHash: opHash }
        });
        if (userOperationEvents.length === 0) {
            return null;
        }
        let event = userOperationEvents[0];

        let tx = await this.client.getTransaction(event.transactionHash);
        let allUserOperations = await this.decodeUserOperations(tx.input, options);

        let userOperationParsed = alot(allUserOperations).find(op => {
            let hash = $erc4337.hash(op.userOperation, this.entryPointContract.address, this.client.chainId);
            return hash === event.params.userOpHash;
        });
        return {
            transaction: tx,
            ...userOperationParsed
        };
    }

    async submitUserOpViaEntryPoint(sender: ChainAccount, op: UserOperation | UserOperation[]) {
        $require.Address(sender?.address);

        let txWriter = await this.entryPointContract.handleOps(sender, Array.isArray(op) ? op : [op], sender.address);
        return txWriter;
    }
}

type Methods<T> = {
    [P in keyof T as T[P] extends (...args: any) => any ? P : never]: T[P]
}
type MethodArguments<T> = T extends (x, ...args: infer U) => infer _ ? U : never[];
