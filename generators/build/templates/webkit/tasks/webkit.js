'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function (grunt) {

    grunt.registerTask('webkit-manifest', 'Build Manifest for webkit (package.json)', function () {
        var pkg = require(__dirname + "/../package.json");
        var pkgKit = {
            "name": pkg.name,
            "version": pkg.version,
            "description": pkg.name + " application",
            "title": pkg.name,
            "main": "index.html",
            "private": true,
            "keywords": [
        "node",
        "webkit",
        "win",
        "osx",
        "linux"
        ],
            "window": {
                "frame": true,
                "toolbar": false,
                "position": "center",
                "resizable": true
            }
        };
        grunt.log.writeln("Writing manifest to: " + grunt.config.get('paths.dist'));
        fs.writeFileSync(path.join(__dirname, '/../' + grunt.config.get('paths.dist') + '/package.json'), JSON.stringify(pkgKit));
    });

   grunt.registerTask('nodewebkit:dist', [ 'clean:dist', 'dist', 'webkit-manifest', 'nwjs' ]);

};
