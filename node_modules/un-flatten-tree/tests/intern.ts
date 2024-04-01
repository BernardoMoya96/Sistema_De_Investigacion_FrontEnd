export const tunnel = 'NullTunnel';

export const reporters = [
    'Console',
    {
        id: 'node_modules/remap-istanbul/lib/intern-reporters/JsonCoverage',
        filename: 'coverage/coverage-final.json'
    }
];

export const loaderOptions = {
    packages: [
        { name: 'lodash', location: 'node_modules/lodash-amd' }
    ]
};

export const suites = ['build/tests/unit/index'];

export const excludeInstrumentation = /^(?:(?:build\/)?tests|node_modules)\//;
