import * as dts from 'dts-bundle';
import { File, Directory } from 'atma-io';

async function process () {

    let files = await Directory.readFilesAsync(`./ts-temp/`, `**.d.ts`);
    for (let file of files) {
        await Normalizer.preprocess(file);
    }

    dts.bundle({
        name: 'dequanto',
        main: './ts-temp/src/exp.d.ts',
        out: './build/typings/index.d.ts',
        emitOnIncludedFileNotFound: true,
    });

    const target = './lib/umd/dequanto.d.ts';
    const source = './ts-temp/src/build/typings/index.d.ts';

    await Normalizer.postprocess(new File(source));
    File.copyTo(source, target);
}

namespace Normalizer {
    function removeFileNotFoundModuleExports (source) {
        let exportsNotFound = /[ \t]*export \{[^\}]+\} from ['"][^'"]+\/\-\-\/[^'"]+['"];?[ \t]*/g;
        let str = source.replace(exportsNotFound, '');
        return {
            source: str,
            modified: source !== str
        };
    }
    function normalizeGlobalImports (source: string) {
        let importGlobal = /^[ \t]*import ['"][^'"]+['"];?[ \t]*$/gm;
        let str = source.replace(importGlobal, '');
        return {
            source: str,
            modified: source !== str
        };
    }
    function normalizeInterfaceImports (source: string) {
        let importsRgx = /import\("([^"]+)"\)\.([a-zA-Z_$\d]+)/g;
        let handled = {};
        let out = source;
        // extract
        do {
            let match = importsRgx.exec(source);
            if (match == null) {
                break;
            }
            let [_, path, name ] = match;

            let key = `${path}:${name}`;
            if (key in handled) {
                continue;
            }

            out = `import { ${name} } from '${path}'; \n ${out}`;
            handled[key] = 1;
        } while (true);


        if (out === source) {
            return { source: out, modified: false }
        }

        // remove
        out = out.replace(importsRgx, '$2');
        return { source: out, modified: true }
    }

    export async function preprocess (file: InstanceType<typeof File>) {
        let source = await file.readAsync<string>({ skipHooks: true, encoding: 'utf8' });

        let result = { source, modified: false };
        let modified = false;

        result = removeFileNotFoundModuleExports(result.source);
        modified = result.modified || modified;

        result = normalizeGlobalImports(result.source);
        modified = result.modified || modified;

        result = normalizeInterfaceImports(result.source);
        modified = result.modified || modified;

        if (modified === false) {
            // no imports
            return;
        }
        await file.writeAsync(result.source, { skipHooks: true });
    }
    export async function postprocess (file: InstanceType<typeof File>) {
        let source = await file.readAsync<string>({ skipHooks: true, encoding: 'utf8' });

        let result = { source, modified: false };
        let modified = false;

        result = removeFileNotFoundModuleExports(result.source);
        modified = result.modified || modified;

        if (modified === false) {
            // no imports
            return;
        }
        await file.writeAsync(result.source, { skipHooks: true });
    }
}

export { process }
