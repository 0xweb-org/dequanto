import memd from 'memd';
import type Ethers from 'ethers'
import type { ContractBase } from '@dequanto/contracts/ContractBase';
import type { Constructor } from 'atma-utils/mixin';
import { ChainAccount } from "@dequanto/models/TAccount";
import { HardhatWeb3Client } from '@dequanto/clients/HardhatWeb3Client';
import { class_Uri } from 'atma-utils';
import { File } from 'atma-io';


export class HardhatProvider {

    /* lazy load */
    hh = require('hardhat');

    constructor() {
        if (this.hh.ethers == null) {
            throw new Error(`hardhat-ethers plugin should be installed and included in hardhat.config`)
        }
        if (this.hh.web3 == null) {
            throw new Error(`hardhat-web3 plugin should be installed and included in hardhat.config`)
        }
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
    async resolve<T extends ContractBase>(Ctor: Constructor<T>, ...params): Promise<T> {
        return this.resolveForSigner(null, Ctor, ...params);
    }

    @memd.deco.memoize()
    async resolveForSigner<T extends ContractBase>(signer: Ethers.Signer | ChainAccount, Ctor: Constructor<T>, ...params): Promise<T> {
        let ethers: typeof Ethers = this.hh.ethers;
        let Factory: Ethers.ContractFactory = await (ethers as any).getContractFactory(Ctor.name);
        if (signer != null) {

            let $signer = 'key' in signer
                ? new ethers.Wallet(signer.key, Factory.signer.provider)
                : signer as Ethers.Signer;

            const provider = ethers.getDefaultProvider();
            Factory = Factory.connect($signer);
        }

        const contract = await Factory.deploy(...params);
        const receipt = await contract.deployed();

        console.log(`Contract ${Ctor.name} deployed to ${contract.address}`);

        const client = this.client();
        return new Ctor(contract.address, client);
    }

    client() {
        const web3 = this.hh.web3;
        const client = new HardhatWeb3Client({ web3 });
        return client;
    }

    async deploy (solContractPath: string, ...params): Promise<{ contract: Ethers.Contract, abi }> {
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

        let ethers: typeof Ethers = this.hh.ethers;
        let Factory: Ethers.ContractFactory = await (ethers as any).getContractFactory(abi, bytecode);

        const contract = await Factory.deploy(...params);
        const receipt = await contract.deployed();
        return {
            contract,
            abi
        };
    }
}
