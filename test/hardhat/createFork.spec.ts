import { PlatformFactory } from 'dequanto/chains/PlatformFactory';
import { Web3ClientFactory } from 'dequanto/clients/Web3ClientFactory';
import { HardhatProvider } from 'dequanto/hardhat/HardhatProvider';
import { HardhatWeb3Client } from 'dequanto/hardhat/HardhatWeb3Client';
import { $dependency } from 'dequanto/utils/$dependency';


UTest({
    async 'forks a local RPC and inherits its chainId' () {
        const hh = new HardhatProvider();
        const client1 = await Web3ClientFactory.getAsync('hh:memory:eth');
        const client2 = await hh.createFork({
            platform: 'eth',
            chainId: 1
        });

        const chainId1 = await client1.getChainId();
        const chainId2 = await client2.getChainId();
        eq_(chainId1, 1337);
        eq_(chainId1, client1.chainId);
        eq_(chainId2, 1);
        eq_(chainId2, client2.chainId);
    },


    async 'creates independent providers and preserves HRE config' () {
        const hh = new HardhatProvider();
        const hre = await hh.getHardhat();
        const originalConfig = hre.config.networks.hardhat;
        const factory = await $dependency.load('hardhat/internal/core/providers/construction.js');
        const originalCreate = factory.createProvider;
        const configs = [];
        // Exercise the real local provider without requiring an external archive RPC.
        factory.createProvider = async (config, name, artifacts) => {
            configs.push(config.networks.hardhat);
            return originalCreate({
                ...config,
                networks: {
                    ...config.networks,
                    hardhat: { ...config.networks.hardhat, forking: undefined },
                },
            }, name, artifacts);
        };
        try {
            const first = await hh.createFork({ url: 'http://localhost:8545', chainId: 1, block: 123 });
            const second = await hh.createFork({ url: 'http://localhost:8545', chainId: 10, block: 'latest' });
            eq_(first instanceof HardhatWeb3Client, true);
            eq_(first.chainId, 1);
            eq_(second.chainId, 10);
            eq_(await first.getChainId(), 1);
            eq_(await second.getChainId(), 10);
            const before = await second.getBlockNumber();
            await first.debug.mine(1);
            eq_(await second.getBlockNumber(), before);
            eq_(hre.config.networks.hardhat, originalConfig);
            eq_(configs[0].forking.blockNumber, 123);
            eq_('blockNumber' in configs[1].forking, false);
        } finally {
            factory.createProvider = originalCreate;
        }
    },
});

