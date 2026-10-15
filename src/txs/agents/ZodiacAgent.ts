import { EoAccount, TAccount, ZodiacAccount } from 'dequanto/models/TAccount';
import { $account } from 'dequanto/utils/$account';
import { ZodiacTx } from 'dequanto/zodiac/ZodiacTx';
import { TxWriter } from '../TxWriter';
import { ITxWriterAccountAgent } from './TxWriterAccountAgents';

export class ZodiacAgent implements ITxWriterAccountAgent {
    supports (account: TAccount) {
        return $account.isZodiac(account);
    }

    async process (sender: EoAccount, account: ZodiacAccount, outerWriter: TxWriter) {
        let zodiac = new ZodiacTx({ ...account, operator: sender }, outerWriter.client, {
            builder: outerWriter.builder.config,
            writer: outerWriter.options,
        });
        return zodiac.execute(outerWriter.builder.getTxData());
    }
}
