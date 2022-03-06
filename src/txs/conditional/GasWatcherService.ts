import { Web3Client } from '@dequanto/clients/Web3Client';
import { $bigint } from '@dequanto/utils/$bigint';
import { $date } from '@dequanto/utils/$date';
import alot from 'alot';
import memd from 'memd';
import { TxWriter } from '../TxWriter';
import { GasWatcherLogger } from './GasWatcherLogger';
import { GasWatcherStore, IGasWatcherStore } from './GasWatcherStore';
import { GasWatcherTx, IGasWatcherCondition } from './GasWatcherTx';


export class GasWatcherService {
    private pending: GasWatcherTx[] = [];
    private logger = new GasWatcherLogger();
    private timer;

    static async load (client: Web3Client, store: IGasWatcherStore = new GasWatcherStore(client.platform)) {
        let service = new GasWatcherService(client, store);
        await service.loadTxs();
        return service;
    }

    protected constructor (public client: Web3Client, public store: IGasWatcherStore) {

    }

    start () {
        this.tick();
        //setInterval(() => this.tick(), ms);
    }

    async tick () {
        let start = Date.now();
        let [block, price] = await Promise.all([
            this.client.getBlockNumber(),
            this.client.getGasPrice()
        ]);

        this.logger.logPrice(price, block);
        await this.store.savePrice({ date: new Date(), price });
        await alot(this.pending)
            .forEachAsync(async entry => {
                await entry.tick(price);
            })
            .toArrayAsync();

        // let end = Date.now();
        // console.log(`Gas tick completed in ${$date.formatTimespan(end - start)}`);

        let ms = 30_000;
        if (this.pending.length > 0) {
            let expectPrice = alot(this.pending).max(x => x.condition.price) ;
            if (expectPrice < price && price - expectPrice < 10) {
                ms = 15_000;
            }
        }
        // if (expectPrice < price) {
        //     ms *= Number(price) / Number(expectPrice) * .5;
        // }
        setTimeout(() => {
            this.tick();
        }, ms)
    }

    async add (writer: TxWriter, condition: IGasWatcherCondition) {
        let writerJson = writer.toJSON();

        let exists = this.pending.some(pending => {
            let currentData = writer.builder.data;
            let pendingData = pending.txWriter.builder.data;

            let currentTo = currentData.to;
            let pendingTo = pendingData.to;
            if (currentTo !== pendingTo) {
                return false;
            }
            let currentFrom = writer.account.address;
            let pendingFrom = pending.txWriter.account.address;
            if (currentFrom !== pendingFrom) {
                return false;
            }
            if (currentData.data !== pendingData.data) {
                return false;
            }
            // similar
            return true;
        });
        if (exists) {
            return;
        }

        let gasWatcherWriter = await GasWatcherTx.fromJSON(condition, writerJson, this.logger);
        this.pending.push(gasWatcherWriter);

        let id = gasWatcherWriter.txWriter.id;
        let gwei = $bigint.toGweiFromWei(gasWatcherWriter.condition.price);
        this.logger.logTx(id, `Transaction was added to listed for ${ gwei } gas gwei`)
        // Ensure completed txs are removed
        this.pending = this.pending.filter(x => x.txWriter.receipt == null);
        await this.saveTxs();
    }

    private async loadTxs () {
        let jsons = await this.store.loadTxs();
        let pending = await alot(jsons)
            .mapAsync(x => GasWatcherTx.fromJSON(x.condition, x.writer, this.logger))
            .toArrayAsync();

        this.pending = pending;
    }
    private async saveTxs () {
        let jsons = this.pending.map(x => x.toJSON());
        await this.store.saveTxs(jsons);
    }
}

