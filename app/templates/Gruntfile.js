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
            compass: {
                files: ['<%= yeoman.app %>/styles/**/*.{scss,sass}'],
                tasks: ['compass:server', 'autoprefixer:tmp']
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
                    '{.tmp,<%= yeoman.app %>}/configuration/**/*.json',
                    '<%= yeoman.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
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
                port: 9090,
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
                    port: 9001,
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
            doc: {
                url: '<%= connect.options.protocol %>://<%= connect.options.hostname %>:9001'
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
        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/styles',
                cssDir: '.tmp/styles',
                generatedImagesDir: '.tmp/images/generated',
                imagesDir: '<%= yeoman.app %>/images',
                javascriptsDir: '<%= yeoman.app %>/scripts',
                fontsDir: '<%= yeoman.app %>/styles/fonts',
                importPath: '<%= yeoman.app %>/bower_components/bootstrap-sass-official/assets/stylesheets',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/styles/fonts',
                relativeAssets: false
            },
            dist: {
                options: {
                    debugInfo: false
                }
            },
            server: {
                options: {
                    debugInfo: true
                }
            },
            dev_dist: {
                options: {
                    debugInfo: true,
                    cssDir: '<%= yeoman.dist %>/styles'
                }
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/*.js',
                        '<%= yeoman.dist %>/styles/*.css',
                        '<%= yeoman.dist %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
                        '!<%= yeoman.dist %>/images/glyphicons-*',
                        '<%= yeoman.dist %>/styles/images/*.{gif,png}'
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
                        'styles/images/*.{jpg,jpeg,svg,gif}',
                        'images/*.{jpg,jpeg,svg,gif}'
                    ],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        tinypng: {
            options: {
                apiKey: "l_QIDgceoKGF8PBNRr3cmYy_Nhfa9F1p",
                checkSigs: true,
                sigFile: '<%= yeoman.app %>/images/tinypng_sigs.json',
                summarize: true,
                showProgress: true,
                stopOnImageError: true
            },
            dist: {
                expand: true,
                cwd: '<%= yeoman.app %>',
                src: 'images/**/*.png',
                dest: '<%= yeoman.app %>'
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
            dev_dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: '**'
                }]
            },
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
                    dest: '<%= yeoman.dist %>/styles/fonts',
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
                dest: '.tmp/styles/fonts',
                src: '**/*'
            },
            png: {
                expand: true,
                cwd: '<%= yeoman.app %>',
                dest: '<%= yeoman.dist %>',
                src: 'images/**/*.png'
            }
        },
        concurrent: {
            server: [
                'coffee',
                'compass:server',
                'copy:i18n',
                'copy:fonts'
            ],
            dist: [
                'coffee',
                'compass:dist',
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
            midway: {
                configFile: './test/karma-midway.conf.js',
                autoWatch: false,
                singleRun: true
            },
            midway_auto: {
                configFile: './test/karma-midway.conf.js'
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
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/*.html']
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
        docular: {
            showDocularDocs: false,
            showAngularDocs: true,
            docular_webapp_target: "doc",
            groups: [
                {
                    groupTitle: 'Appverse HTML5',
                    groupId: 'appverse',
                    groupIcon: 'icon-beer',
                    sections: [
                        {
                            id: "commonapi",
                            title: "Common API",
                            showSource: true,
                            scripts: ["app/scripts/api/modules", "app/scripts/api/directives"
                            ],
                            docs: ["ngdocs/commonapi"],
                            rank: {}
                        }
                    ]
                }
            ]
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
    grunt.loadNpmTasks('grunt-docular');

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

    grunt.registerTask('test', ['testserver', 'karma:unit', 'karma:midway', 'karma:e2e']);
    grunt.registerTask('test:unit', ['karma:unit']);
    grunt.registerTask('test:midway', ['testserver', 'karma:midway']);
    grunt.registerTask('test:e2e', ['testserver', 'karma:e2e']);

    //keeping these around for legacy use
    grunt.registerTask('autotest', ['autotest:unit']);
    grunt.registerTask('autotest:unit', ['karma:unit_auto']);
    grunt.registerTask('autotest:midway', ['testserver', 'karma:midway_auto']);
    grunt.registerTask('autotest:e2e', ['testserver', 'karma:e2e_auto']);


    grunt.registerTask('devmode', [
        'karma:unit',
        'watch:karma'
    ]);

    grunt.registerTask('doc', [
     'clean:doc',
        'docular'
    ]);

    grunt.registerTask('doc:watch', [
        'doc',
        'connect:doc',
        'open:doc',
        'watch:doc'
    ]);

    grunt.registerTask('dist', [
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        'tinypng',
        'copy:png',
        'autoprefixer',
        'concat',
        'copy:dist',
        'cdnify',
        'ngAnnotate',
        'cssmin',
        'uglify',
        'rev',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('dist:dev', [
        'clean:dist',
        'copy:dev_dist',
        'compass:dev_dist'
    ]);

    grunt.registerTask('dist:watch', [
     'dist',
        'connect:dist',
        'open:server',
        'watch'
    ]);

    grunt.registerTask('default', [
        'server'
    ]);
};
