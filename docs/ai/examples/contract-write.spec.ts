import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { ContractReader } from '@dequanto/contracts/ContractReader';
import { ERC20 } from '@dequanto/prebuilt/openzeppelin/ERC20';
import { AavePool } from '../../../0xc/eth/AavePool/AavePool';
import type { TEth } from '@dequanto/models/TEth';
import { $account } from '@dequanto/utils/$account';
import { $address } from '@dequanto/utils/$address';
import { $require } from '@dequanto/utils/$require';

const USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' as const;

UTest({
    async 'submit a contract write transaction' () {
        // Use getAsync(platform) with a real funded account to submit the same write on mainnet
        const client = await Web3ClientFactory.getAsync('hh:memory:eth');
        const pool = new AavePool(undefined, client);

        const addressesProvider = await pool.ADDRESSES_PROVIDER();
        const poolConfigurator = await ContractReader.read<TEth.Address>(
            client,
            addressesProvider,
            'function getPoolConfigurator() view returns (address)'
        );

        const configuratorAccount = {
            address: poolConfigurator,
            type: 'impersonated'
        } as const;

        const newFlashloanPremium = 12_345n;
        const tx = await pool.$receipt().updateFlashloanPremium(configuratorAccount, newFlashloanPremium);
        $require.Hex(tx.receipt.transactionHash);

        const premium = await pool.FLASHLOAN_PREMIUM_TOTAL();
        $require.eq(premium, newFlashloanPremium);
    },

    async 'submit a contract write transaction and read a typed event log' () {
        // Use getAsync(platform) with a real funded account to submit the same write on mainnet
        const client = await Web3ClientFactory.getAsync('hh:memory:eth');
        const pool = new AavePool(undefined, client);

        const user = $account.generate('user');
        const positionManager = $account.generate('positionManager');

        await client.debug.setBalance(user.address, BigInt(1e18));

        const tx = await pool.$receipt().approvePositionManager(user, positionManager.address, true);
        $require.Hex(tx.receipt.transactionHash);

        const [approvalLog] = await pool.extractLogsPositionManagerApproved(tx.receipt);
        $require.True($address.eq(approvalLog.params.user, user.address));
        $require.True($address.eq(approvalLog.params.positionManager, positionManager.address));
    },

    async 'build ERC20 transfer transaction data without submitting it' () {
        const client = await Web3ClientFactory.getAsync('eth');
        const usdc = new ERC20(USDC, client);
        const transferSender = { address: '0x0000000000000000000000000000000000000001' as const };
        const transferRecipient = '0x0000000000000000000000000000000000000002' as const;
        const amount = 1_000_000n;

        const tx = await usdc.$data().transfer(transferSender, transferRecipient, amount);

        $require.True($address.eq(tx.to, usdc.address));
        $require.match(/^0xa9059cbb/, tx.data);
    }
});
