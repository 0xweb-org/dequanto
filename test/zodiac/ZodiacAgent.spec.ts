import { Config, config } from 'dequanto/config/Config';
import { UTest } from 'atma-utest';
import { strict as assert } from 'assert';
import { HardhatProvider } from 'dequanto/hardhat/HardhatProvider';
import { ContractClassFactory } from 'dequanto/contracts/ContractClassFactory';
import { ZodiacAccount } from 'dequanto/models/TAccount';
import { ZodiacTx } from 'dequanto/zodiac/ZodiacTx';
import { TxWriter } from 'dequanto/txs/TxWriter';
import { TxDataBuilder } from 'dequanto/txs/TxDataBuilder';
import { BatchAgent } from 'dequanto/txs/agents/BatchAgent';
import { $abi } from 'dequanto/abi/$abi';
import { TEth } from 'dequanto/models/TEth';
import { $hex } from 'dequanto/utils/$hex';


let hh = new HardhatProvider();
let client = hh.client();
let deployer = hh.deployer();

UTest.create({
    $config: {
        timeout: 120_000
    },
    async $before() {
        await Config.get();

    },
    async $teardown() {
        TxWriter.DEFAULTS.agent = null;
        await client.debug.reset();
    },
    async 'executes contract calls and batches through Roles and the avatar'() {
        let hh = new HardhatProvider();
        let client = hh.client();
        await Config.get();

        let { contract: roles } = await hh.deploySol('./test/fixtures/zodiac/ZodiacRolesFixture.sol', {
            client,
            contractName: 'ZodiacRolesFixture',
            arguments: [hh.deployer(1).address]
        });
        let avatar = await roles.avatar();
        let { contract: targetContract } = ContractClassFactory.fromAbi(await roles.target(), [
            'function add(uint256 amount) payable',
            'function total() view returns (uint256)',
            'function lastSender() view returns (address)'
        ], client);
        let account: ZodiacAccount = {
            type: 'zodiac',
            platform: client.platform,
            address: roles.address,
            operator: hh.deployer(),
            roleKey: '0x1',
        };

        config.safe.contracts[client.network] = {
            MultiSendCallOnly: await roles.multiSend(),
        } as any;

        await client.debug.setBalance(avatar, 1_000n);
        let first = await targetContract.$receipt().add({ ...account, value: 5n }, 2);
        let receipt = first.receipt;
        eq_(receipt.status, 1);
        eq_(receipt.from, account.operator.address);
        eq_(receipt.to, account.address);
        eq_(await targetContract.total(), 2n);
        eq_(await targetContract.lastSender(), avatar);
        eq_(await client.getBalance(targetContract.address), 5n);

        let data = { to: targetContract.address, data: $abi.encodeCall('add(uint256)', [3]) };
        await TxWriter
            .create(client, new TxDataBuilder(client, account, data), account)
            .send()
            .wait();
        eq_(await targetContract.total(), 5n);

        let direct = await TxWriter.writeTxData(client, {
            to: targetContract.address,
            data: $abi.encodeCall('add(uint256)', [0])
        }, account);
        await direct.wait();
        eq_(direct.receipt.to, account.address);

        let batch = new BatchAgent().enable();
        await targetContract.$receipt().add(account, 4);
        await targetContract.$receipt().add(account, 6);
        let writers = await batch.execute();
        batch.disable();
        eq_(writers.length, 1);
        eq_(await targetContract.total(), 15n);
        eq_(await roles.executions(), 4n);

        // Same destination/calldata under different roles must not be deduplicated or grouped.
        batch = new BatchAgent().enable();
        await targetContract.$receipt().add(account, 1);
        await targetContract.$receipt().add({ ...account, roleKey: '0x2' }, 1);
        writers = await batch.execute();
        batch.disable();
        eq_(writers.length, 2);
        eq_(await targetContract.total(), 17n);


        // Different values must not be dropped by batch deduplication.
        batch = new BatchAgent().enable();
        await targetContract.$receipt().add({ ...account, value: 2n }, 0);
        await targetContract.$receipt().add({ ...account, value: 3n }, 0);
        await batch.execute();
        batch.disable();
        eq_(await client.getBalance(targetContract.address), 10n);

        let zodiac = new ZodiacTx(account, client);
        await assert.rejects(async () => {
            let tx = await zodiac.executeBatch(
                { to: targetContract.address, data: $abi.encodeCall('add(uint256)', [10]) },
                { to: targetContract.address, data: $abi.encodeCall('add(uint256)', [999]) }
            );
            await tx.wait();
        });
        eq_(await targetContract.total(), 19n);
        await assert.rejects(async () => {
            let tx = await new ZodiacTx({ ...account, operator: hh.deployer(2) }, client).execute(data);
            await tx.wait();
        });
        eq_(await targetContract.total(), 19n);
    }
});
