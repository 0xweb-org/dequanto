import { TEth } from '@dequanto/models/TEth';
import { $contract } from './$contract';
import { TPlatform } from '@dequanto/models/TPlatform';
import { BlockchainExplorerFactory } from '@dequanto/explorer/BlockchainExplorerFactory';
import { l } from './$logger';

export namespace $abiProvider {
    interface IContractMeta {
        name?: string
        address?: TEth.Address
        abi: TEth.Abi.Item[]
    }
    export async function getAbi(address: TEth.Address, network: TPlatform): Promise<IContractMeta> {
        let local = $contract.store.getContract(address);
        if (local) {
            return local;
        }
        if (network !== 'hardhat') {
            let explorer = await BlockchainExplorerFactory.getAsync(network);
            try {
                let info = await explorer.getContractAbi(address);
                if (info) {
                    l`Loading contracts meta for bold<${address}>...`;
                    let abi = typeof info.abi === 'string'
                        ? JSON.parse(info.abi)
                        : info.abi;
                    return {
                        abi,
                        name: `${address.slice(0, 6)}__${address.slice(-4)}`,
                        address,
                    };
                }
            } catch (err) {
                // ignore
            }
        }

        return null;
    }
}
