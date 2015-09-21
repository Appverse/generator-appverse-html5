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
require("blanket");

var config = require('../generators/app/config/project-config.json');

describe('appverse-html5:generator', function () {
    var deps = [
                [helpers.createDummyGenerator(), 'appverse-html5:module'],
                [helpers.createDummyGenerator(), 'appverse-html5:build']
            ];

    describe('when called with prompts (no modules - no builds)', function () {
        before(function (done) {
            helpers.run(path.join(__dirname, '../generators/app'))
                .inTmpDir(function (dir) {
                    // `dir` is the path to the new temporary directory
                    fse.copySync(path.join(__dirname, '../generators/app/templates'), dir)
                })
                .withGenerators(deps)
                .withPrompts({
                    appName: 'test',
                    coreOptions: []
                })
                .withOptions({
                    'skip-install': true,
                    'skip-welcome-message': true
                }) // execute with options
                .on('end', done);
        });

        it('should create files', function () {
            assert.file(config.files);
        });
        it('should move templates files', function () {
            assert.file(config.templates);
        });
        it('should replace templates with application name', function () {
            assert.fileContent('bower.json', 'test');
            assert.fileContent('package.json', 'test');
            assert.fileContent('app/index.html', '<body data-ng-app="testApp">');
            assert.fileContent('app/scripts/app.js', 'angular.module(\'testApp\'');
        });
        it('should add sctipts to index.html', function () {
            config.scripts.forEach(function (name) {
                assert.fileContent('app/index.html', name);
            });
            config.appScripts.forEach(function (name) {
                assert.fileContent('app/index.html', name);
            });
        });

    });
    describe('when called with argument name', function () {
        before(function (done) {
            helpers.run(path.join(__dirname, '../generators/app'))
                .inTmpDir(function (dir) {
                    // `dir` is the path to the new temporary directory
                    fse.copySync(path.join(__dirname, '../generators/app/templates'), dir)
                })
                .withGenerators(deps)
                .withArguments(['test'])
                .withOptions({
                    'skip-install': true,
                    'skip-welcome-message': true
                }) // execute with options
                .on('end', done);
        });

        it('should create files', function () {
            assert.file(config.files);
        });
        it('should move templates files', function () {
            assert.file(config.templates);
        });
        it('should replace templates with application name', function () {
            assert.fileContent('bower.json', 'test');
            assert.fileContent('package.json', 'test');
            assert.fileContent('app/index.html', '<body data-ng-app="testApp">');
            assert.fileContent('app/scripts/app.js', 'angular.module(\'testApp\'');
        });
        it('should add sctipts to index.html', function () {
            config.scripts.forEach(function (name) {
                assert.fileContent('app/index.html', name);
            });
            config.appScripts.forEach(function (name) {
                assert.fileContent('app/index.html', name);
            });
        });
    });
    describe('when called with project (json) argument name', function () {
        var project = path.join(__dirname, '/data/appverse-project.json');
        before(function (done) {
            helpers.run(path.join(__dirname, '../generators/app'))
                .inTmpDir(function (dir) {
                    // `dir` is the path to the new temporary directory
                    fse.copySync(path.join(__dirname, '../generators/app/templates'), dir)
                })
                .withGenerators(deps)
                .withOptions({
                    'skip-install': true,
                    'skip-welcome-message': true,
                    'project': project
                }) // execute with options
                .on('end', done);
        });

        it('should create files', function () {
            assert.file(config.files);
        });
        it('should move templates files', function () {
            assert.file(config.templates);
        });
        it('should replace templates with application name', function () {
            assert.fileContent('bower.json', 'mytestproject');
            assert.fileContent('package.json', 'mytestproject');
            assert.fileContent('app/index.html', '<body data-ng-app="mytestprojectApp">');
            assert.fileContent('app/scripts/app.js', 'angular.module(\'mytestprojectApp\'');
        });
        it('should add sctipts to index.html', function () {
            config.scripts.forEach(function (name) {
                assert.fileContent('app/index.html', name);
            });
            config.appScripts.forEach(function (name) {
                assert.fileContent('app/index.html', name);
            });
        });
    });

});
