/*
 Copyright (c) 2015 GFT Appverse, S.L., Sociedad Unipersonal.
 This Source Code Form is subject to the terms of the Appverse Public License
 Version 2.0 (“APL v2.0”). If a copy of the APL was not distributed with this
 file, You can obtain one at http://www.appverse.mobi/licenses/apl_v2.0.pdf. [^]
 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the conditions of the AppVerse Public License v2.0
 are met.
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. EXCEPT IN CASE OF WILLFUL MISCONDUCT OR GROSS NEGLIGENCE, IN NO EVENT
 SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT(INCLUDING NEGLIGENCE OR OTHERWISE)
 ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 POSSIBILITY OF SUCH DAMAGE.
*/
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
            'app/bower_components/appverse-web-html5-core/dist/appverse-cache/appverse-cache.js',
//            'app/bower_components/appverse-web-html5-core/dist/appverse-detection/appverse-detection.js',
            //'app/bower_components/appverse-web-html5-core/dist/appverse-logging/appverse-logging.js',
            'app/bower_components/appverse-web-html5-core/dist/appverse-router/appverse-router.min.js',
            'app/bower_components/appverse-web-html5-core/dist/appverse/appverse.min.js',

            'app/bower_components/lodash/dist/lodash.underscore.min.js',
            'app/bower_components/restangular/dist/restangular.min.js',
            'app/bower_components/appverse-web-html5-core/dist/appverse-rest/appverse-rest.js',

            'app/bower_components/appverse-web-html5-security/dist/appverse-security/appverse-security.js',

            'app/bower_components/socket.io-client/dist/socket.io.min.js',
            'app/bower_components/appverse-web-html5-core/dist/appverse-serverpush/appverse-serverpush.js',

            'app/bower_components/appverse-web-html5-core/dist/appverse-translate/appverse-translate.js',
            'app/bower_components/angular-translate/angular-translate.min.js',
            'app/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
            'app/bower_components/angular-dynamic-locale/src/tmhDynamicLocale.js',

            'app/bower_components/appverse-web-html5-core/dist/appverse-utils/appverse-utils.js',
            'app/bower_components/appverse-web-html5-core/dist/appverse-performance/appverse-performance.js',
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
