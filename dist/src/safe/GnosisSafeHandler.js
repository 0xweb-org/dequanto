"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GnosisSafeHandler = void 0;
const a_di_1 = __importDefault(require("a-di"));
const memd_1 = __importDefault(require("memd"));
const alot_1 = __importDefault(require("alot"));
const EthWeb3Client_1 = require("@dequanto/clients/EthWeb3Client");
const safe_core_sdk_1 = __importDefault(require("@gnosis.pm/safe-core-sdk"));
const _address_1 = require("@dequanto/utils/$address");
const _signRaw_1 = require("@dequanto/utils/$signRaw");
const ContractWriter_1 = require("@dequanto/contracts/ContractWriter");
const _gnosis_1 = require("./$gnosis");
const GnosisServiceTransport_1 = require("./transport/GnosisServiceTransport");
const _logger_1 = require("@dequanto/utils/$logger");
const _bigint_1 = require("@dequanto/utils/$bigint");
const ethers_1 = require("ethers");
const _contract_1 = require("@dequanto/utils/$contract");
const _promise_1 = require("@dequanto/utils/$promise");
class GnosisSafeHandler {
    constructor(config) {
        this.safeAddress = config.safeAddress;
        this.owner = config.owner;
        this.client = config.client ?? a_di_1.default.resolve(EthWeb3Client_1.EthWeb3Client);
        this.transport = config.transport ?? new GnosisServiceTransport_1.GnosisServiceTransport(this.client, this.owner);
    }
    async getTx(safeTxHash) {
        return this.transport.getTx(safeTxHash);
    }
    async getTxConfirmations(safeTxHash) {
        return this.transport.getTxConfirmations(safeTxHash);
    }
    async confirmTx(safeTxHash, owner) {
        let acc = owner ?? this.owner;
        let signature = _signRaw_1.$signRaw.signEC(safeTxHash, acc.key);
        return this.transport.confirmTx(safeTxHash, {
            owner: acc.address,
            signature: signature.signature
        });
    }
    async submitTransaction(safeTxHash, options) {
        let tx = await this.transport.getTx(safeTxHash);
        let writer = a_di_1.default.resolve(ContractWriter_1.ContractWriter, this.safeAddress, this.client);
        let confirmations = tx.confirmations;
        if (options?.threshold != null) {
            let needCount = options.threshold;
            if (confirmations.length < needCount) {
                throw new Error(`Require ${needCount} confirmations, but got ${confirmations.length} for the tx ${safeTxHash}`);
            }
            if (confirmations.length > needCount) {
                // get confirmations count as required
                confirmations = confirmations.slice(0, needCount);
            }
        }
        let signaturesArr = (0, alot_1.default)(confirmations)
            .sortBy(x => x.owner)
            .map(x => x.signature)
            .toArray();
        let signatures = '0x' + signaturesArr.map(x => x.substring(2)).join('');
        let args = [
            tx.to,
            tx.value,
            tx.data ?? '0x',
            tx.operation,
            tx.safeTxGas,
            tx.baseGas,
            tx.gasPrice,
            tx.gasToken,
            tx.refundReceiver,
            signatures,
        ];
        let txWriter = await writer.writeAsync(this.owner, SafeAbi.execTransaction, args);
        return txWriter;
    }
    async execute(writer) {
        let value = BigInt(writer.builder.data.value?.toString() ?? 0);
        let { safeTxHash, threshold, safeTxData } = await this.createTransaction(writer, value);
        if (writer.options.txOutput != null) {
            await writer.saveTxAndExit({ safeTxHash, safeTxData });
            return;
        }
        await _promise_1.$promise.waitForObject(async () => {
            let confirmations = await this.getTxConfirmations(safeTxHash);
            if (confirmations.count >= threshold) {
                return [null, {}];
            }
            const addr = confirmations.results?.map(x => x.owner)?.join(', ');
            _logger_1.$logger.log(`Require ${threshold} confirmations. Got ${confirmations.count} (${addr}). Waiting`);
            return [null, null];
        }, {
            intervalMs: 3000
        });
        let tx = await this.submitTransaction(safeTxHash, { threshold });
        return tx;
    }
    async createTxHash(builder, value) {
        let txData = builder.getTxData(this.client);
        let safeTxEstimation = {
            to: _address_1.$address.toChecksum(txData.to),
            value: _bigint_1.$bigint.toHex(value ?? BigInt(txData.value?.toString() ?? 0n)),
            data: txData.data ?? null,
            operation: 0,
        };
        let safeInfo = await this.transport.getSafeInfo(this.safeAddress);
        // let estimated = await this.transport.estimateSafeTransaction(this.safeAddress, safeTxEstimation);
        let safeTxData = {
            ...safeTxEstimation,
            safeTxGas: 0,
            baseGas: 0,
            gasToken: _address_1.$address.ZERO,
            refundReceiver: _address_1.$address.ZERO,
            nonce: safeInfo.nonce,
            gasPrice: 0,
        };
        let safeTxHash = await this.getTransactionHash({
            ...safeTxData,
        });
        return {
            safeInfo,
            safeTxData,
            safeTxHash,
        };
    }
    async createTxSignature(safeTxHash) {
        return {
            signature: {
                signer: _address_1.$address.toChecksum(this.owner.address),
                data: _signRaw_1.$signRaw.signEC(safeTxHash, this.owner.key).signature
            }
        };
    }
    async createTransaction(writer, value) {
        let builder = writer.builder;
        let { safeTxHash, safeTxData, safeInfo, } = await this.createTxHash(builder, value);
        let { signature, } = await this.createTxSignature(safeTxHash);
        let signatures = new Map();
        signatures.set(this.owner.address.toLowerCase(), signature);
        // https://docs.gnosis-safe.io/tutorials/tutorial_tx_service_initiate_sign
        let txProps = {
            safeAddress: _address_1.$address.toChecksum(this.safeAddress),
            senderAddress: _address_1.$address.toChecksum(this.owner.address),
            safeTransaction: {
                data: safeTxData,
                signatures: signatures,
            },
            safeTxHash,
        };
        await this.transport.proposeTransaction(txProps);
        writer.emit('safeTxProposed', txProps);
        return {
            threshold: Number(safeInfo.threshold),
            safeTxData,
            safeTxHash
        };
    }
    async getSafeSdk() {
        let adapter = await this.getAdapter();
        const safeSdk = await safe_core_sdk_1.default.create({
            ethAdapter: adapter,
            safeAddress: this.safeAddress
        });
        return safeSdk;
    }
    async getAdapter() {
        return _gnosis_1.$gnosis.getAdapter(this.owner, this.client);
    }
    getTransactionHash(params) {
        let args = [
            params.to,
            params.value ? _bigint_1.$bigint.toHex(params.value) : 0,
            params.data ?? '0x',
            params.operation,
            params.safeTxGas,
            params.baseGas ?? 0,
            params.gasPrice ?? 0,
            params.gasToken ?? _address_1.$address.ZERO,
            params.refundReceiver ?? _address_1.$address.ZERO,
            params.nonce,
        ];
        return this.client.readContract({
            address: this.safeAddress,
            method: 'getTransactionHash',
            arguments: args,
            abi: [
                SafeAbi.getTransactionHash
            ]
        });
    }
    static parseSafeTx(buffer, value) {
        const inter = new ethers_1.utils.Interface([SafeAbi.execTransaction]);
        const decodedInput = inter.parseTransaction({
            data: buffer,
            value: value,
        });
        return {
            name: decodedInput.name,
            args: _contract_1.$contract.normalizeArgs(Array.from(decodedInput.args))
        };
    }
}
__decorate([
    memd_1.default.deco.memoize({ perInstance: true })
], GnosisSafeHandler.prototype, "getSafeSdk", null);
__decorate([
    memd_1.default.deco.memoize({ perInstance: true })
], GnosisSafeHandler.prototype, "getAdapter", null);
exports.GnosisSafeHandler = GnosisSafeHandler;
// https://etherscan.io/address/0x34cfac646f301356faa8b21e94227e3583fe3f5f#code
const SafeAbi = {
    nonce: {
        "constant": true,
        "inputs": [],
        "name": "nonce",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    execTransaction: {
        "type": "function",
        "stateMutability": "payable",
        "outputs": [
            {
                "type": "bool",
                "name": "",
                "internalType": "bool"
            }
        ],
        "name": "execTransaction",
        "inputs": [
            {
                "type": "address",
                "name": "to",
                "internalType": "address"
            },
            {
                "type": "uint256",
                "name": "value",
                "internalType": "uint256"
            },
            {
                "type": "bytes",
                "name": "data",
                "internalType": "bytes"
            },
            {
                "type": "uint8",
                "name": "operation",
                "internalType": "enum Enum.Operation"
            },
            {
                "type": "uint256",
                "name": "safeTxGas",
                "internalType": "uint256"
            },
            {
                "type": "uint256",
                "name": "baseGas",
                "internalType": "uint256"
            },
            {
                "type": "uint256",
                "name": "gasPrice",
                "internalType": "uint256"
            },
            {
                "type": "address",
                "name": "gasToken",
                "internalType": "address"
            },
            {
                "type": "address",
                "name": "refundReceiver",
                "internalType": "address payable"
            },
            {
                "type": "bytes",
                "name": "signatures",
                "internalType": "bytes"
            }
        ]
    },
    getTransactionHash: {
        "type": "function",
        "stateMutability": "view",
        "outputs": [
            {
                "type": "bytes32",
                "name": "",
                "internalType": "bytes32"
            }
        ],
        "name": "getTransactionHash",
        "inputs": [
            {
                "type": "address",
                "name": "to",
                "internalType": "address"
            },
            {
                "type": "uint256",
                "name": "value",
                "internalType": "uint256"
            },
            {
                "type": "bytes",
                "name": "data",
                "internalType": "bytes"
            },
            {
                "type": "uint8",
                "name": "operation",
                "internalType": "enum Enum.Operation"
            },
            {
                "type": "uint256",
                "name": "safeTxGas",
                "internalType": "uint256"
            },
            {
                "type": "uint256",
                "name": "baseGas",
                "internalType": "uint256"
            },
            {
                "type": "uint256",
                "name": "gasPrice",
                "internalType": "uint256"
            },
            {
                "type": "address",
                "name": "gasToken",
                "internalType": "address"
            },
            {
                "type": "address",
                "name": "refundReceiver",
                "internalType": "address"
            },
            {
                "type": "uint256",
                "name": "_nonce",
                "internalType": "uint256"
            }
        ]
    }
};
