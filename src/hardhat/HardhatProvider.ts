import memd from 'memd';
import alot from 'alot';
import { class_Uri } from 'atma-utils';
import { File, env, Directory } from 'atma-io';

import type { ContractBase } from '@dequanto/contracts/ContractBase';
import type { Constructor } from 'atma-utils/mixin';
import type { TAbiItem } from '@dequanto/types/TAbi';
import type { TEth } from '@dequanto/models/TEth';

import { ChainAccount } from "@dequanto/models/TAccount";
import { HardhatWeb3Client } from '@dequanto/clients/HardhatWeb3Client';
import { Web3Client } from '@dequanto/clients/Web3Client';

import { $logger } from '@dequanto/utils/$logger';
import { $number } from '@dequanto/utils/$number';
import { $require } from '@dequanto/utils/$require';
import { IGeneratorSources } from '@dequanto/gen/Generator';
import { $path } from '@dequanto/utils/$path';
import { ContractClassFactory, IContractWrapped } from '@dequanto/contracts/ContractClassFactory';
import { BlockChainExplorerProvider } from '@dequanto/explorer/BlockChainExplorerProvider';
import { IWeb3EndpointOptions } from '@dequanto/clients/interfaces/IWeb3EndpointOptions';
import { TPlatform } from '@dequanto/models/TPlatform';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { ChainAccountProvider } from '@dequanto/ChainAccountProvider';

import { ContractDeployment } from '@dequanto/contracts/deploy/ContractDeployment';
import { ContractDeployer } from '@dequanto/contracts/deploy/ContractDeployer';
import { $sig } from '@dequanto/utils/$sig';
import { $address } from '@dequanto/utils/$address';




export class HardhatProvider {

    /* lazy load */
    hh = require('hardhat');



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
            url = await platformClient.getNodeURL({ ws: false });

            // Hardhat looks like supports only HTTP nodes to fork from
            $require.True(/^(http)/.test(url), `Requires the HTTP path of a node to fork: ${url}`);

            if (block == null) {
                let rpc = await platformClient.getRpc({ node: { url }});
                block = await rpc.eth_blockNumber();
                // hardhat performance issues on latest block. Requires at least 5 confirmations
                block -= 5;
            }
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
        const accounts: any = this.hh.config.networks.hardhat.accounts;
        const account = $sig.$account.fromMnemonic(accounts.mnemonic, index);
        return {
            key: account.key,
            address: account.address,
        };
    }

    async getFactoryForClass <T extends ContractBase>(Ctor: Constructor<T>, options?: {
        deployer?: ChainAccount
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
        deployer?: ChainAccount
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
            let wrapped = new Error(`Deploy ${Ctor.name} failed: ` + error.message);
            (wrapped as any).data = error.data;
            throw wrapped;
        }

        let address = $address.toChecksum(receipt.contractAddress);
        $logger.log(`Contract ${Ctor.name} deployed(${receipt.status}) to ${address} in tx:${receipt.transactionHash}`);
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
        deployer?:  ChainAccount,
        paths?: {
            root?: string
            artifacts?: string
        },
        contractName?: string
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
        const explorer = this.explorer();
        explorer.localDb.push({ name: '', abi: abi, address: receipt.contractAddress });

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
        deployer?:  ChainAccount,
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

        const explorer = this.explorer();
        explorer.localDb.push({ name: '', abi: abi, address: receipt.contractAddress });
        return {
            contract,
            ContractCtor,
            abi,
            bytecode,
            receipt: receipt,
        };
    }

    async compileSol<T extends ContractBase = IContractWrapped> (solContractPath: string, options?: {
        paths?: {
            root?: string
            artifacts?: string
        },
        contractName?: string
    }): Promise<{
        abi: TAbiItem[]
        bytecode: TEth.Hex
        output: string
        // renamed output
        artifact: string
        source: IGeneratorSources
        ContractCtor: Constructor<T>
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

        let { abi, bytecode, contractName } = await File.readAsync<{ abi, bytecode, contractName }> (output);
        let files = await Directory.readFilesAsync(dir, '*.sol');
        let { contract, ContractCtor } = ContractClassFactory.fromAbi<T>(null, abi, null, null, {
            $meta: {
                artifact: output
            }
        })

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
            artifact: output,
            source: {
                contractName: contractName ?? options?.contractName,
                files: fileMap
            },
            ContractCtor
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


    private async getFactory (
        mix: string | Constructor<ContractBase> | [ abi: TAbiItem[], bytecode: TEth.Hex ],
        client: Web3Client,
        signer: ChainAccount,
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

}
