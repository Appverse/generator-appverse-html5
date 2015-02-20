'use strict';
var yeoman = require('yeoman-generator');
var path = require ('path');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.log('You called the AppverseHtml5 Translate subgenerator.');
    this.conflicter.force = true;
  },

  writing: function () {
    var translateJS = '\n \t<script src="bower_components/angular-translate/angular-translate.min.js"></script> \n' +
                      '\t<script src="bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js"></script> \n' +
                      '\t<script src="bower_components/angular-dynamic-locale/src/tmhDynamicLocale.js"></script> \n' +
                      '\t<script src="bower_components/appverse-web-html5-core/src/modules/api-translate.js"></script> \n' +
                      '\t<script src="scripts/controllers/translation-controller.js"></script>';

    var indexPath = this.destinationPath('app/index.html');
    var index = this.readFileAsString(indexPath);
    var indexTag = 'app-states.js"></script>';
    var output = index;

    if (index.indexOf("api-translate.js") === -1) {
      var pos = index.lastIndexOf (indexTag) + indexTag.length;
      output = [index.slice(0, pos), translateJS, index.slice(pos)].join('');
    }
    var navLink = '<li data-ng-class="{active: $state.includes(\'translation\')}"><a ui-sref="translation">Translation</a></li>';
    var navTag = '</li>';
    var navFile = output;
    if (navFile.indexOf (navLink) === -1) {
      var pos = navFile.lastIndexOf (navTag) + navTag.length;
      output = [navFile.slice(0, pos), navLink, navFile.slice(pos)].join('');
    }
    if (output.length > index.length) {
        this.write(indexPath, output);
        this.log('Writing index.html');
    }
  },
  projectFiles: function () {
    this.directory('/app/resources/i18n', '/app/resources/i18n');
    this.fs.copy(
       this.templatePath('/app/scripts/controllers/translation-controller.js'),
       this.destinationPath('/app/scripts/controllers/translation-controller.js')
    );
    this.fs.copy(
      this.templatePath('/app/views/translation/translation.html'),
      this.destinationPath('/app/views/translation/translation.html')
    );

    //HOME VIEW
     var homePath = this.destinationPath('app/views/home.html');
     var homeFile = this.readFileAsString(homePath);
     var homeLink = '\n <a ui-sref="translation" class="btn btn-primary">Go to Translate Demo</a>';
     var homeTag = '</a>';
     if (homeFile.indexOf (homeLink) === -1) {
         var pos = homeFile.lastIndexOf (homeTag) + homeTag.length;
         var output = [homeFile.slice(0, pos), homeLink, homeFile.slice(pos)].join('');
         this.write(homePath, output);
     }

    //STATES
      var hook = '$stateProvider',
      path   = this.destinationPath('app/scripts/states/app-states.js'),
      file   = this.readFileAsString(path),
      insert = "\n .state('translation', {url: '/translation',templateUrl: 'views/translation/translation.html',controller: 'translationController'})";
      if (file.indexOf(insert) === -1) {
        var pos = file.lastIndexOf (hook) + hook.length;
        var output = [file.slice(0, pos), insert, file.slice(pos)].join('');
        //this.writeFileFromString(path, output);
        this.write(path, output);
     }

    }

});
