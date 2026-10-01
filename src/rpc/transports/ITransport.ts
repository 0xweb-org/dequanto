import type { IWeb3EndpointOptions } from '@dequanto/clients/interfaces/IWeb3EndpointOptions';
import type { TEth } from '@dequanto/models/TEth';
import type { ClientOptions } from 'ws'
import { IEip1193Provider } from './compatibility/EIP1193Transport';

export namespace TTransport {

    export type Transport = {
        id?: string

        request (req: Request[]): Promise<Response[]>
        request (req: Request): Promise<Response>

        subscribe <TResult = any> (req: Request): Promise<Subscription<TResult>>
        unsubscribe (req: Request & { method: 'eth_unsubscribe', params: [SubscriptionId] }): Promise<Subscription<any>>
    }

    export type Request = {
        id: number
        jsonrpc: `${number}`
        method: string
        params: any[]
    }
    export type Response = {
        id: number
        error?: {
            code: number,
            reason?: string
            message: string
            data?: { message: string, data: TEth.Hex }
        }
        result?: any
    }

    export interface Subscription <T> {
        id: SubscriptionId
        unsubscribe(cb?: Function): void | Promise<boolean>
        subscribe (cb: (x: T) => void, onError?: (x: Error | any) => void, once?): any
    }

    export type SubscriptionId = string | number;

    export namespace Options {

        export type Timeout = {
            /** Maximum time for an RPC request in milliseconds. Set to 0 to disable. */
            timeout?: number
        }

        export type Any = string | Http | Ws | Wrapped | Transport | Web3Wrapper | IEip1193Provider;

        export type Http = {
            url: string
        } & Omit<Parameters<typeof fetch>[1], 'headers'> & {
            headers?: Record<string, string | ((req) => Promise<string>)>
        } & Timeout;

        export type Ws = {
            url: string
            clientConfig?: ClientOptions
        } & Timeout

        export type Wrapped = {
            transport: Transport
        }

        export type Web3Wrapper = {
            web3: IWeb3EndpointOptions['web3']
        }
    }
}


export const DEFAULT_RPC_REQUEST_TIMEOUT = 3 * 60 * 1000;

export class RpcRequestTimeoutError extends Error {
    override name = 'RpcRequestTimeoutError';
    code = 1006;
    reason = 'connection failed';

    constructor(public timeout: number, context?: string) {
        super(`RPC request timed out after ${timeout}ms${context ? ` (${context})` : ''}`);
    }
}

export function getRpcRequestTimeout(options?: unknown): number {
    if (options != null && typeof options === 'object' && 'timeout' in options) {
        let timeout = Number((options as TTransport.Options.Timeout).timeout);
        if (Number.isFinite(timeout) && timeout >= 0) {
            return timeout;
        }
    }
    return DEFAULT_RPC_REQUEST_TIMEOUT;
}

export function rpcRequestWithTimeout<T>(promise: PromiseLike<T>, timeout: number, context?: string, onTimeout?: () => void): Promise<T> {
    if (timeout === 0 || Number.isFinite(timeout) === false) {
        return Promise.resolve(promise);
    }
    return new Promise<T>((resolve, reject) => {
        let completed = false;
        let timer = setTimeout(() => {
            if (completed) {
                return;
            }
            completed = true;
            onTimeout?.();
            reject(new RpcRequestTimeoutError(timeout, context));
        }, timeout);

        Promise.resolve(promise).then(
            result => {
                if (completed) {
                    return;
                }
                completed = true;
                clearTimeout(timer);
                resolve(result);
            },
            error => {
                if (completed) {
                    return;
                }
                completed = true;
                clearTimeout(timer);
                reject(error);
            }
        );
    });
}


export class RequestError extends Error {
    override name = 'RequestError'

    data?
    status?: number
    url: string

    constructor({
      data,
      status,
      url,
    }: {
      data?: any
      status?: number
      url: string
    }) {
      super(`RPC error: ${status}; ${url} - ${JSON.stringify(data)}`);

      this.data = data
      this.status = status
      this.url = url
    }
  }
