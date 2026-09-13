import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
// dequanto ships prebuilt TypeScript clients for all OpenZeppelin contracts.
import { ERC20 } from '@dequanto/prebuilt/openzeppelin/ERC20';
// Use 0xweb CLI to download and generate simple TypeScript clients for verified contracts from Etherscan-compatible explorers:
// 0xweb install <address> --name AavePool --chain eth --save-sources false
import { AavePool } from '../../../0xc/eth/AavePool/AavePool';

const USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' as const;

UTest({
    async 'read stable USDC metadata from live Ethereum RPC' () {
        const client = await Web3ClientFactory.getAsync('eth');
        const usdc = new ERC20(USDC, client);

        const [symbol, decimals, balance] = await Promise.all([
            usdc.symbol(),
            usdc.decimals(),
            usdc.balanceOf('0x0000000000000000000000000000000000000000')
        ]);

        eq_(symbol, 'USDC');
        eq_(Number(decimals), 6);
        gte_(balance, 0n);
    },

    async 'read generated Aave Pool data from live Ethereum RPC' () {
        const client = await Web3ClientFactory.getAsync('eth');
        const pool = new AavePool(undefined, client);

        const [addressesProvider, maxReserves, reserves, reserveData] = await Promise.all([
            pool.ADDRESSES_PROVIDER(),
            pool.MAX_NUMBER_RESERVES(),
            pool.getReservesList(),
            pool.getReserveData(USDC)
        ]);

        has_(addressesProvider, /^0x[a-fA-F0-9]{40}$/);
        gt_(Number(maxReserves), 0);
        eq_(reserves.some(x => x.toLowerCase() === USDC.toLowerCase()), true);
        has_(reserveData.aTokenAddress, /^0x[a-fA-F0-9]{40}$/);
        has_(reserveData.variableDebtTokenAddress, /^0x[a-fA-F0-9]{40}$/);
        gte_(reserveData.liquidityIndex, 1n);
    }
});