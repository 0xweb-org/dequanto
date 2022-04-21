import { $config } from '@dequanto/utils/$config';

export class CoingeckoOracle {

    key = $config.get('coingecko.key');

    constructor() {

    }
    getToken (name: string) {

    }
}
