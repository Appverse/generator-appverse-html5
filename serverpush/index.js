var yeoman = require('yeoman-generator');
var path = require ('path');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.log('You called the AppverseHtml5 ServerPush subgenerator.');
    this.conflicter.force = true;
  },

  writing: function () {
    var performanceJS = '\n \t<!-- SECURITY MODULE --> \n' +
                        '\t<script src="bower_components/socket.io-client/dist/socket.io.min.js"></script>\n' +
                        '\t<script src="bower_components/appverse-web-html5-core/dist/appverse-serverpush/appverse-serverpush.min.js"></script>';

    var indexPath = this.destinationPath('app/index.html');
    var index = this.readFileAsString(indexPath);
    var indexTag = 'app-states.js"></script>';
    var output = index;

    if (index.indexOf("appverse-serverpush.js") === -1) {
      var pos = index.lastIndexOf (indexTag) + indexTag.length;
      output = [index.slice(0, pos), performanceJS, index.slice(pos)].join('');
    }
    if (output.length > index.length) {
        this.write(indexPath, output);
        this.log('Writing index.html');
    }
  },
  projectFiles: function () {
    //ANGULAR MODULES
      var hook = '\'App.Controllers\'',
      path   = this.destinationPath('app/scripts/app.js'),
      file   = this.readFileAsString(path),
      insert = ", 'appverse.serverpush'";
      if (file.indexOf(insert) === -1) {
        var pos = file.lastIndexOf (hook) + hook.length;
        var output = [file.slice(0, pos), insert, file.slice(pos)].join('');
        //this.writeFileFromString(path, output);
        this.write(path, output);
     }

    }

});

