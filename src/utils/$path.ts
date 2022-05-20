import { class_Uri } from 'atma-utils';
import { $config } from './$config';

export namespace $path {
    let root: string = null;

    export function resolve (path: string) {

        return class_Uri.combine(root ?? (root = getRoot()), path)
    }

    function getRoot () {
        let base = $config.get('settings.base');
        if (base != null) {
            let cwd = process.cwd();
            return class_Uri.combine('file://' + cwd, base);
        }

        let uri = new class_Uri('file://' + __dirname + '/');
        while (true) {
            let dir = getDirName(uri.path);
            if (!dir || dir === '/') {
                throw new Error(`Root path not resolved: ${__dirname}`);
            }
            if (dir === 'lib' || dir === 'src') {
                uri = uri.cdUp();
                let path = uri.toString();
                if (/dequanto/.test(path) === false) {
                    path = uri.combine('dequanto').toString();
                }
                return path;
            }
            uri = uri.cdUp();
        }
    }
    function getDirName (path: string) {
        return /\/?([^\/]+)\/?$/.exec(path)?.[1];
    }
}
