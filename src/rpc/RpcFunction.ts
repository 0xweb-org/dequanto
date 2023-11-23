import { $rpc } from './$rpc';
import type { RpcBase } from './RpcBase';

type TParamSerializer = Function
type TReturnDeserializer = string | string[] | Function

export class RpcFunction {
    constructor(private rpc: RpcBase, private methodInfo: {
        call: string
        params?: TParamSerializer[]
        output?: TReturnDeserializer
        schemas?
    }) {

    }

    caller () {
        return async (...params) => {
            let arr = params.map((param, i) => {
                let serializer = this.methodInfo.params?.[i];
                if (typeof serializer === 'function') {
                    return serializer(param);
                }
                return param;
            });

            let result = await this.rpc.request({
                method: this.methodInfo.call,
                params: arr,
            });

            let returnsSchema = this.methodInfo.output;
            if (returnsSchema != null) {
                if (typeof returnsSchema === 'function') {
                    return returnsSchema(result);
                }
                return $rpc.deserialize(result, returnsSchema, this.methodInfo.schemas);
            }
            return result;
        }
    }
}
