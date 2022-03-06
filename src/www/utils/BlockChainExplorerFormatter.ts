import { TAddress } from '@dequanto/models/TAddress';
import { TPlatform } from '@dequanto/models/TPlatform';

export namespace BlockChainExplorerFormatter {
    export function getAddressLink(address: TAddress, platform: TPlatform) {
        if (platform === 'bsc') {
            return `https://bscscan.com/address/${address}`;
        }
        if (platform === 'eth') {
            return `https://etherscan.io/address/${address}`;
        }
    }
}
