import { $machine } from './$machine';

export namespace $secret {
    export async function getPin(parameters?: { pin?: string }) {

        let pin = parameters?.pin ?? getPinFromCli() ?? getPinFromEnv();
        if (pin == null || pin.length === 0) {
            return null;
        }
        let id = await $machine.id();
        return `${id}:${pin}`;
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
}
