'use strict';
var yeoman = require('yeoman-generator');
var path = require ('path');
var fs = require ('fs');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.log('You called the AppverseHtml5 QR subgenerator.');
    this.conflicter.force = true;
  },

  writing: function () {
    var qrJS = '\n \t<!-- QR MODULE --> \n' +
               '\t<script src="bower_components/qrcode/lib/qrcode.min.js"></script> \n' +
               '\t<script src="bower_components/angular-qr/angular-qr.min.js"></script> \n';

    var indexPath = this.destinationPath('app/index.html');
    var index = this.readFileAsString(indexPath);
    var indexTag = 'app-states.js"></script>';
    var output = index;

    if (index.indexOf("qrcode") === -1) {
      var pos = index.lastIndexOf (indexTag) + indexTag.length;
      output = [index.slice(0, pos), qrJS, index.slice(pos)].join('');
    }
    if (output.length > index.length) {
        fs.writeFileSync(indexPath, output);
        this.log('Writing index.html by the QR generator.');
    }
  }
});
