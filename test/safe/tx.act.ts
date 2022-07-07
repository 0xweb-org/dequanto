import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';

import { $signRaw } from '@dequanto/utils/$signRaw';
import { class_Uri } from 'atma-utils';
import hre from 'hardhat'
import { File } from 'atma-io';
import { GnosisSafeFactory } from '@dequanto/safe/GnosisSafeFactory';
import { $address } from '@dequanto/utils/$address';
import { GnosisSafe } from '@dequanto-contracts/gnosis/GnosisSafe';
import { GnosisSafeHandler } from '@dequanto/safe/GnosisSafeHandler';
import { InMemoryServiceTransport } from '@dequanto/safe/transport/InMemoryServiceTransport';
import { TokenTransferService } from '@dequanto/tokens/TokenTransferService';
import { ContractWriter } from '@dequanto/contracts/ContractWriter';
import { SafeAccount } from '@dequanto/models/TAccount';
import { $bigint } from '@dequanto/utils/$bigint';


UTest({
    'should sign tx hash' () {
        const key = `0x66e91912f68828c17ad3fee506b7580c4cd19c7946d450b4b0823ac73badc878`;
        const address = `0x6a2EB7F6734F4B79104A38Ad19F1c4311e5214c8`
        const txHash = `0x1ed9d878f89585977e98425d5cedf51027c041e414bb471d64519f8f510bb555`;

        const signature = $signRaw.signEC(txHash, key);
        eq_(signature.signature, `0xc0df6a1b659d56d3d23f66cbd1c483467ea68a428fea7bbbe0a527d43d8681f616af33344035f36c08218718480374dada0fe6cdb266d0182a4225d0e9c227181b`);
    },

    async '!create' () {
        let provider = new HardhatProvider();
        let client = provider.client();
        let owner1 = provider.deployer();
        let owner2 = provider.deployer(1);

        const { contract: proxyFactoryContract, abi: proxyFactoryAbi } = await provider.deploy('/test/fixtures/gnosis/proxies/GnosisSafeProxyFactory.sol');
        const { contract: safeContract, abi: safeAbi } = await provider.deploy('/test/fixtures/gnosis/GnosisSafe.sol');
        const { contract: multiSendContract, abi: multiSendAbi } = await provider.deploy('/test/fixtures/gnosis/libraries/MultiSend.sol');

        let safe = await GnosisSafeFactory.create(owner1, client, {
            owners: [
                owner1.address,
                owner2.address
            ],
            contracts: {
                [client.chainId + '']: {
                    multiSendAddress: multiSendContract.address,
                    multiSendAbi: multiSendAbi,

                    safeMasterCopyAddress: safeContract.address,
                    safeMasterCopyAbi: safeAbi,

                    safeProxyFactoryAbi: proxyFactoryAbi,
                    safeProxyFactoryAddress: proxyFactoryContract.address
                }
            }
        });

        eq_($address.isValid(safe.safeAddress), true, `Invalid address ${safe.safeAddress}`);

        let contract = new GnosisSafe(safe.safeAddress, client);
        let nonce = await contract.nonce();
        eq_(Number(nonce), 0);


        let handler = new GnosisSafeHandler({
            safeAddress: safe.safeAddress,
            owner: owner1,
            client: client,
            transport: new InMemoryServiceTransport(client, owner1)
        });


        const { contract: freeTokenContract, abi: freeTokenAbi } = await provider.deploy('/test/fixtures/contracts/FreeToken.sol');


        let balanceBefore = await freeTokenContract.balanceOf(safe.safeAddress);
        eq_($bigint.toEther(balanceBefore, 18), 0);


        '> airdrop some tokens to sender (safe)'

        let writer = new ContractWriter(freeTokenContract.address, client);
        let txWriter = await writer.writeAsync(<SafeAccount>{
            address: safe.safeAddress,
            operator: owner1,
        }, 'airdrop()', [], {
            builderConfig: {
                send: 'manual'
            }
        });


        let { hash, threshold } = await handler.createTransaction(txWriter, 0n);

        await handler.confirmTx(hash, owner2);
        await handler.confirmTx(hash, owner1);
        let tx = await handler.submitTransaction(hash);

        let receipt = await tx.wait();
        eq_(receipt.status, true);

        let balance = await freeTokenContract.balanceOf(safe.safeAddress);
        let eth = $bigint.toEther(balance, 18);
        eq_(eth, 10);
    }
})
