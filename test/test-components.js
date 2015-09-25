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

var mockdata = path.join(__dirname, 'data/components.json');
var components = require(mockdata);
var templatePath = path.join(__dirname, 'temp/generators/component/templates');

describe('appverse-html5:component', function () {
    describe('add component', function () {
        before(function (done) {
            //console.log('moving to temp!')
            fse.removeSync(path.join(__dirname, '../temp'));
            helpers.run(path.join(__dirname, '../generators/component'))
                .inTmpDir(function (dir) {
                    // `dir` is the path to the new temporary directory
                    fse.copySync(path.join(__dirname, '../generators/app/templates'), dir);
                    var pathFile = path.join(templatePath, components[0].name);
                    var htmlpath = path.join(pathFile,  components[0]['html-snippet']);
                    fse.outputFileSync(htmlpath);
                    var jspath = path.join(pathFile, components[0]['js-snippet'] );
                    fse.outputFileSync(jspath);
                })
                .on('ready', function (generator) {
                    generator.conflicter.force = true;
                    var indexFile = generator.fs.read(generator.destinationPath('app/index.html'));
                    var restJS = ['bower_components/angular/angular.min.js'];
                    //APP FILES
                    indexFile = require('html-wiring').appendScripts(indexFile, 'scripts/scripts.js', restJS);
                    generator.write(generator.destinationPath('app/index.html'), indexFile);

                    var html = "<div class=\"container\" scrolly-scroll></div>";
                   generator.write(generator.destinationPath('app/components/mockview/mockview.html'), html);

                })
                .withArguments([components[0].name])
                .withOptions({
                    'config': mockdata,
                    'templatePath': templatePath,
                    'skip-install': true,
                    'skip-welcome-message': true,
                    'target' : 'mockview'
                }) // execute with options
                .on('end', function () {
                    fse.removeSync(path.join(__dirname, 'temp'));
                    done();
                });
        });
        //Resolve timestamp on file name.
        /*
        it('should move http and js files', function () {
            assert.file("app/components/mockview/mockview-MockHMTL.html");
            assert.file("app/scripts/controllers/mockview-MockJS.js");
        }); */
        it('should add scripts to index', function () {
           assert.fileContent('app/index.html','MockJS.js');
        });
        it('should add content to the target view', function () {
           assert.fileContent('app/components/mockview/mockview.html','MockHMTL.html');
        });

    });


});
