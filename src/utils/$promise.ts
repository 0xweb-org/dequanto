import { class_EventEmitter } from 'atma-utils';

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
}
