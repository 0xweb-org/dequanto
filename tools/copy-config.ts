import { File, Directory } from 'atma-io';
import alot from 'alot';

async function process () {

    let config = await File.readAsync<any>(`configs/dequanto.yml`);

    let json = JSON.stringify(config, null, 4);
    let content = [
        `import { IConfigData } from './interface/IConfigData';`,
        `import { DefaultFactory } from './DefaultFactory';`,
        `export const ConfigDefaults = DefaultFactory(${json});\n`
    ].join('\n');
    await File.writeAsync('src/config/ConfigDefaults.ts', content);
}

export { process }
