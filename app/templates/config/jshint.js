'use strict';
// Make sure code styles are up to par and there are no obvious mistakes
module.exports = {
    options: {
        jshintrc: '.jshintrc'
    },
    all: [
                'Gruntfile.js',
                 '<%=paths.app%>/scripts/{,*/}*.js'
            ]
};
