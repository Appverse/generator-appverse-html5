'use strict';
// Performs rewrites based on rev and the useminPrepare configuration

module.exports = {
    html: ['<%=paths.dist%>/*.html', '<%=paths.dist %>/components/**/*.html'],
    css: '<%=paths.dist%>/styles/**/*.css',
    js: '<%=paths.dist%>/**/*.js',
    options: {
        assetsDirs: ['<%= paths.dist %>/**']
    }
};
