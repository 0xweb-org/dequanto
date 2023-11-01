import di from 'a-di';
import alot from 'alot';
import { type TAbiItem } from '@dequanto/types/TAbi';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { $address } from '@dequanto/utils/$address';
import { $require } from '@dequanto/utils/$require';
import { GeneratorFromAbi } from './GeneratorFromAbi';
import { TAddress } from '@dequanto/models/TAddress';
import { File, Directory } from 'atma-io';
import { class_Uri, obj_setProperty } from 'atma-utils';
import { BlockChainExplorerProvider } from '@dequanto/BlockchainExplorer/BlockChainExplorerProvider';
import { TPlatform } from '@dequanto/models/TPlatform';
import { $path } from '@dequanto/utils/$path';
import { $logger, l } from '@dequanto/utils/$logger';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { EvmBytecode } from '@dequanto/evm/EvmBytecode';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { TEth } from '@dequanto/models/TEth';
import { $hex } from '@dequanto/utils/$hex';

export interface IGenerateOptions {
    platform: TPlatform
    name: string
    defaultAddress?: TAddress

    source: {
        abi?: string | TAddress | TAbiItem[]
        code?: string
        path?: string
    }

    output?: string

    location?: string

    /**
     * a) Slot to read the implementation address from
     * b) The implementation address
     * c) Method function to read the implementation address from
     */
    implementation?: TEth.Hex | TEth.Address | string

    /** ABI will be save alongside with TS classes */
    saveAbi?: boolean

    /** Sources will not be saved if FALSE */
    saveSources?: boolean
}
const KEYS = {
    'platform': 1,
    'name': 1,
    'defaultAddress': 1,
    'source.abi': 1,
    'source.code': 1,
    'source.path': 1,
    'output': 1,
    'implementation': 1
};

export class Generator {

    explorer: IBlockChainExplorer;
    client: Web3Client;

    constructor (public options: IGenerateOptions) {
        let {
            platform,
        } = options;

        this.explorer = BlockChainExplorerProvider.get(platform);
        this.client = Web3ClientFactory.get(platform);

        if (options.defaultAddress == null && $address.isValid(options.source.abi)) {
            options.defaultAddress = options.source.abi;
        }
    }

    static async generateFromSol (path: string) {
        let name = /(?<contractName>[^\\/]+).sol$/.exec(path)?.groups?.contractName;
        $require.notEmpty(name, `Contract name not resolved from the path ${path}`);
        $require.True(await File.existsAsync(path), `${path} does not exist`);

        let generator = new Generator({
            platform: 'hardhat',
            name: name,
            source: {
                path
            },
            output: './0xc/hardhat/'
        });
        return generator.generate();
    }

    /**
     * @deprecated Was possible to generate the Contract Class based on the meta information header in TS file
     */
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
        let {
            name,
            platform: network,
            output,
            implementation: implSource,
            source
        } = this.options;

        let abi: TAbiItem[];
        // compiled json meta output
        let artifact: string;
        let implementation: TAddress;
        let sources: IGeneratorSources;
        if (source.code == null && source.path == null) {
            // Load from block-explorer by address (follows also proxy)
            let result = await this.getAbi({ implementation: implSource as TEth.Address });
            abi = result.abiJson;
            implementation = result.implementation;

            sources = await this.getSources(name, {
                implementation,
                sourcePath: result.sourcePath,
                contractName: result.contractName,
            });
        } else {
            // From local JSON or SOL file
            let result = await this.getContractData();
            abi = result.abi;
            sources = result.source;
            artifact = result.artifact;
        }

