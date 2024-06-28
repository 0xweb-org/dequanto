module.exports = {
    suites: {
        dom : {
            exec: 'dom',
            $config: {
                $before: function () {

                    window.Utils = {};

                    let tag = document.createElement('script');
                    tag.type = 'importmap';
                    tag.textContent = JSON.stringify({
                        "imports": {
                            "a-di": "./node_modules/a-di/lib/esm/di.mjs",
                            "alot": "./node_modules/alot/lib/esm/alot.mjs",
                            "atma-utils": "./node_modules/atma-utils/lib/esm/utils.mjs",
                            "memd": "./node_modules/memd/lib/esm/memd.mjs",
                        }
                    })
                    document.head.appendChild(tag);
                },

                includejs: includeSettings(),
            },
            tests: 'test/browser/**.spec.ts'
        },
        // node : {
        //     tests: 'test/**.spec.ts'
        // }
    }
};


function includeSettings() {

    return {
        extentionDefault: { js: 'ts' },
        amd: true,
        routes: {
            "@dequanto": "/src/{0}"
        },
        "lazy": {

        }

    };
}
