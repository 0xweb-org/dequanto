import { Constructor } from 'atma-utils';
import type { ContractBase } from '../ContractBase';
import { TAbiItem } from '@dequanto/types/TAbi';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import alot from 'alot';
import { $class } from '@dequanto/utils/$class';
import { ContractBaseUtils } from '../utils/ContractBaseUtils';
import { IAccount } from '@dequanto/models/TAccount';
import { ContractWriter } from '../ContractWriter';

export namespace FnSignedWrapper {
    export function create<T extends ContractBase>($base: T) {

        let abiArr = $base.abi;

        let fns = alot(abiArr)
            .filter(abi => abi.type === 'function' && $abiUtils.isReadMethod(abi) === false)
            .map(abiMethod => {
                return {
                    name: abiMethod.name,
                    async fn(this: T, sender: IAccount, ...args: any[]) {

                        let { address, client, builderConfig, writerConfig } = this;
                        let writer = new ContractWriter(address, client, builderConfig, writerConfig);

                        return ContractBaseUtils.$signed(
                            writer,
                            abiMethod,
                            abiArr,
                            sender,
                            ...args
                        );
                    }
                }
            }).toDictionary(x => x.name, x => x.fn);

        let $contract = $class.curry($base, {
            ...fns
        });
        return $contract as any;
    }
}
