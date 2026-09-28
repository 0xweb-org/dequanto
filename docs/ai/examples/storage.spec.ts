import { AavePool } from '../../../0xc/eth/AavePool/AavePool';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { SlotsParser } from '@dequanto/solidity/SlotsParser';
import { SlotsStorage } from '@dequanto/solidity/SlotsStorage';
import { $require } from '@dequanto/utils/$require';

// Generated classes include the storage layout: use instance.storage.$set(name, value).
// SlotsParser and SlotsStorage provide the low-level alternative for Solidity source.
UTest({
    async 'read and set AavePool storage by variable name on an Ethereum fork' () {
        const client = await Web3ClientFactory.getAsync('hh:memory:eth');
        const pool = new AavePool(undefined, client);
        const premiumBefore = await pool.FLASHLOAN_PREMIUM_TOTAL();
        const packedNeighborBefore = await pool.storage.__DEPRECATED_flashLoanPremiumToProtocol();
        const id = await client.debug.snapshot();

        try {
            const premium = premiumBefore + 1n;
            await pool.storage.$set('_flashLoanPremium', premium);

            $require.eq(await pool.storage._flashLoanPremium(), premium);
            $require.eq(await pool.FLASHLOAN_PREMIUM_TOTAL(), premium);
            // Both uint128 fields share slot 58; preserve the neighboring field.
            $require.eq(await pool.storage.__DEPRECATED_flashLoanPremiumToProtocol(), packedNeighborBefore);
        } finally {
            await client.debug.revert(id);
        }

        $require.eq(await pool.FLASHLOAN_PREMIUM_TOTAL(), premiumBefore);
    },

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
