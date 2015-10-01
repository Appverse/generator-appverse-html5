'use strict';

module.exports = function (grunt) {

    grunt.registerTask('jsonserver', 'Run mock server.', function () {
        grunt.log.writeln('Running Mock Server ');
        var jsonServer = require('json-server');
        var fs = require("fs");
        var path = require("path");
        grunt.log.writeln('Reading MOCK - JSON directory. Loading al the JSON files to the MockServer database.');
        var apiFolder = path.join(__dirname, "../api/");
        if (!fs.existsSync(apiFolder)) {
            fs.mkdirSync(apiFolder);
        }
        var db = {};
        fs.readdir(apiFolder, function (err, files) {
            files.forEach(function (file) {
                if (path.extname(apiFolder + file) === '.json') {
                    db[path.basename(apiFolder + file, '.json')] = require(apiFolder + file);
                }
            });
        });
        var router = jsonServer.router(db); // Express router
        var server = jsonServer.create(); // Express server
        server.use(router);
        server.listen(<%= props.mockServerPort %>);
    });
};
