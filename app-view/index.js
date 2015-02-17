'use strict';
var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.conflicter.force = true;
    this.argument('name', {
      required: true,
      type: String,
      desc: 'The View name'
    });
    this.viewName = this.name;
    this.controllerScript = this.name + '-controller.js';
    this.controllerName = this.name + 'Controller';
    this.log('You called the AppverseHtml5 View subgenerator with the argument ' + this.viewName + '.');
  },

  writing: function () {
     var controllerJS = ' \n \t<script src="scripts/controllers/' + this.controllerScript + '"></script>';

    var indexPath = this.destinationPath('app/index.html');
    var index = this.readFileAsString(indexPath);
    var indexTag = 'app-states.js"></script>';
    var output = index;

    if (index.indexOf(this.viewName) === -1) {
      var pos = index.lastIndexOf (indexTag) + indexTag.length;
      output = [index.slice(0, pos), controllerJS, index.slice(pos)].join('');
    }
    var navLink = '<li data-ng-class="{active: $state.includes(\''+ this.viewName + '\')}"><a ui-sref="'+ this.viewName + '">'+ this.viewName + '</a></li>';
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
    //HOME VIEW
     var homePath = this.destinationPath('app/views/home.html');
     var homeFile = this.readFileAsString(homePath);
     var homeLink = '\n <a ui-sref="' + this.viewName + '" class="btn btn-primary">Go to '+ this.viewName + '</a>';
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
      insert = "\n .state('"+ this.viewName +"', {url: '/"+ this.viewName +"',templateUrl: 'views/"
                            + this.viewName +"/"+ this.viewName +".html',controller: '"+ this.controllerName +"'})";
      if (file.indexOf(insert) === -1) {
        var pos = file.lastIndexOf (hook) + hook.length;
        var output = [file.slice(0, pos), insert, file.slice(pos)].join('');
        this.write(path, output);
     }

    this.fs.copyTpl(
      this.templatePath('/app/views/view/view.html'),
      this.destinationPath('/app/views/' + this.viewName + '/' + this.viewName + '.html'),
      this
    );

    this.fs.copyTpl(
      this.templatePath('/app/scripts/controllers/view-controller.js'),
      this.destinationPath('/app/scripts/controllers/' + this.controllerScript),
      this
    );
  }
});
