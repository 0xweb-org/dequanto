import { UTest } from 'atma-utest';
import { Config } from 'dequanto/config/Config';
import { GnosisSafeFactory } from 'dequanto/safe/GnosisSafeFactory';
import { BatchAgent } from 'dequanto/txs/agents/BatchAgent';
import { TxWriter } from 'dequanto/txs/TxWriter';
import { HardhatProvider } from 'dequanto/hardhat/HardhatProvider';
import { InMemoryServiceTransport } from 'dequanto/safe/transport/InMemoryServiceTransport';
import { SafeTx } from 'dequanto/safe/SafeTx';
import { $address } from 'dequanto/utils/$address';
import { $require } from 'dequanto/utils/$require';
import { SafeAccount } from 'dequanto/models/TAccount';
import { Web3Client } from 'dequanto/clients/Web3Client';
import { TEth } from 'dequanto/models/TEth';

UTest.create({
    async 'collect normal contract calls and execute one Safe batch'() {
        let provider = new HardhatProvider();
        let client = provider.client();
        let owner = provider.deployer(0);
        let receiver = provider.deployer(1);

        // Local setup; on a live network, use an existing Safe and configured MultiSend.
        let { safeAddress } = await deployLocalTestSafe(owner, provider, client);
        let { token } = await deployLocalTestToken(provider, client);
        let safe: SafeAccount = {
            type: 'safe',
            platform: client.platform,
            address: safeAddress,
            operator: owner,
            owners: [owner]
        };

        // Dequanto signs and executes when available signers meet the Safe threshold.
        // Otherwise, it submits to the Safe Service API and waits for confirmations.
        TxWriter.DEFAULTS.safeTransport = new InMemoryServiceTransport(client, owner);

        let batch = new BatchAgent().enable();
        try {
            // Normal write calls return mock receipts and queue transactions without submitting them.
            await token.$receipt().transfer(safe, receiver.address, 50n);
            await token.$receipt().transfer(safe, receiver.address, 25n);

            $require.eq(batch.transactions.length, 2);
            $require.eq(await token.received(receiver.address), 0n);

            // Detects the Safe sender and submits both calls as one Safe batch transaction.
            let writers = await batch.execute();

            $require.eq(writers.length, 1);
            $require.eq(await token.received(receiver.address), 75n);
            $require.True($address.eq(await token.lastSender(), safe.address));

        } finally {
            batch.disable();
            TxWriter.DEFAULTS.agent = null;
            TxWriter.DEFAULTS.safeTransport = null;
        }
    },

    async 'build a Safe batch from generated tx data'() {
        const provider = new HardhatProvider();
        const client = provider.client();
        const owner1 = provider.deployer(0);
        const owner2 = provider.deployer(1);

        const { contract: token } = await provider.deployCode(`
            contract Token {
                event Transfer(address indexed from, address indexed to, uint256 value);
                function approve(address spender, uint256 amount) external returns (bool) { return true; }
                function transfer(address to, uint256 amount) external returns (bool) {
                    emit Transfer(msg.sender, to, amount);
                    return true;
                }
            }
        `, { client });

        const safeAccount: SafeAccount = {
            type: 'safe',
            platform: 'hardhat',
            address: owner1.address,
            operator: owner1,
            owners: [owner1, owner2]
        };
        const safeTx = new SafeTx(safeAccount, client, {
            safeTransport: new InMemoryServiceTransport(client, owner1),
            contracts: {
                hardhat: {
                    MultiSend: $address.ZERO,
                    Safe: $address.ZERO,
                    SafeProxyFactory: $address.ZERO
                }
            }
        });

        const txs = [
            await token.$data().approve(safeAccount, owner2.address, 100n),
            await token.$data().transfer(safeAccount, owner2.address, 50n)
        ];

        $require.eq(txs.length, 2);
        txs.forEach(tx => {
            $require.True($address.eq(tx.to, token.address));
            $require.match(/^0x[a-fA-F0-9]+$/, tx.data);
        });
        $require.notNull(safeTx);
    }
});


async function deployLocalTestSafe(owner: TEth.EoAccount, provider: HardhatProvider, client: Web3Client) {
    let config = await Config.get();
    let { contract: singleton } = await provider.deploySol('/test/fixtures/gnosis/GnosisSafe.sol', { client });
    let { contract: proxyFactory } = await provider.deploySol('/test/fixtures/gnosis/proxies/GnosisSafeProxyFactory.sol', { client });
    let { contract: multiSend } = await provider.deploySol('/test/fixtures/gnosis/libraries/MultiSend.sol', { client });

    config.safe.contracts[client.platform] = {
        Safe: singleton.address,
        SafeProxyFactory: proxyFactory.address,
        MultiSend: multiSend.address
    };

    let handler = await GnosisSafeFactory.create(owner, client, {
        owners: [owner.address]
    });

    return {
        safeAddress: handler.safeAddress
    };
}

async function deployLocalTestToken(provider: HardhatProvider, client: Web3Client) {
    let { contract: token } = await provider.deployCode(`
        contract Token {
            mapping(address => uint256) public received;
            address public lastSender;
            function transfer(address to, uint256 amount) external returns (bool) {
                received[to] += amount;
                lastSender = msg.sender;
                return true;
            }
        }
    `, { client });

    return { token };
}
