import alot from 'alot';
import { TPlatform } from '@dequanto/models/TPlatform';
import { TokensServiceFactory } from '@dequanto/tokens/TokensServiceFactory';
import { TransactionReceipt } from 'web3-core';
import { TxWriter } from '../TxWriter';
import { IKnownLogFormatter, ITxLogItem } from './ITxLogItem';
import { TxLogParser } from './TxLogParser';

import { IToken } from '@dequanto/models/IToken';
import { TAddress } from '@dequanto/models/TAddress';

export interface ITxLogsTransferData {
    token: IToken
    from: TAddress
    to: TAddress
    amount: bigint
}
export class TxLogsTransfer implements IKnownLogFormatter {
    async extractFromWriter (writer: TxWriter): Promise<ITxLogsTransferData[]> {
        let receipt = await writer.onCompleted;
        let knownLogs = writer.tx?.knownLogs ?? [];
        return this.extractFromParsed(knownLogs, writer.client.platform);
    }

    async extractFromParsed(knownLogs: ITxLogItem[], platform: TPlatform): Promise<ITxLogsTransferData[]> {

        let transfers = knownLogs.filter(x => x.name === 'Transfer');
        let tokenService = TokensServiceFactory.get(platform);
        return alot(transfers).mapAsync(async transfer => {
            let erc20Address = transfer.contract;
            let token = await tokenService.getTokenOrDefault(erc20Address);
            let [ from, to, amount ] = transfer.arguments;
            return {
                token,
                from: from.value,
                to: to.value,
                amount: amount.value
            };
        }).toArrayAsync();
    }

    async extractFromReceipt (receipt: TransactionReceipt, platform: TPlatform): Promise<ITxLogsTransferData[]> {
        let parser = new TxLogParser();
        let logs = await parser.parse(receipt);
        logs = logs.filter(x => x != null);
        return this.extractFromParsed(logs, platform);
    }

    async extract (transfer: ITxLogItem, platform: TPlatform): Promise<ITxLogsTransferData> {
        let tokenService = TokensServiceFactory.get(platform);
        let erc20Address = transfer.contract;
        let token = await tokenService.getTokenOrDefault(erc20Address);
        let [ from, to, amount ] = transfer.arguments;
        return {
            token,
            from: from.value,
            to: to.value,
            amount: amount.value
        };
    }
}
