'use strict';

module.exports = {
    unit: {
        configFile: './test/karma-unit.conf.js',
        autoWatch: false,
        background: true,
        singleRun: false
    },
    //continuous integration mode: run tests once in PhantomJS browser.
  continuous: {
    configFile: './test/karma-unit.conf.js',
    singleRun: true,
    browsers: ['PhantomJS']
  }
};
