'use strict';

module.exports = function () {
    return {
        basePath: '../',
        frameworks: ['mocha'],

        // coverage reporter generates the coverage
        reporters: ['progress', 'coverage'],

        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'app/scripts/{*!(api)/*.js,!(app).js}': 'coverage'
        },

        // optionally, configure the reporter
        coverageReporter: {
            type: 'lcov',
            dir: 'test/coverage/'
        },

        browsers: ['Chrome'],
        autoWatch: true,

        // these are default values anyway
        singleRun: false,
        colors: true,

        files: [
            //3rd Party Code
            'app/bower_components/jquery/dist/jquery.min.js',
            'app/bower_components/angular/angular.min.js',
            'app/bower_components/angular-touch/angular-touch.min.js',
            'app/bower_components/modernizr/modernizr.js',
            'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'app/bower_components/angular-cookies/angular-cookies.min.js',
            'app/bower_components/angular-ui-router/release/angular-ui-router.min.js',
            'app/bower_components/angular-resource/angular-resource.min.js',
            'app/bower_components/angular-cache/dist/angular-cache.min.js',
            'app/bower_components/ng-grid/build/ng-grid.min.js',

            //App-specific Code
            'app/bower_components/appverse-web-html5-core/src/modules/api-cache.js',
            'app/bower_components/appverse-web-html5-core/src/modules/api-configuration.js',
            'app/bower_components/appverse-web-html5-core/src/modules/api-detection.js',
            //'app/bower_components/appverse-web-html5-core/src/modules/api-logging.js',
            'app/bower_components/appverse-web-html5-core/src/modules/api-main.js',

            'app/bower_components/lodash/dist/lodash.underscore.min.js',
            'app/bower_components/restangular/dist/restangular.min.js',
            'app/bower_components/appverse-web-html5-core/src/modules/api-rest.js',

            'app/bower_components/appverse-web-html5-security/src/modules/api-security.js',

            'app/bower_components/socket.io-client/dist/socket.io.min.js',
            'app/bower_components/appverse-web-html5-core/src/modules/api-serverpush.js',

            'app/bower_components/appverse-web-html5-core/src/modules/api-translate.js',
            'app/bower_components/angular-translate/angular-translate.min.js',
            'app/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
            'app/bower_components/angular-dynamic-locale/src/tmhDynamicLocale.js',

            'app/bower_components/appverse-web-html5-core/src/modules/api-utils.js',

            'app/bower_components/appverse-web-html5-core/src/directives/cache-directives.js',
            'app/bower_components/appverse-web-html5-core/src/directives/rest-directives.js',
            'app/bower_components/appverse-web-html5-core/src/modules/api-performance.js',
            'app/scripts/app.js',
            'app/scripts/controllers/*.js',
            'app/scripts/states/*.js',

            //Test-Specific Code
            'node_modules/chai/chai.js',
            'test/lib/chai-should.js',
            'test/lib/chai-expect.js'
        ]
    };
};
