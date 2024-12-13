import di from 'a-di';
import alot from 'alot';
import { Rpc, RpcTypes } from './Rpc';

import { TAbiItem, TAbiOutput } from '@dequanto/types/TAbi';
import { TAddress } from '@dequanto/models/TAddress';
import { $require } from '@dequanto/utils/$require';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { $abiCoder } from '@dequanto/abi/$abiCoder';
import { RpcError } from './RpcError';
import { $hex } from '@dequanto/utils/$hex';
import { TEth } from '@dequanto/models/TEth';
import { DataLike } from '@dequanto/utils/types';
import { $web3Abi } from '@dequanto/clients/utils/$web3Abi';
import { BlockDateResolver } from '@dequanto/blocks/BlockDateResolver';
import type { Web3Client } from '@dequanto/clients/Web3Client';


type TRpcContract = {
    address?: TAddress
    abi?: TAbiItem[]
};

type TRpcContractCallBase = {
    address?: TAddress

    abi?: string | TAbiItem | TAbiItem[]
    method?: string
    params?: any[]

    data?: TEth.Hex

    value?: bigint
    from?: TAddress
    blockNumber?: DataLike<RpcTypes.BlockNumberOrTagOrHash> | Date
}

export type TRpcContractCall = (TRpcContractCallBase & Pick<TRpcContractCallBase, 'method' | 'params'>)
    | (TRpcContractCallBase & Pick<TRpcContractCallBase, 'data'>)

export class RpcContract {
    constructor(public client: Web3Client, private defaults?: TRpcContract) {

    }

    async request (req: TRpcContractCall) {
        let { methodAbi, methodRequest } = await this.getCallRequestRaw(req);

        try {
            let hex = await this.client.request(methodRequest);
            if ($hex.isEmpty(hex)) {
                return null;
            }
            if (methodAbi == null) {
                return hex;
            }
            return utils.deserializeOutput(hex, methodAbi.outputs);
        } catch (err) {
            if (err instanceof RpcError) {
                err.message = `RpcCall ${req.method} (${JSON.stringify(req.params)}) ${err.message}`;
            }
            throw err;
        }
    }

    async batch (req: TRpcContractCall[]) {

        let requests = await this.getCallRequestsRaw(req);
        try {
            let responseArr = await this.client.batch(requests.map(x => x.methodRequest));

            return responseArr.map((resp, i) => {
                let abi = requests[i].methodAbi;
                if (abi == null) {
                    return resp;
                }
                let outputs = abi.outputs;
                let hex = typeof resp === 'string' ? resp : resp.data;
                let result = utils.deserializeOutput(hex, outputs);
                return result;
            });

        } catch (err) {
            if (err instanceof RpcError) {
                err.message = `RpcCall ${req.map(x => x.method).join(', ')} ${err.message}`;
            }
            throw err;
        }
    }

    private async getCallRequestsRaw (requests: TRpcContractCall[]) {
        return alot(requests).mapAsync(req => this.getCallRequestRaw(req)).toArrayAsync();
    }
    private async getCallRequestRaw (request: TRpcContractCall) {
        let address = request.address ?? this.defaults?.address;
        $require.Address(address);

        let data = request.data;
        let { abi, method, params, blockNumber } = request;
        let abiArr = $web3Abi.ensureAbis(abi ?? this.defaults?.abi);
        let abiItem = abiArr?.find(x => x.name === method);
        if (abiItem == null) {
            abiItem = this.defaults?.abi?.find(x => x.name === method);
        }

        if (data == null) {
            $require.notNull(abiItem, `Method ${method} not found. Available methods: ${abiArr?.map(x => x.name) }`);
            data = $abiUtils.serializeMethodCallData(abiItem, params ?? []);
        }
        if (blockNumber instanceof Date) {
            let resolver = di.resolve(BlockDateResolver, this.client);
            blockNumber = await resolver.getBlockNumberFor(blockNumber);
        }
        let tx = {
            from: request.from ?? void 0,
            to: address,
            value: $hex.ensure(request.value ?? 0n),
            data: data,
        };
        let rpc = new Rpc();
        return {
            methodRequest: rpc.req.eth_call(tx, blockNumber ?? 'latest'),
            methodAbi: abiItem
        };
    }



    // async submit (contract: TRpcContract, req: TRpcContractCallReq) {
    //     let abis = contract.abi;
    //     let abi = abis.find(x => x.name === req.method);
    //     $require.notNull(abi, `Method ${req.method} not found. Available methods: ${abis.map(x => x.name).join(', ')}`);

    //     let sig = $abiUtils.getMethodSignature(abi);
    //     let data = $abiUtils.encode(abi.inputs, req.params);

    //     let result = await this.rpc.eth_call({
    //         from: req.from,
    //         to: contract.address,
    //         input: sig + data.substring(2),
    //         value: req.value ?? 0n,
    //     }, req.blockNumber ?? 'latest');

    //     let outputs = abi.outputs;
    //     let results = Array.isArray(result) === false
    //         ? [ result ]
    //         : (outputs.length === 1
    //             // decode array as single value
    //             ? [ result ]
    //             : result
    //         );

    //     return $abiCoder.decode(outputs, results)
    // }

    // protected getTransaction () {

    // }
}


namespace utils {
    export function deserializeOutput(hex: string, outputs: TAbiOutput[]) {
        let abi = outputs;
        let isDynamic: boolean = null;
        if (outputs.length > 1) {
            let isNamedTuple = outputs.every(x => x.name != null && x.name !== '');
            if (isNamedTuple) {
                // will return as object
                abi = [ { type: 'tuple', components: outputs, name: null } ];
                isDynamic = false;
            }
        }
        let arr = $abiCoder.decode(abi as any, hex, {
            dynamic: isDynamic
        });
        let value = abi.length === 1 ? arr[0] : arr;
        return value;
    }
}
