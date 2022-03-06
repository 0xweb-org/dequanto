import di from 'a-di';
import { Arbiscan } from '@dequanto/chains/arbitrum/Arbiscan';
import { TPlatform } from '@dequanto/models/TPlatform';
import { Bscscan } from './Bscscan';
import { Etherscan } from './Etherscan';
import { Polyscan } from './Polyscan';
import { XDaiscan } from '@dequanto/chains/xdai/XDaiscan';

export namespace BlockChainExplorerProvider {
    export function get (platform: TPlatform) {
        switch (platform) {
            case 'bsc':
                return di.resolve(Bscscan);
            case 'eth':
                return di.resolve(Etherscan);
            case 'polygon':
                return di.resolve(Polyscan);
            case 'arbitrum':
                return di.resolve(Arbiscan);
            case 'xdai':
                return di.resolve(XDaiscan);
            default:
                throw new Error(`Unsupported platform ${platform} for block chain explorer`);
        }
    }
}
