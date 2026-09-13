import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { SlotsParser } from '@dequanto/solidity/SlotsParser';
import { SlotsStorage } from '@dequanto/solidity/SlotsStorage';

UTest({
    async 'read Solidity storage with SlotsParser and SlotsStorage' () {
        const code = `
            contract Vault {
                uint256 public count = 123;
                mapping(address => uint256) balances;

                constructor () {
                    balances[address(0x1000000000000000000000000000000000000001)] = 7;
                }
            }
        `;
        const provider = new HardhatProvider();
        const client = provider.client();
        const { contract } = await provider.deployCode(code, { client });

        const slots = await SlotsParser.slots({ path: '', code }, 'Vault');
        const storage = SlotsStorage.createWithClient(client, contract.address, slots);

        eq_(await storage.get('count'), 123n);
        eq_(await storage.get('balances["0x1000000000000000000000000000000000000001"]'), 7n);
    }
});