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

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');
var fs = require('fs-extra');

describe('appverse-html5:app-view', function () {

    describe('when called with only one argument', function () {

        before(function (done) {
            helpers.run(path.join(__dirname, '../app-view'))
                .inDir(path.join(os.tmpdir(), 'testApp-view'), function (dir) {
                    fs.copySync(path.join(__dirname, '../app/templates/package.json'), path.join(dir, 'package.json'));
                    fs.copySync(path.join(__dirname, '../app/templates/app/index.html'), path.join(dir, 'app/index.html'));
                    fs.copySync(path.join(__dirname, '../app/templates/app/scripts/states/app-states.js'), path.join(dir, 'app/scripts/states/app-states.js'));
                })
                .withArguments('myView')
                .on('end', done);
        });

        it('should create a new state in the menu bar', function () {
            assert.file([
                'app/views/myView/myView.html',
                'app/scripts/controllers/myView-controller.js'
            ]);

            assert.fileContent('app/index.html', '<a angular-ripple="" ui-sref="myView">myView</a>');
        });
    });

    describe('when called with two arguments', function () {

        before(function (done) {
            helpers.run(path.join(__dirname, '../app-view'))
                .inDir(path.join(os.tmpdir(), 'testApp-view2'), function (dir) {
                    fs.copySync(path.join(__dirname, '../app/templates/package.json'), path.join(dir, 'package.json'));
                    fs.copySync(path.join(__dirname, '../app/templates/app/index.html'), path.join(dir, 'app/index.html'));
                    fs.copySync(path.join(__dirname, '../app/templates/app/scripts/states/app-states.js'), path.join(dir, 'app/scripts/states/app-states.js'));
                })
                .withArguments('myView2')
                .withOptions({ menu: 'myDropdown' })
                .on('end', done);
        });

        it('should create a new state inside a new dropdown', function () {
            assert.file([
                 'app/views/myView2/myView2.html',
                 'app/scripts/controllers/myView2-controller.js'
             ]);

            assert.fileContent('app/index.html', '<a angular-ripple="" ui-sref="myView2">myView2</a></li></ul></li></ul>');
            assert.fileContent('app/index.html', 'myDropdown<span class="caret"></span></a><ul class="dropdown-menu">');
        });
    });

    describe('when called with an existing dropdown', function () {

        before(function (done) {
            var utils = require('../lib').projectutils;
            helpers.run(path.join(__dirname, '../app-view'))
                .inDir(path.join(os.tmpdir(), 'testApp-view3'), function (dir) {
                    fs.copySync(path.join(__dirname, '../app/templates/package.json'), path.join(dir, 'package.json'));
                    fs.copySync(path.join(__dirname, '../app/templates/app/index.html'), path.join(dir, 'app/index.html'));
                    fs.copySync(path.join(__dirname, '../app/templates/app/scripts/states/app-states.js'), path.join(dir, 'app/scripts/states/app-states.js'));
                })
                .withArguments('myView3')
                .withOptions({ menu: 'myDropdown' })
                .on('end', done);
        });

        it('should create a new state inside the existing dropdown', function () {
            assert.file([
                 'app/scripts/controllers/myView3-controller.js',
                'app/views/myView3/myView3.html',
             ]);
            assert.fileContent('app/index.html', '<a angular-ripple="" ui-sref="myView3">myView3</a></li></ul></li></ul>');
            assert.fileContent('app/index.html', 'myDropdown<span class="caret"></span></a><ul class="dropdown-menu">');
        });
    });
});
