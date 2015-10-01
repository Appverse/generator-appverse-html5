'use strict';

module.exports = function (grunt) {

  grunt.registerTask('dist', [
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        'concat',
        'postcss:css',
        'copy:dist',
        'ngAnnotate',
        'cssmin',
        'uglify',
        'rev',
        'usemin',
        'htmlmin'
    ]);


};
