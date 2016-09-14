'use strict';

function hasValue(obj, val) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop) && obj[prop] === val) {
            return true;
        }
    }
    return false;
}

module.exports = function(grunt) {

    grunt.task.registerTask('server', 'Serves de application.', function() {
        var isOpen = hasValue(arguments, "open");
        var isMock = hasValue(arguments, "mock");
        var isDist = hasValue(arguments, "dist");
        grunt.config.merge({
            browserSync: {
                options: {
                    open: isOpen
                }
            }
        });
        if (!isMock && !isDist) {
            grunt.log.writeln("Running Server");
            grunt.task.run('serve');
        }
        if (isMock) {
            var proxyMiddleware = require('http-proxy-middleware');
            // configure proxy middleware context
            var context = '/api'; // requests with this path will be proxied
            // configure proxy middleware options
            var options = {
                target: 'http://localhost:<%= props.mockServerPort %>', // target host
                changeOrigin: true, // needed for virtual hosted sites
                ws: true, // proxy websockets
                pathRewrite: {
                    '^/api': '' // rewrite paths
                },
                proxyTable: {
                    // when request.headers.host == 'dev.localhost:3000',
                    // override target 'http://www.example.org' to 'http://localhost:8000'
                    'localhost:9000': 'http://localhost:<%= props.mockServerPort %>'
                }
            };
            grunt.config.merge({
                browserSync: {
                    options: {
                        middleware: proxyMiddleware(context, options)
                    }
                }
            });
            if (isDist) {
                grunt.task.run('mock:dist');
            } else {
                grunt.task.run('mock');
            }
        } else {
            if (isDist) {
                grunt.task.run('distribution');
            }
        }
    });

    grunt.registerTask('serve', [
        'clean:server',
        'concurrent:server',
        'postcss:css',
        'browserSync:dev',
        'jshint:all',
        'wiredep',
        'includeSource',
        'test:dev:unit',
        'watch'
    ]);

    grunt.registerTask('distribution', [
        'dist',
        'browserSync:dist',
        'watch'
    ]);

    grunt.registerTask('mock', [
        'jsonserver',
        'serve',
    ]);

    grunt.registerTask('mock:dist', [
        'jsonserver',
        'distribution'
    ]);

};
