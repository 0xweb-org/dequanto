import alot from 'alot';

export namespace Fixtures {
    type TFixtures = {
        [K: string]: any[]
    };

    export async function walk <TInner> (fixtures:  TFixtures, cb: (fixture: any, i) => Promise<any>) {

        let entries = alot.fromObject(fixtures).toArray();
            if (entries.some(x => x.key.startsWith('!'))) {
                entries = entries.filter(x => x.key.startsWith('!'));
            }

            await alot(entries).forEachAsync(async ({key, value}) => {
                if (key.startsWith('//')) {
                    return;
                }
                let arr = value;
                if (Array.isArray(arr[0]) === false) {
                    arr = [ arr ];
                }
                await alot(arr as any[]).forEachAsync(async (item, i) => {

                    try {
                        await cb(item, i);
                    } catch (error) {
                        console.error(`Failed ${key} (${i})`);
                        throw error;
                    }

                }).toArrayAsync({ threads: 1 });
            }).toArrayAsync({ threads: 1 });
    }
}
