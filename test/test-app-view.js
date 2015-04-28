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
var fse = require('fs-extra');

describe('appverse-html5:app-view', function () {

    describe('when called with only one argument', function () {
        before(function (done) {
            helpers.run(path.join(__dirname, '../app-view'))
                .inDir(path.join(os.tmpdir(), './testApp'), function (dir) {
                    fse.copySync(path.join(__dirname, '../app/templates'), dir);
                })
                .withArguments('myView')
                .on('end', done);
        });

        it('should create a new state in the menu bar', function () {
            assert.file([
                'app/views/myview/myview.html',
                'app/scripts/controllers/myview-controller.js'
            ]);
        });
    });

    describe('when called with two arguments', function () {
        before(function (done) {
            helpers.run(path.join(__dirname, '../app-view'))
                .inDir(path.join(os.tmpdir(), './testApp'), function (dir) {
                    fse.copySync(path.join(__dirname, '../app/templates'), dir);
                })
                .withArguments('myView myDropdown')
                .on('end', done);
        });

        it('should create a new state inside a new dropdown', function () {
            assert.file([
                'app/views/myview/myview.html',
                'app/scripts/controllers/myview-controller.js'
            ]);
        });
    });

    describe('when called with an existing dropdown', function () {
        before(function (done) {
            helpers.run(path.join(__dirname, '../app-view'))
                .inDir(path.join(os.tmpdir(), './testApp'), function (dir) {
                    fse.copySync(path.join(__dirname, '../app/templates'), dir);
                })
                .withArguments('myView2 myDropdown')
                .on('ready', function (generator) {
                    //                    generator.name = 'myView';//                    generator.menu = 'myDropdown';
                })
                .on('end', done);
        });

        it('should create a new state inside the existing dropdown', function () {
            assert.file([
                'app/views/myview2/myview2.html',
                'app/scripts/controllers/myview2-controller.js'
            ]);
        });
    });
});
