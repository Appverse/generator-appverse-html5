module.exports = {
    jscs: {
        src: [
            'Gruntfile.js',
            'app/**/*.js',
            'test/*.js',
            'test/{e2e,unit}/**/*.js'
        ],
        options: {
            config: '.jscsrc',
            "maxErrors": 10000,
            "verbose": false,
            "excludeFiles": [
                "app/bower_components/**/*.js"
            ]
        }
    }
}
