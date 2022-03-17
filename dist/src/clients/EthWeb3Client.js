"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthWeb3Client = void 0;
const _config_1 = require("@dequanto/utils/$config");
const tx_1 = require("@ethereumjs/tx");
const common_1 = __importDefault(require("@ethereumjs/common"));
const Web3Client_1 = require("./Web3Client");
const ClientEndpoints_1 = require("./utils/ClientEndpoints");
class EthWeb3Client extends Web3Client_1.Web3Client {
    constructor(opts) {
        super(ClientEndpoints_1.ClientEndpoints.filterEndpoints(_config_1.$config.get('web3.eth.endpoints'), opts));
        this.platform = 'eth';
        this.chainId = 1;
        this.chainToken = 'ETH';
        this.TIMEOUT = 15 * 60 * 1000;
        this.defaultGasLimit = 2000000;
        //let host = `192.168.1.220`;
        // let host = `localhost`;
        // this.web3 = new Web3(`ws://${host}:8546`);
        // this.eth = this.web3.eth;
    }
    sign(txData, privateKey) {
        const key = Buffer.from(privateKey, 'hex');
        const common = new common_1.default({
            chain: 'mainnet'
        });
        const tx = tx_1.Transaction.fromTxData(txData, { common });
        const signedTx = tx.sign(key);
        return signedTx.serialize();
    }
}
exports.EthWeb3Client = EthWeb3Client;
