'use strict';

// Renames files for browser caching purposes
module.exports = {
  options: {
    additionalFiles: ['bower.json'],
    bump: true, //default: true
    changelog: false, //default: false
    changelogText: '<%= version %>\n', //default: '### <%= version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n'
    file: 'package.json', //default: package.json
    add: false, //default: true
    commit: false, //default: true
    tag: false, //default: true
    push: false, //default: true
    pushTags: false, //default: true
    npm: false, //default: true
    npmtag: false //default: no tag    
  }
};
