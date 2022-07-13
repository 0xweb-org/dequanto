"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$secret = void 0;
const _machine_1 = require("./$machine");
var $secret;
(function ($secret) {
    async function getPin() {
        let pin = getPinFromCli() ?? getPinFromEnv();
        if (pin == null || pin.length === 0) {
            return null;
        }
        let id = await _machine_1.$machine.id();
        return `${id}:${pin}`;
    }
    $secret.getPin = getPin;
    function getPinFromCli() {
        let args = process.argv;
        for (let i = 0; i < args.length - 1; i++) {
            let key = args[i].replace(/^\-+/, '');
            if (key === 'p' || key === 'pin') {
                return args[i + 1];
            }
        }
        return null;
    }
    function getPinFromEnv() {
        return process.env.PIN;
    }
})($secret = exports.$secret || (exports.$secret = {}));
