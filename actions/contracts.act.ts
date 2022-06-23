import { UAction } from 'atma-utest';
import { Generator } from '@dequanto/gen/Generator';

UAction.create({
    async 'contracts' () {
        const paths = [
            './src/contracts/common/ERC20.ts'
        ];
        for (let path of paths) {
            console.log(`Generate ${path}`);
            await Generator.generateForClass(path);
        }
    }
});
