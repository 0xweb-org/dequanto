module.exports = {
    suites: {
        dom : {
            exec: 'dom',
            $config: {
                $before: function () {
                    window.Utils = {};
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
