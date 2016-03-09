/*jshint node:true */
'use strict';

module.exports = function(config) {

    config.set({
        basePath: '../',
        frameworks: ['jasmine', 'sinon'],

        // coverage reporter generates the coverage
        reporters: ['progress', 'coverage', 'junit', 'notify'],

        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'app/components/**/*.js': 'coverage',
            'app/app.js': 'coverage',
            'app/states/app-states.js': 'coverage'
        },

        // optionally, configure the reporter
        coverageReporter: {
            type: 'lcov',
            dir: 'test/coverage/unit',
            subdir: '.',
            includeAllSources: true
        },

        junitReporter: {
            outputFile: 'test/reports/unit/junit-results.xml'
        },

        browsers: ['PhantomJS_custom'],

        // you can define custom flags
        customLaunchers: {
            'PhantomJS_custom': {
                base: 'PhantomJS',
                options: {
                    windowName: 'my-window',
                    settings: {
                        webSecurityEnabled: false
                    }
                },
                flags: ['--load-images=true'],
                debug: true
            }
        },

        phantomjsLauncher: {
            // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
            exitOnResourceError: true
        },

        autoWatch: true,

        // these are default values anyway
        singleRun: false,
        colors: true,

        files: [
            'app/bower_components/jquery/dist/jquery.min.js',
            'app/bower_components/angular/angular.min.js',
            'app/bower_components/angular-touch/angular-touch.min.js',
            'node_modules/ng-describe/dist/ng-describe.js',
            'app/bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js',
            'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'app/bower_components/ag-grid/dist/ag-grid.min.js',
            'app/bower_components/angular-animate/angular-animate.min.js',
            'app/bower_components/angular-xeditable/dist/js/xeditable.js',
            'app/bower_components/appverse-web-html5-core/dist/appverse/appverse.min.js',
            'app/bower_components/appverse-web-html5-core/dist/appverse-router/appverse-router.min.js',
            'app/bower_components/angular-ui-router/release/angular-ui-router.min.js',
            'app/bower_components/appverse-web-html5-core/dist/appverse-utils/appverse-utils.min.js',
            'app/bower_components/angular-ripple/angular-ripple.js',
            'app/bower_components/angular-ui-select/dist/select.min.js',
            'app/bower_components/angularjs-slider/dist/rzslider.min.js',
            'app/bower_components/angular-resize/dist/angular-resize.min.js',
            'app/bower_components/angular-sanitize/angular-sanitize.min.js',
            'app/bower_components/Chart.js/Chart.min.js',
            'app/bower_components/angular-chart.js/dist/angular-chart.min.js',
            'app/bower_components/angular-animate/angular-animate.min.js',
            'app/bower_components/angular-cache/dist/angular-cache.min.js',
            'app/bower_components/appverse-web-html5-core/dist/appverse-cache/appverse-cache.min.js',
            'app/bower_components/appverse-web-html5-core/dist/appverse-detection/appverse-detection.min.js',
            'app/bower_components/appverse-web-html5-core/dist/appverse-logging/appverse-logging.min.js',
            'app/bower_components/appverse-web-html5-core/dist/appverse-performance/appverse-performance.min.js',
            'app/bower_components/lodash/lodash.min.js',
            'app/bower_components/restangular/dist/restangular.min.js',
            'app/bower_components/appverse-web-html5-core/dist/appverse-rest/appverse-rest.min.js',
            'app/bower_components/socket.io-client/dist/socket.io.min.js',
            'app/bower_components/appverse-web-html5-core/dist/appverse-serverpush/appverse-serverpush.min.js',
            'app/bower_components/angular-translate/angular-translate.min.js',
            'app/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
            'app/bower_components/angular-dynamic-locale/src/tmhDynamicLocale.js',
            'app/bower_components/appverse-web-html5-core/dist/appverse-translate/appverse-translate.min.js',
            'app/app.js',
            'app/states/app-states.js',
            'app/components/**/**.js',

            //extra testing code
            'app/bower_components/angular-mocks/angular-mocks.js',

            //test files
            'test/unit/**/*.js'
        ]
    });
};
