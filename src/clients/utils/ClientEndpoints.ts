import { IWeb3EndpointOptions } from '../interfaces/IWeb3EndpointOptions';

export namespace ClientEndpoints {

    export function filterEndpoints (endpoints, opts: IWeb3EndpointOptions) {
        if (opts?.endpoints) {
            endpoints = opts.endpoints
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
        })
    }

}
