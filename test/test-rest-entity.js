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

describe('appverse-html5:rest-entity', function () {
    before(function (done) {
        helpers.run(path.join(__dirname, '../rest-entity'))
            .inDir(path.join(os.tmpdir(), 'testApp-rest-entity'), function (dir) {
                fse.copySync(path.join(__dirname, '../app/templates/package.json'), path.join(dir, 'package.json'));
                fse.copySync(path.join(__dirname, '../app/templates/app/index.html'), path.join(dir, 'app/index.html'));
                fse.copySync(path.join(__dirname, '../app/templates/app/scripts/app.js'), path.join(dir, 'app/scripts/app.js'));
                fse.copySync(path.join(__dirname, '../app/templates/app/scripts/states/app-states.js'), path.join(dir, 'app/scripts/states/app-states.js'));

                var pkg = require(path.join(dir, 'package.json'));
                pkg.devDependencies['json-server'] = "0.6.10";

                fse.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg));
                fse.mkdirSync(path.join(dir, 'api'));
            })
            .on('ready', function (generator) {
                require('../lib').projectutils.addAngularModule.call(generator, 'appverse.rest');

            })
            .withArguments('testEntity')
            .on('end', done);
    });

    it('includes scripts', function () {
        assert.file('api/testEntity.json');
    });

});
