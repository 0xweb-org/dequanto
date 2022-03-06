"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientStatus = void 0;
var ClientStatus;
(function (ClientStatus) {
    ClientStatus[ClientStatus["Ok"] = 200] = "Ok";
    ClientStatus[ClientStatus["NetworkError"] = 500] = "NetworkError";
    ClientStatus[ClientStatus["CallError"] = 400] = "CallError";
})(ClientStatus = exports.ClientStatus || (exports.ClientStatus = {}));
