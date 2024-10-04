import di from 'a-di';
import { Arbiscan } from '@dequanto/chains/arbitrum/Arbiscan';
import { TPlatform } from '@dequanto/models/TPlatform';
import { Bscscan } from './Bscscan';
import { Etherscan } from './Etherscan';
import { Polyscan } from './Polyscan';
import { XDaiscan } from '@dequanto/chains/xdai/XDaiscan';
import { $config } from '@dequanto/utils/$config';
import { BlockChainExplorerFactory, IBlockChainExplorerFactoryParams } from './BlockChainExplorerFactory';
import { Evmscan } from './Evmscan';
import { IBlockChainExplorer } from './IBlockChainExplorer';
import { Constructor } from 'atma-utils';

export namespace BlockChainExplorerProvider {

    const registry = {} as Record<TPlatform, IBlockChainExplorer | Constructor<IBlockChainExplorer>>;

    export function get (platform: TPlatform): IBlockChainExplorer {
        switch (platform) {
            case 'bsc':
                return di.resolve(Bscscan, 'bsc');
            case 'eth':
                return di.resolve(Etherscan, 'eth');
            case 'polygon':
                return di.resolve(Polyscan, 'polygon');
            case 'arbitrum':
                return di.resolve(Arbiscan, 'arbitrum');
            case 'xdai':
                return di.resolve(XDaiscan);
            case 'hardhat':
                return Evmscan({ platform });
            default:
                let cfg = $config.get(`blockchainExplorer.${platform}`);

                let Mix = registry[platform];
                if (Mix != null) {
                    if (typeof Mix === 'function') {
                        return new Mix(cfg);
                    }
                    return Mix;
                }
                if (cfg != null) {
                    return Evmscan({ platform });
                }
                throw new Error(`Unsupported platform ${platform} for block chain explorer`);
        }
    }

    export function register (platform: TPlatform, explorer: IBlockChainExplorer | Constructor<IBlockChainExplorer>) {
        registry[platform] = explorer;
    }

    export function create(options: IBlockChainExplorerFactoryParams) {
        return BlockChainExplorerFactory.create(options);
    }
}

