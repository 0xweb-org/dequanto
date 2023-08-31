import memd from 'memd';
import alot from 'alot';
import type Ethers from 'ethers'
import type { ContractBase } from '@dequanto/contracts/ContractBase';
import type { Constructor } from 'atma-utils/mixin';
import type { AbiItem } from 'web3-utils';
import { ChainAccount } from "@dequanto/models/TAccount";
import { HardhatWeb3Client } from '@dequanto/clients/HardhatWeb3Client';
import { class_Uri } from 'atma-utils';
import { File, env, Directory } from 'atma-io';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { ethers } from 'ethers';
import { $logger } from '@dequanto/utils/$logger';
import { $number } from '@dequanto/utils/$number';
import { $require } from '@dequanto/utils/$require';
import { IGeneratorSources } from '@dequanto/gen/Generator';
import { $path } from '@dequanto/utils/$path';
import { ContractFactory, IContractWrapped } from '@dequanto/contracts/ContractFactory';
import { BlockChainExplorerProvider } from '@dequanto/BlockchainExplorer/BlockChainExplorerProvider';
import { IWeb3EndpointOptions } from '@dequanto/clients/interfaces/IWeb3EndpointOptions';
import { TPlatform } from '@dequanto/models/TPlatform';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';



export class HardhatProvider {

    /* lazy load */
    hh = require('hardhat');

    constructor() {
        if (this.hh.ethers == null) {
            throw new Error(`Run "npm i @nomiclabs/hardhat-ethers" to install plugin and add "require('@nomiclabs/hardhat-ethers')" to hardhat.config.js`)
        }
        if (this.hh.web3 == null) {
            throw new Error(`Run "npm i @nomiclabs/hardhat-web3" to install plugin and add "require('@nomiclabs/hardhat-web3')" to hardhat.config.js`)
        }
    }


    @memd.deco.memoize()
    client(network: 'hardhat' | 'localhost' = 'hardhat', opts: IWeb3EndpointOptions = null) {
        opts ??= {};

        if (opts.web3 == null && opts.endpoints == null) {
            if (network == 'localhost') {
                opts.endpoints = [
                    { url: 'http://127.0.0.1:8545' },
                    // Use `manual`, will be used for subscriptions only, otherwise BatchRequests will fail, as not implemented yet
                    // https://github.com/NomicFoundation/hardhat/issues/1324
                    { url: 'ws://127.0.0.1:8545', manual: true },
                ];
            } else {
                opts.web3 = this.hh.web3;
            }
        }

        const client = new HardhatWeb3Client(opts);
        return client;
    }

