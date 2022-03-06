"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$promise = void 0;
var $promise;
(function ($promise) {
    function wait(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }
    $promise.wait = wait;
    ;
})($promise = exports.$promise || (exports.$promise = {}));
