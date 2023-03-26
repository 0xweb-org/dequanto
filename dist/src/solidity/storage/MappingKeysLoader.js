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
exports.MappingKeysLoader = void 0;
const alot_1 = __importDefault(require("alot"));
const memd_1 = __importDefault(require("memd"));
const BlockChainExplorerProvider_1 = require("@dequanto/BlockchainExplorer/BlockChainExplorerProvider");
const _abiUtils_1 = require("@dequanto/utils/$abiUtils");
const _require_1 = require("@dequanto/utils/$require");
const MappingSettersResolver_1 = require("../SlotsParser/MappingSettersResolver");
const SourceCodeProvider_1 = require("../SourceCodeProvider");
const Web3ClientFactory_1 = require("@dequanto/clients/Web3ClientFactory");
const _logger_1 = require("@dequanto/utils/$logger");
const _contract_1 = require("@dequanto/utils/$contract");
const atma_io_1 = require("atma-io");
const ContractCreationResolver_1 = require("@dequanto/contracts/ContractCreationResolver");
class MappingKeysLoader {
    constructor(params) {
        this.params = params;
        this.address = this.params.address;
        this.implementation = this.params.implementation;
        this.client = this.params.client ?? Web3ClientFactory_1.Web3ClientFactory.get(this.params.platform ?? 'eth');
        this.explorer = this.params.explorer ?? BlockChainExplorerProvider_1.BlockChainExplorerProvider.get(this.client.platform);
        this.sourceCodeProvider = this.params.sourceCodeProvider ?? new SourceCodeProvider_1.SourceCodeProvider(this.client, this.explorer);
        this.logger = this.params.logger ?? _logger_1.$logger;
        _require_1.$require.Address(this?.address);
    }
    async load(mappingVarName) {
        let source = await this.loadSourceCode();
        this.logger.log(`Source code for "${source.main.contractName}" loaded to extract "${mappingVarName}"`);
        let { errors, events, methods } = await MappingSettersResolver_1.MappingSettersResolver.getEventsForMappingMutations(mappingVarName, {
            path: source.main.path,
            code: source.main.content
        }, source.main.contractName, { files: source.files });
        let error = errors?.[0];
        if (error != null) {
            throw error;
        }
        let eventMessage = `For the key "${mappingVarName}" found ${events.length} mutation Events (${events.map(x => x.event.name).join(',')})`;
        let methodsMessage = methods.length
            ? ` and ${methods.length} mutation methods without Events (${methods.map(x => x.method.name).join(',')})`
            : '';
        this.logger.log(`${eventMessage} ${methodsMessage}`);
        let keys = await (0, alot_1.default)(events)
            .mapManyAsync(async (eventInfo) => {
            const logs = await this.loadEvents(eventInfo.event);
            this.logger.log(`Loaded ${logs.length} ${eventInfo.event.name} Events to pick arguments at ${eventInfo.accessorsIdxMapping.join(', ')}`);
            const keys = logs.map(log => {
                return eventInfo
                    .accessorsIdxMapping
                    .map(idx => log.arguments[idx]?.value);
            });
            return keys;
        })
            .toArrayAsync();
        let unique = (0, alot_1.default)(keys).distinctBy(x => x.join('')).toArray();
        return unique;
    }
    async loadSourceCode() {
        let source = await this.sourceCodeProvider.getSourceCode({
            address: this.address,
            implementation: this.implementation,
        });
        return source;
    }
    async loadEvents(ev) {
        const logs = await this.loadEventsByTopic(_abiUtils_1.$abiUtils.getTopicSignature(ev));
        return logs.map(log => _contract_1.$contract.parseLogWithAbi(log, ev));
    }
    async loadEventsByTopic(topic0) {
        // get the contracts deployment date to skip lots of blocks (in case we use pagination to fetch logs)
        let fromBlock = 0;
        try {
            let dateResolver = new ContractCreationResolver_1.ContractCreationResolver(this.client, this.explorer);
            let info = await dateResolver.getInfo(this.address);
            fromBlock = info.block - 1;
        }
        catch (error) {
            // Skip any explorer errors and look from block 0
        }
        let filters = {
            address: this.address,
            fromBlock: fromBlock,
            topics: [
                topic0
            ]
        };
        let logs = await this.client.getPastLogs(filters);
        await atma_io_1.File.writeAsync(`./del/events_${topic0}.json`, logs);
        return logs;
    }
}
__decorate([
    memd_1.default.deco.memoize({ perInstance: true })
], MappingKeysLoader.prototype, "loadSourceCode", null);
__decorate([
    memd_1.default.deco.memoize({ perInstance: true })
], MappingKeysLoader.prototype, "loadEventsByTopic", null);
exports.MappingKeysLoader = MappingKeysLoader;
