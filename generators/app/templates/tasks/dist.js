'use strict';

module.exports = function (grunt) {

  grunt.registerTask('dist', [
        'clean:dist',
        'concurrent:dist',
        'postcss:css',
        'wiredep',
        'includeSource',
        'useminPrepare',
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