'use strict';
// Add vendor prefixed styles
module.exports = {
    options: {
        watchTask: true,
        // Here you can disable/enable each feature individually
        ghostMode: {
            clicks: true,
            forms: true,
            scroll: true
        },
        open: false,
        // Open the site in Chrome & Firefox
        browser: ['google chrome', 'firefox'],
        logLevel: 'info',
        files: [
            'app/**/*.js',
            'app/**/*.html'
        ]
    },
    dev: {
        options: {
            server: {
                baseDir: ['./<%= paths.app %>']
            },
            files: [
                'app/**/*.js',
                'app/**/*.html'
            ],
            ports: {
                min: 9000,
                max: 9100
            },
            injectChanges: true
        }
    },
    dist: {
        options: {
            server: {
                baseDir: ['./<%= paths.dist %>']
            },
            ports: {
                min: 9100,
                max: 9200
            }
        }
    },
    test: {
        options: {
            middleware: require('http-proxy-middleware')('/api', {
                target: 'http://localhost:8888', // target host
                changeOrigin: true, // needed for virtual hosted sites
                ws: true, // proxy websockets
                pathRewrite: {
                    '^/api': '' // rewrite paths
                },
                proxyTable: {
                    // when request.headers.host == 'dev.localhost:3000',
                    // override target 'http://www.example.org' to 'http://localhost:8000'
                    'localhost:9200': 'http://localhost:8888'
                }
            }),
            server: {
                baseDir: ['./test/coverage/instrument/app', './<%= paths.app %>']
            },
            ports: {
                min: 9200,
                max: 9300
            }
        }
    }
};
