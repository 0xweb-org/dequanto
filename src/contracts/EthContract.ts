import di from 'a-di'
import { ContractReader } from './ContractReader'
import { Contract, IContractInit } from './Contract'
import { ContractProvider } from './ContractProvider'
import { Etherscan } from '@dequanto/explorer/Etherscan'
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client'

export class EthContract extends Contract {

    public client = this.opts.client ?? di.resolve(EthWeb3Client);
    public explorer = this.opts.explorer ?? di.resolve(Etherscan);
    public runner = di.resolve(ContractReader, this.client);
    public provider = di.resolve(ContractProvider, this.explorer);

    static async create (name: string, opts?: IContractInit): Promise<EthContract>
    static async create (address: string, opts?: IContractInit): Promise<EthContract>
    static async create (mix: string, opts?: IContractInit): Promise<EthContract> {

        let explorer = di.resolve(Etherscan);
        let contract = Contract.create<EthContract>(mix, {

            Ctor: EthContract,
            explorer,

            ...(opts ?? {})
        });
        return contract;
    }
}
