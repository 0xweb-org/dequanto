export namespace $platform {
    export function toPath (platform: string) {
        return platform.replace(':', '_');
    }
}
