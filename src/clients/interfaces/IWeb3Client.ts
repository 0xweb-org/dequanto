import { TxData } from '@ethereumjs/tx';
import Web3 from 'web3';

export interface IWeb3Client {
    platform: string
    chainId: number
    defaultGasLimit: number

    // web3: Web3
    // eth: Web3['eth']


    sign (txData: TxData, privateKey: string): Buffer
}
