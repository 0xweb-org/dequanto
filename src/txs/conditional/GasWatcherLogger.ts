import { $bigint } from '@dequanto/utils/$bigint';
import { $date } from '@dequanto/utils/$date';
import { $logger } from '@dequanto/utils/$logger';
import { Everlog } from 'everlog';

export class GasWatcherLogger {
    private channels = {
        prices: Everlog.createChannel('gaswatcher-prices', {
            columns: [
                {
                    type: 'date',
                    name: 'Date'
                },
                {
                    type: 'number',
                    name: 'Price(Gwei)'
                },
            ]
        }),
        txs: Everlog.createChannel('gaswatcher-txs', {
            columns: [
                {
                    type: 'date',
                    name: 'Date'
                },
                {
                    type: 'string',
                    name: 'ID'
                },
                {
                    type: 'string',
                    name: 'Message'
                }
            ]
        }),
    }

    logPrice (gasPrice: bigint, block?: number) {
        let date = new Date();
        let gwei = $bigint.toGweiFromWei(gasPrice);
        $logger.log(`Gas ${block || ''} ${ $date.format(date, 'HH:mm') } ${gwei} GWEI`);
        this.channels.prices.writeRow([
            date,
            gwei,
        ]);
    }
    logTx (id: string, message: string) {
        let date = new Date();
        let str = `Tx ${ $date.format(date, 'HH:mm') } ${message}`;
        $logger.log(str);
        this.channels.txs.writeRow([
            date,
            id,
            str
        ]);
    }
}
