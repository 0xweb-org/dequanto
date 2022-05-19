import { $config } from '@dequanto/utils/$config';

UTest({
    async 'get value from cli' () {

        $config.reloadEnv(['--config', '"settings.base=foo"']);

        let val = $config.get('settings.base');
        eq_(val, 'foo');
    },
    async 'get value from ENV' () {

        $config.reloadEnv([], {
            ['DQ_SETTINGS__BASE']: 'boom'
        });

        let val = $config.get('settings.base');
        eq_(val, 'boom');
    }
})
