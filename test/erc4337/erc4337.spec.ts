import { File } from 'atma-io';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { GnosisSafeFactory } from '@dequanto/safe/GnosisSafeFactory';
import { GnosisSafe } from '@dequanto-contracts/gnosis/GnosisSafe';
import { GnosisSafeHandler } from '@dequanto/safe/GnosisSafeHandler';
import { InMemoryServiceTransport } from '@dequanto/safe/transport/InMemoryServiceTransport';
import { ContractWriter } from '@dequanto/contracts/ContractWriter';
import { SafeAccount } from '@dequanto/models/TAccount';
import { FileServiceTransport } from '@dequanto/safe/transport/FileServiceTransport';
import { $signRaw } from '@dequanto/utils/$signRaw';
import { $bigint } from '@dequanto/utils/$bigint';
import { $promise } from '@dequanto/utils/$promise';
import { $address } from '@dequanto/utils/$address';
import { $buffer } from '@dequanto/utils/$buffer';
import { ChainAccountProvider } from '@dequanto/ChainAccountProvider';
import { EntryPoint } from '@dequanto-contracts/ERC4337/EntryPoint/EntryPoint';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { TransactionConfig } from 'web3-core';
import { $sign } from '@dequanto/utils/$sign';
import { $contract } from '@dequanto/utils/$contract';
import { Erc4337Service } from '@dequanto/erc4337/Erc4337Service';
import { SimpleAccount } from '@dequanto-contracts/ERC4337/SimpleAccount/SimpleAccount';
import { SimpleAccountFactory } from '@dequanto-contracts/ERC4337/SimpleAccountFactory/SimpleAccountFactory';


UTest({
    $config: {
        timeout: 1_000_000,
    },


    async 'create in-memory safe and manually receive tokens' () {
        let provider = new HardhatProvider();
        let client = provider.client();
        let erc4337Contracts = await AccountAbstractionTestableFactory.prepare();
        let { demoCounterContract } = await TestableFactory.prepare();
        let ownerFoo = await ChainAccountProvider.generate();
        let erc4337Service = new Erc4337Service(client, {
            addresses: {
                entryPoint: erc4337Contracts.entryPointContract.address,
                accountFactory: erc4337Contracts.accountFactoryContract.address,
                accountImplementation: erc4337Contracts.accountContract.address,
            }
        });

        await client.debug.setBalance(ownerFoo.address, 10n**18n);

        let entryPoint = new EntryPoint(erc4337Contracts.entryPointContract.address, client);

        $contract.store.register(entryPoint);

        let { initCode, initCodeGas } = await erc4337Service.prepareAccountCreation(ownerFoo.address);

        let senderAddress = await erc4337Service.getAccountAddress(ownerFoo.address, initCode)


        //1. Target contract method
        let { callData: demoCallData, callGas: demoCallGas } = await erc4337Service.prepareCallData(demoCounterContract, 'logMe', { address: ownerFoo.address });

        // 2. Account contract execution method
        let { callData: accountCallData } = await erc4337Service.prepareAccountCallData(
            demoCounterContract.address,
            0n,
            demoCallData.data
        );

        type UserOp = Parameters<EntryPoint['handleOps']>[1][0];
        let nonce = await entryPoint.getNonce(ownerFoo.address, 0n);
        let op: UserOp = {
            sender: senderAddress,
            initCode: initCode,
            callData: accountCallData.data,

            callGasLimit: BigInt(demoCallGas),
            verificationGasLimit: 150000n + BigInt(initCodeGas),
            preVerificationGas: 21000n,
            maxFeePerGas: 0n,
            maxPriorityFeePerGas: 0n,
            nonce:  nonce,
            signature: '0x',
            paymasterAndData: '0x',
        };

        let opHash = await entryPoint.getUserOpHash(op);


        let sigForValidation = await $sign.signEIPHashed(client, opHash as string, ownerFoo);
        op.signature = sigForValidation.signature;

        let tx = await entryPoint.handleOps(ownerFoo, [op], ownerFoo.address);
        let receipt = await tx.wait();

        eq_(receipt.status, true);

        let callCount = await demoCounterContract.calls(senderAddress)
        eq_(callCount, 1n);
    },

})

class AccountAbstractionTestableFactory {

    static async prepare () {
        const provider = new HardhatProvider();

        const { contract: entryPointContract, abi: proxyFactoryAbi } = await provider.deploySol('/test/fixtures/erc4337/core/EntryPoint.sol', {
            arguments: [],
        });
        const { contract: accountFactoryContract, abi: safeAbi } = await provider.deploySol('/test/fixtures/erc4337/samples/SimpleAccountFactory.sol', {
            arguments: [entryPointContract.address],
        });
        const { contract: accountContract, abi: multiSendAbi } = await provider.deploySol('/test/fixtures/erc4337/samples/SimpleAccount.sol', {
            arguments: [entryPointContract.address],
        });

        return {
            entryPointContract,
            accountFactoryContract: accountFactoryContract as SimpleAccountFactory,
            accountContract: accountContract as SimpleAccount,
        };
    }
}


namespace TestableFactory {
    export async function prepare () {
        const provider = new HardhatProvider();
        const code = `
        contract DemoCallCounter {
            mapping (address => uint256) public calls;

            function logMe () external {
                calls[msg.sender] += 1;
            }
        }
        `;
        const { contract: demoCounterContract } = await provider.deployCode(code)

        return {
            demoCounterContract
        };
    }
}
