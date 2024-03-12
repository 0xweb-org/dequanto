import { JsonArrayStore } from '@dequanto/json/JsonArrayStore';
import { $promise } from '@dequanto/utils/$promise';
import { File } from 'atma-io';

UTest({
    async 'should check arr' () {
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
    }
})
