import memd from 'memd';
import alot from 'alot';
import { class_Uri } from 'atma-utils';
import { File, env, Directory } from 'atma-io';

import type { ContractBase } from '@dequanto/contracts/ContractBase';

import type { TAbiItem } from '@dequanto/types/TAbi';
import type { TEth } from '@dequanto/models/TEth';

import { EoAccount } from '@dequanto/models/TAccount';
import { HardhatWeb3Client } from '@dequanto/hardhat/HardhatWeb3Client';
import { Web3Client } from '@dequanto/clients/Web3Client';

import { $logger } from '@dequanto/utils/$logger';
import { $number } from '@dequanto/utils/$number';
import { $require } from '@dequanto/utils/$require';
import { IGeneratorSources } from '@dequanto/gen/Generator';
import { $path } from '@dequanto/utils/$path';
import { ContractClassFactory, IContractWrapped } from '@dequanto/contracts/ContractClassFactory';
import { BlockchainExplorerFactory } from '@dequanto/explorer/BlockchainExplorerFactory';
import { IWeb3EndpointOptions } from '@dequanto/clients/interfaces/IWeb3EndpointOptions';
import { TPlatform } from '@dequanto/models/TPlatform';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';

import { ContractDeployment } from '@dequanto/contracts/deploy/ContractDeployment';
import { ContractDeployer } from '@dequanto/contracts/deploy/ContractDeployer';
import { $sig } from '@dequanto/utils/$sig';
import { $address } from '@dequanto/utils/$address';
import { $promise } from '@dequanto/utils/$promise';
import { $date } from '@dequanto/utils/$date';
import { $hex } from '@dequanto/utils/$hex';
import { TAddress } from '@dequanto/models/TAddress';
import { $contract } from '@dequanto/utils/$contract';
import { $dependency } from '@dequanto/utils/$dependency';
import { TTransport } from '@dequanto/rpc/transports/ITransport';
import { Constructor } from '@dequanto/utils/types';
import { BlockchainExplorer } from '@dequanto/explorer/BlockchainExplorer';

type THardhatLib = typeof import('hardhat');

const rgx_CONTRACT_NAME = /contract\s+(?<contractName>[\w_]+)/ig;

export class HardhatProvider {

    @memd.deco.memoize()
    client(network: 'hardhat' | 'localhost' = 'hardhat', opts: IWeb3EndpointOptions = null) {
        opts ??= {};

        if (opts.web3 == null && opts.endpoints == null) {
            if (network == 'localhost') {
                opts.endpoints = [
                    { url: 'http://127.0.0.1:8545' },
                    // Use `manual`, will be used for subscriptions only, otherwise BatchRequests will fail, as not implemented yet
                    // https://github.com/NomicFoundation/hardhat/issues/1324
                    { url: 'ws://127.0.0.1:8545' },
                ];
            } else {
                opts.web3 = this.getHardhatProvider();
            }
        }
        const client = new HardhatWeb3Client(opts);
        return client;
    }

    async forked (params: { platform?: TPlatform, url?: string, block?: number | 'latest' } = {}) {
        const client = await this.client('hardhat');
        let { url, block } = params;
        if (url == null) {
            let platform = params.platform;
            $require.notNull(platform, `Platform is required to resolve the RPC url for`);
            let platformClient = await Web3ClientFactory.get(platform);
            url = await platformClient.getNodeURL({ ws: false });

            // Hardhat looks like supports only HTTPs? nodes to fork from
            $require.True(/^(http)/.test(url), `Requires the HTTP path of a node to fork: ${url}`);

            // Removed: use default Hardhat's behavior
            // if (block == null) {
            //     let rpc = await platformClient.getRpc({ node: { url }});
            //     block = await rpc.eth_blockNumber();
            //     // hardhat performance issues on latest block. Requires at least 5 confirmations
            //     block -= 5;
            // }
        }
        await client.debug.reset({
            forking: {
                jsonRpcUrl: url,
                blockNumber: block,
            }
        });
        return client;
    }

    @memd.deco.memoize()
    async explorer (network: 'hardhat' | 'localhost' = 'hardhat') {
        let client = await this.client(network);
        return new BlockchainExplorer({
            platform: 'hardhat',
            getWeb3: () => client,
            ABI_CACHE: '',
        });
    }

