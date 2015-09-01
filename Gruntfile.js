/*jshint node:true */
'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Bump version numbers
        pkg: grunt.file.readJSON('package.json'),
        bumpup: {
            options: {
                updateProps: {
                    pkg: 'package.json'
                }
            },
            file: 'package.json'
        },
        gitcommit: {
            version: {
                options: {
                    message: 'New version: <%= pkg.version %>'
                },
                files: {
                    // Specify the files you want to commit
                    src: ['package.json']
                }
            }
        },
        instrument: {
            files: ['generators/**/*.js', '!**/templates/**'],
            options: {
                lazy: true,
                basePath: 'temp/generators'
            }
        }
    });

    // Load all grunt plugins here
    grunt.loadNpmTasks('grunt-bumpup');
    grunt.loadNpmTasks('grunt-git');

    grunt.loadNpmTasks('grunt-istanbul');


};
