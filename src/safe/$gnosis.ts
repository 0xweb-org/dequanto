import Web3Adapter from '@gnosis.pm/safe-web3-lib';
import { ChainAccount } from '@dequanto/models/TAccount';
import { $hex } from '@dequanto/utils/$hex';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { Web3 } from '@dequanto/clients/compatibility/Web3';

export namespace $gnosis {
    export async function getAdapter (owner: ChainAccount, client: Web3Client): Promise<Web3Adapter> {
        const web3 = new Web3(client);

        if (owner.key) {
            web3.eth.accounts.wallet.add($hex.ensure(owner.key));
        }

        const ethAdapter = new Web3Adapter({
            web3: <any>web3,
            signerAddress: owner.address,
        });
        return ethAdapter;
    }
}
