import decompress from 'decompress'



export namespace $zip {
    export async function unzip (path: string, output: string) {
        return await decompress(path, output);
    }
}