    async forked (params: { platform?: TPlatform, url?: string, block?: number | 'latest' } = {}) {
        const client = this.client('hardhat');
        let { url, block } = params;
        if (url == null) {
            let platform = params.platform;
            $require.notNull(platform, `Platform is required to resolve the RPC url for`);
            let platformClient = await Web3ClientFactory.get(platform);
            url = await platformClient.getNodeURL();

            // ensure we get the web3 for that url
            let web3 = await platformClient.getWeb3({ node: { url }});
            block = await web3.eth.getBlockNumber();
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
    explorer (network: 'hardhat' | 'localhost' = 'hardhat') {
        let client = this.client(network);
        let Ctor = BlockChainExplorerProvider.create({
            platform: 'hardhat',
            getWeb3: () => client,
            ABI_CACHE: '',

        });
        return new Ctor();
    }

    @memd.deco.memoize()
    deployer(index: number = 0): ChainAccount {
        const ethers: typeof Ethers = this.hh.ethers;
        const accounts: any = this.hh.config.networks.hardhat.accounts;
        const wallet = ethers.Wallet.fromMnemonic(accounts.mnemonic, accounts.path + `/${index}`);
        return {
            key: wallet.privateKey,
            address: wallet.address,
        };
    }

    @memd.deco.memoize()
    async deployClass<T extends ContractBase>(Ctor: Constructor<T>, options?: {
        deployer?: Ethers.Signer | ChainAccount
        arguments?: any[]
        client?: Web3Client
    }): Promise<T> {
        let ethers: typeof Ethers = this.hh.ethers;

        let client = options?.client ?? this.client();
        let signer = options?.deployer ?? this.deployer();
        let params = options?.arguments ?? [];

        let Factory: Ethers.ContractFactory = await this.getFactory([Ctor.name], client, signer);

        const contract = await Factory.deploy(...params);
        const receipt = await contract.deployed();

        $logger.log(`Contract ${Ctor.name} deployed to ${contract.address}`);

        return new Ctor(contract.address, client);
    }

    async deploySol <TReturn extends ContractBase = IContractWrapped > (solContractPath: string, options?: {
        client?: Web3Client
        arguments?: any[],
        deployer?:  Ethers.Signer | ChainAccount,
        paths?: {
            root?: string
            artifacts?: string
        },
        contractName?: string
    }): Promise<{
        contract: TReturn //Ethers.Contract
        abi: AbiItem[]
        bytecode: string
        source: IGeneratorSources
    }> {

        const client = options?.client ?? this.client();
        const args = options?.arguments ?? [];
        const signer = options?.deployer ?? this.deployer();
        const { abi, bytecode, source } = await this.compileSol(solContractPath, options);
        const Factory: Ethers.ContractFactory = await this.getFactory([abi, bytecode], client, signer);
        const contractEthers = await Factory.deploy(...args);
        const receipt = await contractEthers.deployed();
        const contract = await ContractFactory.fromAbi<TReturn>(contractEthers.address, abi, client, null);

        const explorer = this.explorer();
        explorer.localDb.push({ name: '', abi: abi, address: contractEthers.address });
        return {
            contract: contract,
            abi,
            bytecode,
            source
        };
    }

    async deployBytecode <TReturn extends ContractBase = IContractWrapped > (hex: string, options?: {
        client?: Web3Client
        arguments?: any[],
        deployer?:  Ethers.Signer | ChainAccount,
        paths?: {
            root?: string
            artifacts?: string
        },
        contractName?: string
        abi?: AbiItem[]
    }): Promise<{
        contract: TReturn //Ethers.Contract
        abi: AbiItem[]
        bytecode: string,
        receipt: Ethers.ContractReceipt
    }> {

        const client = options?.client ?? this.client();
        const args = options?.arguments ?? [];
        const signer = options?.deployer ?? this.deployer();
        const { abi } = options ?? {};
        const bytecode = hex;
        const Factory: Ethers.ContractFactory = await this.getFactory([abi ?? [], bytecode], client, signer);
        const contractEthers = await Factory.deploy(...args);
        const receipt = await contractEthers.deployed();
        const contract = await ContractFactory.fromAbi<TReturn>(contractEthers.address, abi, client, null);

        let receiptFinal = await receipt.deployTransaction.wait();
        const explorer = this.explorer();
        explorer.localDb.push({ name: '', abi: abi, address: contractEthers.address });
        return {
            contract: contract,
            abi,
            bytecode,
            receipt: receiptFinal,
        };
    }

    async compileSol (solContractPath: string, options?: {
        paths?: {
            root?: string
            artifacts?: string
        },
        contractName?: string
    }): Promise<{
        abi: AbiItem[]
        bytecode: string
        output: string
        source: IGeneratorSources
    }> {

        solContractPath = $path.normalize(solContractPath);

        const dir = solContractPath.replace(/[^\/]+$/, '');
        const filename = /(?<filename>[^\/]+)\.\w+$/.exec(solContractPath)?.groups.filename;
        // Filename could contain have random number, extract main-name
        const filenameRndSuffix = filename.replace(/_\d+$/, '');

        let root = options?.paths?.root;
        let artifacts = options?.paths?.artifacts;

        if (filename == null) {
            throw new Error(`Filename not extracted from ${solContractPath}`);
        }

        let hhOptions = {
            sources: dir,
            root,
            artifacts,
            tsgen: false,
        };

        await this.hh.run('compile', hhOptions);

        if (root == null) {
            root = 'file://' + $path.normalize(process.cwd());
        }
        if (artifacts == null && root != null) {
            artifacts = class_Uri.combine(root, 'artifacts/');
        }

        if (solContractPath.toLowerCase().includes(root.toLowerCase())) {
            let i = solContractPath.toLowerCase().indexOf(root.toLowerCase());
            solContractPath = solContractPath.substring(i + root.length);
        }

        let outputDir = class_Uri.combine(artifacts, solContractPath);
        let output = class_Uri.combine(outputDir, `${filename}.json`);
        if (await File.existsAsync(output) === false) {
            let path = `${outputDir}/`;
            if (await Directory.existsAsync(path) === false) {
                throw new Error(`No JSONs found in ${outputDir}, nor ${output}`);
            }
            let files = await Directory.readFilesAsync(path);
            let jsons = files.filter(x => /(?<!dbg)\.json$/.test(x.uri.file));
            if (jsons.length === 0) {
                throw new Error(`No JSONs output found in "${outputDir}/"`);
            }
            if (jsons.length === 1) {
                output = jsons[0].uri.toString();
            } else {
                let jsonFile = getJsonFile(jsons, filename);
                if (jsonFile == null) {
                    jsonFile = getJsonFile(jsons, filenameRndSuffix);
                }
                if (jsonFile == null) {
                    let contractName = options?.contractName;
                    if (contractName == null) {
                        let source = await File.readAsync<string>(solContractPath);
                        let rgx = /contract \s*(?<contractName>[\w_]+)/ig;
                        let matches = Array.from(source.matchAll(rgx));
                        contractName = matches[matches.length - 1]?.groups?.contractName;
                        options.contractName = contractName;
                    }
                    jsonFile = getJsonFile(jsons, contractName);
                }

                if (jsonFile == null) {
                    $logger.log(`Files: ${ files.map(file => file.uri.file ).join(', ')}`);
                    throw new Error(`Compiled JSON data not found for "${filename}" in "${outputDir}/"`);
                }
                output = jsonFile.uri.toString();
            }
        }
        function getJsonFile (files: InstanceType<typeof File>[], filename: string) {
            return files.find(file => {
                return file.uri.file === `${filename}.json`;
            });
        }

        let { abi, bytecode } = await File.readAsync<{ abi, bytecode }> (output);
        let files = await Directory.readFilesAsync(dir, '*.sol');


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
            output,
            source: {
                contractName: options?.contractName,
                files: fileMap
            }
        };
    }

    async deployCode <TReturn extends ContractBase = IContractWrapped>  (solidityCode: string, options: Parameters<HardhatProvider['deploySol']>[1] = {}) {

        let { tmpFile,  tmpDir, options: optionsNormalized } = await this.createTmpFile(solidityCode, options);

        try {
            return await this.deploySol <TReturn> (tmpFile, optionsNormalized);
        } finally {
            try {
                await Directory.removeAsync(tmpDir);
            } catch (_) { }
        }
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
        let tmp = env.getTmpPath(`hardhat/contracts/${contractName}_${rnd}.sol`);
        let root = tmp.replace(/contracts\/[^/]+$/, '');

        options.paths = {
            root
        };
        await File.writeAsync(tmp, solidityCode);
        return { tmpFile: tmp, tmpDir: root, options }
    }
    private getEthersProvider (client: Web3Client) {
        if (client.options.web3 != null) {
            let ethers: typeof Ethers & { provider /* hardhat */ } = this.hh.ethers;
            return ethers.provider;
        }

        let url = client.options?.endpoints[0].url;
        if (url.startsWith('ws')) {
            return new ethers.providers.WebSocketProvider(url);
        }
        return new ethers.providers.JsonRpcProvider(url);
    }

    private async getFactory (factoryArgs: [string] | [any, string], client: Web3Client, signer: Ethers.Signer | ChainAccount): Promise<Ethers.ContractFactory> {
        let ethers: typeof Ethers = this.hh.ethers;
        let Factory: Ethers.ContractFactory = await (ethers as any).getContractFactory(...factoryArgs);

        let provider = this.getEthersProvider(client);
        let $signer = 'key' in signer
            ? new ethers.Wallet(signer.key, provider)
            : signer as Ethers.Signer;

        Factory = Factory.connect($signer);
        return Factory;
    }
}
