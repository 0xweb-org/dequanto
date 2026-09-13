import { BlockchainExplorerFactory } from '@dequanto/explorer/BlockchainExplorerFactory';

UTest({
    async 'fetch stable USDC ABI and source from configured Ethereum explorer' () {
        const explorer = await BlockchainExplorerFactory.getAsync('eth');
        const address = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';

        const { abi, implementation } = await explorer.getContractAbi(address);
        const source = await explorer.getContractSource(implementation);
        const creation = await explorer.getContractCreation(address);

        eq_(implementation.toLowerCase(), address);
        gt_(JSON.parse(abi).length, 0);
        has_(source.ContractName, /FiatToken|Proxy|USDC/i);
        has_(creation.creator, /^0x[a-fA-F0-9]{40}$/);
        has_(creation.txHash, /^0x[a-fA-F0-9]{64}$/);
    }
});