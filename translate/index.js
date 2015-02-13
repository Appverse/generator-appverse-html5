'use strict';
var yeoman = require('yeoman-generator');
var path = require ('path');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.log('You called the AppverseHtml5 Translate subgenerator.');
  },

  writing: function () {
    var translateJS = ['bower_components/angular-translate/angular-translate.min.js',
                       'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
                       'bower_components/angular-dynamic-locale/src/tmhDynamicLocale.js',
                       'bower_components/appverse-web-html5-core/src/modules/api-translate.js',
                       'scripts/controllers/translation-controller.js'
                       ];
    this.indexFile = this.readFileAsString('app/index.html');
    this.indexFile = this.appendScripts(this.indexFile, 'scripts/scripts.js', translateJS);
    this.write('app/index.html', this.indexFile);

    this.directory('/app/resources/i18n', '/app/resources/i18n');
    this.fs.copy(
       this.templatePath('/app/scripts/controllers/translation-controller.js'),
       this.destinationPath('/app/scripts/controllers/translation-controller.js')
    );
    this.fs.copy(
      this.templatePath('/app/views/translation/translation.html'),
      this.destinationPath('/app/views/translation/translation.html')
    );
    //STATES
      var hook = '$stateProvider',
      path   = this.destinationPath('app/scripts/states/app-states.js'),
      file   = this.readFileAsString(path),
      insert = ".state('translation', {url: '/translation',templateUrl: 'views/translation/translation.html',controller: 'translationController'})";

     if (file.indexOf(insert) === -1) {
        var pos = file.lastIndexOf (hook) + hook.length;
        var output = [file.slice(0, pos), insert, file.slice(pos)].join('');
        //this.writeFileFromString(path, output);
        this.write(path, output);
     }
  }
});
