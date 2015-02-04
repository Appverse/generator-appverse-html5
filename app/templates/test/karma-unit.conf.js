var sharedConfig = require('./karma-shared.conf');

module.exports = function (config) {
    var conf = sharedConfig();

    conf.browsers = ['PhantomJS'];

    conf.coverageReporter.dir += 'unit';

    conf.files = conf.files.concat([

        {
            pattern: 'app/resources/**',
            included: false,
            served: true
        },

        //extra testing code
        'app/bower_components/angular-mocks/angular-mocks.js',

        //mocha stuff
        'test/mocha.conf.js',

        //test files
        'test/unit/**/*.js'
    ]);

    conf.proxies = {
        '/resources/': 'http://localhost:9876/base/app/resources/'
    };

    config.set(conf);
};
