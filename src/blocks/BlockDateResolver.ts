import { Web3Client } from '@dequanto/clients/Web3Client';
import { $block } from '@dequanto/utils/$block';
import alot from 'alot';

export class BlockDateResolver {
    private AVG_INITIAL = {
        eth: 12_000,
        bsc: 3_000,
        polygon: 3_000,
    };

    private closestTime: number;
    private closestIdx: number;
    private maxBlock: number;

    private known = [] as IKnownBlock[]
    private q: Date;

    constructor(public client: Web3Client) {

    }

    async getBlockNumberFor (date: Date): Promise<number> {
        this.q = date;

        let avg = this.AVG_INITIAL[this.client.platform] ?? this.AVG_INITIAL['eth'];
        let now = new Date();
        let topBlock = <IKnownBlock> {
            blockNumber: await this.client.getBlockNumberCached(),
            date: now,
            avg,
        };

        this.maxBlock = topBlock.blockNumber;
        this.known.push(topBlock);
        return await this.moveNext(date);
    }

    private async moveNext (date: Date) {

        let closestIndex = this.getClosest(date);
        let block = this.known[closestIndex];
        let timeDiff = this.diffTime(block.date, date);

        let timeDistance = Math.abs(timeDiff);
        const BLOCKS_TOLERANCE = 2;
        if (timeDistance <= block.avg * BLOCKS_TOLERANCE) {
            return block.blockNumber;
        }
        if (this.closestTime != null && timeDistance >= this.closestTime) {
            let b = this.known[this.closestIdx];
            return b.blockNumber;
        }

        this.closestTime = timeDistance;
        this.closestIdx = closestIndex;

        let nextInfo = await this.checkPoint(block, timeDiff);
        if (nextInfo == null) {
            return block.blockNumber;
        }

        return this.moveNext(date);
    }

    /**
     * Returns index of the first known block, which is most near to specified block (it can be before or after the specified date).
     */
    private getClosest (date: Date) {
        let entry = alot(this.known).map(x => [
            this.diffTimeAbs(x.date, date),
            x
        ] as const).minItem(x => x[0])[1];
        let i = this.known.indexOf(entry);
        return i;
    }

    private async checkPoint (anchor: IKnownBlock, diffTime: number) {
        let diffCount = Math.round(diffTime / anchor.avg);
        if (diffCount === 0) {
            return null;
        }
        let blockNumber = anchor.blockNumber + diffCount;
        if (blockNumber < 0) {
            throw new Error(`Date Out of range: ${ this.q.toISOString() }. Based on the AVG block time, the blockchain was not active on that date`);
        }
        let date = await this.getBlockDate(blockNumber);
        let info = {
            blockNumber: blockNumber,
            date: date,
        };
        this.push(info);
        this.refineAvg();
        return info;
    }

    /** Add a know block to set */
    private push(info: IKnownBlock) {
        for (let i = 0; i < this.known.length; i++) {
            let x = this.known[i];
            if (info.date < x.date) {
                this.known.splice(i, 0, info);
                return;
            }
        }
        this.known.push(info);
    }
    /** Loads the block and gets the Date of the block */
    private async getBlockDate (blockNumber: number) {
        let block = await this.client.getBlock(blockNumber);
        if (block == null) {
            throw new Error(`Block not loaded: ${blockNumber}`);
        }
        let date = $block.getDate(block);
        return date;
    }
    /** Returns SIGNED time in milliseconds between two dates. Negative values when t2 < t1 */
    private diffTime (t1: Date, t2: Date) {
        return (t2.getTime() - t1.getTime());
    }
    /** Returns ABSOLUTE time in milliseconds between two dates.  */
    private diffTimeAbs (t1: Date, t2: Date) {
        return Math.abs(this.diffTime(t1, t2));
    }
    /** Returns AVG block count between two dates */
    private getAvgBlockCountBetween (b1: IKnownBlock, b2: IKnownBlock) {
        let diff = this.diffTimeAbs(b1.date, b2.date);
        return Math.round(diff / Math.abs(b2.blockNumber - b1.blockNumber));
    }
    /** With N>1 blocks we can better find out the AVG block time */
    private refineAvg () {
        for (let i = 1; i < this.known.length; i++) {
            let info = this.known[i];
            let prev = this.known[i - 1];

            info.avg = this.getAvgBlockCountBetween(prev, info);
            if (i === 1) {
                this.known[0].avg = info.avg;
            }
        }
    }
}

interface IKnownBlock {
    blockNumber: number;
    date: Date
    avg?: number
}

