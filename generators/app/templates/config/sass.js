/*jshint node:true*/
'use strict';

// Compiles Sass to CSS and generates necessary files if requested
module.exports = {
    options: {
        sourceMap: true,
        includePaths: ['<%=paths.app%>/bower_components/bootstrap-sass/assets/stylesheets']
    },
    server: {
        files: [{
            expand: true,
            cwd: '<%=paths.app%>/styles/sass',
            src: '*.{scss,sass}',
            dest: '<%=paths.app%>/styles/css',
            ext: '.css'
                }]
    }

};
