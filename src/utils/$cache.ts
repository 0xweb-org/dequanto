import { env } from 'atma-io';

export namespace $cache {
    export function file (filename: string) {
        return env.appdataDir.combine(`.dequanto/cache/${filename}`).toString();
    }
}
