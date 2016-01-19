'use strict';

// Renames files for browser caching purposes
module.exports = {
    dist: {
        files: {
            src: [
                        '<%=paths.dist%>/**/*.js',
                        '<%=paths.dist%>/styles/**/*.css', 
                        '<%=paths.dist%>/fonts/**/*'
                    ]
        }
    }
};
