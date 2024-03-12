import { JsonArrayStore } from '@dequanto/json/JsonArrayStore';
import { JsonObjectStore } from '@dequanto/json/JsonObjectStore';
import { $promise } from '@dequanto/utils/$promise';
import { File } from 'atma-io'


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
    },
    'watchers': {
        async 'array' () {
            let path = `./test/tmp/json-store-test.json`;
            let data = [
                { id: 'foo', letter: 'F'},
                { id: 'bar', letter: 'B'}
            ]
            await File.writeAsync(path, data);

            let storeA = new JsonArrayStore<any>({
                path: path,
                key: x => x.id
            });
            let dataFromA = await storeA.getAll();
            deepEq_(data, dataFromA);


            let storeB = new JsonArrayStore<any>({
                path: path,
                key: x => x.id,
                watchFs: true
            });
            let dataFromB = await storeA.getAll();
            deepEq_(data, dataFromB);


            let dataModified = JSON.parse(JSON.stringify(data));
            dataModified[0].letter = 'Q';
            await File.writeAsync(path, dataModified);
            await $promise.wait(200);

            dataFromA = await storeA.getAll();
            deepEq_(data, dataFromA);

            dataFromB = await storeB.getAll();
            deepEq_(dataModified, dataFromB);
        },
        async 'object' () {
            let path = `./test/tmp/json-store-test-object.json`;
            let data = {
                time: Date.now()
            }
            await File.writeAsync(path, data);

            let storeA = new JsonObjectStore<any>({
                path: path
            });
            let dataFromA = await storeA.get();
            deepEq_(data, dataFromA);


            let storeB = new JsonObjectStore<any>({
                path: path,
                watchFs: true
            });
            let dataFromB = await storeA.get();
            deepEq_(data, dataFromB);


            let dataModified = JSON.parse(JSON.stringify(data));
            dataModified.time = Date.now();
            await File.writeAsync(path, dataModified);
            await $promise.wait(200);

            dataFromA = await storeA.get();
            deepEq_(data, dataFromA);

            dataFromB = await storeB.get();
            deepEq_(dataModified, dataFromB);
        }
    }
})
