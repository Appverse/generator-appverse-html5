'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var slug = require("underscore.string");

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
    this.conflicter.force = true;
  },
    constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
    this.interactiveMode = true;
    // This makes `appname` an argument.
    this.argument('applicationName', { type: String, required: false });
    // And you can then access it later on this way; e.g. CamelCased
    if ( typeof this.applicationName != 'undefined') {
        this.applicationName = slug.slugify(this.applicationName);
        this.interactiveMode = false;
        this.log(
            'Setting interactive mode off!'
        );
    }
    // This method adds support for a `--cache` flag
    this.option('cache');
    this.option('detection');
    this.option('logging');
    this.option('performance');
    this.option('qr');
    this.option('translate');
    this.option('serverpush');
    this.option('security');
    this.option('rest');
    this.option('all');

    if (this.interactiveMode) {
        if (this.options.cache || this.options.detection || this.options.logging || this.options.performance ||this.options.qr || this.options.translate
            || this.options.serverpush || this.options.security || this.options.rest || this.options.all) {
            this.applicationName = slug.slugify(this.appname);
            this.interactiveMode = false;
            this.log(
               'Setting interactive mode off!'
            );
        }
    }
  },
prompting: function () {
    var done = this.async();
    console.log(chalk.cyan('\n' +
            '                 __    __                    \n' +
            '   __ _ _ __  _ _\\ \\  / /__ _ __ ___  ___    \n' +
            '  / _| | |_ \\| |_ \\ \\/ / _ | |__/ __|/ _ \\   \n' +
            ' | (_| | |_) | |_) \\  /  __| |  \\__ |  __/   \n' +
            '  \\__|_| .__/| .__/ \\/ \\___|_|  |___/\\___|   \n' +
            '       | |   | |                             \n' +
            '       |_|   |_|                             \n'));

        // Have Yeoman greet the user.
        this.log(
            'Welcome to the ' + chalk.cyan('Appverse Html5') + ' generator!'
        );

        if (this.interactiveMode) {
        var prompts = [
            {
                name: 'appName',
                message: 'What is your app\'s name ?  ' +
                '\n Application name cannot contain special characters or a blank space. ' +
                '\n Name will be slug if needed.  ',
                default: slug.slugify(this.appname)
        }, {
                type: 'checkbox',
                name: 'coreOptions',
                message: "Select core modules. \n You can add the modules later executing the subgenerators",
                choices: [
                    {
                        name: 'Logging',
                        value: 'appLogging',
                        checked: false
                    },
                     {
                        name: 'Cache',
                        value: 'appCache',
                        checked: false
                    },
                    {
                        name: 'REST',
                        value: 'appRest',
                        checked: false
                    }, {
                        name: 'Detection',
                        value: 'appDetection',
                        checked: false
                    },  {
                        name: 'Server Push',
                        value: 'appServerPush',
                        checked: false
                    },
                    {
                        name: 'Translate',
                        value: 'appTranslate',
                        checked: false
                    }, {
                        name: 'Security',
                        value: 'appSecurity',
                        checked: false
                    },
                     {
                        name: 'Performance',
                        value: 'appPerformance',
                        checked: false
                    },
                     {
                        name: 'QR',
                        value: 'appQR',
                        checked: false
                    }
                ]
            }];
          } else {
              var prompts = [];
          }

        this.prompt(prompts, function (props) {
             function hasFeature(options, feat) {
                    if (typeof options != 'undefined') {
                    return options.indexOf(feat) !== -1;
                    } else {
                        return false;
                    }
                }
              if (prompts.length > 0) {
                this.appName = slug.slugify(props.appName);
                var coreOptions = props.coreOptions;

                // manually deal with the response, get back and store the results.
                // we change a bit this way of doing to automatically do this in the self.prompt() method.
                   this.appTranslate = hasFeature(coreOptions,'appTranslate');
                   this.appQR = hasFeature(coreOptions,'appQR');
                   this.appRest = hasFeature(coreOptions,'appRest');
                   this.appPerformance = hasFeature(coreOptions,'appPerformance');
                   this.appSecurity = hasFeature(coreOptions,'appSecurity');
                   this.appServerPush = hasFeature(coreOptions,'appServerPush');
                   this.appCache = hasFeature (coreOptions,'appCache');
                   this.appLogging = hasFeature (coreOptions,'appLogging');
                   this.appDetection = hasFeature (coreOptions,'appDetection');
                   this.env.options.appPath = this.options.appPath || 'app';
                   this.config.set('appPath', this.env.options.appPath);
                } else {
                    this.appName = slug.slugify(this.applicationName);
                    this.appTranslate = this.options.translate || this.options.all;
                    this.appQR = this.options.qr || this.options.all;
                    this.appRest = this.options.rest || this.options.all;
                    this.appPerformance = this.options.performance || this.options.all;
                    this.appSecurity = this.options.security || this.options.all;
                    this.appServerPush = this.options.serverpush || this.options.all;
                    this.appCache = this.options.cache || this.options.all;
                    this.appLogging = this.options.logging || this.options.all;
                    this.appDetection = this.options.detection || this.options.all;
                    this.env.options.appPath = this.options.appPath || 'app';
                    this.config.set('appPath', this.env.options.appPath);
                }
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
                'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/transition.js',
                'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/collapse.js',
                'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
                'bower_components/ng-grid/build/ng-grid.min.js',
                'bower_components/venturocket-angular-slider/build/angular-slider.min.js',
                'bower_components/angular-xeditable/dist/js/xeditable.js',
                'bower_components/appverse-web-html5-core/dist/appverse/appverse.min.js',
                'bower_components/angular-route/angular-route.min.js',
                'bower_components/angular-resource/angular-resource.min.js',
                'bower_components/appverse-web-html5-core/dist/appverse-router/appverse-router.min.js',
                'bower_components/angular-ui-router/release/angular-ui-router.min.js',
                'bower_components/appverse-web-html5-core/dist/appverse-utils/appverse-utils.min.js'
            ];

            //APP FILES
            var appsJS = ['scripts/app.js', 'scripts/controllers/home-controller.js', 'scripts/states/app-states.js'];
            Array.prototype.push.apply(js, appsJS);
            this.indexFile = this.appendScripts(this.indexFile, 'scripts/scripts.js', js);
            this.write('app/index.html', this.indexFile);
        },

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
    },
 install: function () {
        if (this.appRest) {
           this.composeWith('appverse-html5:rest', { options: {}});
         }
        if (this.appQR) {
            this.composeWith('appverse-html5:qr', { options: {}});
        }
        if (this.appSecurity) {
            this.composeWith('appverse-html5:security', { options: {}});
        }
        if (this.appServerPush) {
            this.composeWith('appverse-html5:serverpush', { options: {}});
        }
        if (this.appTranslate) {
            this.composeWith('appverse-html5:translate', { options: {}});
        }
        if (this.appCache) {
            this.composeWith('appverse-html5:cache', { options: {}});
        }
        if (this.appLogging) {
            this.composeWith('appverse-html5:logging', { options: {}});
        }
        if (this.appDetection) {
            this.composeWith('appverse-html5:detection', { options: {}});
        }
        if (this.appPerformance) {
            this.composeWith('appverse-html5:performance', { options: {}});
        }
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
 },
     end : function () {
        this.log("Finish! Execute 'grunt server' to run de application.");
    },

});
