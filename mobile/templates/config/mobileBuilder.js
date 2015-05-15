 'use strict';

 module.exports = function (grunt) {
     return {
         options: {
             url: 'https://' + '<%= mobileBuilder.host %>' + '/builder/service_5_0',
             method: 'POST',
             rejectUnauthorized: false,
             headers: {
                 'Authorization': 'Basic ' + new Buffer(grunt.config.get('mobileBuilder.username') + ':' + grunt.config.get('mobileBuilder.password')).toString('base64')
             },
             data: {
                 // Addresses where to email the result (separated by commas)
                 addressList: ''
             },

             onComplete: function (data) {
                 // Get build id from log and set is as grunt global variable
                 var pattern = /Distributed to: http(s)?:\/\[\.\.\.\]\/(\S+)<br>/
                 var match = pattern.exec(data);
                 var buildId = match[2];
                 grunt.option('buildId', buildId);
                 grunt.log.writeln('Builder server generated build with id: ' + buildId);
                 grunt.file.write(grunt.config.get('paths.mobileDist') + '/build.log', data);
             }
         },
         src: '.tmp/mobile-build-bundle.zip',
         dest: 'filename'
     }
 }
