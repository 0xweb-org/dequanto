import { l } from '@dequanto/utils/$logger';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { ChainAccountProvider } from '@dequanto/ChainAccountProvider';
import { EntryPoint } from '@dequanto-contracts/ERC4337/EntryPoint/EntryPoint';
import { Erc4337Service } from '@dequanto/erc4337/Erc4337Service';
import { SimpleAccount } from '@dequanto-contracts/ERC4337/SimpleAccount/SimpleAccount';
import { SimpleAccountFactory } from '@dequanto-contracts/ERC4337/SimpleAccountFactory/SimpleAccountFactory';
import { UserOperation } from '@dequanto/erc4337/models/UserOperation';
import { Erc4337TxWriter } from '@dequanto/erc4337/Erc4337TxWriter';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { $address } from '@dequanto/utils/$address';
import { $abiParser } from '@dequanto/utils/$abiParser';

const provider = new HardhatProvider();
const client = provider.client();
const explorer = provider.explorer();

UTest({
    async 'check handleOps method sig'() {
        let abi = new EntryPoint().abi.find(x => x.name === 'handleOps');
        let sig = $abiUtils.getMethodSignature(abi);
        eq_(sig, '0x1fad948c');
    },
    async 'parse handleOps method' () {
        let tx = {
            data: `0x1fad948c0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000e109be7b84e9bee53d9c043578ace493a9ea04c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000b6f84e00149de01a2690e88a64f76438db3341110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001e0000000000000000000000000000000000000000000000000000000000000a9d500000000000000000000000000000000000000000000000000000000000647f60000000000000000000000000000000000000000000000000000000000005208000000000000000000000000000000000000000000000000000000005c8d76b9000000000000000000000000000000000000000000000000000000003b9aca0000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002e00000000000000000000000000000000000000000000000000000000000000058e7f1725e7734ce288f8367e1bb143e90bb3f05125fbfb9cf000000000000000000000000e51dbcf3a958f4b2fd1ea0cfbcd64ee5ab0ab5300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a4b61d27f6000000000000000000000000cf7ed3acca5a467e9e704c703e8d87f634fb0fc9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000004d0854455000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041f769d7020ec7eda54e9df74ef24fa48c4ad2c7cfe81ca088b29582adf8eb7f542cfdff5cc271ec5b33f5a05b8548aaca1cc8c9707a673167c07eea5c7d00bff31c00000000000000000000000000000000000000000000000000000000000000`
        };

        explorer.localDb.push({
            name: 'DemoCallLogger',
            address: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
            abi: [
                $abiParser.parseMethod(`logMe()`)
            ]
        });

        let service = new Erc4337Service(client, explorer, {
            addresses: {
                entryPoint: $address.ZERO,
                accountFactory: $address.ZERO,
                accountImplementation: $address.ZERO
            }
        });


        let info = await service.decodeUserOperations(tx.data, { decodeContractCall: true });
        eq_(info.length, 1);
        eq_(info[0].contractCall.method, 'logMe');
    },

    async '!erc4337 contracts'() {

        let erc4337Contracts = await AccountAbstractionTestableFactory.prepare();
        let { demoLoggerContract: demoCounterContract } = await TestableFactory.prepare();

        let erc4337Service = new Erc4337Service(client, explorer,{
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
                let writer = new Erc4337TxWriter(client, explorer, {
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
                let writer = new Erc4337TxWriter(client, explorer, {
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

                let info = await writer.service.getUserOperation(opHash, { decodeContractCall: true});

                eq_(info.userOperations[0].contractCall.method, 'logMe');
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
