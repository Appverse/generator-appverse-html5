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

describe('appverse-html5:generator', function () {
    var gen;
    beforeEach(function (done) {
        this.timeout(10000);
        var deps = [
                '../app',
            [helpers.createDummyGenerator(), 'appverse-html5:imagemin'],
            [helpers.createDummyGenerator(), 'appverse-html5:webkit']
            ];

        helpers.testDirectory(path.join(os.tmpdir(), 'testApp1'), function (err) {
            if (err) {
                return done(err);
            }
            gen = helpers.createGenerator('appverse-html5', deps);
            gen.options['skip-install'] = true;
            done();
        }.bind(this));
    });

    describe('when called with an argument', function () {
        before(function (done) {
            fse.copy(path.join(__dirname, '../app/templates'), path.join(os.tmpdir(), 'testApp1'), done);
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

});
