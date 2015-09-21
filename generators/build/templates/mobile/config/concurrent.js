/*jshint node:true */

'use strict';
// Run some tasks in parallel to speed up build process

module.exports = {
    server: [
                'coffee',
                'sass',
                'copy:i18n',
                'copy:fonts'
            ],
    dist: [
                'coffee',
                'sass'
            ],
    emulator: ["watch", "setEmulatedDevice"],
    mobile: [
                'build_mobile:ios_android',
                'build_mobile:windows'
            ]
};
