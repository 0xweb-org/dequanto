import * as dts from 'dts-bundle';
import { File, Directory } from 'atma-io';
import alot from 'alot';
import { class_Uri } from 'atma-utils';

async function process () {

    let files = await Directory.readFilesAsync(`./lib/types/`, `**.d.ts`);
    console.log(`Files`, files.length);


    await await alot(files).forEachAsync(async (file, i) => {

        let path = file.uri.toString();
        let typesRoot = path.replace(/\/lib\/types\/.$/, '/lib/types/');
        let cjsFile = path.replace('/lib/types/', '/lib/cjs/').replace(/\.d\.ts$/, '.js');
        let mjsFile = path.replace('/lib/types/', '/lib/esm/').replace(/\.d\.ts$/, '.mjs');

        let [ cjsFileExists, mjsFileExists ] = await Promise.all([
            File.existsAsync(cjsFile),
            File.existsAsync(mjsFile),
        ]);
        if (cjsFileExists === false && mjsFileExists === false) {
            return;
        }

        let content = await file.readAsync<string>({ skipHooks: true });

        content = content.replace(/from (?<q>['"])(?<path>@dequanto\/[^'"]+)['"]/g, (match, q, importPath) => {
            let importPathFull = importPath.replace(/^@dequanto\//, typesRoot);
            let importPathRelative = new class_Uri(importPathFull).toRelativeString(typesRoot);

            return `from ${q}${importPathRelative}${q}`;
        });

        if (cjsFileExists) {
            let cjsFileTarget = cjsFile.replace(/.js$/, '.d.ts');
            await File.writeAsync(cjsFileTarget, content, { skipHooks: true });
        }
        if (mjsFileExists) {
            let mjsFileTarget = mjsFile.replace(/.mjs$/, '.d.ts');
            await File.writeAsync(mjsFileTarget, content, { skipHooks: true });
        }

    }).toArrayAsync();
}

export { process }
