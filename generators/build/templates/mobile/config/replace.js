 'use strict';

 var _ = require('lodash');

 module.exports = {
     // Replace URLs relative to the mobile build server\n
     // for a custom ones. This is necessary as the mobile build server only keeps generated\n
     // files for 10 minutes. Because of this, assets should be downloaded to the CI server and this task\n
     // replaces URLs to point to the CI server.\n
     // This task requires the base-url command line parameter: eg grunt replace --base-url=http://localhost\n
     plist: {
         options: {
             patterns: [
                 {
                     // match any url with domain builder.gft.com (inside a <string> tag)\n
                     match: new RegExp(/<string>\w+tps?:\/\/\S*builder\.gft\.com\S+\?\w+=(\w+\.\w+)<\/string>/g).toString(),
                     replacement: _.trim('http://localhost', '/') + '/ios/$1'
                        }
                    ]
         },
         files: [{
             src: '<%= paths.mobileDist %>/ios/' + '<%= appName %>' + '.plist',
             dest: '<%= paths.mobileDist %>/ios/' + '<%= appName %>' + '.plist'
                }]
     },
     mobileZipUrl: {
         options: {
             patterns: [
                 {
                     // match the URL to download the mobile build ZIP file\n
                     match: new RegExp(/href="(https:\/\/builder\.gft\.com\/builder\/dist\/\w+)"/).toString(),
                     replacement: 'href=\"' + _.trim('http://localhost', '/') + '/build-result-encripted.zip\"'
                        }
                    ]
         },
         files: {
             '<%= paths.mobileDist %>/index.html': ['<%= paths.mobileDist %>/index.html']
         }
     },
     iOSBuildUrl: {
         options: {
             patterns: [
                 {
                     // match the URLs for each platform\n
                     match: new RegExp(/\w+tps?:\/\/\S*builder\.gft\.com\S+\/dist\/\w+\/(\w+.plist)/).toString(),
                     replacement: _.trim('http://localhost', '/') + '/ios/$1',
                        }
                    ]
         },
         files: {
             '<%= paths.mobileDist %>/index.html': ['<%= paths.mobileDist %>/index.html']
         }
     },
     androidBuildUrl: {
         options: {
             patterns: [
                 {
                     // match the URLs for each platform\n
                     match: new RegExp(/\w+tps?:\/\/\S*builder\.gft\.com\S+\/dist\/\w+\/(\w+.apk)/).toString(),
                     replacement: _.trim('http://localhost', '/') + '/android/$1',
                        }
                    ]
         },
         files: {
             '<%= paths.mobileDist %>/index.html': ['<%= paths.mobileDist %>/index.html']
         }
     }
 }
