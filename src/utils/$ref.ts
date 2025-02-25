import { IEip1193Provider } from '@dequanto/rpc/transports/compatibility/EIP1193Transport';
import { class_EventEmitter } from 'atma-utils';



export type TGlobal = {
    ethereum: IEip1193Provider;
    addEventListener (event: string, listener: Function, options?: boolean | AddEventListenerOptions): void;
    dispatchEvent (event: any): void;
}

export namespace $ref {
    export function getGlobal (): TGlobal {
        if (typeof window !== 'undefined' && typeof window === 'object') {
            const g = window as any as TGlobal;
            return g;
        }
        if (typeof global !== 'undefined' && typeof global  === 'object') {
            const g = global as any as TGlobal;

            if (typeof g.addEventListener !== 'function' || typeof g.dispatchEvent !== 'function') {
                const emitter = new class_EventEmitter;
                g.addEventListener = function (event: string, fn: Function) {
                    emitter.on(event, fn);
                };
                g.dispatchEvent = function (event: CustomEvent) {
                    emitter.emit(event.type, event);
                };
            }

            return g;
        }
        throw new Error('No global object found');
    }
}
