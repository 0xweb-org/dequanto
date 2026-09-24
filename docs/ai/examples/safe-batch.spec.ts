import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { InMemoryServiceTransport } from '@dequanto/safe/transport/InMemoryServiceTransport';
import { SafeTx } from '@dequanto/safe/SafeTx';
import { $address } from '@dequanto/utils/$address';
import { $require } from '@dequanto/utils/$require';
import { SafeAccount } from '@dequanto/models/TAccount';

UTest({
    async 'build a Safe batch from generated tx data' () {
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