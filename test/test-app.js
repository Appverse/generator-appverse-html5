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
var fse = require('fs-extra');

var config = require('../generators/app/config/project-config.json');

describe('appverse-html5:generator', function () {
    var deps = [
                [helpers.createDummyGenerator(), 'appverse-html5:module'],
                [helpers.createDummyGenerator(), 'appverse-html5:build'],
                [helpers.createDummyGenerator(), 'appverse-html5:runtime']
            ];
    describe('when called with demo option', function () {
        before(function (done) {
            helpers.run(path.join(__dirname, '../generators/app'))
                .inTmpDir(function (dir) {
                    fse.copySync(path.join(__dirname, '../generators/app/templates'), dir);
                })
                .withGenerators(deps)
                .withPrompts({
                    appName: 'test',
                    coreOptions: []
                })
                .withOptions({
                    'skip-install': true,
                    'skip-welcome-message': true,
                    'demo': true
                })
                .on('end', done);
        });

        it('should create files and demo files', function () {
           assert.file(config.files);
           assert.file(config.demofiles);
        });
        it('should move templates and demo templates', function() {
            assert.file(config.templates);
            assert.file(config.demotemplates);
        });
        it('should replace templates with application name', function () {
            assert.fileContent([
                [ 'bower.json', '\"name\": \"test\"' ],
                [ 'package.json', '\"name\": \"test\"' ],
                [ 'app/index.html', '<html class=\"no-js\" ng-app=\"testApp\">' ],
                [ 'app/app.js', 'angular.module(\'testApp\'' ]
            ]);
        });
        it('should add style placeholders to index', function () {
            assert.fileContent([
                [ 'app/index.html', '<!-- bower:css -->' ],
                [ 'app/index.html', '<!-- endbower -->' ],
                [ 'app/index.html', '<!-- include: \"type\": \"css\", \"files\": \"<%= css %>\" -->' ],
                [ 'app/index.html', '<!-- /include -->' ]
            ]);
        });
        it('should add script placeholders to index', function () {
            assert.fileContent([
                [ 'app/index.html', '<!-- bower:css -->' ],
                [ 'app/index.html', '<!-- endbower -->' ],
                [ 'app/index.html', '<!-- include: \"type\": \"js\", \"files\": \"<%= scripts %>\" -->' ],
                [ 'app/index.html', '<!-- /include -->' ]
            ]);
        });
        it('should add new states', function () {
            assert.fileContent([
                [ 'app/states/app-states.js', 'components/theme/theme.html' ],
                [ 'app/states/app-states.js', 'components/components/components.html' ],
                [ 'app/states/app-states.js', 'components/charts/charts.html' ],
                [ 'app/states/app-states.js', 'components/icons/icons.html' ]
            ]);
        });
        it('should add new navbar items', function () {
             assert.fileContent([
                [ 'app/index.html', 'Theme' ],
                [ 'app/index.html', 'Components' ],
                [ 'app/index.html', 'Charts' ],
                [ 'app/index.html', 'Icons' ]
            ]);
        })
    });

    describe('when called with prompts (no modules - no builds)', function () {
        before(function (done) {
            helpers.run(path.join(__dirname, '../generators/app'))
                .inTmpDir(function (dir) {
                    // `dir` is the path to the new temporary directory
                    fse.copySync(path.join(__dirname, '../generators/app/templates'), dir,
                                {filter: function(elem) {
                                    for (var i = 0; i<config.demotemplates.length; i++){
                                        if (elem.indexOf(config.demotemplates[i])>-1) {
                                            return false;
                                        }
                                    }
                                    for (var i = 0; i<config.demofiles.length; i++){
                                        if (elem.indexOf(config.demofiles[i])>-1) {
                                            return false;
                                        }
                                    }
                                    return true;
                                }});
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
            assert.noFile(config.demofiles);
        });
        it('should move templates files', function () {
            assert.file(config.templates);
            assert.noFile(config.demotemplates);
        });
        it('should replace templates with application name', function () {
            assert.fileContent([
                [ 'bower.json', '\"name\": \"test\"' ],
                [ 'package.json', '\"name\": \"test\"' ],
                [ 'app/index.html', '<html class=\"no-js\" ng-app=\"testApp\">' ],
                [ 'app/app.js', 'angular.module(\'testApp\'' ]
            ]);
        });
        it('should add style placeholders to index', function () {
            assert.fileContent([
                [ 'app/index.html', '<!-- bower:css -->' ],
                [ 'app/index.html', '<!-- endbower -->' ],
                [ 'app/index.html', '<!-- include: \"type\": \"css\", \"files\": \"<%= css %>\" -->' ],
                [ 'app/index.html', '<!-- /include -->' ]
            ]);
        });
        it('should add script placeholders to index', function () {
            assert.fileContent([
                [ 'app/index.html', '<!-- bower:css -->' ],
                [ 'app/index.html', '<!-- endbower -->' ],
                [ 'app/index.html', '<!-- include: \"type\": \"js\", \"files\": \"<%= scripts %>\" -->' ],
                [ 'app/index.html', '<!-- /include -->' ]
            ]);
        });
        it('should not add new states', function () {
            assert.noFileContent([
                [ 'app/states/app-states.js', 'components/theme/theme.html' ],
                [ 'app/states/app-states.js', 'components/components/components.html' ],
                [ 'app/states/app-states.js', 'components/charts/charts.html' ],
                [ 'app/states/app-states.js', 'components/icons/icons.html' ]
            ]);
        });
        it('should not add new navbar components', function () {
            assert.noFileContent([
                [ 'app/index.html', 'Theme' ],
                [ 'app/index.html', 'Components' ],
                [ 'app/index.html', 'Charts' ],
                [ 'app/index.html', 'Icons' ]
            ]);
        });
    });

    describe('when called with argument name', function () {
        before(function (done) {
            helpers.run(path.join(__dirname, '../generators/app'))
                .inTmpDir(function (dir) {
                    // `dir` is the path to the new temporary directory
                    fse.copySync(path.join(__dirname, '../generators/app/templates'), dir,
                                {filter: function(elem) {
                                    for (var i = 0; i<config.demotemplates.length; i++){
                                        if (elem.indexOf(config.demotemplates[i])>-1) {
                                            return false;
                                        }
                                    }
                                    for (var i = 0; i<config.demofiles.length; i++){
                                        if (elem.indexOf(config.demofiles[i])>-1) {
                                            return false;
                                        }
                                    }
                                    return true;
                                }});
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
            assert.noFile(config.demofiles);
        });
        it('should move templates files', function () {
            assert.file(config.templates);
            assert.noFile(config.demotemplates);
        });
        it('should replace templates with application name', function () {
            assert.fileContent([
                [ 'bower.json', '\"name\": \"test\"' ],
                [ 'package.json', '\"name\": \"test\"' ],
                [ 'app/index.html', '<html class=\"no-js\" ng-app=\"testApp\">' ],
                [ 'app/app.js', 'angular.module(\'testApp\'' ]
            ]);
        });
        it('should add style placeholders to index', function () {
            assert.fileContent([
                [ 'app/index.html', '<!-- bower:css -->' ],
                [ 'app/index.html', '<!-- endbower -->' ],
                [ 'app/index.html', '<!-- include: \"type\": \"css\", \"files\": \"<%= css %>\" -->' ],
                [ 'app/index.html', '<!-- /include -->' ]
            ]);
        });
        it('should add script placeholders to index', function () {
            assert.fileContent([
                [ 'app/index.html', '<!-- bower:css -->' ],
                [ 'app/index.html', '<!-- endbower -->' ],
                [ 'app/index.html', '<!-- include: \"type\": \"js\", \"files\": \"<%= scripts %>\" -->' ],
                [ 'app/index.html', '<!-- /include -->' ]
            ]);
        });
        it('should not add new states', function () {
            assert.noFileContent([
                [ 'app/states/app-states.js', 'components/theme/theme.html' ],
                [ 'app/states/app-states.js', 'components/components/components.html' ],
                [ 'app/states/app-states.js', 'components/charts/charts.html' ],
                [ 'app/states/app-states.js', 'components/icons/icons.html' ]
            ]);
        });
        it('should not add new navbar components', function () {
            assert.noFileContent([
                [ 'app/index.html', 'Theme' ],
                [ 'app/index.html', 'Components' ],
                [ 'app/index.html', 'Charts' ],
                [ 'app/index.html', 'Icons' ]
            ]);
        });
    });

    describe('when called with project (json) argument name', function () {
        var project = path.join(__dirname, '/data/appverse-project.json');
        before(function (done) {
            helpers.run(path.join(__dirname, '../generators/app'))
                .inTmpDir(function (dir) {
                    // `dir` is the path to the new temporary directory
                    fse.copySync(path.join(__dirname, '../generators/app/templates'), dir,
                                {filter: function(elem) {
                                    for (var i = 0; i<config.demotemplates.length; i++){
                                        if (elem.indexOf(config.demotemplates[i])>-1) {
                                            return false;
                                        }
                                    }
                                    for (var i = 0; i<config.demofiles.length; i++){
                                        if (elem.indexOf(config.demofiles[i])>-1) {
                                            return false;
                                        }
                                    }
                                    return true;
                                }});
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
            assert.noFile(config.demofiles);
        });
        it('should move templates files', function () {
            assert.file(config.templates);
            assert.noFile(config.demotemplates);
        });
        it('should replace templates with application name', function () {
            assert.fileContent( [
                [ 'bower.json', '\"name\": \"mytestproject\"' ],
                [ 'package.json', '\"name\": \"mytestproject\"' ],
                [ 'app/index.html', '<html class=\"no-js\" ng-app=\"mytestprojectApp\">' ],
                [ 'app/app.js', 'angular.module(\'mytestprojectApp\'' ]
            ]);
        });
        it('should add style placeholders to index', function () {
            assert.fileContent([
                [ 'app/index.html', '<!-- bower:css -->' ],
                [ 'app/index.html', '<!-- endbower -->' ],
                [ 'app/index.html', '<!-- include: \"type\": \"css\", \"files\": \"<%= css %>\" -->' ],
                [ 'app/index.html', '<!-- /include -->' ]
            ]);
        });
        it('should add script placeholders to index', function () {
            assert.fileContent([
                [ 'app/index.html', '<!-- bower:css -->' ],
                [ 'app/index.html', '<!-- endbower -->' ],
                [ 'app/index.html', '<!-- include: \"type\": \"js\", \"files\": \"<%= scripts %>\" -->' ],
                [ 'app/index.html', '<!-- /include -->' ]
            ]);
        });
        it('should not add new states', function () {
            assert.noFileContent([
                [ 'app/states/app-states.js', 'components/theme/theme.html' ],
                [ 'app/states/app-states.js', 'components/components/components.html' ],
                [ 'app/states/app-states.js', 'components/charts/charts.html' ],
                [ 'app/states/app-states.js', 'components/icons/icons.html' ]
            ]);
        });
        it('should not add new navbar components', function () {
            assert.noFileContent([
                [ 'app/index.html', 'Theme' ],
                [ 'app/index.html', 'Components' ],
                [ 'app/index.html', 'Charts' ],
                [ 'app/index.html', 'Icons' ]
            ]);
        });
        it('should add module files to bower.json', function () {
            assert.fileContent([
                [ 'config/wiredep.js', 'angular-cache']
            ]);
        })
    });

});
