"use strict";

var sharedConfig = require('./karma-shared.conf');

module.exports = function (config) {
    var conf = sharedConfig();

    conf.coverageReporter.dir += 'e2e';

    conf.files = [
        'app/scripts/**',
        'test/e2e/**/*.js'
    ];

    conf.proxies = {
        '/': 'http://localhost:9090/',
        '/scripts/': 'http://localhost:9876/base/app/scripts/'
    };

    conf.urlRoot = '/__karma__/';

    conf.frameworks = ['ng-scenario'];

    config.set(conf);
};
