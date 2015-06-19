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


describe('appverse-html5:bootstrap-theme', function () {
    describe('Theme by default', function () {
        before(function (done) {
            helpers.run(path.join(__dirname, '../bootstrap-theme'))
                .inDir(path.join(os.tmpdir(), 'testApp-bootstrap'), function (dir) {
                    fs.copySync(path.join(__dirname, '../app/templates'), dir);
                })
                .withOptions({
                    config: {
                        theme: {
                            enabled: false,
                            config: {
                                scss: "http://bootswatch.com/flatly/_bootswatch.scss",
                                scssVariables: "http://bootswatch.com/flatly/_variables.scss"
                            }
                        }
                    }
                })
                .on('end', done);
        });

        it('Appverse theme by default', function () {
            assert.fileContent('app/styles/theme/_theme.scss', 'Appverse');
            assert.fileContent('app/styles/theme/_variables.scss', 'Appverse');
        });
    });

    describe('Set Theme by config', function () {
        before(function (done) {

            helpers.run(path.join(__dirname, '../bootstrap-theme'))
                .inDir(path.join(os.tmpdir(), 'testApp2-bootstrap'), function (dir) {
                    fs.copySync(path.join(__dirname, '../app/templates'), dir);
                })
                .withOptions({
                    config: {
                        theme: {
                            enabled: true,
                            config: {
                                scss: "http://bootswatch.com/flatly/_bootswatch.scss",
                                scssVariables: "http://bootswatch.com/flatly/_variables.scss"
                            }
                        }
                    }
                })
                .on('end', done);
        });

        it('Appverse theme by default', function () {

            assert.fileContent('app/styles/theme/_theme.scss', 'Flatly');
            assert.fileContent('app/styles/theme/_variables.scss', 'Flatly');
        });
    });
    describe('Set Theme by config', function () {
        before(function (done) {

            helpers.run(path.join(__dirname, '../bootstrap-theme'))
                .inDir(path.join(os.tmpdir(), 'testApp3-bootstrap'), function (dir) {
                    fs.copySync(path.join(__dirname, '../app/templates'), dir);
                })
                .withPrompts({
                    themes: "Cerulean"
                })
                .on('end', done);
        });

        it('Appverse theme by default', function () {

            assert.fileContent('app/styles/theme/_theme.scss', 'Cerulean');
            assert.fileContent('app/styles/theme/_variables.scss', 'Cerulean');
        });
    });
});
