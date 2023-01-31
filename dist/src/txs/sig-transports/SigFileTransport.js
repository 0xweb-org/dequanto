"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SigFileTransport = void 0;
const _logger_1 = require("@dequanto/utils/$logger");
const _sign_1 = require("@dequanto/utils/$sign");
const _txData_1 = require("@dequanto/utils/$txData");
const atma_io_1 = require("atma-io");
const ethers_1 = require("ethers");
class SigFileTransport {
    async create(path, txBuilder, params) {
        let tx = _txData_1.$txData.getJson(txBuilder.data, txBuilder.client);
        let json = {
            account: {
                address: txBuilder.account?.address
            },
            tx,
            config: txBuilder.config,
            raw: ethers_1.utils.serializeTransaction(tx),
            signature: null,
        };
        await atma_io_1.File.writeAsync(path, json);
        _logger_1.$logger.log('');
        _logger_1.$logger.log(`Tx data saved to the file "${path}".`);
        _logger_1.$logger.log(`Sign the data, insert the signature to the "signature" field and save the file.`);
        if (params.wait) {
            _logger_1.$logger.log(`Waiting for the signature...`);
            _logger_1.$logger.log(`... or you can close this process, and continue later with "0xweb tx send ${path}"`);
        }
        else {
            _logger_1.$logger.log(`Continue later with "0xweb tx send ${path}"`);
            return { path };
        }
        _logger_1.$logger.log('');
        return new Promise((resolve) => {
            atma_io_1.File.watch(path, async () => {
                _logger_1.$logger.log(`File changed. Checking signature...`);
                let json = await atma_io_1.File.readAsync(path, { cached: false });
                if (json?.signature == null) {
                    _logger_1.$logger.log(`Signature not found. Still waiting...`);
                    return;
                }
                let signed = await _sign_1.$sign.serializeTx(tx, json.signature);
                resolve({ path, signed });
            });
        });
    }
}
exports.SigFileTransport = SigFileTransport;
