import { $promise } from './$promise';

export namespace $fn {
    export function retriable<T extends TRetriableMethod> (fn: T, ctx: any)  {
        return new Retriable(fn, ctx);
    }

    export function timeoutPromise<T extends Promise<any>> (promise: T, ms: number): T {
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

    type TRetriableMethod = (...args) => Promise<any>

    interface IRetriableOptions<T extends TRetriableMethod> {
        timeout?: number
        retries?: number
        onError?: (error, ...args) => Promise<Parameters<T>> | void
    }
    class Retriable<T extends TRetriableMethod> {

        private _retries: number = 0;
        private _options: IRetriableOptions<T> = {
            timeout: null as number,
            retries: null as number,
            onError: null as (error, ...args) => Promise<Parameters<T>>
        }

        constructor (public fn: T, public ctx) {

        }
        options (opts: IRetriableOptions<T>): this {
            this._options = opts;
            return this;
        }
        call(...args: Parameters<T>): ReturnType<T> {
            return this.tick(...args);
        }

        private async tick (...args: Parameters<T>) {
            try {
                let result = await this.fn.apply(this.ctx, args);
                return result;
            } catch (error) {
                let { timeout, retries = 3, onError } = this._options;

                if (timeout != null) {
                    await $promise.wait(timeout);
                }
                if (++this._retries > retries) {
                    throw error;
                }
                if (onError) {
                    error.message += ` Will be re-executed ${this._retries}/${retries}`;
                    let overriddenArgs = await onError(error);
                    if (Array.isArray(overriddenArgs)) {
                        args = overriddenArgs;
                    }
                }
                return this.tick(...args);
            }
        }
    }
}
