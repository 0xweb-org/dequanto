import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TAddress } from '@dequanto/models/TAddress';
import { ContractBase } from './ContractBase';

export class ContractWrapped extends ContractBase {
    abi?: any;
}

export namespace ContractFactory {

    export async function get (client: Web3Client, explorer: IBlockChainExplorer, contractAddr: TAddress) {
        let { abi } = await explorer.getContractAbi(contractAddr);

        let contract = new ContractWrapped(contractAddr, client, explorer);
        contract.abi = JSON.parse(abi);
        return contract;
    }
}
