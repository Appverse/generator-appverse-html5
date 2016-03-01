'use strict';

// Watches files for changes and runs tasks based on the changed files
module.exports = {
    options: {
        spawn: false
    },
    sass: {
        files: ['<%=paths.app%>/styles/**/*.{scss,sass}'],
        tasks: ['sass', 'postcss:css', 'bsReload:css'],
        options: {
            spawn: false,
            livereload: false
        }
    },
    karma: {
      files: ['app/app.js', 'app/states/*.js', 'app/components/**/*.js'],
      tasks: ['karma:unit:run']
    },
    jshint: {
      files: ['app/app.js', 'app/states/*.js', 'app/components/**/*.js'],
      tasks: ['jshint']
    },
    includeSource: {
        files: ['app/app.js', 'app/states/*.js', 'app/components/**/*.js'],
        tasks: ['includeSource']
    },
    wiredep: {
        files: ['app/bower_components/', 'config/wiredep.js'],
        tasks: ['wiredep']
    }
};