    @memd.deco.memoize()
    deployer(index: number = 0): EoAccount {
        // const hh = await this.getHardhat();
        // const accounts: any = hh.config.networks.hardhat.accounts;
        const mnemonic = `test test test test test test test test test test test junk`;
        const account = $sig.$account.fromMnemonic(mnemonic, index);
        return {
            key: account.key,
            address: account.address,
        };
    }

    async getFactoryForClass <T extends ContractBase>(Ctor: Constructor<T>, options?: {
        deployer?: EoAccount
        arguments?: any[]
        client?: Web3Client
    }): Promise<{
        factory: ContractDeployment
        abi: TAbiItem[]
        bytecode: TEth.Hex
        deployedBytecode: TEth.Hex
    }> {
        let client = options?.client ?? this.client();
        let signer = options?.deployer ?? this.deployer();
        let params = options?.arguments ?? [];
        let factory = await this.getFactory(Ctor, client, signer, params);
        return {
            factory,

            bytecode: factory.ctx.bytecode,
            deployedBytecode: factory.ctx.deployedBytecode,
            abi: factory.ctx.abi
        }
    }

    async deployClass<T extends ContractBase>(Ctor: Constructor<T>, options?: {
        deployer?: EoAccount
        arguments?: any[]
        client?: Web3Client
    }): Promise<{
        contract: T
        receipt: TEth.TxReceipt
        abi: TAbiItem[]
        bytecode: TEth.Hex
        deployedBytecode: TEth.Hex
    }> {

        let client = options?.client ?? this.client();
        let { factory, abi } = await this.getFactoryForClass(Ctor, options);
        let receipt: TEth.TxReceipt;

        try {
            receipt = await factory.deploy();
        } catch (error) {
            let wrapped = new Error(`Deploy ${Ctor.name} failed: ` + error.message + `\n ${error.stack}`);
            (wrapped as any).data = error.data;
            throw wrapped;
        }

        let address = $address.toChecksum(receipt.contractAddress);
        $logger.log(`${receipt.status ? '✅' : '⛔' } Contract bold<${Ctor.name}> deployed to bold<${address}> in tx:${receipt.transactionHash}`);

        await $promise.waitForTrue(async () => {
            let code = await client.getCode(address);
            if ($hex.isEmpty(code)) {
                $logger.log(`⏳ Waiting for the contract data to be indexed...`);
                return false;
            }
            return true;
        }, {
            timeoutMessage: `${receipt.transactionHash} did not deploy in 30s`,
            timeoutMs: $date.parseTimespan('30s')
        });

        let contract = new Ctor(address, client);
        return {
            contract,
            receipt,
            abi: contract.abi,
            bytecode: factory.ctx.bytecode,
            deployedBytecode: factory.ctx.deployedBytecode
        };
    }

    async deploySol <TReturn extends ContractBase = IContractWrapped> (solContractPath: string, options?: {
        client?: Web3Client
        arguments?: any[],
        deployer?:  EoAccount,
        paths?: {
            root?: string
            artifacts?: string
        },
        contractName?: string
        tmpDir?: string
    }): Promise<{
        contract: TReturn
        ContractCtor: Constructor<TReturn>,
        receipt: TEth.TxReceipt
        abi: TAbiItem[]
        bytecode: TEth.Hex
        source: IGeneratorSources
    }> {

        const client = options?.client ?? this.client();
        const args = options?.arguments ?? [];
        const signer = options?.deployer ?? this.deployer();
        const { abi, bytecode, source } = await this.compileSol(solContractPath, options);
        const Factory = await this.getFactory([abi, bytecode], client, signer, args);

        const receipt = await Factory.deploy();
        const { contract, ContractCtor } = await ContractClassFactory.fromAbi<TReturn>(receipt.contractAddress, abi, client, null);
        const explorer = await this.explorer();
        explorer.inMemoryDb.push({ name: '', abi: abi, address: receipt.contractAddress });

        return {
            contract,
            ContractCtor,
            receipt,
            abi,
            bytecode,
            source
        };
    }

