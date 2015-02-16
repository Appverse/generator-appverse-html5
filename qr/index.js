'use strict';
var yeoman = require('yeoman-generator');
var path = require ('path');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.log('You called the AppverseHtml5 QR subgenerator.');
    this.conflicter.force = true;
  },

  writing: function () {
    var qrJS = '\n \t<script src="bower_components/qrcode/lib/qrcode.min.js"></script> \n' +
               '\t<script src="bower_components/angular-qr/angular-qr.min.js"></script> \n';

    var indexPath = this.destinationPath('app/index.html');
    var index = this.readFileAsString(indexPath);
    var indexTag = 'app-states.js"></script>';
    var output = index;

    if (index.indexOf("qrcode") === -1) {
      var pos = index.lastIndexOf (indexTag) + indexTag.length;
      output = [index.slice(0, pos), qrJS, index.slice(pos)].join('');
    }
    var navLink = '<li data-ng-class="{active: $state.includes(\'qr\')}"><a ui-sref="qr">QR</a></li>';
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
    this.fs.copy(
      this.templatePath('/app/views/qr/qr.html'),
      this.destinationPath('/app/views/qr/qr.html')
    );

    //HOME VIEW
     var homePath = this.destinationPath('app/views/home.html');
     var homeFile = this.readFileAsString(homePath);
     var homeLink = '\n <a ui-sref="qr" class="btn btn-primary">Go to QR Demo</a>';
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
      insert = "\n .state('qr', {url: '/qr',templateUrl: 'views/qr/qr.html'})";
      if (file.indexOf(insert) === -1) {
        var pos = file.lastIndexOf (hook) + hook.length;
        var output = [file.slice(0, pos), insert, file.slice(pos)].join('');
        //this.writeFileFromString(path, output);
        this.write(path, output);
     }

    }

});
