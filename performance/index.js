var yeoman = require('yeoman-generator');
var path = require ('path');
var fs = require ('fs');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.log('You called the AppverseHtml5 Performance subgenerator.');
    this.conflicter.force = true;
  },

  writing: function () {
    var restJS = '\n  \t<!-- PERFORMANCE MODULE --> \n' +
                      '\t <script src="bower_components/appverse-web-html5-core/dist/appverse-performance/appverse-performance.min.js"></script>';

    var indexPath = this.destinationPath('app/index.html');
    var index = this.readFileAsString(indexPath);
    var indexTag = 'app-states.js"></script>';
    var output = index;

    if (index.indexOf("appverse-performance.js") === -1) {
      var pos = index.lastIndexOf (indexTag) + indexTag.length;
      output = [index.slice(0, pos), restJS, index.slice(pos)].join('');
    }
    if (output.length > index.length) {
        fs.writeFileSync(indexPath, output);
        this.log('Writing index.html by the Performance generator');
    }
  },
  projectFiles: function () {
    //ANGULAR MODULES
      var hook = '\'App.Controllers\'',
      path   = this.destinationPath('app/scripts/app.js'),
      file   = this.readFileAsString(path),
      insert = ", 'appverse.performance'";
      if (file.indexOf(insert) === -1) {
        var pos = file.lastIndexOf (hook) + hook.length;
        var output = [file.slice(0, pos), insert, file.slice(pos)].join('');
        //this.writeFileFromString(path, output);
        fs.writeFileSync(path, output);
     }

    }

});
