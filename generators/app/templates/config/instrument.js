'use strict';

// Empties folders to start fresh
module.exports = {

     files: ['app/components/**/*.js', 'app/states/*.js', 'app/app.js'],
    options: {
        lazy: true,
        basePath: 'test/coverage/instrument/'
    }

};
