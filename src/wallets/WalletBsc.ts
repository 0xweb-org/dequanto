import di from 'a-di';
import { BscWeb3Client } from '@dequanto/clients/BscWeb3Client';
import { Wallet } from './Wallet';
import { Bscscan } from '@dequanto/explorer/Bscscan';
import { TPlatform } from '@dequanto/models/TPlatform';
import { TAddress } from '@dequanto/models/TAddress';

/** @deprecated use generic Wallet.ts */
export class WalletBsc extends Wallet {
    constructor (account: { platform: TPlatform, address: TAddress },) {
        super(account, di.resolve(BscWeb3Client), di.resolve(Bscscan));
    }
}
