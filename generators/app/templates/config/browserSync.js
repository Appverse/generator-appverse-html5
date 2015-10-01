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
        browser: ["google chrome", "firefox"],
        logLevel: "info"
    },
    dev: {
        options: {
            server: {
                baseDir: ['./<%= paths.app %>']
            },
            files: [
                         'app/scripts/**/*.js',
                         'app/scripts/*.js'
                      ],
            ports: {
                min: 9000,
                max: 9100
            },
            plugins: [
                {
                    module: "bs-html-injector",
                    options: {
                        files: ["./<%= paths.app %>/**/*.html", "./<%= paths.app %>/*.html"]
                    }
                }
            ],
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
    }
};
