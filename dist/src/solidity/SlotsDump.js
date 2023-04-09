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
exports.SlotsDump = void 0;
const memd_1 = __importDefault(require("memd"));
const BlockChainExplorerProvider_1 = require("@dequanto/BlockchainExplorer/BlockChainExplorerProvider");
const Web3ClientFactory_1 = require("@dequanto/clients/Web3ClientFactory");
const _logger_1 = require("@dequanto/utils/$logger");
const _perf_1 = require("@dequanto/utils/$perf");
const _require_1 = require("@dequanto/utils/$require");
const atma_utils_1 = require("atma-utils");
const SlotsParser_1 = require("./SlotsParser");
const SlotsStorage_1 = require("./SlotsStorage");
const SourceCodeProvider_1 = require("./SourceCodeProvider");
const MappingKeysLoader_1 = require("./storage/MappingKeysLoader");
const SlotsStorageTransport_1 = require("./storage/SlotsStorageTransport");
const _hex_1 = require("@dequanto/utils/$hex");
const alot_1 = __importDefault(require("alot"));
class SlotsDump {
    constructor(params) {
        this.params = params;
        this.address = this.params.address;
        this.implementation = this.params.implementation;
        this.client = this.params.client ?? Web3ClientFactory_1.Web3ClientFactory.get(this.params.platform ?? 'eth');
        this.explorer = this.params.explorer ?? BlockChainExplorerProvider_1.BlockChainExplorerProvider.get(this.client.platform);
        this.sourceCodeProvider = this.params.sourceCodeProvider ?? new SourceCodeProvider_1.SourceCodeProvider(this.client, this.explorer);
        this.logger = this.params.logger ?? _logger_1.$logger;
        this.keysLoader = new MappingKeysLoader_1.MappingKeysLoader({
            address: this.address,
            implementation: this.implementation,
            client: this.client,
            explorer: this.explorer,
            logger: this.logger,
            platform: this.params.platform,
            sourceCodeProvider: this.sourceCodeProvider
        });
        _require_1.$require.Address(this?.address);
    }
    async getStorage() {
        let slots = await this.getSlots();
        return slots;
    }
    async getSlots() {
        let sources = await this.sourceCodeProvider.getSourceCode({
            address: this.address,
            implementation: this.implementation
        });
        let slots = await SlotsParser_1.SlotsParser.slots({
            path: sources.main.path,
            code: sources.main.content
        }, sources.main.contractName, {
            files: sources.files
        });
        let transport = new MockedStorageTransport(this.keysLoader, this.client, this.address);
        let reader = new SlotsStorage_1.SlotsStorage(transport, slots);
        let json = await reader.fetchAll();
        let memory = (0, alot_1.default)(transport.memory).sortBy(slot => BigInt(slot[0])).toArray();
        return {
            json,
            memory: memory,
        };
    }
}
exports.SlotsDump = SlotsDump;
class MockedStorageTransport extends SlotsStorageTransport_1.SlotsStorageTransport {
    constructor(keysLoader, client, address, params) {
        super(client, address, params);
        this.keysLoader = keysLoader;
        this.loader = new BatchLoader(this.address, this.client, this.params);
        this.memory = [];
    }
    async getStorageAtInner(slot) {
        slot = _hex_1.$hex.padBytes(slot, 32);
        let data = await this.loader.getStorageAt(slot);
        this.memory.push([slot, data]);
        return data;
    }
    setStorageAt(slot, position, size, buffer) {
        throw new Error('Method not implemented.');
    }
    async extractMappingKeys(ctx) {
        let keys = await this.keysLoader.load(ctx.slot.name);
        return { keys };
    }
}
class BatchLoader {
    constructor(address, client, params) {
        this.address = address;
        this.client = client;
        this.params = params;
        this.total = 0;
        this.loaded = 0;
        this.queueArr = [];
        this.queueHash = {};
        this.isBusy = false;
    }
    getStorageAt(slot) {
        let dfr = new atma_utils_1.class_Dfr();
        this.total++;
        this.queueArr.push(slot);
        this.queueHash[slot] = dfr;
        this.tick();
        return dfr;
    }
    async tick() {
        if (this.isBusy || this.queueArr.length === 0) {
            return;
        }
        this.isBusy = true;
        let slotsListeners = this.queueHash;
        let slots = this.queueArr.slice(0);
        this.queueArr = [];
        this.queueHash = {};
        try {
            let tick = _perf_1.$perf.start();
            if (slots.length > 50) {
                (0, _logger_1.l) `<SlotsDump.BatchLoader> Loading ${slots.length} slots`;
            }
            let memory = await this.client.getStorageAtBatched(this.address, slots, this.params?.blockNumber);
            this.loaded += slots.length;
            (0, _logger_1.l) `<SlotsDump.BatchLoader> ${memory.length} slots loaded in ${tick()}. ${this.loaded}/${this.total}`;
            for (let i = 0; i < memory.length; i++) {
                let slot = slots[i];
                let data = memory[i];
                let dfr = slotsListeners[slot];
                dfr.resolve(data);
            }
        }
        catch (error) {
            _logger_1.$logger.error(`Storage batched loader errored`, error);
            for (let i = 0; i < slots.length; i++) {
                let slot = slots[i];
                let dfr = slotsListeners[slot];
                dfr.reject(error);
            }
        }
        finally {
            this.isBusy = false;
            this.tick();
        }
    }
}
__decorate([
    memd_1.default.deco.debounce(30)
], BatchLoader.prototype, "tick", null);
