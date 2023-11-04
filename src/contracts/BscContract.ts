import di from 'a-di'
import { BscWeb3Client } from '@dequanto/clients/BscWeb3Client'
import { ContractReader } from './ContractReader'
import { Bscscan } from '@dequanto/explorer/Bscscan'
import { Contract, IContractInit } from './Contract'
import { ContractProvider } from './ContractProvider'

export class BscContract extends Contract {

    public client = di.resolve(BscWeb3Client);
    public explorer = di.resolve(Bscscan);
    public runner = di.resolve(ContractReader, this.client);
    public provider = di.resolve(ContractProvider, this.explorer);

    static async create (name: string, opts?: IContractInit): Promise<BscContract>
    static async create (address: string, opts?: IContractInit): Promise<BscContract>
    static async create (mix: string, opts?: IContractInit): Promise<BscContract> {

        let explorer = di.resolve(Bscscan);
        return Contract.create<BscContract>(mix, {

            Ctor: BscContract,
            explorer,

            ...(opts ?? {})
        });
    }
}
