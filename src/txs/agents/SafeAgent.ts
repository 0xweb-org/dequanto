import { EoAccount, SafeAccount, TAccount } from '@dequanto/models/TAccount';
import { ITxWriterAccountAgent } from './TxWriterAccountAgents';
import { $account } from '@dequanto/utils/$account';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TxDataBuilder } from '../TxDataBuilder';
import { GnosisSafeHandler } from '@dequanto/safe/GnosisSafeHandler';
import { TxWriter } from '../TxWriter';
import alot from 'alot';
import { ChainAccountService } from '@dequanto/ChainAccountService';
import { $address } from '@dequanto/utils/$address';

export class SafeAgent implements ITxWriterAccountAgent {
    supports (account: TAccount) {
        return $account.isSafe(account);
    }
    async process (senderMix: string | EoAccount, safeAccount: SafeAccount, outerWriter: TxWriter) {

        let { client, options } = outerWriter;
        let safe = await GnosisSafeHandler.getInstance(senderMix, safeAccount, client, {
            transport: options?.safeTransport
        });
        let innerWriter = await safe.execute(outerWriter);
        return innerWriter;
    }
}
