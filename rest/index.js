'use strict';
var yeoman = require('yeoman-generator');
var path = require ('path');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.log('You called the AppverseHtml5 REST subgenerator.');
    this.conflicter.force = true;
  },

  writing: function () {
    var restJS = '\n  \t<!-- REST MODULE --> \n' +
                     '\t<script src="bower_components/angular-resource/angular-resource.min.js"></script> \n' +
                     '\t<script src="bower_components/lodash/dist/lodash.underscore.min.js"></script> \n' +
                     '\t<script src="bower_components/restangular/dist/restangular.min.js"></script> \n' +
                     '\t<script src="bower_components/appverse-web-html5-core/dist/appverse-rest/appverse-rest.min.js"></script> \n' +
                     '\t<!-- REST DEMO --> \n' +
                     '\t<script src="scripts/controllers/tasks-controller.js"></script>';

    var indexPath = this.destinationPath('app/index.html');
    var index = this.readFileAsString(indexPath);
    var indexTag = 'app-states.js"></script>';
    var output = index;

    if (index.indexOf("appverse-rest.js") === -1) {
      var pos = index.lastIndexOf (indexTag) + indexTag.length;
      output = [index.slice(0, pos), restJS, index.slice(pos)].join('');
    }
    var navLink = '<li data-ng-class="{active: $state.includes(\'tasks\')}"><a ui-sref="tasks">Tasks</a></li>';
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
    this.directory('/server', '/server');
    this.fs.copy(
       this.templatePath('/app/scripts/controllers/tasks-controller.js'),
       this.destinationPath('/app/scripts/controllers/tasks-controller.js')
    );
    this.fs.copy(
      this.templatePath('/app/views/tasks/tasks.html'),
      this.destinationPath('/app/views/tasks/tasks.html')
    );

    //ANGULAR MODULES
      var hook = '\'App.Controllers\'',
      path   = this.destinationPath('app/scripts/app.js'),
      file   = this.readFileAsString(path),
      insert = ", 'appverse.rest'";
      if (file.indexOf(insert) === -1) {
        var pos = file.lastIndexOf (hook) + hook.length;
        var output = [file.slice(0, pos), insert, file.slice(pos)].join('');
        //this.writeFileFromString(path, output);
        this.write(path, output);
     }

    //STATES
      var hook = '$stateProvider',
      path   = this.destinationPath('app/scripts/states/app-states.js'),
      file   = this.readFileAsString(path),
      insert = "\n .state('tasks', {url: '/tasks',templateUrl: 'views/tasks/tasks.html',controller: 'tasksController'})";
      if (file.indexOf(insert) === -1) {
        var pos = file.lastIndexOf (hook) + hook.length;
        var output = [file.slice(0, pos), insert, file.slice(pos)].join('');
        //this.writeFileFromString(path, output);
        this.write(path, output);
     }

    }

});
