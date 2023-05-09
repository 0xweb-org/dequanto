import memd from 'memd';
import hre from "hardhat";

import { HardhatWeb3Client } from '@dequanto/clients/HardhatWeb3Client';
import { Socket } from 'net';
import { Shell } from 'shellbee'
import { $config } from '@dequanto/utils/$config';
import { $promise } from '@dequanto/utils/$promise';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';

const PORT = `8545`;
const HOST = `http://127.0.0.1:${PORT}/`

export class TestNode {
    static PORT = PORT
    static HOST = HOST

    @memd.deco.memoize()
    static async client (network: 'hardhat' | 'localhost' = 'hardhat') {
        let provider = new HardhatProvider();
        return provider.client(network);
    }

    @memd.deco.memoize()
    static async start () {
        if (await isPortBusy(PORT) === false || await isServerRunning() === false) {
            let shell = new Shell({
                command: 'node --openssl-legacy-provider ./node_modules/hardhat/internal/cli/cli.js node --hostname 127.0.0.1',
                matchReady: /Started HTTP/i,
                silent: true
            });
            shell.run();
            await shell.onReadyAsync();
        }
    }
}

async function isServerRunning () {
    let provider = new HardhatProvider();
    let client = provider.client('localhost');
    try {
        let nr = await client.getBlockNumber();
        return true;
    } catch (error) {
        return false;
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
            if (exception.code === "ECONNREFUSED" || exception.code === "ECONNRESET") {
                resolve(false);
            } else {
                socket.destroy();
                resolve(true);
            }
        });

        socket.connect(port, "127.0.0.1");
    });
}