    async deployBytecode <TReturn extends ContractBase = IContractWrapped > (hex: TEth.Hex, options?: {
        client?: Web3Client
        arguments?: any[],
        deployer?:  EoAccount,
        paths?: {
            root?: string
            artifacts?: string
        },
        contractName?: string
        abi?: TAbiItem[]
    }): Promise<{
        contract: TReturn
        ContractCtor: Constructor<TReturn>
        receipt: TEth.TxReceipt
        abi: TAbiItem[]
        bytecode: TEth.Hex
    }> {

        const client = options?.client ?? this.client();
        const args = options?.arguments ?? [];
        const signer = options?.deployer ?? this.deployer();
        const { abi } = options ?? {};
        const bytecode = hex;
        const Factory = await this.getFactory([ abi , bytecode ], client, signer, args);

        const receipt = await Factory.deploy();
        const { contract, ContractCtor } = await ContractClassFactory.fromAbi<TReturn>(receipt.contractAddress, abi, client, null);

        const explorer = await this.explorer();
        explorer.inMemoryDb.push({ name: '', abi: abi, address: receipt.contractAddress });
        return {
            contract,
            ContractCtor,
            abi,
            bytecode,
            receipt: receipt,
        };
    }

    async compileSolDirectory (dir: string, options?: {
        paths?: {
            root?: string
            artifacts?: string
        },
        contractName?: string
        tsgen?: boolean
        install?: string
    }): Promise<{
        abi: TAbiItem[]
        bytecode: TEth.Hex
        output: string
        // renamed output
        artifact: string
        source: IGeneratorSources
        ContractCtor: Constructor<IContractWrapped>
        linkReferences?: Record<string /* path */, Record<string /* name */, any>>
    }[]> {

        dir = $path.normalize(dir);
        if (await Directory.existsAsync(dir) === false) {
            throw new Error(`Directory "${dir}" does not exist.`);
        }
        const paths = {
            sources: dir,
            root: options?.paths?.root,
            artifacts: options?.paths?.artifacts,
        };
        const hhOptions = {
            ...paths,
            tsgen: options?.tsgen ?? false,
            install: options?.install ?? void 0
        };
        const hh = await this.getHardhat();
        await hh.run('compile', hhOptions);

        const files = await Directory.readFilesAsync(paths.sources, '*.sol');

        const results = await alot(files).mapAsync(async file => {
            let solContractPath = file.uri.toLocalFile();
            return await this.getContractFromSolPath(solContractPath, {
                paths
            });
        }).toArrayAsync();

        return results.filter(x => x != null);
    }

    async compileSol<T extends ContractBase = IContractWrapped> (solContractPath: string, options?: {
        paths?: {
            root?: string
            artifacts?: string
        },
        contractName?: string
        tsgen?: boolean
        install?: string
    }): Promise<{
        abi: TAbiItem[]
        bytecode: TEth.Hex
        output: string
        // renamed output
        artifact: string
        source: IGeneratorSources
        ContractCtor: Constructor<T>
        linkReferences?: Record<string /* path */, Record<string /* name */, any>>
    }> {

        solContractPath = $path.normalize(solContractPath);

        const dir = $path.getDirectory(solContractPath);
        const paths = {
            sources: dir,
            root: options?.paths?.root,
            artifacts: options?.paths?.artifacts,
        };

        let hhOptions = {
            ...paths,

            tsgen: options?.tsgen ?? false,
            install: options?.install ?? void 0
        };
        const hh = await this.getHardhat();
        await hh.run('compile', hhOptions);


        return await this.getContractFromSolPath<T> (solContractPath, {
            contractName: options?.contractName,
            paths
        });
    }

    async deployCode <TReturn extends ContractBase = IContractWrapped> (
        solidityCode: string,
        options: Parameters<HardhatProvider['deploySol']>[1] = {}
    ) {

        let { tmpFile,  tmpDir, options: optionsNormalized } = await this.createTmpFile(solidityCode, options);

        try {
            return await this.deploySol <TReturn> (tmpFile, optionsNormalized);
        } finally {
            try {
                await Directory.removeAsync(tmpDir);
            } catch (_) { }
        }
    }

