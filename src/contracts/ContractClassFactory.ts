import { type TAbiItem } from '@dequanto/types/TAbi';
import { IBlockChainExplorer } from '@dequanto/explorer/IBlockChainExplorer';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TAddress } from '@dequanto/models/TAddress';
import { ContractBase } from './ContractBase';
import { $abiParser } from '@dequanto/utils/$abiParser';
import { Constructor } from '@dequanto/utils/types';
import alot from 'alot';


export interface IContractWrapped extends ContractBase {
    abi?: any
    [method: string]: any
}


export namespace ContractClassFactory {

    export async function get (client: Web3Client, explorer: IBlockChainExplorer, contractAddr: TAddress) {
        let { abi } = await explorer.getContractAbi(contractAddr);

        let abiJson = JSON.parse(abi);
        return fromAbi(contractAddr, abiJson, client, explorer);
    }

    export function fromAbi<TReturn = IContractWrapped> (
        contractAddr: TAddress
        , abi: (TAbiItem | string)[]
        , client: Web3Client
        , explorer?: IBlockChainExplorer
        , opts?: {
            contractName?: string
            $meta?: ContractBase['$meta']
        }
    ): {
        ContractCtor: Constructor<TReturn>
        contract: TReturn
    } {
        let arr = abi.map(item => {
            return typeof item ==='string'
                ? $abiParser.parseMethod(item)
                : item
        });
        let builder = new ClassBuilder <TReturn> (arr, opts);
        return builder.create(contractAddr, client, explorer);
    }
}


class ClassBuilder<T = ContractBase> {

    constructor (private abi: TAbiItem[], private opts?: {
        contractName?: string
        $meta?: ContractBase['$meta']
    }) {

    }

    create (contractAddr: TAddress, client: Web3Client, explorer: IBlockChainExplorer) {
        let ContractCtor = this.createClass(this.abi)

        this.defineMethods(ContractCtor, this.abi);

        let contract = new ContractCtor(contractAddr, client, explorer);
        return {
            ContractCtor: ContractCtor as Constructor<T>,
            contract: contract as T,
        };
    }

    private createClass (abi: TAbiItem[]) {
        let $meta = this.opts?.$meta;
        let Ctor = class extends ContractBase {
            abi = abi
            $meta = $meta
            Types = null
        };
        if (this.opts?.contractName) {
            Object.defineProperty(Ctor, 'name', { value: this.opts.contractName });
        }
        return Ctor;
    }

    private defineMethods (Ctor, abi: TAbiItem[]) {

        alot(abi)
            .filter(x => x.type === 'function')
            .groupBy(x => x.name)
            .forEach(group => {

                if (group.values.length > 2) {
                    let abis = group.values;
                    let abiItem = abis[0];
                    Ctor.prototype[abiItem.name] = function (this: ContractBase, ...args) {
                        let abiItem = this.$getAbiItemOverload(abis, args);
                        return this.$read(abiItem, ...args);
                    };
                    return;
                }
                let abiItem = group.values[0];
                let isRead = $abiUtil.isReader(abiItem);
                if (isRead) {
                    Ctor.prototype[abiItem.name] = function (this: ContractBase, ...args) {
                        return this.$read(abiItem, ...args);
                    };
                    return;
                }
                Ctor.prototype[abiItem.name] = function (this: ContractBase, account, ...args) {
                    return this.$write(abiItem, account, ...args);
                };
            })
            .toArray();
    }
}

namespace $abiUtil {
    export function isReader (abi: TAbiItem) {
        return ['view', 'pure', null].includes(abi.stateMutability);
    }
}
