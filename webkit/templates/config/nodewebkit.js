 'use strict';

 module.exports = {
     options: {
         //The platforms you want to build. Can be ['win32', 'win64', 'osx32', 'osx64', 'linux32', 'linux64']
         // The values ['win', 'osx', 'linux'] can also be used and will build both the 32 and 64 bit versions of the specified platforms.
         platforms: ['win', 'osx', 'linux'],
         buildDir: './webkitbuilds', // Where the build version of my node-webkit app is saved
     },
     src: [__dirname + '/../dist/**/*'] // Your node-webkit app

 };
