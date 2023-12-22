import { $logger } from '@dequanto/utils/$logger';
import { $txData } from '@dequanto/utils/$txData';
import { File } from 'atma-io'
import { TxDataBuilder } from '../TxDataBuilder'
import { $sig } from '@dequanto/utils/$sig';
import { TEth } from '@dequanto/models/TEth';
export class SigFileTransport {

    async create (path: string, txBuilder: TxDataBuilder, params: { wait: boolean }): Promise<{ path: string, signed?: TEth.Hex }> {
        let tx = $txData.getJson(txBuilder.data, txBuilder.client);
        let json = {
            account: {
                address: txBuilder.account?.address
            },
            tx,
            config: txBuilder.config,
            raw: $sig.TxSerializer.serialize(tx),
            signature: null,
        };

        await File.writeAsync(path, json);

        $logger.log('');
        $logger.log(`Tx data saved to the file "${path}".`);
        $logger.log(`Sign the data, insert the signature to the "signature" field and save the file.`);
        if (params.wait) {
            $logger.log(`Waiting for the signature...`);
            $logger.log(`... or you can close this process, and continue later with "0xweb tx send ${path}"`);
        } else {
            $logger.log(`Continue later with "0xweb tx send ${path}"`);
            return { path };
        }
        $logger.log('');

        return new Promise((resolve) => {
            File.watch(path, async () => {
                $logger.log(`File changed. Checking signature...`);
                let json = await File.readAsync<{ signature }>(path, { cached: false });
                if (json?.signature == null) {
                    $logger.log(`Signature not found. Still waiting...`);
                    return;
                }
                let signed = await $sig.TxSerializer.serialize(tx, json.signature);
                resolve({ path, signed });
            });
        });
    }

}
