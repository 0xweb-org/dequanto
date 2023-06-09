import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { ChainAccountProvider } from '@dequanto/ChainAccountProvider';
import { EntryPoint } from '@dequanto-contracts/ERC4337/EntryPoint/EntryPoint';
import { $sign } from '@dequanto/utils/$sign';
import { $contract } from '@dequanto/utils/$contract';
import { Erc4337Service } from '@dequanto/erc4337/Erc4337Service';
import { SimpleAccount } from '@dequanto-contracts/ERC4337/SimpleAccount/SimpleAccount';
import { SimpleAccountFactory } from '@dequanto-contracts/ERC4337/SimpleAccountFactory/SimpleAccountFactory';
import { UserOperation } from '@dequanto/erc4337/models/UserOperation';
import { l } from '@dequanto/utils/$logger';
import { Erc4337TxWriter } from '@dequanto/erc4337/Erc4337TxWriter';


UTest({
    async 'erc4337 contracts'() {
        let provider = new HardhatProvider();
        let client = provider.client();
        let erc4337Contracts = await AccountAbstractionTestableFactory.prepare();
        let { demoLoggerContract: demoCounterContract } = await TestableFactory.prepare();

        let erc4337Service = new Erc4337Service(client, {
            addresses: {
                entryPoint: erc4337Contracts.entryPointContract.address,
                accountFactory: erc4337Contracts.accountFactoryContract.address,
                accountImplementation: erc4337Contracts.accountContract.address,
            }
        });
        let callCounter = 0;
        let ownerFoo = await ChainAccountProvider.generate();
        await client.debug.setBalance(ownerFoo.address, 10n ** 18n);


        return UTest({
            async 'create and test with demo contract'() {
                l`1. Prepare ERC4337 contract account via Account Factory`;
                let { initCode, initCodeGas } = await erc4337Service.prepareAccountCreation(ownerFoo.address);
                let senderAddress = await erc4337Service.getAccountAddress(ownerFoo.address, initCode)
                has_(senderAddress, /0x.+/)

                l`2. Prepare Target (Demo) contract transaction data`;
                let { callData: demoCallData, callGas: demoCallGas } = await erc4337Service.prepareCallData(demoCounterContract, 'logMe', { address: senderAddress });

                l`3. Prepare contract account execution method`;
                let { callData: accountCallData } = await erc4337Service.prepareAccountCallData(
                    demoCounterContract.address,
                    0n,
                    demoCallData.data
                );

                l`4. Get nonce`
                let nonce = await erc4337Service.getNonce(ownerFoo.address, 0n);

                let { op } = await erc4337Service.getSignedUserOp( <Partial<UserOperation>> {
                    sender: senderAddress,
                    initCode: initCode,
                    callData: accountCallData.data,
                    callGasLimit: BigInt(demoCallGas),
                    verificationGasLimit: 150000n + BigInt(initCodeGas),
                    nonce: nonce
                }, ownerFoo);

                let receipt = await erc4337Service.submitUserOpViaEntryPoint(ownerFoo, op);
                callCounter++;


                eq_(receipt.status, true);
                let callCount = await demoCounterContract.calls(senderAddress);
                eq_(callCount, callCounter);
            },
            async 'should submit via factory' () {
                let writer = new Erc4337TxWriter(client, {
                    addresses: {
                        entryPoint: erc4337Contracts.entryPointContract.address,
                        accountFactory: erc4337Contracts.accountFactoryContract.address,
                        accountImplementation: erc4337Contracts.accountContract.address,
                    }
                });

                let erc4337Account = await writer.getAccount(ownerFoo);

                let tx = await demoCounterContract.$data().logMe({ address: erc4337Account.address });
                let receipt = await writer.submitUserOpViaEntryPoint({
                    tx,
                    owner: ownerFoo,
                    submitter: ownerFoo,
                });
                callCounter++;

                let callCount = await demoCounterContract.calls(erc4337Account.address);
                eq_(callCount, callCounter);
            },
            async 'should submit with another contract' () {
                let writer = new Erc4337TxWriter(client, {
                    addresses: {
                        entryPoint: erc4337Contracts.entryPointContract.address,
                        accountFactory: erc4337Contracts.accountFactoryContract.address,
                        accountImplementation: erc4337Contracts.accountContract.address,
                    }
                });
                let submitter = await ChainAccountProvider.generate();
                client.debug.setBalance(submitter.address, 10n**18n);

                let erc4337Account = await writer.getAccount(ownerFoo);

                client.debug.setBalance(erc4337Account.address, 10n**18n);


                let tx = await demoCounterContract.$data().logMe({ address: erc4337Account.address });

                let callCountBefore = await demoCounterContract.calls(erc4337Account.address);
                let { op, opHash, receipt } = await writer.submitUserOpViaEntryPoint({
                    tx,
                    owner: ownerFoo,
                    submitter: submitter,
                });
                callCounter++;

                let callCount = await demoCounterContract.calls(erc4337Account.address);
                eq_(callCount, callCounter);

                // Should spend some fees
                let erc4337AccountBalance = await client.getBalance(erc4337Account.address);
                lt_(erc4337AccountBalance, 10n**18n);


                let entryPoint = new EntryPoint(erc4337Contracts.entryPointContract.address, client);
                let userOperationEvents = await entryPoint.getPastLogsUserOperationEvent({
                    params: { userOpHash: opHash }
                });
                eq_(userOperationEvents.length, 1);
                eq_(userOperationEvents[0].params.userOpHash, opHash);
            }
        });

    },

})

class AccountAbstractionTestableFactory {

    static async prepare() {
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
    export async function prepare() {
        const provider = new HardhatProvider();
        const code = `
        contract DemoCallLogger {
            mapping (address => uint256) public calls;

            function logMe () external {
                calls[msg.sender] += 1;
            }
        }
        `;
        const { contract: demoLoggerContract } = await provider.deployCode(code)

        return {
            demoLoggerContract
        };
    }
}
