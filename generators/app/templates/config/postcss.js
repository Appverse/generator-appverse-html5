'use strict';
// Add vendor prefixed styles
module.exports = {
    options: {
        map: true,
        processors: [
            require('autoprefixer')({
                browsers: ['last 5 versions', 'ie 8']
            })
    ]
    },
    css: {
        files: [
            {
                expand: true,
                cwd: 'app/styles/',
                src: '{,*/}*.css',
                dest: 'app/styles/'
   }
  ]
    }
};
