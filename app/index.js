'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();
      
       console.log(chalk.cyan('\n' +
        '                 __    __                    \n'+       
        '   __ _ _ __  _ _\\ \\  / /__ _ __ ___  ___    \n'+
        '  / _| | |_ \\| |_ \\ \\/ / _ | |__/ __|/ _ \\   \n'+
        ' | (_| | |_) | |_) \\  /  __| |  \\__ |  __/   \n'+
        '  \\__|_| .__/| .__/ \\/ \\___|_|  |___/\\___|   \n'+
        '       | |   | |                             \n'+
        '       |_|   |_|                             \n'));
      
    // Have Yeoman greet the user.
    this.log(
      'Welcome to the ' + chalk.cyan('Appverse Html5') + ' generator!'
    );
   
    var prompts = [{
        name: 'appName',
        message: 'What is your app\'s name ?'
    }]; 

      this.prompt(prompts, function (props) {
            this.appName = props.appName;
            done();
        }.bind(this));
  },

  writing: {
     createFolders: function() {
        this.mkdir('app');        
        this.mkdir('app/images');
        this.mkdir('app/resources');
        this.mkdir('app/resources/configuration');
        this.mkdir('app/resources/detection');
        this.mkdir('app/resources/i18n');
        this.mkdir('app/scripts');
        this.mkdir('app/scripts/controllers');
        this.mkdir('app/scripts/api');
        this.mkdir('app/scripts/states');
        this.mkdir('app/styles');
        this.mkdir('app/styles/images');
        this.mkdir('app/views');
        this.mkdir('app/tasks');
        this.mkdir('ngdocs/commonapi');
        this.mkdir('ngdocs/jqmapi');
        this.mkdir('server/api/v1');
        this.mkdir('test');
        this.mkdir('test/e2e');
        this.mkdir('test/e2e/controllers');
        this.mkdir('test/lib');
        this.mkdir('test/midway');
        this.mkdir('test/midway/controllers');
        this.mkdir('test/unit');
        this.mkdir('test/unit/controllers');      
    },
    app: function () {
       
    },        
    projectfiles: function () {     
        this.directory('/ngdocs', '/ngdocs');
        this.directory('/server', '/server');
        this.directory('/test', '/test'); 
        this.directory('/app', '/app');  
        this.directory('/', '/');  
        
        this.fs.copyTpl(          
        this.templatePath('package.json'),
        this.destinationPath('package.json'),
        this
      );  
        this.fs.copyTpl(          
        this.templatePath('bower.json'),
        this.destinationPath('bower.json'),
        this
      );  
        this.fs.copyTpl(          
        this.templatePath('README.md'),
        this.destinationPath('README.md'),
        this
      );   
      this.fs.copyTpl(          
       this.templatePath('sonar-project.properties'),
       this.destinationPath('sonar-project.properties'),
       this
      );  
       this.fs.copyTpl(          
       this.templatePath('/app/index.html'),
       this.destinationPath('/app/index.html'),
       this
      );  
       this.fs.copyTpl(          
       this.templatePath('/app/views/home.html'),
       this.destinationPath('/app/views/home.html'),
       this
      );  
       this.fs.copyTpl(          
       this.templatePath('/app/views/tasks/tasks.html'),
       this.destinationPath('/app/views/tasks/tasks.html'),
       this
      );     
       this.fs.copyTpl(          
       this.templatePath('/app/scripts/controllers/home-controller.js'),
       this.destinationPath('/app/scripts/controllers/home-controller.js'),
       this
      );  
       this.fs.copyTpl(          
       this.templatePath('/app/scripts/controllers/tasks-controller.js'),
       this.destinationPath('/app/scripts/controllers/tasks-controller.js'),
       this
      );      
       this.fs.copyTpl(          
       this.templatePath('/app/scripts/states/app-states.js'),
       this.destinationPath('/app/scripts/states/app-states.js'),
       this
      );     
       this.fs.copyTpl(          
       this.templatePath('/app/scripts/app.js'),
       this.destinationPath('/app/scripts/app.js'),
       this
      );   
       this.fs.copyTpl(          
       this.templatePath('/test/midway/controllers/controllersSpec.js'),
       this.destinationPath('/test/midway/controllers/controllersSpec.js'),
       this
      );      
       this.fs.copyTpl(          
       this.templatePath('/test/midway/appSpec.js'),
       this.destinationPath('/test/midway/appSpec.js'),
       this
      );  
      this.fs.copyTpl(          
       this.templatePath('/test/unit/controllers/controllersSpec.js'),
       this.destinationPath('/test/unit/controllers/controllersSpec.js'),
       this
      );        
     
    }           
  },
  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});
