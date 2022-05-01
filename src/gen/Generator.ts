import di from 'a-di';
import alot from 'alot';
import { type AbiItem } from 'web3-utils';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { $address } from '@dequanto/utils/$address';
import { $require } from '@dequanto/utils/$require';
import { GeneratorFromAbi } from './GeneratorFromAbi';
import { TAddress } from '@dequanto/models/TAddress';
import { File, Directory } from 'atma-io';
import { class_Uri, obj_setProperty } from 'atma-utils';
import { BlockChainExplorerProvider } from '@dequanto/BlockchainExplorer/BlockChainExplorerProvider';
import { TPlatform } from '@dequanto/models/TPlatform';

export interface IGenerateOptions {
    platform: TPlatform
    name: string
    defaultAddress?: TAddress

    source: {
        abi?: TAddress
        code?: string
    }

    output?: string

    location?: string

    /**
     * a) Slot to read the implementation address from
     * b) The implementation address
     * c) Method function to read the implementation address from
     */
    implementation?: string

    /** ABI will be save alongside with TS classes */
    saveAbi?: boolean
}
const KEYS = {
    'platform': 1,
    'name': 1,
    'defaultAddress': 1,
    'source.abi': 1,
    'source.code': 1,
    'output': 1,
    'implementation': 1
};

export class Generator {

    explorer: IBlockChainExplorer;

    constructor (public options: IGenerateOptions) {
        let {
            platform,
        } = options;

        this.explorer = BlockChainExplorerProvider.get(platform);

        if (options.defaultAddress == null && $address.isValid(options.source.abi)) {
            options.defaultAddress = options.source.abi;
        }
    }

    static async generateForClass (path: string) {

        let i = path.indexOf('*');
        if (i > -1) {
            let base = path.substring(0, i).replace(/\\/g, '/');
            let glob = path.substring(i).replace(/\\/g, '/');
            let files = await Directory.readFilesAsync(base, glob);

            await alot(files)
                .forEachAsync(async file => {
                    await this.generateForClass(file.uri.toString());
                })
                .toArrayAsync({ threads: 1 });
            return;
        }

        let jsCode = await File.readAsync <string> (path, { skipHooks: true });
        let startIdx = jsCode.indexOf('/*');
        let endIdx = jsCode.indexOf('*/');
        if (startIdx === -1 || endIdx === -1) {
            throw new Error(`${path} should contain dequanto options in comment`);
        }

        let header = jsCode.substring(startIdx, endIdx);
        let lines = header.split('\n');
        let rgxOpts = /(?<key>[\w.]+)\s*:\s*(?<value>[^\n]+)/;
        let options = {} as IGenerateOptions;
        for (let line of lines) {
            let match = rgxOpts.exec(line);
            if (match == null) {
                continue;
            }
            let key = match.groups.key.trim();
            let value: any = match.groups.value.trim();
            if (value === 'true') {
                value = true;
            } else if (value === 'false') {
                value = false;
            } else if (/^[\d\.]$/.test(value)) {
                value = Number(value)
            }

            if (key in KEYS === false) {
                throw new Error(`Invalid options key ${key}`);
            }

            obj_setProperty(options, key, value);
        }

        // make Contracts in dequanto package relative to dequanto root
        let rgxRoot = /[\\\/]dequanto[\\\/].+/;
        if (rgxRoot.test(path)) {
            let root = path.replace(rgxRoot, '/dequanto/');
            options.output = class_Uri.combine(root, options.output);
        }
        let generator = new Generator({
            ...options,
            location: new class_Uri(path).toDir().toString()
        });
        await generator.generate();
    }

    async generate () {
        let { name, platform: network, output, implementation: implSource } = this.options;

        let { abiJson, implementation } = await this.getAbi({ implementation: implSource });
        let sources = await this.getSources(implementation, name);
        let generator = di.resolve(GeneratorFromAbi);

        let address = this.options.defaultAddress;

        return await generator.generate(abiJson, {
            network: network,
            name: name,
            address: address,
            output: output,
            implementation: implementation,
            sources: sources,
            saveAbi: this.options.saveAbi
        });
    }

    private async getAbi(opts: { implementation: string }) {
        let abi = this.options.source.abi;
        $require.notNull(abi, `Abi not provided to get the Abi Json from`);

        let abiJson: AbiItem[]
        let implementation: TAddress;
        if (abi.startsWith('0x')) {
            let { abi, implementation: impl } = await this.getAbiByAddress(opts);
            abiJson = abi;
            implementation= impl;
        } else {
            let path = abi;
            let location = this.options.location;
            if (location && path[0] !== '/') {
                // if path not relative, check the file at ClassFile location
                let relPath = class_Uri.combine(location, path);
                if (await File.existsAsync(relPath)) {
                    path = relPath;
                }
            }
            let json = await File.readAsync <any> (path);
            abiJson = Array.isArray(json) ? json : json.abi;
        }

        $require.notNull(abiJson, `Abi not resolved from ${abi}`);
        return { abiJson, implementation };
    }
    private async getSources (implementation: TAddress, name: string) {
        if ($address.isValid(implementation) === false) {
            return null;
        }

        console.log('Loading contract source code.');
        let meta = await this.explorer.getContractSource(implementation);
        if (meta?.SourceCode == null) {
            console.log('No contract source found.');
            return null;
        }
        if (/^\s*\{/.test(meta.SourceCode) === false) {
            console.log('Source contract as single file fetched.');
            return {
                [`${name}.sol`]: {
                    content: meta.SourceCode
                }
            };
        }

        let code = meta
            .SourceCode
            .replace(/\{\{/g, '{')
            .replace(/\}\}/g, '}')

        try {
            let sources = JSON.parse(code);
            let files = sources.sources;

            console.log(`Source code (${Object.keys(files).join(', ')}) fetched.`)
            return files;
        } catch (error) {
            console.error(`Source code can't be parsed: `, code);
            throw new Error(`Source code can't be parsed: ${error.message}`);
        }
    }

    private async getAbiByAddress (opts: { implementation: string }) {
        let address = $address.expectValid(this.options.source?.abi, 'contract address is not valid');
        let explorer = $require.notNull(this.explorer, `Explorer not resolved for network: ${this.options.platform}`);

        try {
            console.log(`Loading contracts ABI for ${address}. `)
            let { abi, implementation } = await explorer.getContractAbi(address, opts);

            let hasProxy = $address.eq(address, implementation) === false;
            console.log(`Proxy detected: ${hasProxy ? 'YES' : 'NO' }`, hasProxy ? implementation : '');

            let abiJson = JSON.parse(abi) as AbiItem[];
            return { abi: abiJson, implementation };
        } catch (error) {
            console.error(error);
            throw new Error(`ABI is not resolved from ${this.options.platform}/${address}: ${error.message ?? error}`);
        }
    }
}
