import { Etherscan } from '@dequanto/explorer/Etherscan';
import { IBlockChainExplorer } from '@dequanto/explorer/IBlockChainExplorer';
import { IContractDetails } from '@dequanto/models/IContractDetails';
import { TAddress } from '@dequanto/models/TAddress';
import di from 'a-di';


interface IContract {
    address: TAddress
    abi: string
    name?: string
}

export interface IContractProvider {
    getAbi (address: string): Promise<string>
    getInfo (address: string): Promise<IContractDetails>
}

export class ContractProvider implements IContractProvider {

    constructor (public api: IBlockChainExplorer = di.resolve(Etherscan)) {

    }

    async getByName(name: string): Promise<IContract> {
        let info = this.api.localDb.find(x => x.name === name);
        let { abi } = await this.api.getContractAbi(info.address);

        return {
            ...info,
            abi
        };
    }

    async getByAddress (address: string): Promise<IContract> {
        let info = await this.getInfo(address);
        if (info == null) {
            throw new Error(`Contract info not found for ${address}`)
        }
        let abi = await this.getAbi(info.address);

        return {
            ...info,
            abi
        };
    }

    async getAbi (address: string): Promise<string> {
        let { abi } = await this.api.getContractAbi(address);
        return abi;
    }
    async getInfo (q: string): Promise<IContractDetails> {
        return this.api.getContractMeta(q);
    }
}
