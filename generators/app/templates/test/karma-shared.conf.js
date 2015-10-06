/*jshint node:true */
'use strict';

module.exports = function () {
    return {
        basePath: '../',
        frameworks: ['jasmine'],

        // coverage reporter generates the coverage
        reporters: ['progress', 'coverage', 'junit'],

        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'app/**/*.js': 'coverage'
        },

        // optionally, configure the reporter
        coverageReporter: {
            type: 'lcov',
            dir: 'test/coverage/',
            includeAllSources: true
        },

        junitReporter: {
            outputFile: 'test/reports/unit/junit-results.xml'
        },

        autoWatch: true,

        // these are default values anyway
        singleRun: false,
        colors: true,

        files: [
              'app/bower_components/jquery/dist/jquery.min.js',
              'app/bower_components/angular/angular.min.js',
              'app/bower_components/angular-touch/angular-touch.min.js',
              'app/bower_components/modernizr/modernizr.js',
              'app/bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js',
              'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
              'app/bower_components/ng-grid/build/ng-grid.min.js',
              'app/bower_components/venturocket-angular-slider/build/angular-slider.min.js',
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
              'app/app.js',
              'app/states/app-states.js',
              'app/components/**/**.js'
          ]
    };
};
