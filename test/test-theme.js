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

var request = require('request');


describe('appverse-html5:theme', function () {
    describe('switch to appverse default', function () {
        before(function (done) {
            //console.log('moving to temp!')
            fse.removeSync(path.join(__dirname, '../temp'));
            helpers.run(path.join(__dirname, '../generators/theme'))
                .inTmpDir(function (dir) {
                    // `dir` is the path to the new temporary directory
                    fse.copySync(path.join(__dirname, '../generators/app/templates'), dir);
                })
                .on('ready', function (generator) {
                    generator.conflicter.force = true;
                })
                .withPrompts({
                    themes: "appverse"
                })
                .withOptions({
                    'skip-install': true,
                    'skip-welcome-message': true
                }) // execute with options
                .on('end', function () {
                    fse.removeSync(path.join(__dirname, 'temp'));
                    done();
                });
        });

        it('should not add dark theme source to sass.js', function () {
             assert.noFileContent('config/sass.js', 'appverse-dark');
        });
    });

    describe('switch to dark', function () {
        before(function (done) {
            //console.log('moving to temp!')
            fse.removeSync(path.join(__dirname, '../temp'));
            helpers.run(path.join(__dirname, '../generators/theme'))
                .inTmpDir(function (dir) {
                    // `dir` is the path to the new temporary directory
                    fse.copySync(path.join(__dirname, '../generators/app/templates'), dir);
                })
                .on('ready', function (generator) {
                    generator.conflicter.force = true;
                })
                .withPrompts({
                    themes: "appverse-dark"
                })
                .withOptions({
                    'skip-install': true,
                    'skip-welcome-message': true
                }) // execute with options
                .on('end', function () {
                    fse.removeSync(path.join(__dirname, 'temp'));
                    done();
                });
        });

        it('should add dark theme source to sass.js', function () {
             assert.fileContent('config/sass.js', 'appverse-dark');
        });
    });

    describe('switch to bootswatch', function () {
        describe('switch to Sandstone', function() {
            before(function (done) {
            //console.log('moving to temp!')
                fse.removeSync(path.join(__dirname, '../temp'));
                helpers.run(path.join(__dirname, '../generators/theme'))
                    .inTmpDir(function (dir) {
                        // `dir` is the path to the new temporary directory
                        fse.copySync(path.join(__dirname, '../generators/app/templates'), dir);
                    })
                    .on('ready', function (generator) {
                        generator.conflicter.force = true;
                    })
                    .withPrompts({
                        themes: "bootswatch",
                        bthemes: "Sandstone"
                    })
                    .withOptions({
                        'skip-install': true,
                        'skip-welcome-message': true
                    }) // execute with options
                    .on('end', function () {
                        fse.removeSync(path.join(__dirname, 'temp'));
                        done();
                    });
            });

            it('should modify _variables.scss', function () {
                assert.fileContent('app/styles/sass/_variables.scss', '#000 !default;'); //$gray-base
                assert.fileContent('app/styles/sass/_variables.scss', '#3E3F3A !default;'); //$gray-darker
                assert.fileContent('app/styles/sass/_variables.scss', '#8E8C84 !default;'); //$gray-dark
                assert.fileContent('app/styles/sass/_variables.scss', '#98978B !default;'); //$gray
                assert.fileContent('app/styles/sass/_variables.scss', '#DFD7CA !default;'); //$gray-light
                assert.fileContent('app/styles/sass/_variables.scss', '#F8F5F0 !default;'); //$gray-lighter

                assert.fileContent('app/styles/sass/_variables.scss', '#325D88 !default;'); //$brand-primary
                assert.fileContent('app/styles/sass/_variables.scss', '#93C54B !default;'); //$brand-success
                assert.fileContent('app/styles/sass/_variables.scss', '#29ABE0 !default;'); //$brand-info
                assert.fileContent('app/styles/sass/_variables.scss', '#F47C3C !default;'); //$brand-warning
                assert.fileContent('app/styles/sass/_variables.scss', '#d9534f !default;'); //$brand-danger
            });
            it('should modify _theme.scss', function () {
                assert.fileContent('app/styles/sass/_theme.scss', '.sandstone {');
            });
        });
    });
});
