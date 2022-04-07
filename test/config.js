module.exports = {
    suites: {
        selenium : {
            exec: 'node',
            tests: 'test/**.spec.ts'
        }
    }
};
