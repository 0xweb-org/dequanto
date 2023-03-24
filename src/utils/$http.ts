import { class_Uri } from 'atma-utils';
import axios, { AxiosRequestConfig } from 'axios';
import { $path } from './$path';
import { $require } from './$require';
import * as fs from 'fs';
import { Directory } from 'atma-io';


export namespace $http {

    export const get = axios.get;
    export const post = axios.post;
    export const put = axios.put;
    export const del = axios.delete;
    export const options = axios.options;

    /**
     *  output: Directory or File
     */
    export async function download(url: string, config: AxiosRequestConfig & { output: string }) {
        let output = $require.notNull(config.output, `Output is undefined. Should be directory or file path`);
        if ($path.hasExt(output) === false) {
            let filename = new class_Uri(url).file;
            $require.notEmpty(filename, `There is no filename with extension in source url. To save a file, you must specify the filename in "output"`);
            output = class_Uri.combine(output, filename);
        }
        if ($path.isAbsolute(output) === false) {
            output = class_Uri.combine(`file://`, process.cwd(), output);
        }

        const fileuri = new class_Uri(output);
        const filepath = fileuri.toLocalFile();

        await Directory.ensureAsync(fileuri.toDir());

        const writer = fs.createWriteStream(filepath);
        const response = await axios({
            url: url,
            responseType: 'stream',
            ...config
        });

        //ensure that the user can call `then()` only when the file has
        //been downloaded entirely.

        return new Promise((resolve, reject) => {
            response.data.pipe(writer);
            let error = null;

            writer.on('error', err => {
                error = err;
                writer.close();
                reject(err);
            });
            writer.on('close', () => {
                if (error == null) {
                    resolve(response);
                }
                // ...otherwise was rejected in `error` callback
            });
        });
    }
}
