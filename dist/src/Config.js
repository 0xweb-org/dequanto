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
exports.config = exports.Config = void 0;
const memd_1 = __importDefault(require("memd"));
const appcfg_1 = __importDefault(require("appcfg"));
const _secret_1 = require("./utils/$secret");
const _cli_1 = require("./utils/$cli");
const atma_utils_1 = require("atma-utils");
const atma_io_1 = require("atma-io");
class Config {
    static async fetch(parameters) {
        let unlockedAccountsKey = await _secret_1.$secret.getPin(parameters);
        let configPathAccounts = _cli_1.$cli.getParamValue('config-accounts', parameters) ?? '%APPDATA%/.dequanto/accounts.json';
        let configPathGlobal = _cli_1.$cli.getParamValue('config-global', parameters) ?? '%APPDATA%/.dequanto/config.yml';
        let dequantoConfigs = 'dequanto/configs/';
        let [
        //- inApp,
        inCwd, inNodeModules,] = await Promise.all([
            //- Directory.existsAsync(env.applicationDir.combine(`./${dequantoConfigs}`).toString()),
            atma_io_1.Directory.existsAsync(`./${dequantoConfigs}`),
            atma_io_1.Directory.existsAsync(`./node_modules/${dequantoConfigs}`),
        ]);
        let prfx = '%APP%/';
        if (inNodeModules) {
            prfx = './node_modules/';
        }
        if (inCwd) {
            prfx = './';
        }
        let cfg = await appcfg_1.default.fetch([
            {
                path: `${prfx}${dequantoConfigs}dequanto.yml`,
                optional: true,
            },
            {
                path: `${prfx}${dequantoConfigs}defi.yml`,
                optional: true,
            },
            {
                path: configPathGlobal,
                writable: true,
                optional: true,
                extendArrays: false,
            },
            unlockedAccountsKey ? {
                name: 'accounts',
                path: configPathAccounts,
                writable: true,
                optional: true,
                secret: unlockedAccountsKey
            } : null,
            {
                path: 'package.json',
                getterProperty: 'dequanto',
                optional: true,
            },
            {
                path: 'dequanto.yml',
                optional: true
            },
        ]);
        (0, atma_utils_1.obj_extend)(exports.config, cfg.toJSON());
        return cfg;
    }
    static async extend(json) {
        let current = await Config.fetch();
        await current.$write(json);
    }
}
__decorate([
    memd_1.default.deco.memoize()
], Config, "fetch", null);
exports.Config = Config;
exports.config = new Config();
