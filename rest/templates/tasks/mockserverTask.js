'use strict';

module.exports = function (grunt) {

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
    });
};
