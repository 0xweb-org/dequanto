import memd from 'memd';
import { HardhatWeb3Client } from '@dequanto/clients/HardhatWeb3Client';
import { Socket } from 'net';
import { Shell } from 'shellbee'

const PORT = `8545`;
const HOST = `http://127.0.0.1:${PORT}/`

export class TestNode {
    static PORT = PORT
    static HOST = HOST

    static async client () {
        await TestNode.start();
        return HardhatWeb3Client.url(HOST, { chainId: 1337 });
    }

    @memd.deco.memoize()
    static async start () {
        if (await isPortBusy(PORT) === false) {

            let shell = await Shell.run({
                command: 'npx hardhat node',
                matchReady: /Started HTTP/i
            });
            await shell.onReadyAsync();
        }
    }
}

async function isPortBusy(port) {

    return new Promise((resolve, reject) => {
        const socket = new Socket();

        const timeout = () => {
            resolve(false);
            socket.destroy();
        };


        setTimeout(timeout, 500);
        socket.on("timeout", timeout);

        socket.on("connect", function () {
            socket.destroy();
            resolve(true);
        });

        socket.on("error", function (exception: any) {
            if (exception.code !== "ECONNREFUSED") {
                resolve(false);
            } else {
                socket.destroy();
                resolve(true);
            }
        });

        socket.connect(port, "127.0.0.1");
    });
}
