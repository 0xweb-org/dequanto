
export type TResult<T> = {
    error?: Error
    result?: T
}
export type TResultAsync<T> = Promise<TResult<T>>;
