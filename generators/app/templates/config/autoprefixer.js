'use strict';
// Add vendor prefixed styles
module.exports = {
    options: {
        browsers: ['last 1 version']
    },
    tmp: {
        files: [
            {
                expand: true,
                cwd: 'app/styles/sass',
                src: '{,*/}*.css',
                dest: 'app/styles/css'
   }
  ]
    },
    styles: {
        files: [{
            expand: true,
            cwd: '<%=paths.app%>/styles/sass',
            src: '**/*.css',
            dest: '<%=paths.app%>/styles/css'
                }]
    }
};