    async linkReferences (
        bytecode: TEth.Hex,
        linkReferences: Record<string /* path */, Record<string /* name */, any>>,
        addresses: Record<string /* name */, TAddress>
    ): Promise<TEth.Hex> {
        for (let path in linkReferences) {
            for (let name in linkReferences[path]) {
                let address = addresses[name];
                $require.AddressNotEmpty(address, `Address for "${path}:${name}" not found`);

                let str = `${path}:${name}`;
                let hash = $contract.keccak256(str, 'hex').substring(2, 34 + 2);
                let placeholder = `__$${hash}$__`;
                bytecode = bytecode.replaceAll(placeholder, address.substring(2)) as TEth.Hex;
            }
        }
        return bytecode;
    }

    async compileCode (solidityCode: string, options: Parameters<HardhatProvider['deploySol']>[1] = {}) {
        let { tmpFile,  tmpDir, options: optionsNormalized } = await this.createTmpFile(solidityCode, options);

        try {
            return await this.compileSol(tmpFile, optionsNormalized);
        } finally {
            try {
                await Directory.removeAsync(tmpDir);
            } catch (_) { }
        }
    }

    private async createTmpFile(solidityCode: string, options: Parameters<HardhatProvider['deploySol']>[1] = {}) {
        let contractName = options.contractName;
        if (contractName == null) {
            let matches = Array.from(solidityCode.matchAll(/contract\s+(?<name>[\w]+)/g));
            contractName = matches[matches.length - 1].groups.name;
        }
        $require.notNull(contractName, `Contract name not resolved from the code`);
        let rnd = $number.randomInt(0, 10**10);

        let path = `hardhat/contracts/${contractName}_${rnd}.sol`;
        let tmp = options?.tmpDir ? class_Uri.combine(options.tmpDir, `tmp${rnd}`, path) :  env.getTmpPath(path);
        let root = tmp.replace(/contracts\/[^/]+$/, '');

        options.paths = {
            root
        };
        await File.writeAsync(tmp, solidityCode);
        return { tmpFile: tmp, tmpDir: root, options }
    }


    private async getFactory (
        mix: string | Constructor<ContractBase> | [ abi: TAbiItem[], bytecode: TEth.Hex ],
        client: Web3Client,
        signer: EoAccount,
        params: any[],
    ): Promise<ContractDeployment> {

        let deployer = new ContractDeployer(client, signer);
        if (typeof mix === 'function') {
            return await deployer.prepareDeployment({
                contract: mix,
                params
            })
        }
        if (typeof mix === 'string') {
            if (mix.endsWith('json')) {
                return await deployer.prepareDeployment({
                    path: mix,
                    params
                })
            }
            return await deployer.prepareDeployment({
                name: mix,
                params
            })
        }
        let [ abi, bytecode ]  = mix;
        return await deployer.prepareDeployment({
            bytecode,
            abi,
            params
        })
    }

    @memd.deco.memoize()
    private async getHardhat (): Promise<THardhatLib> {
        return await $dependency.load<THardhatLib>('hardhat');
    }

    private async getHardhatProvider (): Promise<TTransport.Transport> {
        const hh = await this.getHardhat();
        return hh.network.provider as any as TTransport.Transport;
    }


