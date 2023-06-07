import { TError } from '@dequanto/models/TError';
import { class_EventEmitter } from 'atma-utils';
import { TFnWithCallback } from './types';

export namespace $promise {
    export function wait (ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    };

    export function fromEvent<
        T extends Pick<class_EventEmitter, 'on' | 'off'>,
        TArgs extends Parameters<T['on']>,
    > (
        eventEmitter: T,
        event: TArgs[0],
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const cb = (value) => {
                resolve(value);
                eventEmitter.off(event, cb)
            };
            eventEmitter.on(event, cb);
        });
    }


    export function fromCallback <TResult, TArgs extends any[]> (fn: TFnWithCallback<TArgs, TResult>, ...args: TArgs): Promise<TResult> {
        return new Promise((resolve, reject) => {
            fn(...args, (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(result);
            });
        })
    }

    export function fromCallbackCtx <TResult, TArgs extends any[]> (ctx: any, fn: TFnWithCallback<TArgs, TResult>, ...args: TArgs): Promise<TResult> {
        return new Promise((resolve, reject) => {
            fn.call(ctx, ...args, (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(result);
            });
        })
    }

    export async function catched<T, TErr extends Error = TError > (fn: () => Promise<T>): Promise<{ result?: T, error?: TError}>
    export async function catched<T, TErr extends Error = TError & { code?: string | number } > (promise: Promise<T>): Promise<{ result?: T, error?: TError}>
    export async function catched<T, TErr extends Error = TError & { code?: string | number } > (mix: Promise<T> | (() => Promise<T>)): Promise<{ result?: T, error?: TError}> {
        try {
            let promise = typeof mix === 'function' ? mix() : mix;
            let result = await promise;
            return { result };
        } catch (error) {
            return { error };
        }
    }

    export function timeout<T extends Promise<any>> (promise: T, ms: number): T {
        let err = new Error(`Promise timeouted in ${ms}ms`)

        return new Promise((resolve, reject) => {
            let completed = false;
            let timeout = setTimeout(() => {
                if (completed) {
                    return;
                }
                completed = true;
                reject(err);
            }, ms);

            promise.then(
                result => {
                    completed = true;
                    clearTimeout(timeout);
                    resolve(result);
                },
                err => {
                    completed = true;
                    clearTimeout(timeout);
                    reject(err);
                }
            );
        }) as T;
    }

    export function waitForTrue (check: () => boolean | Promise<boolean>, opts?: Parameters<typeof waitForObject>[1]): Promise<any> {
        return waitForObject(async () => {
            let result = await check();
            return [ null, result === true ? {} : null ]
        }, opts);
    }

    export function waitForObject<T>(check: () => Promise<[Error, T?]>, opts?: {
        intervalMs?: number
        timeoutMs?: number
        timeoutMessage?: string | (() => string)
    }): Promise<T>  {
        let start = Date.now();
        let completed = false;
        let intervalMs = opts?.intervalMs ?? 500;
        let timeoutMs  = opts?.timeoutMs ?? null;
        let timeoutMessage = opts?.timeoutMessage ?? `Waiting for object timeouted`;

        return new Promise(async (resolve, reject) => {
            async function tick () {
                let [ error, result ] = (await check()) ?? [ null, null ];
                if (result != null) {
                    completed = true;
                    resolve(result);
                    return;
                }
                if (error != null) {
                    completed = true;
                    reject(error);
                    return;
                }
                if (timeoutMs != null && (Date.now() - start) > timeoutMs) {
                    completed = true;
                    let message = typeof timeoutMessage === 'function'
                        ? timeoutMessage()
                        : timeoutMessage;

                    reject(new Error(message));
                    return;
                }
            }

            while (true) {
                try {
                    await tick ();
                } finally {}
                if (completed === true) {
                    break;
                }
                await $promise.wait(intervalMs);
            }
        });
    }

}
