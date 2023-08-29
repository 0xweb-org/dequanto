import type { TxWriter } from '../TxWriter';

import { ChainAccount, Erc4337Account, TAccount } from '@dequanto/models/TAccount';
import { ITxWriterAccountAgent } from './TxWriterAccountAgents';
import { $account } from '@dequanto/utils/$account';
import { Erc4337Factory } from '@dequanto/erc4337/Erc4337Factory';

export class Erc4337Agent implements ITxWriterAccountAgent {
    supports (account: TAccount) {
        return $account.isErc4337(account);
    }
    async process (sender: ChainAccount, account: Erc4337Account, outerWriter: TxWriter) {

        let { client, builder } = outerWriter;

        let erc4337TxWriter = Erc4337Factory.createWriter({
            client: client,
            platform: client.platform,
        });
        let tx = builder.getTxData(client);
        let { writer: opWriter } = await erc4337TxWriter.submitUserOpViaEntryPointWithOwner({
            erc4337Account: {
                address: account.address
            },
            tx,
            owner: sender,
            submitter: sender,
        });

        return opWriter;
    }
}
