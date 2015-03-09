// Generated on 2013-09-19 using generator-angular 0.4.0
'use strict';
var LIVERELOAD_PORT = 35728;
var lrSnippet = require('connect-livereload')({
    port: LIVERELOAD_PORT
});

var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

var fs = require('fs');

var delayApiCalls = function (request, response, next) {
    if (request.url.indexOf('/api') !== -1) {
        setTimeout(function () {
            next();
        }, 1000);
    } else {
        next();
    }
};

// configurable paths
var yeomanConfig = {
    app: 'app',
    dist: 'dist',
    doc: 'doc',
    server: 'server'
};

var httpMethods = function (request, response, next) {

    console.log("\nrequest method: " + JSON.stringify(request.method));
    var rawpath = request.url.split('?')[0];
    console.log("request url: " + JSON.stringify(request.url));
    var path = require('path').resolve(__dirname, '' + yeomanConfig.server + rawpath);

    console.log("request path : " + JSON.stringify(path));

    console.log("request current dir : " + JSON.stringify(__dirname));

    if ((request.method === 'PUT' || request.method === 'POST')) {

        request.content = '';

        request.addListener("data", function (chunk) {
            request.content += chunk;
        });

        request.addListener("end", function () {
            console.log("request content: " + JSON.stringify(request.content));

            if (request.url === '/log') {

                var filePath = yeomanConfig.server + '/log/server.log';

                var logData = JSON.parse(request.content);

                fs.appendFile(filePath, logData.logUrl + '\n' + logData.logMessage + '\n', function (err) {
                    if (err) {
                        throw err;
                    }
                    console.log('log saved');
                    response.end('log was saved');
                });
                return;
            }

            var endSuccess = function (response, err, successMessage) {
                if (err) {
                    throw err;
                }
                console.log(successMessage);
                response.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                response.end(successMessage);
            };

            var endError = function (response, errorMessage) {
                console.error(errorMessage);
                response.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                response.end(errorMessage);
            };

            if (fs.existsSync(path)) {

                if (request.method === 'PUT') {
                    fs.writeFile(path, request.content, function (err) {
                        endSuccess(response, err, 'File was updated successfully.');
                    });
                } else {
                    endError(response, 'File already exist so cannot create it. Please use PUT method to update existing files.');
                }
            } else {
                if (request.method === 'POST') {
                    fs.writeFile(path, request.content, function (err) {
                        endSuccess(response, err, 'File was created successfully.');
                    });
                } else {
                    endError(response, 'File does not exist so cannot update it. Please use POST method to create files.');
                }
            }
        });
        return;
    }
    next();
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    try {
        yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
    } catch (e) {}

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            coffee: {
                files: ['<%= yeoman.app %>/scripts/**/*.coffee'],
                tasks: ['coffee:app']
            },
            coffeeTest: {
                files: ['test/spec/**/*.coffee'],
                tasks: ['coffee:test']
            },
            sass: {
                files: ['<%= yeoman.app %>/styles/**/*.{scss,sass}'],
                tasks: ['sass', 'autoprefixer:tmp']
            },
            styles: {
                files: ['<%= yeoman.app %>/styles/**/*.css'],
                tasks: ['autoprefixer:styles']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%= yeoman.app %>/**/*.html',
                    '{.tmp,<%= yeoman.app %>}/styles/**/*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/**/*.js',
                    '<%= yeoman.app %>/resources/**/*'
                ]
            }
            //            ,
            //            doc: {
            //                files: ['{.tmp,<%= yeoman.app %>}/scripts/**/*.js'],
            //                tasks: ['docular']
            //            }
        },
        autoprefixer: {
            options: ['last 1 version'],
            tmp: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '**/*.css',
                    dest: '.tmp/styles/'
                }]
            },
            styles: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/styles/',
                    src: '**/*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },
        connect: {
            options: {
                protocol: 'http',
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            delayApiCalls,
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.server),
                            mountFolder(connect, yeomanConfig.app),
                            httpMethods
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9003,
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.server),
                            mountFolder(connect, yeomanConfig.app),
                            mountFolder(connect, 'test')
                        ];
                    }
                }
            },
            dist: {
                options: {
                    port: 9001,
                    middleware: function (connect) {
                        return [
                            delayApiCalls,
                            mountFolder(connect, yeomanConfig.server),
                            mountFolder(connect, yeomanConfig.dist),
                            httpMethods
                        ];
                    }
                }
            },
            doc: {
                options: {
                    port: 9002,
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, yeomanConfig.doc)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                url: '<%= connect.options.protocol %>://<%= connect.options.hostname %>:<%= connect.options.port %>'
            },
            dist: {
                url: '<%= connect.options.protocol %>://<%= connect.options.hostname %>:<%= connect.dist.options.port %>'
            },
            doc: {
                url: '<%= connect.options.protocol %>://<%= connect.options.hostname %>:<%= connect.doc.options.port %>'
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp',
            doc: 'doc'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js'
            ]
        },
        coffee: {
            options: {
                sourceMap: true,
                sourceRoot: ''
            },
            app: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/scripts',
                    src: '**/*.coffee',
                    dest: '.tmp/scripts',
                    ext: '.js'
                }]
            },
            test: {
                files: [{
                    expand: true,
                    cwd: 'test/spec',
                    src: '{,*/}*.coffee',
                    dest: '.tmp/spec',
                    ext: '.js'
                }]
            }
        },
        sass: {
                options: {
                sourceMap: true,
                includePaths: ['<%= yeoman.app %>/bower_components/bootstrap-sass-official/assets/stylesheets']
            },
            server: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/styles',
                    src: '*.{scss,sass}',
                    dest: '.tmp/styles',
                    ext: '.css'
                }]
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/**/*.js',
                        '<%= yeoman.dist %>/styles/**/*.css',
                        '<%= yeoman.dist %>/styles/images/**/*',
                        '<%= yeoman.dist %>/fonts/**/*'
                    ]
                }
            }
        },
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        usemin: {
            html: ['<%= yeoman.dist %>/*.html', '<%= yeoman.dist %>/views/**/*.html'],
            css: ['<%= yeoman.dist %>/styles/**/*.css'],
            options: {
                assetsDirs: ['<%= yeoman.dist %>/**']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: [
                        'styles/images/*.{jpg,jpeg,svg,gif}'
                    ],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    removeCommentsFromCDATA: true,
                    removeCDATASectionsFromCDATA: true,
                    collapseWhitespace: true,
                    //                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: false,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    keepClosingSlash: true,
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: [
                        '*.html',
                        'views/**/*.html',
                        'template/**/*.html'
                    ],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'images/{,*/}*.{gif,webp}',
                        'resources/**',
                        'styles/fonts/*',
                        'styles/images/*',
                        '*.html',
                        'views/**/*.html',
                        'template/**/*.html'
                    ]
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components/bootstrap-sass-official/assets/fonts',
                    dest: '<%= yeoman.dist %>/fonts',
                    src: '**/*'
                }, {
                    expand: true,
                    cwd: '.tmp/images',
                    dest: '<%= yeoman.dist %>/images',
                    src: 'generated/*'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components/angular-i18n',
                    dest: '<%= yeoman.dist %>/resources/i18n/angular',
                    src: [
                        '*en-us.js',
                        '*es-es.js',
                        '*ja-jp.js',
                        '*ar-eg.js'
                    ]
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '.tmp/styles',
                src: '**/*.css'
            },
            i18n: {
                expand: true,
                cwd: '<%= yeoman.app %>/bower_components/angular-i18n',
                dest: '.tmp/resources/i18n/angular',
                src: [
                    '*en-us.js',
                    '*es-es.js',
                    '*ja-jp.js',
                    '*ar-eg.js'
                ]
            },
            fonts: {
                expand: true,
                cwd: '<%= yeoman.app %>/bower_components/bootstrap-sass-official/assets/fonts',
                dest: '.tmp/fonts',
                src: '**/*'
            }
        },
        concurrent: {
            server: [
                'coffee',
                'sass',
                'copy:i18n',
                'copy:fonts'
            ],
            dist: [
                'coffee',
                'sass',
                'imagemin'
            ]
        },
        karma: {
            unit: {
                configFile: './test/karma-unit.conf.js',
                autoWatch: false,
                singleRun: true
            },
            unit_auto: {
                configFile: './test/karma-unit.conf.js'
            },
            e2e: {
                configFile: './test/karma-e2e.conf.js',
                autoWatch: false,
                singleRun: true
            },
            e2e_auto: {
                configFile: './test/karma-e2e.conf.js'
            }
        },
        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/scripts',
                    src: '*.js',
                    dest: '.tmp/concat/scripts'
                }]
            }
        },
        license: {
            licence: {
                output: 'licenses.json'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-license');

    grunt.registerTask('server', [
        'clean:server',
        'concurrent:server',
        'autoprefixer',
        'connect:livereload',
        'open:server',
        'watch'
    ]);

    grunt.registerTask('testserver', [
        'clean:server',
        'concurrent:server',
        'autoprefixer',
        'connect:test'
    ]);

    grunt.registerTask('test', [
        'karma:unit',
        'testserver',
        'karma:e2e'
    ]);

    grunt.registerTask('test:unit', [
        'karma:unit_auto'
    ]);

    grunt.registerTask('test:e2e', [
        'testserver',
        'karma:e2e_auto'
    ]);

    grunt.registerTask('doc', [
        'clean:doc',
        'docular'
    ]);

    grunt.registerTask('server:doc', [
        'connect:doc',
        'open:doc',
        'watch:doc'
    ]);

    grunt.registerTask('dist', [
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'copy:dist',
        'ngAnnotate',
        'cssmin',
        'uglify',
        'rev',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('server:dist', [
        'connect:dist',
        'open:dist',
        'watch'
    ]);

    grunt.registerTask('default', [
        'server'
    ]);
};
