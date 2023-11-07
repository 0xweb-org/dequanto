import { type TAbiItem } from '@dequanto/types/TAbi';
import { IBlockChainExplorer } from '@dequanto/explorer/IBlockChainExplorer';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TAddress } from '@dequanto/models/TAddress';
import { ContractBase } from './ContractBase';
import { $abiParser } from '@dequanto/utils/$abiParser';
import { Constructor } from 'atma-utils';


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

    export function fromAbi<TReturn extends ContractBase = IContractWrapped> (
        contractAddr: TAddress
        , abi: (TAbiItem | string)[]
        , client: Web3Client
        , explorer: IBlockChainExplorer
        , opts?: {
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


class ClassBuilder<T extends ContractBase> {

    constructor (private abi: TAbiItem[], private opts?: {
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
        return class extends ContractBase {
            abi = abi
            $meta = $meta
        };
    }

    private defineMethods (Ctor, abi) {

        abi
            .filter(x => x.type === 'function')
            .forEach(abiItem => {
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
            });
    }
}

namespace $abiUtil {
    export function isReader (abi: TAbiItem) {
        return ['view', 'pure', null].includes(abi.stateMutability);
    }
}
