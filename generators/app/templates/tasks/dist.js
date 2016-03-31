'use strict';

module.exports = function (grunt) {

  grunt.registerTask('dist', [
        'clean:dist',
        'useminPrepare',
        'wiredep',
        'concurrent:dist',
        'postcss:css',
        'includeSource',
        'concat:generated',
        'copy:dist',
        'ngAnnotate',
        'cssmin:generated',
        'uglify:generated',
        'rev',
        'usemin',
        'htmlmin'
    ]);
};