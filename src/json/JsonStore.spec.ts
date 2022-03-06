import { File } from 'atma-io'
import { JsonArrayStore } from './JsonArrayStore';
import { JsonObjectStore } from './JsonObjectStore';


let pathArr = '/test/tmp/jsonstore-arr.json';
let pathObj = '/test/tmp/jsonstore-obj.json';

UTest({
    'array': {
        $before () {
            File.exists(pathArr) && File.remove(pathArr);
        },
        async 'should handle multiple' () {
            let store = new JsonArrayStore<any>({ path: pathArr, key: x => x.id });
            let tick = Date.now();

            store.upsert({ id: 1, letter: 'A', tick });
            store.upsert({ id: 1, letter: 'B' });
            store.upsert({ id: 1, letter: 'C' });
            store.upsert({ id: 1, letter: 'D' });
            await store.upsert({ id: 1, letter: 'E' });

            let arr = await store.getAll();
            eq_(arr.length, 1);
            eq_(arr[0].letter, 'E');
            eq_(arr[0].tick, tick);

            store.upsert({ id: 1, letter: 'F' });
            await store.upsert({ id: 1, letter: 'G' });

            arr = await store.getAll();
            eq_(arr.length, 1);
            eq_(arr[0].letter, 'G');

            await store.getLock();

            let existsBak = await File.existsAsync(pathArr + '.bak');
            eq_(existsBak, false);

            let str = await File.readAsync <string> (pathArr, { skipHooks: true, cache: false });
            eq_(str[0], '[');

            let json = JSON.parse(str);
            deepEq_(json, arr);
        },
        'should load file and then write': {
            async $before () {
                await File.writeAsync(pathArr, [
                    { id: 'foo', letter: 'F'},
                    { id: 'bar', letter: 'B'}
                ]);
                File.clearCache();
            },
            async 'load and upsert' () {
                let store = new JsonArrayStore<any>({
                    path: pathArr,
                    key: x => x.id,
                    map: (x) => {
                        x.letter = x.letter.toLowerCase();
                        return x;
                    }
                });
                let all = await store.getAll();
                let tick = Date.now();

                eq_(all.length, 2);

                all[0].tick = tick;
                all[1].tick = tick;
                await store.upsertMany(all);

                File.clearCache();
                let arr = await File.readAsync<any[]>(pathArr);
                eq_(arr.length, 2);
                eq_(arr[0].tick, tick);
                eq_(arr[0].letter, 'f');
            }
        }
    },
    'object': {
        $before () {
            File.exists(pathObj) && File.remove(pathObj);
        },
        async 'should handle multiple' () {
            let store = new JsonObjectStore<any>({ path: pathObj });
            let tick = Date.now();

            await store.save({  tick });

            let obj = await store.get();
            eq_(obj.tick, tick);

            let obj1 = await File.readAsync <any> (pathObj, { cache: false });
            eq_(obj1.tick, tick);
        },
    }
})
