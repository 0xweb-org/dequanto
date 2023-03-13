import { $config } from '@dequanto/utils/$config';

export class CoingeckoOracle {

    key = $config.get('coingecko.key');

    constructor() {
        throw new Error(`Not implemented`)
    }
    getToken (name: string) {

    }
}
