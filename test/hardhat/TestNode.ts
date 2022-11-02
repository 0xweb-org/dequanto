import memd from 'memd';
import hre from "hardhat";

import { HardhatWeb3Client } from '@dequanto/clients/HardhatWeb3Client';
import { Socket } from 'net';
import { Shell } from 'shellbee'
import { $config } from '@dequanto/utils/$config';

const PORT = `8545`;
const HOST = `http://127.0.0.1:${PORT}/`

export class TestNode {
    static PORT = PORT
    static HOST = HOST

    @memd.deco.memoize()
    static async client () {
        //> in-memory
        const web3 = (hre as any).web3;


        // clean default configuration
        $config.set('web3.hardhat.endpoints', []);

        const client = new HardhatWeb3Client({ web3, chainId: 1337 });
        return client;

        //> localhost
        // await TestNode.start();
        // return HardhatWeb3Client.url(HOST, { chainId: 1337 });
    }

    @memd.deco.memoize()
    static async start () {
        if (await isPortBusy(PORT) === false) {
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
