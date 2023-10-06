import { $require } from '@dequanto/utils/$require';
import { IRpc, IRpcRequestModel, IRpcResponseModel, IRpcTransport } from './transports/ITransport'
import { RpcError } from './RpcError';
import { RpcSubscription } from './RpcSubscription';


let ID = 0;
export class RpcModelMiddleware implements IRpc {
    constructor (protected transport: IRpcTransport, protected returns: {
        methods: {
            [method: string]: any
        }
        schemas: {
            [model: string]: any
        }
    }) {

    }
    async request <TRespMode = any> (req: IRpcRequestModel): Promise<IRpcResponseModel> {
        let body = this._wrapBody(req);
        let resp = await this.transport.request(body);
        if ('error' in resp) {
            throw new RpcError(resp.error);
        }
        let result = this._unwrapBody(resp);
        return this._deserialize(req.method, result);
    }
    async batch (reqs: IRpcRequestModel[]) {
        let body = reqs.map(req => this._wrapBody(req));
        let resp = await this.transport.request(body);
        return resp.map((resp, i) => {
            let req = reqs[i];
            let result = this._unwrapBody(resp);
            return this._deserialize(req.method, result);
        });

    }
    subscribe <TRespModel = any> (req: IRpcRequestModel): RpcSubscription<TRespModel> {
        let body = this._wrapBody(req);
        return this.transport.subscribe(body);
    }

    private _wrapBody (req: IRpcRequestModel): any {
        if (Array.isArray(req)) {
            return req.map(x => this._wrapBody(x));
        }
        return {
            id: ID++,
            jsonrpc: '2.0',

            method: req.method,
            params: req.params
        };
    }
    private _unwrapBody (resp: any): TRespModel {
        return resp.result;
    }
    private _deserialize (method: string, result: any) {
        let { methods, schemas } = this.returns;
        let schema = methods[method];
        if (schema in schemas) {
            schema = schemas[schema];
        }
        if (schema == null || result == null) {
            return result;
        }
        return this._deserializeSingle(result, schema)

    }

    private _deserializeSingle (model: any, schema: string | string[] | { oneOf: string[] }) {
        let type = schema;
        if (typeof schema === 'string') {
            switch (type) {
                case 'number':
                    return Number(model);
                case 'bigint':
                    return BigInt(model);
                case 'boolean':
                    return Boolean(model);
            }
        }
        if (Array.isArray(schema)) {
            $require.True(schema.length === 1, `Schema length must be 1 (the type): ${schema}`);

            if (Array.isArray(model) === false) {
                throw new Error(`Result must be an array: ${JSON.stringify(model)}`);
            }
            return model.map(x => this._deserializeSingle(x, schema[0]));
        }
        if (typeof schema === 'object') {
            let modelType = typeof model;
            if ('oneOf' in schema) {
                let oneOf = schema.oneOf.find(x => typeof x === modelType);
                if (oneOf) {
                    return this._deserializeSingle(model, oneOf);
                }
                return model;
            }
            if (modelType === 'object') {
                let out = {};
                for (let key in model) {
                    out[key] = this._deserializeSingle(model[key], schema[key]);
                }
                return out;
            }
        }
        return model;
    }
}

