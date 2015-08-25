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

describe('appverse-html5:crud-rest-entity', function () {
  var deps = [
      [helpers.createDummyGenerator(), 'appverse-html5:imagemin'],
      [helpers.createDummyGenerator(), 'appverse-html5:mobile'],
      [helpers.createDummyGenerator(), 'appverse-html5:security'],
      [helpers.createDummyGenerator(), 'appverse-html5:serverpush'],
      [helpers.createDummyGenerator(), 'appverse-html5:translate'],
      [helpers.createDummyGenerator(), 'appverse-html5:cache'],
      [helpers.createDummyGenerator(), 'appverse-html5:detection'],
      [helpers.createDummyGenerator(), 'appverse-html5:performance'],
      [helpers.createDummyGenerator(), 'appverse-html5:logging'],
      [helpers.createDummyGenerator(), 'appverse-html5:app-view'],
      [helpers.createDummyGenerator(), 'appverse-html5:bootstrap-theme'],
      [helpers.createDummyGenerator(), 'appverse-html5:webkit']
  ];


describe('when called with only entity argument', function () {
    before(function (done) {
          helpers.run(path.join(__dirname, '../rest-entity'))
          .inTmpDir(function (dir) {
              // `dir` is the path to the new temporary directory
              fse.copySync(path.join(__dirname, '../app/templates'), dir);
             //MOCK SERVER DEP
             var pkg = require(path.join(dir, 'package.json'));
             pkg.devDependencies['json-server'] = "0.6.10";
             fse.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg));
             fse.mkdirSync(path.join(dir, 'api'));
        })
        // ANGULAR MODULE
          .on('ready', function (generator) {
              generator.conflicter.force = true;
              require('../lib').projectutils.addAngularModule.call(generator, 'appverse.rest');
              var indexFile = generator.fs.read(generator.destinationPath('app/index.html'));
              var restJS = ['<script src="bower_components/lodash/lodash.min.js"></script>',
                            '<script src="bower_components/restangular/dist/restangular.min.js"></script>',
                            '<script src="bower_components/appverse-web-html5-core/dist/appverse-rest/appverse-rest.min.js"></script>'
                          ];
              //APP FILES
              indexFile = require('html-wiring').appendScripts(indexFile, 'scripts/scripts.js', restJS);
              generator.write(generator.destinationPath('app/index.html'), indexFile);
          })
            .withArguments('testEntity')
            .withOptions({
                'skip-install': true
            })
            .on('end', done);
    });


    it('includes view and controller files', function () {
        assert.file(['api/testEntity.json',
                     'app/views/testEntity/testEntity.html',
                     'app/views/testEntity/testEntityModalForm.html',
                     'app/scripts/controllers/testEntity-modal-controller.js',
                     'app/scripts/controllers/testEntity-controller.js']);
        //ASERT LODASH TEMPLATE REPLACEMENT
        assert.fileContent('app/scripts/controllers/testEntity-controller.js', '$scope.baseTestEntity = Restangular.all(\'testEntity\');');
        assert.fileContent('app/scripts/controllers/testEntity-controller.js', '$scope.baseTestEntity.getList().then(function (items) {' );
        assert.fileContent('app/scripts/controllers/testEntity-controller.js', '$scope.TestEntity = items;' );
        assert.fileContent('app/scripts/controllers/testEntity-controller.js', 'data: \'TestEntity\'' );
        assert.fileContent('app/scripts/controllers/testEntity-controller.js', 'var index = $scope.TestEntity.indexOf(item);');
        assert.fileContent('app/scripts/controllers/testEntity-controller.js', '$scope.TestEntity.some(function (element, index) {');
        assert.fileContent('app/scripts/controllers/testEntity-controller.js', '$scope.baseTestEntity.post(item).then(function (responseData) {');
        assert.fileContent('app/scripts/controllers/testEntity-controller.js', '$scope.TestEntity.push(responseData);');
        assert.fileContent('app/scripts/controllers/testEntity-controller.js', '$scope.filterTestEntity = function () {');
        assert.fileContent('app/scripts/controllers/testEntity-controller.js', 'templateUrl: \'views/testEntity/testEntityModalForm.html\'');
        assert.fileContent('app/scripts/controllers/testEntity-controller.js', 'controller: \'testEntity-modal-controller\'');

        assert.fileContent('app/scripts/controllers/testEntity-modal-controller.js', '.controller(\'testEntity-modal-controller\'');
        assert.fileContent('app/scripts/controllers/testEntity-modal-controller.js', '.controller(\'testEntity-modal-controller\'');
        assert.fileContent('app/scripts/controllers/testEntity-modal-controller.js', 'Edit testEntity');
        assert.fileContent('app/scripts/controllers/testEntity-modal-controller.js', 'New testEntity');

        assert.fileContent('app/index.html', '<script src="scripts/controllers/testEntity-controller.js"></script>');
        assert.fileContent('app/index.html', '<script src="scripts/controllers/testEntity-modal-controller.js"></script>');
        });
    });
});
