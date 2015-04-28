'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var fs = require('fs-extra');
var os = require('os');

describe('appverse-html5:rest-entity', function () {
    before(function (done) {

        helpers.run(path.join(__dirname, '../rest-entity'))
            .inDir(path.join(os.tmpdir(), './testApp-rest-entity'), function (dir) {
                fs.copySync(path.join(__dirname, '../app/templates'), dir);
            })
            .withArguments('testEntity')
            .on('end', done);
    });

    it('includes scripts', function () {
        assert.noFile('api/testEntity.json');
    });

});
