/*jshint node:true */

'use strict';
// Run some tasks in parallel to speed up build process

module.exports = {
    server: [
                'sass',
                'copy:i18n',
                'copy:fonts',
                'copy:theme'
            ],
    dist: [
                'sass'
            ]
};
