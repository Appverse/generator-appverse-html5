 var fs = require('fs');
 var path = require('path');



 module.exports = function (grunt) {

     grunt.registerTask('emulator', [
        'runNodeWebKit',
        'clean:server',
        'concurrent:server',
        'postcss:css',
        'browserSync:dev',
        'concurrent:emulator'
     ]);

     grunt.registerTask('runNodeWebKit', '', function () {

         var exec = require('child_process').exec;

         var manifestFolder = path.join(__dirname, "../manifest");
         var devices = [];

         grunt.file.recurse(manifestFolder, function (abspath, rootdir, subdir, filename) {
             if (subdir) {
                 if (filename === 'package.json') {
                     exec('node node_modules/nodewebkit/bin/nodewebkit ./manifest/' + subdir, function (error, stdout, stderr) {
                         console.log('stdout: ', stdout);
                         console.log('stderr: ', stderr);
                         if (error !== null) {
                             console.log('exec error: ', error);
                         }
                     });
                 }
             }
         });
     });
 };
