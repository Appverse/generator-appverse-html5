'use strict';

var mobileDistDownloader = require('./grunt-helpers/download-mobile-dist');

module.exports = function (grunt) {

    grunt.registerTask('dist:mobile', ['dist:mobile:build']);

    grunt.registerTask('dist:mobile:build', [
            'dist:mobile:emulator',
            'compress:mobileBuildBundle',
            'http_upload:mobileBuilder',
            'download_mobile_build',
            'http_upload:windowsMobileBuilder',
            'download_windows_mobile_build'
        ]);
    grunt.registerTask('dist:mobile:emulator', [
            'dist',
            'clean:mobileBuilderBundle',
            'copy:mobile',
        ]);

    grunt.registerTask('download_mobile_build', function () {
        var done = this.async();
        var downloadPath = grunt.config.get('paths.mobileDist');
        var downloadOptions = {
            host: grunt.config.get('mobileBuilder.hostname'),
            baseUrl: '/builder/dist/' + grunt.option('buildId'),
            appName: '<%= appName %>'
        };

        grunt.log.writeln('Build available at https://' + downloadOptions.host + downloadOptions.baseUrl);
        grunt.file.mkdir(grunt.config.get('paths.mobileDist'));
        grunt.file.mkdir(grunt.config.get('paths.mobileDist') + '/ios');
        grunt.file.mkdir(grunt.config.get('paths.mobileDist') + '/android');

        mobileDistDownloader(downloadOptions)
            .downloadIn(downloadPath)
            .then(
                function ok() {
                    grunt.log.ok('Downloaded generated build to ' + downloadPath);
                    done();
                },
                function error(err) {
                    grunt.log.error(err);
                    done(false);
                }
            );
    });

    grunt.registerTask('download_windows_mobile_build', function () {
        var done = this.async();
        var downloadPath = grunt.config.get('paths.mobileDist');
        var windowsBuildUrl = grunt.option('windowsBuildUrl');
        if (windowsBuildUrl) {
            var relativeUrl = windowsBuildUrl.replace('https://' + grunt.config.get('mobileBuilder.hostname'), '');
            var downloadOptions = {
                windowsBuilder: true,
                host: grunt.config.get('mobileBuilder.hostname'),
                baseUrl: relativeUrl,
                appName: '<%= appName %>'
            };

            grunt.log.writeln('Build available at https://' + downloadOptions.host + downloadOptions.baseUrl);
            grunt.file.mkdir(grunt.config.get('paths.mobileDist'));
            grunt.file.mkdir(grunt.config.get('paths.mobileDist') + '/windows');

            mobileDistDownloader(downloadOptions)
                .downloadIn(downloadPath)
                .then(
                    function ok() {
                        grunt.log.ok('Downloaded generated build to ' + downloadPath);
                        done();
                    },
                    function error(err) {
                        grunt.log.error(err);
                        done(false);
                    }
                );
        }
    });


    grunt.registerTask('dist:web', [
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'copy:dist',
        'copy:fonts',
        'ngAnnotate',
        'cssmin',
        'uglify',
        'rev',
        'usemin',
        'htmlmin'
    ]);


}
