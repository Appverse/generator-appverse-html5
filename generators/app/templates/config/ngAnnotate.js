'use strict';
//produce minified svg's in the dist folder
module.exports = {
    dist: {
        files: [{
            expand: true,
            cwd: 'app/concat/scripts',
            src: '*.js',
            dest: 'app/concat/scripts'
                }]
    }
};
