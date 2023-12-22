import { Web3Client } from '@dequanto/clients/Web3Client';
import { IAccount } from '@dequanto/models/TAccount';
import { TAddress } from '@dequanto/models/TAddress';
import { TPlatform } from '@dequanto/models/TPlatform';
import { $require } from '@dequanto/utils/$require';
import memd from 'memd';

export class TxNonceManager {

    private nonce: bigint;
    private nonceUpdatedAt: number;
    private cursor = 0n;
    private cursorUpdatedAt: number;

    protected constructor (
        public platform: TPlatform,
        public account: TAddress,
    ) {

    }
    static create (client: Web3Client, account: IAccount | TAddress) {
        let address = typeof account === 'string' ? account : account.address;
        $require.Address(address, `Invalid address: ${ account }`);

        let platform = client.platform;
        let key = Utils.getKey(platform, address);
        let current = managers.get(key);
        if (current != null) {
            return current;
        }
        let manager = new TxNonceManager(platform, address);
        managers.set(key, manager);
        return manager;
    }

    /**
     * Pick current nonce without incrementing. TxDataBuilder will call the incrementCursor after the tx signed.
     * */
    public async pickNonce (client: Web3Client): Promise<bigint> {
        if (this.shouldUpdateNonce()) {
            await this.updateNonce(client);
        }
        let nonce = this.nonce + this.cursor;
        this.cursorUpdatedAt = Date.now();

        this.cursor++;
        return nonce;
    }

    public incrementCursor () {
        // this.cursor++;
    }

    private async updateNonce (client: Web3Client) {
        let nonce = await TxNonceManager.loadNonce(client, this.account);
        this.nonce = BigInt(nonce);
        this.cursor = 0n;

        this.cursorUpdatedAt = this.nonceUpdatedAt = Date.now();
    }
    static async loadNonce (client: Web3Client, address: TAddress) {
        return await client.getTransactionCount(address, 'pending');
    }

    private shouldUpdateNonce() {
        if (this.nonce == null) {
            return true;
        }
        // update nonce every 15 seconds after last usage
        const CURSOR_STALE_TIME = 1000 * 15;
        let now = Date.now();
        if (now - this.cursorUpdatedAt > CURSOR_STALE_TIME) {
            return true;
        }
        return false;
    }
}

const managers = new Map<string, TxNonceManager>();

namespace Utils {
    export function getKey (platform: TPlatform, account: TAddress) {
        let key = `${platform}:${account.toLowerCase()}`;
        return key;
    }
}
