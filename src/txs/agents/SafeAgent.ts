import { ChainAccount, SafeAccount, TAccount } from '@dequanto/models/TAccount';
import { ITxWriterAccountAgent } from './TxWriterAccountAgents';
import { $account } from '@dequanto/utils/$account';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TxDataBuilder } from '../TxDataBuilder';
import { GnosisSafeHandler } from '@dequanto/safe/GnosisSafeHandler';
import { TxWriter } from '../TxWriter';

export class SafeAgent implements ITxWriterAccountAgent {
    supports (account: TAccount) {
        return $account.isSafe(account);
    }
    async process (sender: ChainAccount, safeAccount: SafeAccount, outerWriter: TxWriter) {

        let { client, options } = outerWriter;
        let safe = new GnosisSafeHandler({
            safeAddress: safeAccount.address ?? safeAccount.safeAddress,
            owner: sender,
            client: client,
            transport: options?.safeTransport
        });
        let innerWriter = await safe.execute(outerWriter);
        return innerWriter;
    }
}
