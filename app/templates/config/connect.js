'use strict';

// The actual grunt server settings
module.exports = {
    options: {
        port: '<%= ports.app %>',
        livereload: '<%= ports.livereload %>',
        // Change this to '0.0.0.0' to access the server from outside
        hostname: '0.0.0.0'
    },
    livereload: {
        options: {
            open: false,
            base: [
    '.tmp', '<%= paths.app %>'
   ]
        }
    },
    test: {
        options: {
            port: '<%= ports.test %>',
            base: [
    '.tmp', 'test', '<%= paths.app %>'
   ]
        }
    },
    dist: {
        options: {
            open: false,
            port: '<%= ports.dist %>',
            base: '<%= paths.dist %>',
            livereload: false
        }
    },
    doc: {
        options: {
            port: '<%= ports.doc %>',
            base: '<%= paths.doc %>',
            livereload: false
        }
    }

};
