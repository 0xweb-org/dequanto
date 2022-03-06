"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atma_io_1 = require("atma-io");
const JsonArrayStore_1 = require("./JsonArrayStore");
const JsonObjectStore_1 = require("./JsonObjectStore");
let pathArr = '/test/tmp/jsonstore-arr.json';
let pathObj = '/test/tmp/jsonstore-obj.json';
UTest({
    'array': {
        $before() {
            atma_io_1.File.exists(pathArr) && atma_io_1.File.remove(pathArr);
        },
        async 'should handle multiple'() {
            let store = new JsonArrayStore_1.JsonArrayStore({ path: pathArr, key: x => x.id });
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
            let existsBak = await atma_io_1.File.existsAsync(pathArr + '.bak');
            eq_(existsBak, false);
            let str = await atma_io_1.File.readAsync(pathArr, { skipHooks: true, cache: false });
            eq_(str[0], '[');
            let json = JSON.parse(str);
            deepEq_(json, arr);
        },
        'should load file and then write': {
            async $before() {
                await atma_io_1.File.writeAsync(pathArr, [
                    { id: 'foo', letter: 'F' },
                    { id: 'bar', letter: 'B' }
                ]);
                atma_io_1.File.clearCache();
            },
            async 'load and upsert'() {
                let store = new JsonArrayStore_1.JsonArrayStore({
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
                atma_io_1.File.clearCache();
                let arr = await atma_io_1.File.readAsync(pathArr);
                eq_(arr.length, 2);
                eq_(arr[0].tick, tick);
                eq_(arr[0].letter, 'f');
            }
        }
    },
    'object': {
        $before() {
            atma_io_1.File.exists(pathObj) && atma_io_1.File.remove(pathObj);
        },
        async 'should handle multiple'() {
            let store = new JsonObjectStore_1.JsonObjectStore({ path: pathObj });
            let tick = Date.now();
            await store.save({ tick });
            let obj = await store.get();
            eq_(obj.tick, tick);
            let obj1 = await atma_io_1.File.readAsync(pathObj, { cache: false });
            eq_(obj1.tick, tick);
        },
    }
});
