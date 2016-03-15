'use strict';

function hasValue(obj, val) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop) && obj[prop] === val) {
            return true;
        }
    }
    return false;
}

module.exports = function (grunt) {

    grunt.task.registerTask('server', 'Serves de application.', function (arg1, arg2) {
        var isOpen = hasValue(arguments, 'open');
        var isDist = hasValue(arguments, 'dist');
        grunt.config.merge({
            browserSync: {
                options: {
                    open: isOpen
                }
            }
        });
        if (!isDist) {
            grunt.log.writeln('Running Server');
            grunt.task.run('serve');
        } else {
            grunt.task.run('distribution');
        }

    });

    grunt.registerTask('serve', [
        'clean:server',
        'concurrent:server',
        'postcss:css',
        'browserSync:dev',
        'jshint:all',
        'wiredep',
        'includeSource',
        'test:dev:unit',
        'watch'
    ]);

    grunt.registerTask('distribution', [
        'dist',
        'browserSync:dist',
        'watch'
    ]);
};
