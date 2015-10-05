'use strict';

module.exports = function (grunt) {

  grunt.registerTask('test:e2e', [
      'clean:reports',
      'clean:server',
      'concurrent:server',
      'postcss:css',
      'instrument',
      'browsersync:test',
      'shell:jasmine2'
   ]);

   grunt.registerTask('test:unit', [
     'clean:reports',
     'karma:unit'
   ]);

   grunt.registerTask('test', [
       'clean:reports',
       'karma:unit',
       'clean:server',
       'concurrent:server',
       'postcss:css',
       'instrument',
       'browsersync:test',
       'shell:jasmine2'
   ]);

   grunt.registerTask('test:unit:auto', [
       'karma:unit_auto'
   ]);


};
