/*jshint node:true*/
'use strict';
// Copies remaining files to places other tasks can use

module.exports = {
    dist: {
        files: [{
            expand: true,
            dot: true,
            cwd: '<%= paths.app %>',
            dest: '<%= paths.dist %>',
            src: [
                '*.{ico,png,txt}',
                '.htaccess',
                'images/{,*/}*.{gif,webp}',
                'resources/**',
                'styles/fonts/*',
                'images/*',
                '*.html',
                'components/**/*.html',
                'template/**/*.html'
            ]
        }, {
            expand: true,
            cwd: '<%=paths.app%>/bower_components/bootstrap-sass/assets/fonts/bootstrap',
            dest: '<%=paths.dist%>/styles/fonts',
            src: '**/*'
        }, {
            expand: true,
            cwd: '<%= paths.app %>/styles/css',
            dest: '<%= paths.dist %>/styles/css',
            src: '**/*'
        }, {
            expand: true,
            cwd: '<%= paths.app %>/styles/sass/theme',
            dest: '<%= paths.dist %>/styles/css/theme',
            src: '**/*'
        }, {
            expand: true,
            cwd: '<%=paths.app%>/images',
            dest: '<%=paths.dist%>/images',
            src: 'generated/*'
        }, {
            expand: true,
            cwd: '<%=paths.app%>/bower_components/angular-i18n',
            dest: '<%=paths.dist%>/resources/i18n/angular',
            src: [
                '*en-us.js',
                '*es-es.js',
                '*ja-jp.js',
                '*ar-eg.js'
            ]
        }]
    },
    styles: {
        expand: true,
        cwd: '<%= paths.app %>' + '/styles',
        dest: '<%= paths.app %>/styles/css',
        src: '**/*.css'
    },
    i18n: {
        expand: true,
        cwd: '<%=paths.app%>/bower_components/angular-i18n',
        dest: '<%= paths.app %>/resources/i18n/angular',
        src: [
            '*en-us.js',
            '*es-es.js',
            '*ja-jp.js',
            '*ar-eg.js'
        ]
    },
    fonts: {
        expand: true,
        cwd: '<%=paths.app%>/bower_components/bootstrap-sass/assets/fonts/bootstrap',
        dest: 'app/styles/fonts',
        src: '**/*'
    },
    theme: {
        expand: true,
        cwd: '<%=paths.app%>/styles/sass/theme',
        dest: 'app/styles/css/theme',
        src: ['fonts/*', 'images/*']
    },
    mobile: {
        files: [
            {
                expand: true,
                cwd: 'mobile-builder-bundle',
                src: '**',
                dest: '<%= paths.mobileDist %>/emulator'
                    },
            {
                expand: true,
                cwd: '<%= paths.dist %>',
                src: '**',
                dest: '<%= paths.mobileDist %>/emulator/Web/WebResources/www/'
                    },
                ]
    }
};
