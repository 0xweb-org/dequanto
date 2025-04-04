import { class_Uri } from 'atma-utils';
import { $config } from './$config';
import { env } from 'atma-io';
import { $dependency } from './$dependency';
import { $is } from './$is';

export namespace $path {
    let root: string = null;

    /*** Gets dequanto root path (cwd or npm global modules) */
    export function resolve (path: string) {
        return class_Uri.combine(root ?? (root = getRoot()), path)
    }
    export function isAbsolute(path: string) {
        if (path[0] === '/') {
            return true;
        }
        let hasProtocol = /^[\w]{2,5}:[\\\/]{2,}/.test(path);
        if (hasProtocol) {
            return true;
        }
        return false;
    }
    export function hasExt (path: string) {
        return /\.\w+($|\?)/.test(path);
    }
    export function normalize (path: string) {
        path = path
            // Replace all / duplicates, but not near the protocol
            .replace(/(?<![:/])\/{2,}/g, '/')
            // Use forward slashes
            .replace(/\\/g, '/')
            // Replace "foo/./bar" with single slash: "foo/bar"
            .replace(/\/\.\//g, '/')
            ;
        while (true) {
            let next = path.replace(/([^\/]+)\/\.\.\//g, (match, p1) => {
                if (p1 !== '..' && p1 !== '.') {
                    return '';
                }
                return match;
            });
            if (next === path) {
                // nothing to collapse
                break;
            }
            path = next;
        }
        return path;
    }
    export function getDirectory (path: string) {
        const dir = path.replace(/[^\/\\]+$/, '');
        return dir;
    }

    export function getFilename (path: string) {
        const match = /(?<filename>[^\/\\]+)\.(?<extension>\w+)$/.exec(path);
        const { filename, extension } = match?.groups ?? { filename: null, extension: null };
        return { filename, extension };
    }

    export function getRelativePath (path: string, base?: string) {
        if (path == null) {
            return null;
        }
        if (base == null) {
            base = env.currentDir.toString();
        }
        let path_ = normalize(path).replace('file://', '');
        let base_ = normalize(base).replace('file://', '');
        let i = path_.toLowerCase().indexOf(base_.toLowerCase());
        if (i > -1) {
            return path_.substring(i + base_.length);
        }
        return path;
    }

    function getRoot () {
        let base = $config.get('settings.base');
        if ($is.BROWSER) {
            let root = $dependency.dirname();
            if (base != null && isAbsolute(base)) {
                return base;
            }
            base ??= '/node_modules/dequanto/';
            return class_Uri.combine(root, base);
        }
        if (base != null) {
            let cwd = process.cwd();
            return class_Uri.combine('file://' + cwd, base);
        }

        let dirname = $dependency.dirname();
        let uri = new class_Uri('file://' + dirname + '/');
        while (true) {
            let dir = getDirName(uri.path);
            if (!dir || dir === '/') {
                throw new Error(`Root path not resolved: ${dirname}`);
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
