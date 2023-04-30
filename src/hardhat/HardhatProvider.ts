import memd from 'memd';
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
import alot from 'alot';
import { IGeneratorSources } from '@dequanto/gen/Generator';



export class HardhatProvider {

    /* lazy load */
    hh = require('hardhat');

    constructor() {
        if (this.hh.ethers == null) {
            throw new Error(`hardhat-ethers plugin should be installed and included in hardhat.config.js`)
        }
        if (this.hh.web3 == null) {
            throw new Error(`hardhat-web3 plugin should be installed and included in hardhat.config.js`)
        }
    }


    @memd.deco.memoize()
    client(network: 'hardhat' | 'localhost' = 'hardhat') {
        if (network == 'localhost') {
            return new HardhatWeb3Client({
                endpoints: [
                    { url: 'http://127.0.0.1:8545' },
                    // Use `manual`, will be used for subscriptions only, otherwise BatchRequests will fail, as not implemented yet
                    // https://github.com/NomicFoundation/hardhat/issues/1324
                     { url: 'ws://127.0.0.1:8545', manual: true },
                ]
            });
        }
        const web3 = this.hh.web3;
        const client = new HardhatWeb3Client({ web3 });
        return client;
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

    async deploySol (solContractPath: string, options?: {
        client?: Web3Client
        arguments?: any[],
        deployer?:  Ethers.Signer | ChainAccount,
        paths?: {
            root?: string
            artifacts?: string
        },
        contractName?: string
    }): Promise<{
        contract: Ethers.Contract
        abi: AbiItem[]
        bytecode: string
        source: IGeneratorSources
    }> {

        const client = options?.client ?? this.client();
        const args = options?.arguments ?? [];
        const signer = options?.deployer ?? this.deployer();
        const { abi, bytecode, source } = await this.compileSol(solContractPath, options);
        const Factory: Ethers.ContractFactory = await this.getFactory([abi, bytecode], client, signer);
        const contract = await Factory.deploy(...args);
        const receipt = await contract.deployed();
        return {
            contract,
            abi,
            bytecode,
            source
        };
    }

    async compileSol (solContractPath: string, options?: {
        paths?: {
            root?: string
            artifacts?: string
        },
        contractName?: string
    }): Promise<{
        abi: AbiItem[],
        bytecode: string,
        source: IGeneratorSources
    }> {


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
            root = 'file://' + process.cwd();
        }
        if (artifacts == null && root != null) {
            artifacts = class_Uri.combine(root, 'artifacts/');
        }

        if (root != null && solContractPath.toLowerCase().includes(root.toLowerCase())) {
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
                    let contractName = options.contractName;
                    if (contractName == null) {
                        let source = await File.readAsync<string>(solContractPath);
                        let rgx = /contract \s*(?<contractName>[\w_]+)/ig;
                        let matches = Array.from(source.matchAll(rgx));
                        contractName = matches[matches.length - 1]?.groups?.contractName;
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
            source: {
                contractName: options?.contractName,
                files: fileMap
            }
        };
    }

    async deployCode (solidityCode: string, options: Parameters<HardhatProvider['deploySol']>[1] = {}) {

        let { tmpFile,  tmpDir, options: optionsNormalized } = await this.createTmpFile(solidityCode, options);

        try {
            return await this.deploySol(tmpFile, optionsNormalized);
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
