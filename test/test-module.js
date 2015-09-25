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
var fs = require('fs');

var mockdata = path.join(__dirname, 'data/modules.json');
var modules = require(mockdata);
var templatePath = path.join(__dirname, 'temp/generators/module/templates');

describe('appverse-html5:module', function () {
    describe('module with scripts', function () {
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
                    var indexFile = generator.fs.read(generator.destinationPath('app/index.html'));
                    var restJS = ['<script src="bower_components/angular/angular.min.js"></script>'];
                    //APP FILES
                    indexFile = require('html-wiring').appendScripts(indexFile, 'scripts/scripts.js', restJS);
                    generator.write(generator.destinationPath('app/index.html'), indexFile);
                })
                .withArguments([modules[0].name])
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

        it('should add scripts to index', function () {
            modules[0].scripts.forEach(function (name) {
                assert.fileContent('app/index.html', name);
            });
        });

    });
    describe('module with scripts and angular', function () {
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
                    var indexFile = generator.fs.read(generator.destinationPath('app/index.html'));
                    var restJS = ['<script src="bower_components/angular/angular.min.js"></script>'];
                    //APP FILES
                    indexFile = require('html-wiring').appendScripts(indexFile, 'scripts/scripts.js', restJS);
                    generator.write(generator.destinationPath('app/index.html'), indexFile);
                })
                .withArguments([modules[1].name])
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

        it('should add scripts to index', function () {
            modules[1].scripts.forEach(function (name) {
                assert.fileContent('app/index.html', name);
            });
        });
        it('should define angular modules ', function () {
            assert.fileContent('app/app.js', modules[1].angular);
        });

    });
    describe('module with scripts angular and config', function () {
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
                    var indexFile = generator.fs.read(generator.destinationPath('app/index.html'));
                    var restJS = ['<script src="bower_components/angular/angular.min.js"></script>'];
                    //APP FILES
                    indexFile = require('html-wiring').appendScripts(indexFile, 'scripts/scripts.js', restJS);
                    generator.write(generator.destinationPath('app/index.html'), indexFile);
                })
                .withArguments([modules[2].name])
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

        it('should add scripts to index', function () {
            modules[2].scripts.forEach(function (name) {
                assert.fileContent('app/index.html', name);
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

    });
    describe('add module with scripts angular and files ', function () {
        before(function (done) {
            fse.removeSync(path.join(__dirname, 'temp'));
            helpers.run(path.join(__dirname, '../generators/module'))
                .inTmpDir(function (dir) {
                    fse.copySync(path.join(__dirname, '../generators/app/templates'), dir);
                    var pathFile = path.join(templatePath, modules[3].name);
                    modules[3].files.forEach(function (name) {
                        var fullpath = path.join(pathFile, name);
                        fse.outputFileSync(fullpath);
                    });

                })
                .on('ready', function (generator) {
                    generator.conflicter.force = true;
                    var indexFile = generator.fs.read(generator.destinationPath('app/index.html'));
                    var restJS = ['<script src="bower_components/angular/angular.min.js"></script>'];
                    //APP FILES
                    indexFile = require('html-wiring').appendScripts(indexFile, 'scripts/scripts.js', restJS);
                    generator.write(generator.destinationPath('app/index.html'), indexFile);

                })
                .withArguments([modules[3].name])
                .withOptions({
                    'config': mockdata,
                    'templatePath': templatePath,
                    'skip-install': true,
                    'skip-welcome-message': true
                }) // execute with options
                .on('end', function () {
                    fse.removeSync(path.join(__dirname, 'temp'));
                    done();
                });
        });

        it('should add scripts to index', function () {
            modules[3].scripts.forEach(function (name) {
                assert.fileContent('app/index.html', name);
            });
        });
        it('should define angular modules ', function () {
            assert.fileContent('app/app.js', modules[3].angular);
        });
        it('should move files ', function () {
            assert.file(modules[3].files);
        });

    });



    describe('add module with all the options ', function () {
        before(function (done) {
            fse.removeSync(path.join(__dirname, 'temp'));
            helpers.run(path.join(__dirname, '../generators/module'))
                .inTmpDir(function (dir) {
                    fse.copySync(path.join(__dirname, '../generators/app/templates'), dir);
                    var pathFile = path.join(templatePath, modules[4].name);
                    modules[4].files.forEach(function (name) {
                        var fullpath = path.join(pathFile, name);
                        fse.outputFileSync(fullpath);
                    });
                    modules[4].templates.forEach(function (name) {
                        var fullpath = path.join(pathFile, name);
                        fse.outputFileSync(fullpath);
                    });
                })
                .on('ready', function (generator) {
                    generator.conflicter.force = true;
                    var indexFile = generator.fs.read(generator.destinationPath('app/index.html'));
                    var restJS = ['<script src="bower_components/angular/angular.min.js"></script>'];
                    //APP FILES
                    indexFile = require('html-wiring').appendScripts(indexFile, 'scripts/scripts.js', restJS);
                    generator.write(generator.destinationPath('app/index.html'), indexFile);

                })
                .withArguments([modules[4].name])
                .withOptions({
                    'config': mockdata,
                    'templatePath': templatePath,
                    'skip-install': true,
                    'skip-welcome-message': true
                }) // execute with options
                .on('end', function () {
                    fse.removeSync(path.join(__dirname, 'temp'));
                    done();
                });
        });

        it('should add scripts to index', function () {
            modules[4].scripts.forEach(function (name) {
                assert.fileContent('app/index.html', name);
            });
        });
        it('should define angular modules ', function () {
            assert.fileContent('app/scripts/app.js', modules[4].angular);
        });
        it('should define angular configuration ', function () {
            assert.fileContent('app/scripts/app.js', modules[4].config.name);
            assert.fileContent('app/scripts/app.js', modules[4].config.values[0].name);
            assert.fileContent('app/scripts/app.js', modules[4].config.values[1].name);
        });
        it('should add package to bower.json', function () {
            assert.fileContent('bower.json', modules[4].bower[0].name);
            assert.fileContent('bower.json', modules[4].bower[0].version);
            assert.fileContent('bower.json', modules[4].bower[1].name);
            assert.fileContent('bower.json', modules[4].bower[1].version);
        });
        it('should add package to package.json', function () {
            assert.fileContent('package.json', modules[4].npm[0].name);
            assert.fileContent('package.json', modules[4].npm[0].version);
            assert.fileContent('package.json', modules[4].npm[1].name);
            assert.fileContent('package.json', modules[4].npm[1].version);
        });
        it('should move files ', function () {
            assert.file(modules[4].files);
        });
        it('should move templates ', function () {
            assert.file(modules[4].templates);
        });
    });




});
