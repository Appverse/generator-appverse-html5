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
                files: [yeomanConfig.app + '/scripts/**/*.coffee'],
                tasks: ['coffee:app']
            },
            coffeeTest: {
                files: ['test/spec/**/*.coffee'],
                tasks: ['coffee:test']
            },
            sass: {
                files: [yeomanConfig.app + '/styles/**/*.{scss,sass}'],
                tasks: ['sass', 'autoprefixer:tmp']
            },
            styles: {
                files: [yeomanConfig.app + '/styles/**/*.css'],
                tasks: ['autoprefixer:styles']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                   yeomanConfig.app + '/**/*.html',
                    '{.tmp,' + yeomanConfig.app + '}/styles/**/*.css',
                    '{.tmp,' + yeomanConfig.app + '}/scripts/**/*.js',
                    yeomanConfig.app + '/resources/**/*'
                ]
            }
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
                    cwd: yeomanConfig.app + '/styles/',
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
                hostname: require('os').hostname()
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
                        return [
                             // Include the proxy first
                            proxy,
                            delayApiCalls,
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.server),
                            mountFolder(connect, yeomanConfig.app),
                            httpMethods
                        ];
                    }
                },
                proxies: [
                    {
                        context: '/api',
                        host: "<%= restBaseUrl %>",
                        port: <%= restBaseUrlPort %> ,
                        https: false,
                        rewrite: {
                            '^/api': ''
                        }
                    }
             ]
            },
            <%
            if (mockServer) { %>
                mocklivereload: {
                    options: {
                        middleware: function (connect) {
                            var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
                            return [
                            // Include the proxy first
                            proxy,
                            delayApiCalls,
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.server),
                            mountFolder(connect, yeomanConfig.app),
                            httpMethods
                        ];
                        }
                    },
                    proxies: [
                        {
                            context: '/api',
                            host: '127.0.0.1',
                            port: <%= mockServerPort %> ,
                            https: false,
                            rewrite: {
                                '^/api': ''
                            }
                    }
             ]
                }, <%
            } %>
            test: {
                options: {
                    port: 9003,
                    middleware: function (connect) {
                        var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
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
                },
                proxies: [
                    {
                        context: '/rest',
                        host: "<%= restBaseUrl %>",
                        port: <%= restBaseUrlPort %> ,
                        https: false,
                        rewrite: {
                            '^/api': ''
                        }
                    }
             ]
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
                url: 'http://' + require('os').hostname() + ':9000'
            },
            dist: {
                url: 'http://' + require('os').hostname() + ':9001'
            },
            doc: {
                url: 'http://' + require('os').hostname() + ':9002'
            }

        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        yeomanConfig.dist + '/*',
                        '!' + yeomanConfig.dist + '/.git*'
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
                yeomanConfig.app + '/scripts/{,*/}*.js'
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
                    cwd: yeomanConfig.app + '/scripts',
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
                includePaths: [yeomanConfig.app + '/bower_components/bootstrap-sass-official/assets/stylesheets']
            },
            server: {
                files: [{
                    expand: true,
                    cwd: yeomanConfig.app + '/styles',
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
                        yeomanConfig.dist + '/scripts/**/*.js',
                        yeomanConfig.dist + '/styles/**/*.css',
                        yeomanConfig.dist + '/styles/images/**/*',
                        yeomanConfig.dist + '/fonts/**/*'
                    ]
                }
            }
        },
        useminPrepare: {
            html: yeomanConfig.app + '/index.html',
            options: {
                dest: yeomanConfig.dist
            }
        },
        usemin: {
            html: [yeomanConfig.dist + '/*.html', yeomanConfig.dist + '/views/**/*.html'],
            css: yeomanConfig.dist + '/styles/**/*.css',
            js: yeomanConfig.dist + '/scripts/**/*.js',
            options: {
                assetsDirs: [yeomanConfig.dist + '/**']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: yeomanConfig.app,
                    src: 'styles/images/**/*.{jpg,jpeg,svg,gif,png}',
                    dest: yeomanConfig.dist
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
                    //conservativeCollapse: true,
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
                    cwd: yeomanConfig.dist,
                    src: [
                        '*.html',
                        'views/**/*.html',
                        'template/**/*.html'
                    ],
                    dest: yeomanConfig.dist
                }]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: yeomanConfig.app,
                    dest: yeomanConfig.dist,
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
                    cwd: yeomanConfig.app + '/bower_components/bootstrap-sass-official/assets/fonts/bootstrap',
                    dest: yeomanConfig.dist + '/fonts',
                    src: '**/*'
                }, {
                    expand: true,
                    cwd: '.tmp/images',
                    dest: yeomanConfig.dist + '/images',
                    src: 'generated/*'
                }, {
                    expand: true,
                    cwd: yeomanConfig.app + '/bower_components/angular-i18n',
                    dest: yeomanConfig.dist + '/resources/i18n/angular',
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
                cwd: yeomanConfig.app + '/styles',
                dest: '.tmp/styles',
                src: '**/*.css'
            },
            i18n: {
                expand: true,
                cwd: yeomanConfig.app + '/bower_components/angular-i18n',
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
                cwd: yeomanConfig.app + '/bower_components/bootstrap-sass-official/assets/fonts/bootstrap',
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
    grunt.loadNpmTasks('grunt-connect-proxy');

    grunt.registerTask('server', [
        'clean:server',
        'configureProxies:livereload',
        'concurrent:server',
        'autoprefixer',
        'connect:livereload',
        'watch'
    ]);

    grunt.registerTask('server:open', [
        'clean:server',
        'concurrent:server',
        'configureProxies:livereload',
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

    <%
    if (mockServer) { %>
        grunt.registerTask('mockserver', 'Run mock server.', function () {
            console.log('Running Mock Server ');
            var jsonServer = require('json-server');
            var fs = require("fs");
            var path = require("path");
            console.log('Reading MOCK - JSON directory. Loading al the json files to the MockServer database.');
            var p = "./api/";
            var db = {};
            fs.readdir(p, function (err, files) {
                files.forEach(function (file) {
                    if (path.extname(p + file) === '.json') {
                        db[path.basename(p + file, '.json')] = require(p + file);
                    }
                });
            });
            var router = jsonServer.router(db); // Express router
            var server = jsonServer.create(); // Express server

            server.use(router);
            server.listen( <%= mockServerPort %> );
            grunt.task.run('configureProxies:mocklivereload');
            grunt.task.run('clean:server');
            grunt.task.run('concurrent:server');
            grunt.task.run('autoprefixer');
            grunt.task.run('connect:livereload');
            grunt.task.run('watch');
        }); <%
    } %>

};
