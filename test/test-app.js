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

describe('appverse-html5:app', function () {

    describe('when called with an argument', function () {
        before(function (done) {

            var deps = [
                [helpers.createDummyGenerator(), 'appverse-html5:imagemin']
            ];

            helpers.run(path.join(__dirname, '../app'))
                .inDir(path.join(os.tmpdir(), 'testApp1'))
                .withArguments('testApp1')
                .withOptions({
                    'skip-install': true
                })
                .withPrompts({
                    bootstrapTheme: false
                })
                .withGenerators(deps)
                .on('end', done);
        });

        it('should create files with defaults', function () {
            assert.file([
                'bower.json',
                'package.json',
                '.editorconfig',
                '.jshintrc'
            ]);

            assert.fileContent('bower.json', 'testapp1');
        });
    });

    describe('when called without an argument and serverpush prompt', function () {
        before(function (done) {

            var deps = [
                [helpers.createDummyGenerator(), 'appverse-html5:serverpush'],
                [helpers.createDummyGenerator(), 'appverse-html5:imagemin']
            ];

            helpers.run(path.join(__dirname, '../app'))
                .inDir(path.join(os.tmpdir(), 'testApp4'))
                .withOptions({
                    'skip-install': true
                })
                .withPrompts({
                    appName: "testApp4",
                    coreOptions: [
                        'appServerPush'
                    ]
                })
                .withGenerators(deps)
                .on('end', done);
        });

        it('should create files with defaults and call serverpush subgenerator', function () {
            assert.file([
                'bower.json',
                'package.json',
                '.editorconfig',
                '.jshintrc'
            ]);

            assert.fileContent('bower.json', 'testapp4');
        });
    });

    describe('when called without an argument', function () {
        before(function (done) {

            var deps = [
            [helpers.createDummyGenerator(), 'appverse-html5:imagemin']
        ];

            helpers.run(path.join(__dirname, '../app'))
                .inDir(path.join(os.tmpdir(), 'testApp2'))
                .withOptions({
                    'skip-install': true
                })
                .withPrompts({
                    appName: "testApp2",
                    bootstrapTheme: false
                })
                .withGenerators(deps)
                .on('end', done);
        });

        it('should create files with promts answers', function () {
            assert.file([
                'bower.json',
                'package.json',
                '.editorconfig',
                '.jshintrc'
            ]);

            assert.fileContent('bower.json', 'testapp2');
        });
    });

    describe('when called without argument and --cache option', function () {
        before(function (done) {

            var deps = [
                [helpers.createDummyGenerator(), 'appverse-html5:cache'],
                [helpers.createDummyGenerator(), 'appverse-html5:imagemin']
            ];

            helpers.run(path.join(__dirname, '../app'))
                .inDir(path.join(os.tmpdir(), 'testApp3'))
                .withOptions({
                    cache: true,
                    'skip-install': true
                })
                .withPrompts({
                    appName: "testApp3",
                    bootstrapTheme: false
                })
                .withGenerators(deps)
                .on('end', done);
        });

        it('should create files with defaults and call cache subgenerator', function () {
            assert.file([
                'bower.json',
                'package.json',
                '.editorconfig',
                '.jshintrc'
            ]);

            assert.fileContent('bower.json', 'testapp3');
        });
    });
});
