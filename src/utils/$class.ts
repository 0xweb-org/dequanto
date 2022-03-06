export namespace $class {
    export function curry<T, TMix> (entity: T, extend: TMix): T & TMix {
        let cloned = Object.assign({}, entity, extend);
        let proto = Object.getPrototypeOf(entity);
        Object.setPrototypeOf(cloned, proto);
        return cloned;
    }
}
