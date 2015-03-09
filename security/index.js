var yeoman = require('yeoman-generator');
var path = require ('path');
var fs = require ('fs');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.log('You called the AppverseHtml5 Security subgenerator.');
    this.conflicter.force = true;
  },

  writing: function () {
    var securityJS = '\n \t<!-- SECURITY MODULE --> \n' +
                        '\t<script src="bower_components/angular-cookies/angular-cookies.min.js"></script>\n' +
                        '\t<script src="bower_components/angular-sanitize/angular-sanitize.min.js"></script> \n' +
                        '\t<script src="bower_components/appverse-web-html5-security/dist/appverse-html5-security.min.js"></script>';

    var indexPath = this.destinationPath('app/index.html');
    var index = this.readFileAsString(indexPath);
    var indexTag = 'app-states.js"></script>';
    var output = index;

    if (index.indexOf("appverse-security.js") === -1) {
      var pos = index.lastIndexOf (indexTag) + indexTag.length;
      output = [index.slice(0, pos), securityJS, index.slice(pos)].join('');
    }

    if (output.length > index.length) {
        fs.writeFileSync(indexPath, output);
        this.log('Writing index.html by the Security generator.');
    }
  },
  projectFiles: function () {
   //ANGULAR MODULES
   var hook = '\'App.Controllers\'',
   path   = this.destinationPath('app/scripts/app.js'),
   file   = this.readFileAsString(path),
   insert = ", 'appverse.security'";
   if (file.indexOf(insert) === -1) {
      var pos = file.lastIndexOf (hook) + hook.length;
      var output = [file.slice(0, pos), insert, file.slice(pos)].join('');
      fs.writeFileSync(path, output);
   }
  },
  install : function () {
        this.bowerInstall (["appverse-web-html5-security#~0.4.0"], { save: true });
  }

});
