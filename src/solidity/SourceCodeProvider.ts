import { BlockchainExplorerProvider } from '@dequanto/explorer/BlockchainExplorerProvider';
import { IBlockchainExplorer } from '@dequanto/explorer/IBlockchainExplorer';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TAddress } from '@dequanto/models/TAddress';
import { $require } from '@dequanto/utils/$require';
import alot from 'alot';
import memd from 'memd';

export class SourceCodeProvider {

    constructor(private client: Web3Client, private explorer: IBlockchainExplorer = BlockchainExplorerProvider.get(client.platform)) {

    }

    public async getSourceCode (opts: {
        contractName?: string
        address?: TAddress
        implementation?: TAddress
        sources?: {
            [file: string]: { content: string }
        },
     }): Promise<{
        main: { contractName: string, path: string, content: string }
        files: { path: string, content: string }[]
     }> {

        let { sources, contractName, address } = opts;
        if (sources == null || Object.keys(sources).length === 0) {
            let result = await this.getSourceCodeByAddress(address, opts);
            return this.getSourceCode({
                contractName: result.contractName,
                sources: result.files,
            });
        }

        let files = alot.fromObject(sources ?? {}).map(x => {
            return {
                path: x.key,
                content: x.value.content
            };
        }).toArray();

        if (files.length === 0) {
            throw new Error(`Source code can't be loaded for ${this.client.platform}:${opts.address}`);
        }

        let file = null as (typeof files[0]);
        if (files.length === 1) {
            file = files[0];
        } else {
            let rgx = new RegExp(`contract \s*${contractName}`, 'i')
            let main = await alot(files.reverse()).findAsync(async x => {
                return rgx.test(x.content);
            });
            if (main == null) {
                main = files[0];
            }
            file = main;
        }

        return {
            main: { contractName, path: file.path, content: file.content },
            files: files
        }
    }

    @memd.deco.memoize({ perInstance: true })
    private async getSourceCodeByAddress (address: TAddress, opts?: { implementation?: TAddress }): Promise<{
        contractName: string,
        files: {
            [path: string]: { content: string }
        }
    }> {

        $require.Address(address, 'The address of the contract is not valid');
        let { abi, implementation } = await this.explorer.getContractAbi(address, opts);
        let meta = await this.explorer.getContractSource(implementation ?? address);
        if (meta?.SourceCode == null) {
            throw new Error(`No contract source found.`);
        }
        return meta.SourceCode;
    }
}
