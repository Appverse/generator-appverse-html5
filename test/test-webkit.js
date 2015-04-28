'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

xdescribe('AppverseHtml5:webkit', function () {
    before(function (done) {
        helpers.run(path.join(__dirname, '../webkit'))
            .withArguments('name', '--force')
            .withOptions({
                'skip-install': true
            })
            .on('end', done);
    });

    it('creates files', function () {
        assert.file([
      'somefile.js'
    ]);
    });
});
