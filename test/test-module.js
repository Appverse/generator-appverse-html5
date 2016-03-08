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
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var os = require('os');
var fse = require('fs-extra');
var fs = require('fs');

var mockdata = path.join(__dirname, 'data/modules.json');
var mockproject = path.join(__dirname, 'data/modules-project.json');
var modules = require(mockdata);
var projectmodules = require(mockproject);
var templatePath = path.join(__dirname, 'temp/generators/module/templates');

describe('appverse-html5:module', function () {

    describe('add module with scripts, angular and config. Prompts', function () {
        before(function (done) {
            //console.log('moving to temp!')
            fse.removeSync(path.join(__dirname, '../temp'));
            helpers.run(path.join(__dirname, '../generators/module'))
                .inTmpDir(function (dir) {
                    // `dir` is the path to the new temporary directory
                    fse.copySync(path.join(__dirname, '../generators/app/templates'), dir);
                })
                .on('ready', function (generator) {
                    generator.conflicter.force = true;
                })
                .withArguments([modules[0].name])
                .withPrompts({
                    promptmock0: "mock0",
                    promptmock1: "mock1"
                })
                .withOptions({
                    'config': mockdata,
                    'skip-install': true,
                    'skip-welcome-message': true
                }) // execute with options
                .on('end', function () {
                    fse.removeSync(path.join(__dirname, 'temp'));
                    done();
                });
        });

        it('should add scripts correctly to wiredep config', function () {
            for (var key in modules[0].wiredep.overrides) {
                if (modules[0].wiredep.overrides.hasOwnProperty(key)) {
                    assert.noFileContent('config/wiredep.js', '/' + key + '/');
                    modules[0].wiredep.overrides[key].main.forEach(function(name) {
                        assert.fileContent('config/wiredep.js', name);
                    });
                }
            }
            modules[0].wiredep.exclude.forEach(function(name) {
                assert.fileContent('config/wiredep.js', name);
            });
        });
        it('should define angular modules ', function () {
            assert.fileContent('app/app.js', modules[0].angular);
        });
        it('should define angular configuration ', function () {
            assert.fileContent('app/app.js', modules[0].config.name);
            assert.fileContent('app/app.js', modules[0].config.values[0].name);
            assert.fileContent('app/app.js', modules[0].config.values[1].name);
        });

    });

    describe('add module with scripts, angular and files. No Prompts', function () {
        before(function (done) {
            fse.removeSync(path.join(__dirname, 'temp'));
            helpers.run(path.join(__dirname, '../generators/module'))
                .inTmpDir(function (dir) {
                    fse.copySync(path.join(__dirname, '../generators/app/templates'), dir);
                    var pathFile = path.join(templatePath, modules[1].name);
                    modules[1].files.forEach(function (name) {
                        var fullpath = path.join(pathFile, name);
                        fse.outputFileSync(fullpath);
                    });

                })
                .on('ready', function (generator) {
                    generator.conflicter.force = true;
                })
                .withArguments([modules[1].name])
                .withOptions({
                    'config': mockdata,
                    'templatePath': templatePath,
                    'skip-install': true,
                    'skip-welcome-message': true,
                    'skip-prompts': true
                }) // execute with options
                .on('end', function () {
                    fse.removeSync(path.join(__dirname, 'temp'));
                    done();
                });
        });

        it('should add scripts correctly to wiredep config', function () {
            for (var key in modules[1].wiredep.overrides) {
                if (modules[1].wiredep.overrides.hasOwnProperty(key)) {
                    assert.noFileContent('config/wiredep.js', '/' + key + '/');
                    modules[1].wiredep.overrides[key].main.forEach(function(name) {
                        assert.fileContent('config/wiredep.js', name);
                    });
                }
            }
            modules[1].wiredep.exclude.forEach(function(name) {
                assert.fileContent('config/wiredep.js', name);
            });
        });
        it('should define angular modules ', function () {
            assert.fileContent('app/app.js', modules[1].angular);
        });
        it('should move files ', function () {
            assert.file(modules[1].files);
        });

    });

    describe('add module with all the options. Project file', function () {
        before(function (done) {
            fse.removeSync(path.join(__dirname, 'temp'));
            helpers.run(path.join(__dirname, '../generators/module'))
                .inTmpDir(function (dir) {
                    fse.copySync(path.join(__dirname, '../generators/app/templates'), dir);
                    var pathFile = path.join(templatePath, modules[2].name);
                    modules[2].files.forEach(function (name) {
                        var fullpath = path.join(pathFile, name);
                        fse.outputFileSync(fullpath);
                    });
                    modules[2].templates.forEach(function (name) {
                        var fullpath = path.join(pathFile, name);
                        fse.outputFileSync(fullpath);
                    });
                })
                .on('ready', function (generator) {
                    generator.conflicter.force = true;
                })
                .withArguments([modules[2].name])
                .withPrompts({
                    promptmock0: "mock0",
                    promptmock1: "mock1"
                })
                .withOptions({
                    'config': mockdata,
                    'templatePath': templatePath,
                    'jsonproject': projectmodules,
                    'skip-install': true,
                    'skip-welcome-message': true
                }) // execute with options
                .on('end', function () {
                    fse.removeSync(path.join(__dirname, 'temp'));
                    done();
                });
        });

        it('should add scripts correctly to wiredep config', function () {
            for (var key in modules[2].wiredep.overrides) {
                if (modules[2].wiredep.overrides.hasOwnProperty(key)) {
                    assert.noFileContent('config/wiredep.js', '/' + key + '/');
                    modules[2].wiredep.overrides[key].main.forEach(function(name) {
                        assert.fileContent('config/wiredep.js', name);
                    });
                }
            }
            modules[2].wiredep.exclude.forEach(function(name) {
                assert.fileContent('config/wiredep.js', name);
            });
        });
        it('should define angular modules ', function () {
            assert.fileContent('app/app.js', modules[2].angular);
        });
        it('should define angular configuration ', function () {
            assert.fileContent('app/app.js', modules[2].config.name);
            assert.fileContent('app/app.js', modules[2].config.values[0].name);
            assert.fileContent('app/app.js', modules[2].config.values[1].name);
        });
        it('should add package to bower.json', function () {
            assert.fileContent('bower.json', modules[2].bower[0].name);
            assert.fileContent('bower.json', modules[2].bower[0].version);
            assert.fileContent('bower.json', modules[2].bower[1].name);
            assert.fileContent('bower.json', modules[2].bower[1].version);
        });
        it('should add package to package.json', function () {
            assert.fileContent('package.json', modules[2].npm[0].name);
            assert.fileContent('package.json', modules[2].npm[0].version);
            assert.fileContent('package.json', modules[2].npm[1].name);
            assert.fileContent('package.json', modules[2].npm[1].version);
        });
        it('should move files ', function () {
            assert.file(modules[2].files);
        });
        it('should move templates ', function () {
            assert.file(modules[2].templates);
        });
    });




});
