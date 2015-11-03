/*jshint node:true */

'use strict';

// Make sure code styles are up to par and there are no obvious mistakes
module.exports = {
    options: {
        jshintrc: '.jshintrc',
        force: true,
        reporter: require('jshint-stylish')
    },
    all: [
        'Gruntfile.js',
        'app/components/**/*.js',
        'app/*.js',
        'app/states/*.js',
        'test/*.js',
        'test/{e2e,unit}/**/*.js'
    ]
};
