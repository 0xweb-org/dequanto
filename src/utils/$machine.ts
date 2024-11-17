import { $dependency } from './$dependency';



export namespace $machine {

    export function id(original: boolean = false): Promise<string> {
        return new Promise(async (resolve: Function, reject: Function): Promise<Object> => {
            const { exec } = await $dependency.load<typeof import('child_process')>('child_process');

            return exec(getCommand(), {}, async (err: any, stdout: any, stderr: any) => {
                if (err) {
                    return reject(
                        new Error(`Error while obtaining machine id: ${err.stack}`)
                    );
                }
                let id: string = extractId(stdout.toString());
                let result = original ? id : await hash(id);
                return resolve(result);
            });
        });
    }

    async function hash(guid: string): Promise<string> {
        const { createHash } = await $dependency.load<typeof import('crypto')>('crypto');
        return createHash('sha256').update(guid).digest('hex');
    }

    function getCommand() {

        let { platform } = process;
        let win32RegBinPath = {
            native: '%windir%\\System32',
            mixed: '%windir%\\sysnative\\cmd.exe /c %windir%\\System32'
        };
        let guid = {
            darwin: 'ioreg -rd1 -c IOPlatformExpertDevice',
            win32: `${win32RegBinPath[isWindowsProcessMixedOrNativeArchitecture()]}\\REG.exe ` +
                'QUERY HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Cryptography ' +
                '/v MachineGuid',
            linux: '( cat /var/lib/dbus/machine-id /etc/machine-id 2> /dev/null || hostname ) | head -n 1 || :',
            freebsd: 'kenv -q smbios.system.uuid || sysctl -n kern.hostuuid'
        };
        function isWindowsProcessMixedOrNativeArchitecture(): string {
            // detect if the node binary is the same arch as the Windows OS.
            // or if this is 32 bit node on 64 bit windows.
            if (process.platform !== 'win32') {
                return '';
            }
            if (process.arch === 'ia32' && process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432')) {
                return 'mixed';
            }
            return 'native';
        }

        return guid[platform];
    }

    function extractId(result: string): string {
        switch (process.platform) {
            case 'darwin':
                return result
                    .split('IOPlatformUUID')[1]
                    .split('\n')[0].replace(/\=|\s+|\"/ig, '')
                    .toLowerCase();
            case 'win32':
                return result
                    .toString()
                    .split('REG_SZ')[1]
                    .replace(/\r+|\n+|\s+/ig, '')
                    .toLowerCase();
            case 'linux':
                return result
                    .toString()
                    .replace(/\r+|\n+|\s+/ig, '')
                    .toLowerCase();
            case 'freebsd':
                return result
                    .toString()
                    .replace(/\r+|\n+|\s+/ig, '')
                    .toLowerCase();
            default:
                throw new Error(`Unsupported platform: ${process.platform}`);
        }
    }

}
