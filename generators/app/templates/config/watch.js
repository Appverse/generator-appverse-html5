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
    }

};
