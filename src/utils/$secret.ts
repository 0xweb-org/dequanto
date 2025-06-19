import { $machine } from './$machine';

export namespace $secret {
    export async function getPin(parameters?: { pin?: string, machineKey?: string }) {

        let pin = parameters?.pin ?? getPinFromCli() ?? getPinFromEnv();
        if (pin == null || pin.length === 0) {
            return null;
        }
        let machineKey = parameters?.machineKey ?? getMachineKeyFromCli() ?? getMachineKeyFromEnv() ?? await $machine.id();
        return `${machineKey}:${pin}`;
    }

    function getPinFromCli () {
        let args = process.argv;
        for (let i = 0; i < args.length - 1; i++) {
            let key = args[i].replace(/^\-+/, '');
            if (key === 'p' || key === 'pin') {
                return args[i + 1];
            }
        }
        return null;
    }
    function getPinFromEnv () {
        return process.env.PIN;
    }
    function getMachineKeyFromCli () {
        let args = process.argv;
        for (let i = 0; i < args.length - 1; i++) {
            let key = args[i].replace(/^\-+/, '');
            if (key === 'machineKey' || key ==='machine-key') {
                return args[i + 1];
            }
        }
        return null;
    }
    function getMachineKeyFromEnv () {
        return process.env.MACHINE_KEY;
    }
}
