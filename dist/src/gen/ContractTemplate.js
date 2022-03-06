"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$NAME$ = void 0;
/**
 *  AUTO-Generated Class: $DATE$
 *  Implementation: $EXPLORER_URL$
 */
const a_di_1 = __importDefault(require("a-di"));
const ContractBase_1 = require("@dequanto/contracts/ContractBase");
/* IMPORTS */
class $NAME$ extends ContractBase_1.ContractBase {
    constructor(address = '$ADDRESS$', client = a_di_1.default.resolve($EthWeb3Client$), explorer = a_di_1.default.resolve($Etherscan$)) {
        super(address, client, explorer);
        this.address = address;
        this.client = client;
        this.explorer = explorer;
        /* METHODS */
        /* EVENTS */
        /* EVENTS_EXTRACTORS */
        this.abi = $ABI$;
    }
}
exports.$NAME$ = $NAME$;
/* $EVENT_INTERFACES$ */
