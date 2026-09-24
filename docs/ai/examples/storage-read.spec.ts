import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { SlotsParser } from '@dequanto/solidity/SlotsParser';
import { SlotsStorage } from '@dequanto/solidity/SlotsStorage';
import { $require } from '@dequanto/utils/$require';

// This is the low-level path for creating a storage reader directly from Solidity source.
// Classes generated from source with 0xweb install or @0xweb/hardhat expose storage on the instance: foo.storage.get('count').
UTest({
    async 'read and write Solidity storage with SlotsParser and SlotsStorage' () {
        const code = `
            contract Vault {
                uint256 public count = 123;
                mapping(address => uint256) balances;

                constructor () {
                    balances[address(0x1000000000000000000000000000000000000001)] = 7;
                }
            }
        `;
        const hh = new HardhatProvider();
        const client = await Web3ClientFactory.getAsync('hh:memory');
        const { contract } = await hh.deployCode(code, { client });

        const slots = await SlotsParser.slots({ path: '', code }, 'Vault');
        const storage = SlotsStorage.createWithClient(client, contract.address, slots);

        $require.eq(await storage.get('count'), 123n);
        $require.eq(await storage.get('balances["0x1000000000000000000000000000000000000001"]'), 7n);

        // Direct storage writes require a debug network such as Hardhat.
        await storage.set('count', 500n);
        $require.eq(await storage.get('count'), 500n);
    }
});
