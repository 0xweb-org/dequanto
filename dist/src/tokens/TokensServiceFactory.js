"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokensServiceFactory = void 0;
const a_di_1 = __importDefault(require("a-di"));
const TokensServiceBsc_1 = require("./TokensServiceBsc");
const TokensServiceEth_1 = require("./TokensServiceEth");
const TokensServicePolygon_1 = require("./TokensServicePolygon");
const TokensServiceXDai_1 = require("./TokensServiceXDai");
const TokensServiceArbitrum_1 = require("@dequanto/chains/arbitrum/TokensServiceArbitrum");
const TokensService_1 = require("./TokensService");
const Config_1 = require("@dequanto/Config");
var TokensServiceFactory;
(function (TokensServiceFactory) {
    function get(platform) {
        switch (platform) {
            case 'bsc':
                return a_di_1.default.resolve(TokensServiceBsc_1.TokensServiceBsc);
            case 'eth':
                return a_di_1.default.resolve(TokensServiceEth_1.TokensServiceEth);
            case 'polygon':
                return a_di_1.default.resolve(TokensServicePolygon_1.TokensServicePolygon);
            case 'xdai':
                return a_di_1.default.resolve(TokensServiceXDai_1.TokensServiceXDai);
            case 'arbitrum':
                return a_di_1.default.resolve(TokensServiceArbitrum_1.TokensServiceArbitrum);
            case 'hardhat':
                return a_di_1.default.resolve(TokensService_1.TokensService, platform);
            default: {
                let cfg = Config_1.config.web3[platform];
                if (cfg != null) {
                    return a_di_1.default.resolve(TokensService_1.TokensService, platform);
                }
                throw new Error(`Unsupported platform ${platform} for TokensService`);
            }
        }
    }
    TokensServiceFactory.get = get;
})(TokensServiceFactory = exports.TokensServiceFactory || (exports.TokensServiceFactory = {}));
