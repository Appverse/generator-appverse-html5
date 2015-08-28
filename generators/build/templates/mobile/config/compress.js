 'use strict';

 module.exports = {
     /* Compress mobile resources to send to the build server.\n" +
      * Takes the structure required by the mobile builder and zips it.\n" +
      * This creates the complete zipped file to:\n"  +
      * Use in the emulator\n" +
      * Upload to the builder service\n */

     mobileBuildBundle: {
         options: {
             archive: '.tmp/mobile-build-bundle.zip'
         },
         files: [{
             expand: true,
             cwd: '<%= paths.mobileDist %>/emulator',
             src: '**'
                }]
     }
 }
