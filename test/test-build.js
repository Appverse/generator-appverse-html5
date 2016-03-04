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
var mockdata = path.join(__dirname, 'data/builds.json');
var modules = require(mockdata);
var templatePath = path.join(__dirname, 'temp/generators/build/templates');

describe('appverse-html5:build', function () {
    describe('build', function () {
        before(function (done) {
            //console.log('moving to temp!')
            fse.removeSync(path.join(__dirname, 'temp'));
            helpers.run(path.join(__dirname, '../generators/build'))
                .inTmpDir(function (dir) {
                    fse.copySync(path.join(__dirname, '../generators/app/templates'), dir);
                    var pathFile = path.join(templatePath, modules[0].name);
                    modules[0].files.forEach(function (name) {
                        var fullpath = path.join(pathFile, name);
                        fse.outputFileSync(fullpath);
                    });
                    modules[0].templates.forEach(function (name) {
                        var fullpath = path.join(pathFile, name);
                        fse.outputFileSync(fullpath);
                    });
                })

            .withArguments([modules[0].name])
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

        it('should add package to package.json', function () {
            assert.fileContent([
                    [ 'package.json',
                        '\"' + modules[0].npm[0].name + '\":\"' + modules[0].npm[0].version + '\"'
                    ],
                    [ 'package.json',
                        '\"' + modules[0].npm[1].name + '\":\"' + modules[0].npm[1].version + '\"'
                    ]
            ]);
        });
        it('should add scripts to package.json', function () {
            assert.fileContent( 'package.json',
                                '\"' + modules[0].scripts[0].name + '\":\"' + modules[0].scripts[0].value + '\"' );
        });
        it('should move files ', function () {
            assert.file(modules[0].files);
        });
        it('should move templates ', function () {
            assert.file(modules[0].templates);
        });
    });
});