        let generator = di.resolve(GeneratorFromAbi);
        let address = this.options.defaultAddress;
        return await generator.generate(abi, {
            network: network,
            name: name,
            contractName: sources?.contractName,
            address: address,
            output: output,
            implementation: implementation,
            sources: sources?.files,
            saveAbi: this.options.saveAbi,
            saveSources: this.options.saveSources,
            client: this.client,
            artifact
        });
    }

    private async getAbi(opts: { implementation: TEth.Address }) {
        let abi = this.options.source.abi;
        $require.notNull(abi, `Abi not provided to get the Abi Json from`);

        if (Array.isArray(abi)) {
            return {
                abiJson: abi,
                implementation: opts.implementation
            };
        }

        let sourcePath: string;
        let contractName: string;
        let abiJson: TAbiItem[]
        let implementation: TAddress;
        if (abi.startsWith('0x')) {
            let { abi, implementation: impl } = await this.getAbiByAddress(opts);
            abiJson = abi;
            implementation = impl;
        } else {
            let path = abi;
            let json = await this.readFile(path)
            if (Array.isArray(json)) {
                // simple json with abi as an array
                abiJson = json;
            } else {
                // should be compiled json artifact
                abiJson = json.abi;
                sourcePath = json.sourceName;
                contractName = json.contractName;
            }
        }

        $require.notNull(abiJson, `Abi not resolved from ${abi}`);
        return { abiJson, implementation, sourcePath, contractName };
    }
    private async getSources (name: string, opts: {
        implementation?: TAddress,
        contractName?: string,
        sourcePath?: string
        location?: string
    }): Promise<{
        contractName: string,
        files: {
            [path: string]: { content: string }
        }
    }> {
        if (opts.sourcePath != null) {
            let contractName = opts.contractName ?? name;
            let { path, code } = await this.resolveSourcePath(opts.sourcePath, opts);
            if (path == null) {
                console.error(`Source path not found: ${opts.sourcePath}`);
                return null;
            }
            return {
                contractName,
                files: {
                    [path]: {
                        content: code
                    }
                }
            };
        }
        if ($address.isValid(opts.implementation) === false) {
            return null;
        }

        $logger.log('Loading contract source code from blockchain explorer.');
        let meta = await this.explorer.getContractSource(opts.implementation);
        if (meta?.SourceCode == null) {
            $logger.log('No contract source found.');
            return null;
        }
        return meta.SourceCode;
    }
    private async resolveSourcePath (path: string, opts?: {
        // current directory, in case we have loaded *.json artifact previously
        location?: string
    }): Promise<{ path: string, code: string }> {
        if (opts?.location != null && path.startsWith('.')) {
            let absPath = $path.normalize(class_Uri.combine(opts.location, path));
            if (await File.existsAsync(absPath)) {
                return { path: absPath, code: await File.readAsync(absPath) };
            }
        }
        if (await File.existsAsync(path)) {
            return { path, code: await File.readAsync(path) };
        }
        let nodePath = `node_modules/${path}`;
        if (await File.existsAsync(nodePath)) {
            return { path: nodePath, code: await File.readAsync(nodePath) };
        }
        return { path: null, code: null };
    }
    private async getContractData (): Promise<{
        abi: TAbiItem[]
        bytecode: TEth.Hex
        artifact: string
        source: {
            contractName: string,
            files: {
                [path: string]: { content: string }
            }
        }
    }> {
        let { code, path } = this.options.source ?? {};
        if (code == null && path == null) {
            throw new Error(`getContractData was called without "code" and "path"`);
        }

        if (typeof path === 'string' && path.endsWith('.json')) {
            let json = await this.readFile(path);
            let { abi, bytecode, sourceName, contractName } = json
            let source = await this.getSources(contractName, {
                sourcePath: sourceName,
                contractName,
                location: new class_Uri(path).toDir()
            });
            return {
                abi,
                bytecode,
                artifact: path,
                source
            };
        }

        let provider = new HardhatProvider();
        let result = path != null
            ? await provider.compileSol(path)
            : await provider.compileCode(code);

        return result;
    }

    private async readFile<T = any> (path: string) {
        let location = this.options.location;
        if (location && $path.isAbsolute(path) === false) {
            // if path not relative, check the file at ClassFile location
            let relPath = class_Uri.combine(location, path);
            if (await File.existsAsync(relPath)) {
                path = relPath;
            }
        }
        let content = await File.readAsync <T> (path);
        return content;
    }

    private async getAbiByAddress (opts: { implementation: string }) {
        let address = $require.Address(this.options.source?.abi as any, 'contract address is not valid');
        let explorer = $require.notNull(this.explorer, `Explorer not resolved for network: ${this.options.platform}`);

        try {
            $logger.log(`Loading contracts ABI for ${address}. `)
            let { abi, implementation } = await explorer.getContractAbi(address, opts);

            let hasProxy = $address.eq(address, implementation) === false;
            $logger.log(`Proxy detected: ${hasProxy ? 'YES' : 'NO' }`, hasProxy ? implementation : '');

            let abiJson = JSON.parse(abi) as TAbiItem[];
            return { abi: abiJson, implementation };
        } catch (error) {
            let message = `ABI is not resolved from ${this.options.platform}/${address}: ${error.message ?? error}. Extract from bytecode...`;
            l`${message}`

            let code = await this.client.getCode(address);
            if ($hex.isEmpty(code)) {
                throw new Error(`${this.options.platform}:${address} is not a contract`);
            }

            let evm = new EvmBytecode(code);
            let abi = await evm.getAbi();

            return { abi };
        }
    }

}

export interface IGeneratorSources {
    contractName: string,
    files: {
        [path: string]: { content: string }
    }
}
