 'use strict';

 module.exports = function (grunt) {
     return {
         /* Http uploader.\n" +
          * Uploads all the app resources to the mobile builder service\n" +
          * that generates mobile Packages\n" +
          */


         // Builds iOS and Android\n" +
         mobileBuilder: {
             options: {
                 url: '<%= props.hostname %>/builder/service_5_0',
                 method: 'POST',
                 rejectUnauthorized: false,
                 headers: {
                     'Authorization': 'Basic ' + new Buffer('<%=props.username%>:<%=props.password%>').toString('base64')
                 },
                 data: {
                     // Addresses where to email the result (separated by commas)\n" +
                     addressList: '<%= props.email %>'
                 },
                 onComplete: function (data) {
                     // Get build id from log and set is as grunt global variable \n" +
                     var pattern = /Distributed to: http(s)?:\/\[\.\.\.\]\/(\S+)<br>/;
                     var match = pattern.exec(data);
                     var buildId = match[2];
                     grunt.option('buildId', buildId);
                     grunt.log.writeln('Builder server generated build with id: ' + buildId);
                     grunt.file.write(grunt.config.get('paths.mobileDist') + '/build.log', data);
                 }
             },
             src: '.tmp/mobile-build-bundle.zip',
             dest: 'filename'
         },

         // Builds Windows phone\n" +
         windowsMobileBuilder: {
             options: {
                 url: '<%= props.hostname %>/builder-winphone/service_win_phone_5_0',
                 method: 'POST',
                 rejectUnauthorized: false,
                 headers: {
                     'Authorization': 'Basic ' + new Buffer('<%=props.username%>:<%=props.password%>').toString('base64')
                 },
                 data: {
                     // Addresses where to email the result (separated by commas)\n" +
                     // In this case it is COMPULSORY to specify an address as\n" +
                     // you only download an encrypted .zip file. The password\n" +
                     // will be sent in the email\n" +
                     addressList: '<%= props.email %>'
                 },
                 onComplete: function (data) {
                     // Get build id from log and set is as grunt global variable \n" +
                     var pattern = /Distributed to: (\S*)<br>/;
                     var match = pattern.exec(data);
                     try {
                         var windowsBuildUrl = match[1];
                         grunt.option('windowsBuildUrl', windowsBuildUrl);
                         grunt.log.writeln('Builder server generated Windows build in: ' + windowsBuildUrl);
                         grunt.file.writegrunt(config.get('mobileBuilder.mobileDist') + '/build_windows.log', data);
                     } catch (e) {
                         grunt.log.writeln('Windows Phone build was not generated');
                     }
                 }
             },
             src: '.tmp/mobile-build-bundle.zip',
             dest: 'filename'
         }
     }
 }
