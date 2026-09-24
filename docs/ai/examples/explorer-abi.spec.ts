import { BlockchainExplorerFactory } from '@dequanto/explorer/BlockchainExplorerFactory';
import { $address } from '@dequanto/utils/$address';
import { $require } from '@dequanto/utils/$require';

UTest({
    async 'fetch stable USDC ABI and source from configured Ethereum explorer' () {
        const explorer = await BlockchainExplorerFactory.getAsync('eth');
        const address = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';

        const { abi, implementation } = await explorer.getContractAbi(address);
        const source = await explorer.getContractSource(implementation);
        const creation = await explorer.getContractCreation(address);

        $require.AddressNotEmpty(implementation);
        $require.True($address.eq(implementation, address) === false, `USDC is Proxy: ${implementation} != ${address}`);
        $require.gt(JSON.parse(abi).length, 0);
        $require.match(/FiatToken|Proxy|USDC/i, source.ContractName);
        $require.AddressNotEmpty(creation.creator);
        $require.TxHash(creation.txHash);
    }
});
