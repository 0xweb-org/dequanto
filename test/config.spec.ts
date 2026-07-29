import { $config } from '@dequanto/utils/$config';

UTest({
    $after () {
        $config.reloadEnv();

        let val = $config.get('settings.base');
        eq_(val ?? './', './');
    },
    async 'get a value from the CLI' () {
        $config.reloadEnv(['--config', '"settings.base=foo"']);
        let val = $config.get('settings.base');
        eq_(val, 'foo');
    },
    async 'get a single value from the CLI' () {

        $config.reloadEnv(["--config='settings.base=./'"]);

        let val = $config.get('settings.base');
        eq_(val, './');
    },
    async 'get a value from an environment variable' () {

        $config.reloadEnv([], {
            ['DQ_SETTINGS__BASE']: 'boom'
        });

        let val = $config.get('settings.base');
        eq_(val, 'boom');
    }
})
