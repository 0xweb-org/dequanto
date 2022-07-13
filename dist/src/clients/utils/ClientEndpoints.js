"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientEndpoints = void 0;
var ClientEndpoints;
(function (ClientEndpoints) {
    function filterEndpoints(endpoints, opts) {
        if (opts?.web3) {
            return [];
        }
        if (opts?.endpoints) {
            endpoints = opts.endpoints;
        }
        if (opts == null) {
            return endpoints;
        }
        if (endpoints == null) {
            return null;
        }
        return endpoints.filter(endpoint => {
            if (opts.type != null && endpoint.type !== opts.type) {
                return false;
            }
            if (opts.safe != null && endpoint.safe !== opts.safe) {
                return false;
            }
            if (opts.ws === true && endpoint.url.startsWith('ws') === false) {
                return false;
            }
            return true;
        });
    }
    ClientEndpoints.filterEndpoints = filterEndpoints;
})(ClientEndpoints = exports.ClientEndpoints || (exports.ClientEndpoints = {}));
