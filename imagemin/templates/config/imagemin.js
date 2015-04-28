'use strict';
//produce minified images in the dist folder
module.exports = {
    dist: {
        files: [{
            expand: true,
            cwd: '<%= paths.app %>',
            src: 'styles/images/**/*',
            dest: '<%= paths.dist %>'
        }]
    }
};
