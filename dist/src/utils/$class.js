"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$class = void 0;
var $class;
(function ($class) {
    function curry(entity, extend) {
        let cloned = Object.assign({}, entity, extend);
        let proto = Object.getPrototypeOf(entity);
        Object.setPrototypeOf(cloned, proto);
        return cloned;
    }
    $class.curry = curry;
})($class = exports.$class || (exports.$class = {}));
