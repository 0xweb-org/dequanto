import type { ContractBase } from '../ContractBase';
import type { ContractReaderUtils } from '../ContractReader';

export namespace FnRequestWrapper {
    export function create<T extends ContractBase>($base: T): TRequests<T> {
        return $base.$config({ send: 'manual' }) as TRequests<T>;
    }
}

type TRequests<T extends ContractBase> = {
    [K in keyof T]: T[K] extends (...any) => Promise<any>
        ? (...params: Parameters<T[K]>) => ContractReaderUtils.IContractReadParams<Awaited<ReturnType<T[K]>>>
        : never
}

