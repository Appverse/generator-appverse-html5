// Ads bower components to HTML
module.exports = {
    update: {
        src: ['app/index.html'],
        options:{
            "exclude": [
                "/lodash/",
                "/sockjs-client/",
                "/sifter/",
                "/json3/",
                "/microplugin/",
                "/placeholders/",
                "/angular-highlightjs/",
                "/angular-cache/",
                "/angular-dynamic-locale/",
                "/angular-translate/",
                "/angular-translate-loader-static-files/",
                "/restangular/",
                "/stomp-websocket/"
            ],
            "overrides": {
                "jquery": {
                    "main": [
                                "dist/jquery.min.js"
                    ]
                },
                "angular": {
                    "main": [
                                "angular.min.js"
                    ]
                },
                "angular-touch": {
                    "main": [
                                "angular-touch.min.js"
                    ]
                },
                "Chart.js": {
                    "main": [
                                "Chart.min.js"
                    ]
                },
                "angular-chart.js": {
                    "main": [
                                "dist/angular-chart.min.js",
                                "dist/angular-chart.css"
                    ]
                },
                "bootstrap-sass": {
                    "main": [
                                "assets/javascripts/bootstrap.min.js"
                    ]
                },
                "angular-bootstrap": {
                    "main": [
                                "ui-bootstrap-tpls.min.js"
                    ]
                },
                "ag-grid": {
                    "main": [
                                "dist/ag-grid.min.js"
                    ]
                },
                "angular-animate": {
                    "main": [
                                "angular-animate.min.js"
                    ]
                },
                "angular-ui-router": {
                    "main": [
                                "release/angular-ui-router.min.js"
                    ]
                },
                "angular-ui-select": {
                    "main": [
                                "dist/select.min.js",
                                "dist/select.min.css"
                    ]
                },
                "angularjs-slider": {
                    "main": [
                                "dist/rzslider.min.js",
                                "dist/rzslider.min.css"
                    ]
                },
                "angular-resize": {
                    "main": [
                                "dist/angular-resize.min.js"
                    ]
                },
                "angular-sanitize": {
                    "main": [
                                "angular-sanitize.min.js"
                    ]
                },
                "angular-loading-bar": {
                    "main": [
                                "build/loading-bar.min.js",
                                "build/loading-bar.min.css"
                    ]
                },
                "angular-ripple": {
                    "main": [
                                "angular-ripple.js"
                            ]
                },
                "angular-xeditable": {
                    "main": [
                                "dist/css/xeditable.css",
                                "dist/js/xeditable.js"
                            ]
                },
                "selectize": {
                    "main": [
                                "dist/css/selectize.css"
                            ]
                },
                "appverse-web-html5-core": {
                    "main": [
                                "dist/appverse/appverse.min.js",
                                "dist/appverse-router/appverse-router.min.js",
                                "dist/appverse-utils/appverse-utils.min.js"
                            ]
                }
            }
        }
    }
};
