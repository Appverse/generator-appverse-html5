'use strict';

// The actual grunt server settings
module.exports = {
    options: {
        port: '<%%= ports.app %>',
        livereload: '<%%= ports.livereload %>',
        // Change this to '0.0.0.0' to access the server from outside
        hostname: '0.0.0.0'
    },
    livereload: {
        options: {
            open: false,
            base: [
    '.tmp', '<%%= paths.app %>'
   ],
            middleware: function (connect, options) {
                if (!Array.isArray(options.base)) {
                    options.base = [options.base];
                }
                // Setup the proxy
                var middlewares = [require('grunt-connect-proxy/lib/utils').proxyRequest];
                // Serve static files.
                options.base.forEach(function (base) {
                    middlewares.push(connect.static(base));
                });
                // Make directory browse-able.
                var directory = options.directory || options.base[options.base.length - 1];
                middlewares.push(connect.directory(directory));
                return middlewares;
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
        }
    },
    <%
    if (mockServer) { %>
        mocklivereload: {
            options: {
                middleware: function (connect) {
                    if (!Array.isArray(options.base)) {
                        options.base = [options.base];
                    }

                    // Setup the proxy
                    var middlewares = [require('grunt-connect-proxy/lib/utils').proxyRequest];

                    // Serve static files.
                    options.base.forEach(function (base) {
                        middlewares.push(connect.static(base));
                    });

                    // Make directory browse-able.
                    var directory = options.directory || options.base[options.base.length - 1];
                    middlewares.push(connect.directory(directory));

                    return middlewares;
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
            port: '<%%= ports.test %>',
            base: [
    '.tmp', 'test', '<%%= paths.app %>'
   ]
        }
    },
    dist: {
        options: {
            open: false,
            port: '<%%= ports.dist %>',
            base: '<%%= paths.dist %>',
            livereload: false
        }
    },
    doc: {
        options: {
            port: '<%%= ports.doc %>',
            base: '<%%= paths.doc %>',
            livereload: false
        }
    }

};
