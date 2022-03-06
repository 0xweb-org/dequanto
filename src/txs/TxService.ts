import { Web3Client } from '@dequanto/clients/Web3Client';

export class TxService {

    constructor(public client: Web3Client) {

    }

    async cancelTx (hash: string) {
        let tx = await this.client.getTransaction(hash);
        if (tx == null) {
            throw new Error(`Tx ${hash} not found`);
        }
        if (tx.blockNumber) {
            throw new Error(`Tx ${hash} was already mined in block ${tx.blockNumber}`);
        }
        console.log(tx);
    }
}
