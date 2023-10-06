import { type TAbiItem } from '@dequanto/types/TAbi';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { $address } from '@dequanto/utils/$address';
import { $require } from '@dequanto/utils/$require';

import { TAddress } from '@dequanto/models/TAddress';
import { File } from 'atma-io';
import { class_Uri } from 'atma-utils';
import { $path } from '@dequanto/utils/$path';
import { $logger } from '@dequanto/utils/$logger';
import { Web3Client } from '@dequanto/clients/Web3Client';


export class ContractAbiProvider {

    constructor (public client: Web3Client, public explorer: IBlockChainExplorer) {

    }

    async getAbi(abi: TAddress | string, opts: { implementation?: string, location?: string, optional?: boolean } = null) {

        $require.notNull(abi, `Abi not provided to get the Abi Json from`);

        let abiJson: TAbiItem[]
        let implementation: TAddress;
        if (abi.startsWith('0x')) {
            let { abi: abiResult, implementation: impl } = await this.getAbiByAddress(abi, opts);
            abiJson = abiResult;
            implementation= impl;
        } else {
            let path = abi;
            let location = opts?.location;
            if (location && $path.isAbsolute(path) === false) {
                // if path not relative, check the file at ClassFile location
                let relPath = class_Uri.combine(location, path);
                if (await File.existsAsync(relPath)) {
                    path = relPath;
                }
            }
            let json = await File.readAsync <any> (path);
            abiJson = Array.isArray(json) ? json : json.abi;
        }

        opts?.optional !== true && $require.notNull(abiJson, `Abi not resolved from ${abi}`);
        return { abiJson, implementation };
    }


    private async getAbiByAddress (abi: TAddress, opts: { implementation?: string }) {
        let address = $address.expectValid(abi, 'contract address is not valid');
        let platform = this.client.platform;
        let explorer = $require.notNull(this.explorer, `Explorer not resolved for network: ${platform}`);

        try {
            $logger.log(`Loading contracts ABI for ${address}. `)
            let { abi, implementation } = await explorer.getContractAbi(address, opts);

            let hasProxy = $address.eq(address, implementation) === false;
            $logger.log(`Proxy detected: ${hasProxy ? 'YES' : 'NO' }`, hasProxy ? implementation : '');

            let abiJson: TAbiItem[] = typeof abi === 'string' ? JSON.parse(abi) : abi;
            return { abi: abiJson, implementation };
        } catch (error) {
            $logger.error(error);
            throw new Error(`ABI is not resolved from ${platform}/${address}: ${error.message ?? error}`);
        }
    }
}
