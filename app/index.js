'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require ('path');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
    this.conflicter.force = true;
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
   
    var prompts = [
        {
            name: 'appName',
            message: 'What is your app\'s name ?',
            default : this.appname // Default to current folder name
        },{
            type: 'checkbox',
            name: 'coreOptions',
            message: "Select core modules",
        choices: [
        {
            name: 'Translate',
            value: 'appTranslate',
            checked: false
        }, {
            name: 'QR',
            value: 'appQR',
            checked: false
        }]
    }];

      this.prompt(prompts, function (props) {
         this.appName = props.appName;
         var coreOptions = props.coreOptions;

         function hasFeature(feat) { return coreOptions.indexOf(feat) !== -1; }

          // manually deal with the response, get back and store the results.
          // we change a bit this way of doing to automatically do this in the self.prompt() method.

          this.appTranslate = hasFeature('appTranslate');
          this.appQR = hasFeature('appQR');

          this.env.options.appPath = this.options.appPath || 'app';
          this.config.set('appPath', this.env.options.appPath);

            done();
        }.bind(this));
  },

  writing: {
  writeIndex: function () {
      this.log('Writing the index.html... ');
      this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'app/index.html'));
      this.indexFile = this.engine(this.indexFile, this);
      var js = ['bower_components/jquery/dist/jquery.min.js',
                'bower_components/angular/angular.min.js',
                'bower_components/angular-touch/angular-touch.min.js',
                'bower_components/modernizr/modernizr.js',
                'bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/transition.js',
                'bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/collapse.js',
                'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
                'bower_components/angular-cookies/angular-cookies.min.js',
                'bower_components/angular-sanitize/angular-sanitize.min.js',
                'bower_components/angular-ui-router/release/angular-ui-router.min.js',
                'bower_components/angular-cache/dist/angular-cache.min.js',
                'bower_components/angular-resource/angular-resource.min.js',
                'bower_components/ng-grid/build/ng-grid.min.js',
                'bower_components/venturocket-angular-slider/build/angular-slider.min.js',
                'bower_components/angular-xeditable/dist/js/xeditable.js',
                'bower_components/appverse-web-html5-core/src/modules/api-configuration.js',
                'bower_components/appverse-web-html5-core/src/modules/api-cache.js',
                'bower_components/appverse-web-html5-core/src/directives/cache-directives.js',
                'bower_components/appverse-web-html5-core/src/modules/api-detection.js',
                'bower_components/appverse-web-html5-core/src/modules/api-logging.js',
                'bower_components/appverse-web-html5-core/src/modules/api-main.js',
                'bower_components/lodash/dist/lodash.underscore.min.js',
                'bower_components/restangular/dist/restangular.min.js',
                'bower_components/appverse-web-html5-core/src/modules/api-rest.js',
                'bower_components/appverse-web-html5-security/src/modules/api-security.js',
                'bower_components/socket.io-client/dist/socket.io.min.js',
                'bower_components/appverse-web-html5-core/src/modules/api-serverpush.js',
                'bower_components/appverse-web-html5-core/src/modules/api-utils.js',
                'bower_components/appverse-web-html5-core/src/directives/rest-directives.js',
                'bower_components/appverse-web-html5-core/src/modules/api-performance.js'
               ];

      //APP FILES
      var appsJS = ['scripts/app.js', 'scripts/controllers/home-controller.js', 'scripts/controllers/tasks-controller.js', 'scripts/states/app-states.js' ];
      Array.prototype.push.apply(js, appsJS);

      this.indexFile = this.appendScripts(this.indexFile, 'scripts/scripts.js', js);
      this.write('app/index.html', this.indexFile);
  },
  projectfiles: function () {
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
       this.templatePath('/app/views/home.html'),
       this.destinationPath('/app/views/home.html'),
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
      this.templatePath('/app/views/tasks/tasks.html'),
      this.destinationPath('/app/views/tasks/tasks.html'),
      this
      );
      this.directory('/server', '/server');
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
      this.directory('/ngdocs', '/ngdocs');
      this.directory('/test', '/test');
      this.directory('/app/images', '/app/images');
      this.directory('/app/resources/detection', '/app/resources/detection');
      this.directory('/app/resources/configuration', '/app/resources/configuration');
      this.directory('/app/scripts/api', '/app/scripts/api');
      this.directory('/app/styles', '/app/styles');
      this.fs.copy(
       this.templatePath('.bowerrc'),
       this.destinationPath('.bowerrc')
      );
      this.fs.copy(
       this.templatePath('Gruntfile.js'),
       this.destinationPath('Gruntfile.js')
      );
      this.fs.copy(
       this.templatePath('LICENSE.md'),
       this.destinationPath('LICENSE.md')
      );
      this.fs.copy(
       this.templatePath('app/.htaccess'),
       this.destinationPath('app/.htaccess')
      );
       this.fs.copy(
       this.templatePath('app/404.html'),
       this.destinationPath('app/404.html')
      );
       this.fs.copy(
       this.templatePath('cache.manifest'),
       this.destinationPath('cache.manifest')
      );
      this.fs.copy(
       this.templatePath('robots.txt'),
       this.destinationPath('robots.txt')
      );
    }           
  },
  composed: function () {

  },
  install: function () {
   //   obj.page.conflicter.force = true;
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
    if (this.appTranslate) {
       this.composeWith('appverse-html5:translate', { options: {}});
    }
       if (this.appQR) {
       this.composeWith('appverse-html5:qr', { options: {}});
    }
  }
});
