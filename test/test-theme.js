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

var nock = require('nock');

var api = {
  version: "0.0.1",
  themes: [
    {
      name: "appverse",
      description: "Appverse theme",
      scss: "https://appverse.gftlabs.com/theme/appverse/_theme.scss",
      scssVariables: "https://appverse.gftlabs.com/theme/appverse/_variables.scss"
    },
    {
      name: "appverse-dark",
      description: "Appverse Dark theme",
      scss: "https://appverse.gftlabs.com/theme/appverse-dark/_theme.scss",
      scssVariables: "https://appverse.gftlabs.com/theme/appverse-dark/_variables.scss"
    }
  ]
}; 
describe('appverse-html5:theme', function () {
    describe('switch to dark ', function () {

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
                    var themeserver = nock('https://appverse.gftlabs.com')
                                    .get('/theme')
                                    .reply(200, api);

                    var _theme = nock('https://appverse.gftlabs.com')
                                          .get('/theme/appverse-dark/_theme.scss')
                                          .replyWithFile(200, __dirname + '/data/_theme.scss');

                    var _variables = nock('https://appverse.gftlabs.com')
                                      .get('/theme/appverse-dark/_variables.scss')
                                      .replyWithFile(200, __dirname + '/data/_variables.scss');
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

        it('Appverse theme switch to dark', function () {
            assert.fileContent('app/styles/theme/_theme.scss', 'Appverse-dark');
            assert.fileContent('app/styles/theme/_variables.scss', 'Appverse-dark');
        });

    });
});
