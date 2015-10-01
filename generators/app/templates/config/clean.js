'use strict';

// Empties folders to start fresh
module.exports = {
    dist: {
        files: [{
            dot: true,
            src: [
                        'app/styles/css/**',
                        'app/styles/fonts/**',
                        'app/resources/**',
                        '<%= paths.dist %>/*',
                        '!' + '<%= paths.dist %>/.git*'
                    ]
                }]
    },
    server: {
        files: [{
            dot: true,
            src: [
                        'app/styles/css/**',
                        'app/styles/fonts/**',
                        'app/resources/**'
                    ]
                }]
    }
};
