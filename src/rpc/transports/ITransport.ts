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
        unsubscribe (req: Request & { method: 'eth_unsubscribe', params: [number] }): Promise<Subscription<any>>
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
        id: number
        unsubscribe(cb?: Function): void | Promise<boolean>
        subscribe (cb: (x: T) => void, onError?: (x: Error | any) => void, once?): any
    }

    export namespace Options {

        export type Any = string | Http | Ws | Wrapped | Transport | Web3Wrapper | IEip1193Provider;

        export type Http = {
            url: string
        } & Omit<Parameters<typeof fetch>[1], 'headers'> & {
            headers?: Record<string, string | ((req) => Promise<string>)>
        };

        export type Ws = {
            url: string
            clientConfig?: ClientOptions
        }

        export type Wrapped = {
            transport: Transport
        }

        export type Web3Wrapper = {
            web3: IWeb3EndpointOptions['web3']
        }
    }
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
