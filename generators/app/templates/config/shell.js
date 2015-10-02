/*jshint node:true */
'use strict';

module.exports = {
    jasmine2: {
        command: 'node node_modules/protractor/bin/protractor test/protractor-jasmine2.conf.js'
    },
    cucumber: {
        command: 'node node_modules/protractor/bin/protractor test/protractor-cucumber.conf.js'
    }
};
