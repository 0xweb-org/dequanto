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
exports.HardhatProvider = void 0;
const memd_1 = __importDefault(require("memd"));
const HardhatWeb3Client_1 = require("@dequanto/clients/HardhatWeb3Client");
const atma_utils_1 = require("atma-utils");
const atma_io_1 = require("atma-io");
const ethers_1 = require("ethers");
const _logger_1 = require("@dequanto/utils/$logger");
const _number_1 = require("@dequanto/utils/$number");
const _require_1 = require("@dequanto/utils/$require");
class HardhatProvider {
    constructor() {
        /* lazy load */
        this.hh = require('hardhat');
        if (this.hh.ethers == null) {
            throw new Error(`hardhat-ethers plugin should be installed and included in hardhat.config.js`);
        }
        if (this.hh.web3 == null) {
            throw new Error(`hardhat-web3 plugin should be installed and included in hardhat.config.js`);
        }
    }
    client(network = 'hardhat') {
        if (network == 'localhost') {
            return new HardhatWeb3Client_1.HardhatWeb3Client({
                endpoints: [
                    { url: 'http://127.0.0.1:8545' },
                    // Use `manual`, will be used for subscriptions only, otherwise BatchRequests will fail, as not implemented yet
                    // https://github.com/NomicFoundation/hardhat/issues/1324
                    { url: 'ws://127.0.0.1:8545', manual: true },
                ]
            });
        }
        const web3 = this.hh.web3;
        const client = new HardhatWeb3Client_1.HardhatWeb3Client({ web3 });
        return client;
    }
    deployer(index = 0) {
        const ethers = this.hh.ethers;
        const accounts = this.hh.config.networks.hardhat.accounts;
        const wallet = ethers.Wallet.fromMnemonic(accounts.mnemonic, accounts.path + `/${index}`);
        return {
            key: wallet.privateKey,
            address: wallet.address,
        };
    }
    async deployClass(Ctor, options) {
        let ethers = this.hh.ethers;
        let client = options?.client ?? this.client();
        let signer = options?.deployer ?? this.deployer();
        let params = options?.arguments ?? [];
        let Factory = await this.getFactory([Ctor.name], client, signer);
        const contract = await Factory.deploy(...params);
        const receipt = await contract.deployed();
        _logger_1.$logger.log(`Contract ${Ctor.name} deployed to ${contract.address}`);
        return new Ctor(contract.address, client);
    }
    async deploySol(solContractPath, options) {
        const client = options?.client ?? this.client();
        const args = options?.arguments ?? [];
        const signer = options?.deployer ?? this.deployer();
        const dir = solContractPath.replace(/[^\/]+$/, '');
        const filename = /(?<filename>[^\/]+)\.\w+$/.exec(solContractPath)?.groups.filename;
        const filenameRndSuffix = filename.replace(/_\d+$/, '');
        let root = options?.paths?.root;
        let artifacts = options?.paths?.artifacts;
        if (filename == null) {
            throw new Error(`Filename not extracted from ${solContractPath}`);
        }
        let hhOptions = {
            sources: dir,
            root,
            artifacts,
            tsgen: false,
        };
        await this.hh.run('compile', hhOptions);
        if (root == null) {
            root = 'file://' + process.cwd();
        }
        if (artifacts == null && root != null) {
            artifacts = atma_utils_1.class_Uri.combine(root, 'artifacts/');
        }
        if (root != null && solContractPath.toLowerCase().includes(root.toLowerCase())) {
            let i = solContractPath.toLowerCase().indexOf(root.toLowerCase());
            solContractPath = solContractPath.substring(i + root.length);
        }
        let outputDir = atma_utils_1.class_Uri.combine(artifacts, solContractPath);
        let output = atma_utils_1.class_Uri.combine(outputDir, `${filename}.json`);
        if (await atma_io_1.File.existsAsync(output) === false) {
            let path = `${outputDir}/`;
            if (await atma_io_1.Directory.existsAsync(path) === false) {
                throw new Error(`No JSONs found in ${outputDir}, nor ${output}`);
            }
            let files = await atma_io_1.Directory.readFilesAsync(path);
            let jsons = files.filter(x => /(?<!dbg)\.json$/.test(x.uri.file));
            if (jsons.length === 0) {
                throw new Error(`No JSONs output found in "${outputDir}/"`);
            }
            if (jsons.length === 1) {
                output = jsons[0].uri.toString();
            }
            else {
                let jsonFile = jsons.find(file => {
                    return file.uri.file === `${filename}.json` || file.uri.file === `${filenameRndSuffix}.json`;
                });
                if (jsonFile == null) {
                    _logger_1.$logger.log(`Files: ${files.map(file => file.uri.file).join(', ')}`);
                    throw new Error(`Compiled JSON data not found for "${filename}" in "${outputDir}/"`);
                }
                output = jsonFile.uri.toString();
            }
        }
        let { abi, bytecode } = await atma_io_1.File.readAsync(output);
        let Factory = await this.getFactory([abi, bytecode], client, signer);
        const contract = await Factory.deploy(...args);
        const receipt = await contract.deployed();
        return {
            contract,
            abi,
            bytecode
        };
    }
    async deployCode(solidityCode, options = {}) {
        let contractName = options.contractName;
        if (contractName == null) {
            let matches = Array.from(solidityCode.matchAll(/contract\s+(?<name>[\w]+)/g));
            contractName = matches[matches.length - 1].groups.name;
        }
        _require_1.$require.notNull(contractName, `Contract name not resolved from the code`);
        let rnd = _number_1.$number.randomInt(0, 10 ** 10);
        let tmp = atma_io_1.env.getTmpPath(`hardhat/contracts/${contractName}_${rnd}.sol`);
        let root = tmp.replace(/contracts\/[^/]+$/, '');
        options.paths = {
            root
        };
        await atma_io_1.File.writeAsync(tmp, solidityCode);
        try {
            return await this.deploySol(tmp, options);
        }
        finally {
            //await Directory.removeAsync(root);
        }
    }
    getEthersProvider(client) {
        if (client.options.web3 != null) {
            let ethers = this.hh.ethers;
            return ethers.provider;
        }
        let url = client.options?.endpoints[0].url;
        if (url.startsWith('ws')) {
            return new ethers_1.ethers.providers.WebSocketProvider(url);
        }
        return new ethers_1.ethers.providers.JsonRpcProvider(url);
    }
    async getFactory(factoryArgs, client, signer) {
        let ethers = this.hh.ethers;
        let Factory = await ethers.getContractFactory(...factoryArgs);
        let provider = this.getEthersProvider(client);
        let $signer = 'key' in signer
            ? new ethers.Wallet(signer.key, provider)
            : signer;
        Factory = Factory.connect($signer);
        return Factory;
    }
}
__decorate([
    memd_1.default.deco.memoize()
], HardhatProvider.prototype, "client", null);
__decorate([
    memd_1.default.deco.memoize()
], HardhatProvider.prototype, "deployer", null);
__decorate([
    memd_1.default.deco.memoize()
], HardhatProvider.prototype, "deployClass", null);
exports.HardhatProvider = HardhatProvider;
