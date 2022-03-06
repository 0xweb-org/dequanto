"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractFactory = exports.ContractWrapped = void 0;
const ContractBase_1 = require("./ContractBase");
class ContractWrapped extends ContractBase_1.ContractBase {
}
exports.ContractWrapped = ContractWrapped;
var ContractFactory;
(function (ContractFactory) {
    async function get(client, explorer, contractAddr) {
        let { abi } = await explorer.getContractAbi(contractAddr);
        let contract = new ContractWrapped(contractAddr, client, explorer);
        contract.abi = JSON.parse(abi);
        return contract;
    }
    ContractFactory.get = get;
})(ContractFactory = exports.ContractFactory || (exports.ContractFactory = {}));
