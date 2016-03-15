/*jshint node:true */
'use strict';

module.exports = function (grunt) {
    //Load all .js tasks definitions at tasks folder
    grunt.loadTasks('./tasks');
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);
    grunt.loadNpmTasks('grunt-browser-sync');

    var options = {
        appName: require('./package.json').name,
        // Project settings
        paths: {
            // Configurable paths
            app: 'app',
            dist: 'dist/web',
            server: 'server',
            doc: 'doc'
        },
        ports: {
            app: '9000',
            dist: '9100',
            doc: '9200',
            test: '9300'
        },
        scripts: [
            'app.js',
            'states/*.js',
            'components/**/*-module.js',
            'components/**/*.js',
            '!components/**/*.spec.js'
        ],
        css: [
            'styles/**/*.css'
        ]
    };

    // Load grunt configurations automatically at config folder
    var configs = require('load-grunt-configs')(grunt, options);

    // Define the configuration for all the tasks
    grunt.initConfig(configs);

    grunt.registerTask('default', [
        'server'
    ]);

};
