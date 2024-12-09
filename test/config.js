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
                            "memd": "./node_modules/memd/lib/esm/memd.mjs",
                            "atma-utils": "./node_modules/atma-utils/lib/esm/utils.mjs",
                            "alot": "./node_modules/alot/lib/esm/alot.mjs",
                            "atma-io": "./node_modules/atma-io/lib/esm/browser/io.mjs",
                            "appcfg": "./node_modules/appcfg/lib/esm/browser/appcfg.mjs",
                            "@noble/hashes/pbkdf2": "./node_modules/@noble/hashes/esm/pbkdf2.js",
                            "@noble/hashes/sha3": "./node_modules/@noble/hashes/esm/sha3.js",
                            "@noble/hashes/crypto": "./node_modules/@noble/hashes/esm/crypto.js",
                            "@noble/hashes/sha256": "./node_modules/@noble/hashes/esm/sha256.js",
                            "@noble/hashes/utils": "./node_modules/@noble/hashes/esm/utils.js",
                            "@noble/hashes/hmac": "./node_modules/@noble/hashes/esm/hmac.js",
                            "@noble/hashes/ripemd160": "./node_modules/@noble/hashes/esm/ripemd160.js",
                            "@noble/hashes/sha512": "./node_modules/@noble/hashes/esm/sha512.js",
                            "@noble/hashes/_assert": "./node_modules/@noble/hashes/esm/_assert.js",
                            "@noble/curves/abstract/modular": "./node_modules/@noble/curves/esm/abstract/modular.js",

                            "@noble/curves/secp256k1": "./node_modules/@noble/curves/esm/secp256k1.js",
                            "@scure/bip32": "./node_modules/@scure/bip32/lib/esm/index.js",
                            "@scure/bip39": "./node_modules/@scure/bip39/esm/index.js",
                            "@scure/base": "./node_modules/@scure/base/lib/esm/index.js",
                            "class-json": "./node_modules/class-json/lib/esm/json.mjs",
                            "@everlog/core": "./node_modules/@everlog/core/lib/esm/browser/everlog.mjs",
                        }
                    });
                    document.head.appendChild(tag);
                },

                includejs: includeSettings(),
            },
            tests: 'test/browser/**.spec.ts'
        },
        node : {
            $config: {
                includejs: includeSettings(),
            },
            tests: 'test/**.spec.ts'
        }
    }
};


function includeSettings() {

    return {
        amd: true,
        routes: {
            "@dequanto": "/src/{0}",
            "dequanto": "/src/{0}"
        },
        "lazy": {

        }

    };
}
