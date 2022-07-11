import memd from 'memd';
import type Ethers from 'ethers'
import type { ContractBase } from '@dequanto/contracts/ContractBase';
import type { Constructor } from 'atma-utils/mixin';
import { ChainAccount } from "@dequanto/models/TAccount";
import { HardhatWeb3Client } from '@dequanto/clients/HardhatWeb3Client';
import { class_Uri } from 'atma-utils';
import { File } from 'atma-io';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { ethers } from 'ethers';


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


    client(network: 'hardhat' | 'localhost' = 'hardhat') {
        if (network == 'localhost') {
            return new HardhatWeb3Client({
                endpoints: [ { url: 'http://127.0.0.1:8545' } ]
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

        console.log(`Contract ${Ctor.name} deployed to ${contract.address}`);


        return new Ctor(contract.address, client);
    }

    async deploySol (solContractPath: string, options?: {
        client?: Web3Client
        arguments?: any[],
        deployer?:  Ethers.Signer | ChainAccount
    }): Promise<{ contract: Ethers.Contract, abi }> {

        const client = options?.client ?? this.client();
        const args = options?.arguments ?? [];
        const signer = options?.deployer ?? this.deployer();

        const dir = solContractPath.replace(/[^\/]+$/, '');
        const filename = /(?<filename>[^\/]+)\.\w+$/.exec(solContractPath)?.groups.filename;
        if (filename == null) {
            throw new Error(`Filename not extracted from ${solContractPath}`);
        }

        await this.hh.run('compile', {
            sources: dir
        });

        let output = class_Uri.combine('./artifacts/', solContractPath, `${filename}.json`);
        let { abi, bytecode } = await File.readAsync<{ abi, bytecode }> (output);

        let Factory: Ethers.ContractFactory = await this.getFactory([abi, bytecode], client, signer);

        const contract = await Factory.deploy(...args);
        const receipt = await contract.deployed();
        return {
            contract,
            abi
        };
    }

    private getEthersProvider (client: Web3Client) {
        if (client.options.web3) {
            let ethers: typeof Ethers & { provider /* hardhat */ } = this.hh.ethers;
            return ethers.provider;
        }

        let url = client.options?.endpoints[0].url;
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
