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

        let sender = typeof senderMix === 'string'
            ? await ChainAccountService.get(senderMix) as EoAccount
            : senderMix;

        let owners = [ sender ];

        if (safeAccount.owners) {
            let others = await alot(safeAccount.owners)
                .mapAsync(async name => await ChainAccountService.get(name))
                .toArrayAsync();

            others
                .filter(other => $address.eq(sender.address, other.address) === false)
                .forEach(other => owners.push(other as EoAccount))
        }

        let { client, options } = outerWriter;
        let safe = new GnosisSafeHandler({
            safeAddress: safeAccount.address ?? safeAccount.safeAddress,
            owners: owners,
            client: client,
            transport: options?.safeTransport
        });
        let innerWriter = await safe.execute(outerWriter);
        return innerWriter;
    }
}
