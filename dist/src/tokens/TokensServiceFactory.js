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
            default:
                throw new Error(`Unsupported platform ${platform} for TokensService`);
        }
    }
    TokensServiceFactory.get = get;
})(TokensServiceFactory = exports.TokensServiceFactory || (exports.TokensServiceFactory = {}));
