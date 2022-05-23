import hh from 'hardhat';
import memd from 'memd';
import type Ethers from 'ethers'
import type { ContractBase } from '@dequanto/contracts/ContractBase';
import type { Constructor } from 'atma-utils/mixin';
import type { ChainAccount } from '@dequanto/ChainAccountProvider';
import { HardhatWeb3Client } from '@dequanto/clients/HardhatWeb3Client';


export class HardhatProvider {

    @memd.deco.memoize()
    static deployer(index: number = 0): ChainAccount {
        const ethers: typeof Ethers = (hh as any).ethers;
        const accounts: any = hh.config.networks.hardhat.accounts;
        const wallet = ethers.Wallet.fromMnemonic(accounts.mnemonic, accounts.path + `/${index}`);
        return {
            key: wallet.privateKey,
            address: wallet.address,
        };
    }

    @memd.deco.memoize()
    static async resolve<T extends ContractBase>(Ctor: Constructor<T>, ...params): Promise<T> {
        const ethers = (hh as any).ethers;
        const Factory: Ethers.ContractFactory = await ethers.getContractFactory(Ctor.name);
        const contract = await Factory.deploy(...params);
        const receipt = await contract.deployed();

        console.log(`Contract ${Ctor.name} deployed to ${contract.address}`);

        const client = HardhatProvider.client();
        return new Ctor(contract.address, client);
    }

    static client() {
        //$config.set('web3.hardhat.endpoints', []);

        const web3 = (hh as any).web3;
        const client = new HardhatWeb3Client({ web3, chainId: 1337 });
        return client;
    }

    @memd.deco.memoize()
    private static async compile () {
        await hh.run('compile');
    }
}
