import { $config } from '@dequanto/utils/$config';
import { Web3Client } from '../clients/Web3Client';
import { TPlatform } from '@dequanto/models/TPlatform';
import { IWeb3EndpointOptions } from '../clients/interfaces/IWeb3EndpointOptions';
import { ClientEndpoints } from '../clients/utils/ClientEndpoints';


// https://docs.flashbots.net/flashbots-auction/advanced/rpc-endpoint

export class FlashbotWeb3Client extends Web3Client {

    platform: TPlatform = 'hardhat'
    chainId: number = this.options.chainId ?? 1337
    chainToken = 'ETH';
    TIMEOUT: number = 5 * 60 * 1000;
    defaultGasLimit = 2_000_000

    constructor (private innerClient: Web3Client) {

    }

}
