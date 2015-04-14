'use strict';
//produce minified images in the dist folder
module.exports = {
    dist: {
        files: [{
            expand: true,
            cwd: '<%= paths.app %>',
            src: 'styles/images/**/*.{jpg,jpeg,svg,gif,png}',
            dest: '<%= paths.dist %>'
                }]
    }
};
