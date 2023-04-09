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
const _require_1 = require("@dequanto/utils/$require");
const MappingSettersResolver_1 = require("../SlotsParser/MappingSettersResolver");
const SourceCodeProvider_1 = require("../SourceCodeProvider");
const Web3ClientFactory_1 = require("@dequanto/clients/Web3ClientFactory");
const _logger_1 = require("@dequanto/utils/$logger");
const ContractReader_1 = require("@dequanto/contracts/ContractReader");
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
        let { errors, events, methods } = await MappingSettersResolver_1.MappingSettersResolver.getEventsForMappingMutations(mappingVarName, {
            path: source.main.path,
            code: source.main.content
        }, source.main.contractName, { files: source.files });
        let error = errors?.[0];
        if (error != null) {
            throw error;
        }
        let eventCountStr = `${events.length > 0 ? 'green' : 'red'}<${events.length}>`;
        let eventNames = events.map(x => `gray<${x.event.name}>`).join(',');
        this.logger.log(`For the mapping "bold<${mappingVarName}>" found:`);
        this.logger.log(`    • ${eventCountStr} mutation Events (${eventNames})`);
        if (methods.length > 0) {
            let methodCountStr = `red<${methods.length}>`;
            let methodNames = methods.map(x => `red<${x.method.name}>`).join(',');
            this.logger.log(`    • ${methodCountStr} mutation methods without Events (${methodNames})`);
        }
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
        this.logger.log(`The source code for "bold<${source.main.contractName}>" has been loaded`);
        return source;
    }
    async loadEvents(ev) {
        let reader = new ContractReader_1.ContractReader(this.client);
        return reader.getLogsParsed(ev, {
            address: this.address,
            fromBlock: 'deployment'
        });
    }
}
__decorate([
    memd_1.default.deco.memoize({ perInstance: true })
], MappingKeysLoader.prototype, "loadSourceCode", null);
__decorate([
    memd_1.default.deco.memoize({ perInstance: true })
], MappingKeysLoader.prototype, "loadEvents", null);
exports.MappingKeysLoader = MappingKeysLoader;
