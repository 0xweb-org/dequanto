import { class_Uri } from 'atma-utils';
import { $path } from './$path';
import { $require } from './$require';
import { $logger } from './$logger';
import { Directory, File } from 'atma-io';
import { $is } from './$is';


interface THttpResponse<T> {
    status: 200 | number
    data: T
}

export namespace $http {

    const handlers = [] as {
        rgx: RegExp,
        handler: (opts: IHttpFetch) => Promise<{ status, data, headers? }>
    }[];

    export function register (rgx: RegExp, handler: (typeof handlers[0]['handler'])) {
        handlers.push({ rgx, handler });
    }

    export interface IHttpFetch {
        url: string
        method?: 'GET' | string
        params?: Record<string, string>
        body?: string | Record<string, string> | any
        headers?: Record<string, string>
        responseType?: 'stream'
    }

    async function doFetch <T = any> (opts: IHttpFetch): Promise<THttpResponse<T>> {
        let url = opts.url;
        if (opts.params) {
            url += '?' + new URLSearchParams(opts.params).toString();
        }
        let headers = new Headers(opts.headers ?? {});
        let body = opts.body;
        if (body != null) {
            let contentType = headers.get('Content-Type');
            if (contentType == null) {
                contentType = 'application/json';
                headers.append('Content-Type', contentType);
                //headers.append('Content-Type', 'application/x-www-form-urlencoded');
            }

            if (typeof body !== 'string') {
                if (contentType.includes('urlencoded')) {
                    const params = new URLSearchParams(opts.body);
                    // for (let key in opts.body) {
                    //     params.append(key, opts.body[key]);
                    // }
                    body = params.toString();
                }
                if (contentType.includes('json')) {
                    body = JSON.stringify(body);
                }
            }
        }


        let options = {
            method: opts.method ?? 'GET',
            headers: headers,
            body: body
        };

        let handler = handlers.find(x => x.rgx.test(url));
        if (handler) {
            return handler.handler(opts);
        }

        let resp = await doFetchInner(url, options);

        let contentType = resp.headers.get('Content-Type');
        let data: any = resp.body;
        if (opts.responseType !== 'stream') {
            if (contentType?.includes('json')) {
                data = await resp.json();
            } else {
                data = await resp.text();
            }
        }
        let response = {
            status: resp.status,
            data: data
        };
        if (resp.status > 400) {
            let err = new HttpError(response);
            throw err;
        }

        return response;
    }

    async function doFetchInner (url: string, reqInit: RequestInit, options?: {
        retries?: number
    }) {
        options ??= {};
        options.retries ??= 3;

        let resp: Response;
        let timeout = setTimeout(() => {
            $logger.log(`${reqInit.method} ${url} response takes longer as expected. Waiting...`);
        }, 8_000);
        try {
            resp = await fetch(url, reqInit);
        } catch (error) {
            let errCode = error.cause?.code;
            let message = `Fetch failed for ${ url } with "${error.message }: ${errCode}"`;
            if (--options.retries < 0) {
                throw new Error(message);
            }
            console.log(`Retry HTTP request after "${message}"`);
            return doFetchInner(url, reqInit, options);
        } finally {
            clearTimeout(timeout);
        }
        return resp;
    }

    export function get<T = any> (opts: IHttpFetch): Promise<THttpResponse<T>>
    export function get<T = any> (url: string): Promise<THttpResponse<T>>
    export function get<T = any> (mix: string | IHttpFetch): Promise<THttpResponse<T>> {
        let opts = typeof mix === 'string' ? { url: mix } : mix;
        return doFetch<T>({
            ...opts,
            method: 'GET'
        });
    }

    export function post<T = any> (opts: IHttpFetch) {
        return doFetch<T>({
            ...opts,
            method: 'POST'
        });
    }

    /**
     *  output: Directory or File
     */
    export async function download(url: string, config: IHttpFetch & { output: string }) {
        let output = $require.notNull(config.output, `Output is undefined. Should be directory or file path`);
        if ($path.hasExt(output) === false) {
            let filename = new class_Uri(url).file;
            $require.notEmpty(filename, `There is no filename with extension in source url. To save a file, you must specify the filename in "output"`);
            output = class_Uri.combine(output, filename);
        }

        return $is.NODE
            ? $httpNode.download(url, output, config)
            : $httpBrowser.download(url, output, config)
            ;
    }

    class HttpError extends Error {
        constructor (public response: { status: number, data: any}) {
            super(`HTTP Error ${response.status}. ${typeof response.data === 'string' ? response.data : ''}`);
        }
    }
}



namespace $httpNode {
    /**
     *  output: Directory or File
     */
    export async function download(url: string, output: string, config?: RequestInit){

        if ($path.isAbsolute(output) === false) {
            output = class_Uri.combine(`file://`, process.cwd(), output);
        }

        const fileUri = new class_Uri(output);
        const filepath = fileUri.toLocalFile();

        await Directory.ensureAsync(fileUri.toDir());


        const response = await fetch (url,  config);
        const buffer = await response.arrayBuffer();

        await File.writeAsync(output, buffer, { skipHooks: true})
    }

}



export namespace $httpBrowser {
    /**
     *  output: Directory or File
     */
    export async function download(url: string, output: string, config?: RequestInit){

        if ($path.isAbsolute(output) === false) {
            output = class_Uri.combine(`file://`, process.cwd(), output);
        }

        const fileUri = new class_Uri(output);
        const filepath = fileUri.toLocalFile();

        await Directory.ensureAsync(fileUri.toDir());

        const response = await fetch (url,  config);
        const blob = await response.blob();

        const uri = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = uri;
        a.download = output;
        document.body.appendChild(a);
        a.click();
    }

}
