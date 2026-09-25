import { Config } from '@dequanto/config/Config';
import { IRpcConfig } from '@dequanto/clients/ClientPool';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { $require } from '@dequanto/utils/$require';
import { BlockchainExplorerFactory } from '@dequanto/explorer/BlockchainExplorerFactory';

UTest({
    async 'load default configuration before RPC actions' () {
        const config = await Config.fetch();

        // Defaults are defined in src/config/ConfigDefaults.ts. They are useful for basic reads,
        // but paid/custom RPCs are preferable for indexing and higher-volume requests.
        $require.True(config.web3.eth.endpoints.some(x => x.url.includes('publicnode') || x.url.includes('drpc')));
    },

    async 'override a built-in platform RPC with the rpc alias' () {
        await Config.fetch({
            rpc: {
                eth: 'https://example.bar'
            }
        });

        const client = await Web3ClientFactory.getAsync('eth');
        $require.eq(client.options.endpoints.length, 1);
        $require.eq(client.options.endpoints[0].url, 'https://example.bar');
    },

    async 'override a built-in platform with full RPC endpoint config' () {
        await Config.fetch({
            rpc: {
                eth: [
                    <IRpcConfig>{
                        url: 'https://example2.bar',
                        rateLimit: '100/1sec',
                        blockRangeLimit: 100_000,
                        batchLimit: 100,
                    }
                ]
            }
        });

        const client = await Web3ClientFactory.getAsync('eth');
        const endpoint = client.options.endpoints[0];

        $require.eq(client.options.endpoints.length, 1);
        $require.eq(endpoint.url, 'https://example2.bar');
        $require.eq(endpoint.rateLimit, '100/1sec');
        $require.eq(endpoint.blockRangeLimit, 100_000);
        $require.eq(endpoint.batchLimit, 100);
    },

    async 'define a custom chain config' () {
        await Config.fetch({
            config: {
                web3: {
                    foo: {
                        chainId: 500,
                        chainToken: 'FOO',
                        endpoints: [
                            { url: 'wss://foo.example' },
                            { url: 'https://foo.example' }
                        ]
                    }
                }
            }
        });

        const client = await Web3ClientFactory.getAsync('foo');
        $require.eq(client.chainId, 500);
        $require.eq(client.options.endpoints[0].url, 'wss://foo.example');
        $require.eq(client.options.endpoints[1].url, 'https://foo.example');
    },

    async 'override a built-in blockchain explorer API key' () {
        // Explorer APIs are used for contract verification, source loading, 0xweb install, and metadata.
        const config = await Config.fetch({
            config: {
                blockchainExplorer: {
                    eth: { key: 'Foo' }
                }
            }
        });
        const explorer = await BlockchainExplorerFactory.getAsync('eth');
        $require.eq(explorer.config.api.key, 'Foo');
    },

    async 'define blockchain explorer config for a custom platform' () {
        await Config.fetch({
            config: {
                // web3 config is also required for the chain
                web3: {
                    foo: { chainId: 4000, endpoints: [] },
                },
                blockchainExplorer: {
                    foo: { api: 'https://api.foo.bar/?token=BAR' }
                }
            }
        });
        const explorer = await BlockchainExplorerFactory.getAsync('foo');
        $require.eq(explorer.config.api.url, 'https://api.foo.bar/?token=BAR' );
    },

    $teardown () {
        Config.clean();
    }
});

// Config sources agents should know about:
// 1. Global dequanto config, editable with: 0xweb config -e
// 2. Workspace config: ./configs/dequanto.yml
// 3. Runtime overrides: Config.fetch({ rpc }) or Config.fetch({ config })
// 4. Built-in platform RPC env vars: RPC_<PLATFORM>, for example RPC_ETH
// Explorer API keys can also be configured globally, which is important for deploy verification and 0xweb install.
