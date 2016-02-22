// Ads bower components to HTML
module.exports = {
    update: {
        src: ['app/index.html'],
        options:{
            exclude: [
                /lodash/,
                /sockjs-client/,
                /sifter/,
                /json3/,
                /microplugin/,
                /selectize/,
                /placeholders/,
                /angular-highlightjs/,
                /angular-cache/,
                /angular-dynamic-locale/,
                /angular-translate/,
                /angular-translate-loader-static-files/,
                /restangular/,
                /stomp-websocket/
            ],
            overrides: {
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
                                "dist/angular-chart.min.js"
                    ]
                },
                "bootstrap-sass": {
                    "main": [
                                "/assets/javascripts/bootstrap.min.js"
                    ]
                },
                "angular-bootstrap": {
                    "main": [
                                "ui-bootstrap-tpls.min.js"
                    ]
                },
                "ng-grid": {
                    "main": [
                                "build/ng-grid.min.js"
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
                                "dist/select.min.js"
                    ]
                },
                "angularjs-slider": {
                    "main": [
                                "dist/rzslider.min.js"
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
                                "build/loading-bar.min.js"
                    ]
                },
                "angular-ripple": {
                    "main": [
                                "angular-ripple.js"
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