    private async getArtifactJsonPath (solContractPath: string, options: {
        contractName?: string
        paths: {
            root: string
            artifacts: string
        }
    }) {
        let outputDir = class_Uri.combine(options.paths.artifacts, solContractPath, '/');
        if (await Directory.existsAsync(outputDir) === false) {
            let content = await this.getSolFileContent(solContractPath, options);
            if (rgx_CONTRACT_NAME.test(content) === false) {
                return null;
            }
            throw new Error(`No JSONs found in ${outputDir} for ${solContractPath}`);
        }

        if (options.contractName != null) {
            let artifactJsonPath = class_Uri.combine(outputDir, `${options.contractName}.json`);
            if (await File.existsAsync(artifactJsonPath)) {
                return artifactJsonPath;
            }
        }
        const { filename } = $path.getFilename(solContractPath);

        if (filename != null) {
            let artifactJsonPath = class_Uri.combine(outputDir, `${filename}.json`);
            if (await File.existsAsync(artifactJsonPath)) {
                return artifactJsonPath;
            }
        }
        if (filename == null) {
            throw new Error(`Filename not extracted from ${solContractPath}`);
        }
        let files = await Directory.readFilesAsync(outputDir);
        let jsons = files.filter(x => /(?<!dbg)\.json$/.test(x.uri.file));
        if (jsons.length === 0) {
            throw new Error(`No JSONs output found in "${outputDir}/"`);
        }
        if (jsons.length === 1) {
            // Only one JSON artifact found, assume it's the main contract
            let artifactJsonPath = jsons[0].uri.toString();
            return artifactJsonPath;
        }


        let jsonFile = getJsonFile(jsons, filename);
        if (jsonFile == null) {
            // Filename could contain random number, extract main-name
            const filenameRndSuffix = filename.replace(/_\d+$/, '');
            if (filenameRndSuffix != null) {
                jsonFile = getJsonFile(jsons, filenameRndSuffix);
            }
        }
        if (jsonFile == null) {
            let source = await this.getSolFileContent(solContractPath, options);
            let matches = Array.from(source.matchAll(rgx_CONTRACT_NAME));
            let contractName = matches[matches.length - 1]?.groups?.contractName;
            options.contractName = contractName;
            jsonFile = getJsonFile(jsons, contractName);
        }

        if (jsonFile == null) {
            $logger.log(`Files: ${ files.map(file => file.uri.file ).join(', ')}`);
            throw new Error(`Compiled JSON data not found for "${filename}" in "${outputDir}/"`);
        }
        let artifactJsonPath = jsonFile.uri.toString();
        return artifactJsonPath;


        function getJsonFile (files: InstanceType<typeof File>[], filename: string) {
            return files.find(file => {
                return file.uri.file === `${filename}.json`;
            });
        }
    }

    private async getPaths (paths?: { root?: string, artifacts?: string }) {
        let root = paths?.root;
        let artifacts = paths?.artifacts;

        if (root == null) {
            root = 'file://' + $path.normalize(process.cwd());
        }
        if (artifacts == null) {
            artifacts = class_Uri.combine(root, 'artifacts/');
        }

        return { root, artifacts };
    }

    private async getSolFileContent (solContractPath, options: { paths: { root }}) {
        let sourceFile = solContractPath;
        if (await File.existsAsync(sourceFile) === false) {
            sourceFile = class_Uri.combine(options.paths.root, sourceFile);
        }
        if (await File.existsAsync(sourceFile) === false) {
            throw new Error(`Source file "${solContractPath}" not found in ${options.paths.root}`);
        }

        let source = await File.readAsync<string>(sourceFile);
        return source;
    }

    public async getContractFromSolPath <T extends ContractBase = IContractWrapped>  (solContractPath: string, options?: {
        contractName?: string
        paths: {
            sources?: string
            root?: string;
            artifacts?: string;
        };
    }) {

        let { root, artifacts } = await this.getPaths (options?.paths);
        let solContractPathRootRelative = $path.getRelativePath(solContractPath, root);

        let artifactJsonPath = await this.getArtifactJsonPath(solContractPathRootRelative, {
            contractName: options?.contractName,
            paths: {
                root,
                artifacts,
            },
        });
        if (artifactJsonPath == null) {
            return null;
        }

        let { abi, bytecode, contractName, linkReferences } = await File.readAsync<IJsonArtifact> (artifactJsonPath);
        let { contract, ContractCtor } = ContractClassFactory.fromAbi<T>(null, abi, null, null, {
            contractName,
            $meta: {
                name: contractName,
                source: solContractPathRootRelative,
                artifact: artifactJsonPath
            }
        })

        let files = options?.paths?.sources
            ? await Directory.readFilesAsync(options.paths.sources, '*.sol')
            : [];
        let fileMap = await alot(files)
            .mapAsync(async file => {
                return {
                    key: file.uri.toString(),
                    content: await file.readAsync<string>()
                };
            })
            .toDictionaryAsync(x => x.key, x => ({ content: x.content }));

        return {
            abi,
            bytecode,
            output: artifactJsonPath,
            artifact: artifactJsonPath,
            source: {
                contractName: contractName ?? options?.contractName,
                files: fileMap
            },
            linkReferences,
            ContractCtor
        };
    }
}


interface IJsonArtifact {
    abi: TEth.Abi.Item[]
    bytecode: TEth.Hex
    contractName: string
    linkReferences: Record<string /* path */, Record<string /* name */, any>>
}
