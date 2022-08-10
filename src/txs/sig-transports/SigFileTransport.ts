import { $fn } from '@dequanto/utils/$fn';
import { $logger } from '@dequanto/utils/$logger';
import { $txData } from '@dequanto/utils/$txData';
import { File } from 'atma-io'
import { utils } from 'ethers';
import { TxDataBuilder } from '../TxDataBuilder'

export class SigFileTransport {

    async create (path: string, txBuilder: TxDataBuilder): Promise<string> {
        let tx = $txData.getJson(txBuilder.data, txBuilder.client);
        let json = {
            builder: {
                tx,
                config: txBuilder.config
            },
            raw: utils.serializeTransaction(<any> tx),
            signature: null,
        };
        await File.writeAsync(path, json);
        $logger.log(`Tx data saved to the file "${path}". Sign the data, insert the signature to the "signature" field and save the file.`);

        return new Promise((resolve) => {
            File.watch(path, async () => {
                $logger.log(`File changed. Checking signature...`);
                let json = await File.readAsync<{ signature }>(path, { cached: false });
                if (json?.signature == null) {
                    $logger.log(`Signature not found. Still waiting...`);
                    return;
                }
                resolve(json.signature);
            })
        });
    }

}
