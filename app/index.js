/*
 Copyright (c) 2012 GFT Appverse, S.L., Sociedad Unipersonal.
 This Source Code Form is subject to the terms of the Appverse Public License
 Version 2.0 (“APL v2.0”). If a copy of the APL was not distributed with this
 file, You can obtain one at http://www.appverse.mobi/licenses/apl_v2.0.pdf. [^]
 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the conditions of the AppVerse Public License v2.0
 are met.
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. EXCEPT IN CASE OF WILLFUL MISCONDUCT OR GROSS NEGLIGENCE, IN NO EVENT
 SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT(INCLUDING NEGLIGENCE OR OTHERWISE)
 ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 POSSIBILITY OF SUCH DAMAGE.
 */

'use strict';
var yeoman = require('yeoman-generator');
var slug = require("underscore.string");
var utils = require('../lib');
var pkg = require('../package.json');
var inquirer = require('inquirer');
var _ = require('lodash');
var fs = require('fs');
var os = require('os');
var wiring = require('html-wiring');

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        this.conflicter.force = true;
    },
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);

        // this.log("CONFIG:" + JSON.stringify(this.config.getAll()));
        // This makes `project` an option. --project=project.json
        // Get a JSON path or URL as value. The JSON defines the project and must validate against schema/appverse-project-schema.json
        this.option('help', {
            type: String,
            required: false
        });
        if (this.options['help']) {
            utils.out.help();
            process.exit();
        }
        this.interactiveMode = true;
        // This makes `appname` an argument.
        this.argument('applicationName', {
            type: String,
            required: false
        });

        // And you can then access it later on this way; e.g. CamelCased
        // Get the application name as argument to skip promtps and init all the variables
        // false by default or --all
        if (typeof this.applicationName !== 'undefined') {
            this.applicationName = slug.slugify(this.applicationName);
            this.appName = this.applicationName;
            this.appTranslate = false;
            //this.appQR = false;
            this.appRest = false;
            this.appPerformance = false;
            this.appSecurity = false;
            this.appServerPush = false;
            this.appCache = false;
            this.appLogging = false;
            this.appDetection = false;
            this.env.options.appPath = this.options.appPath || 'app';
            this.appBootstrapSelector = false;
            this.config.set('appPath', this.env.options.appPath);
            this.interactiveMode = false;
            this.log('Setting interactive mode off!');
        }

        // This makes `project` an option. --project=project.json
        // Get a JSON path or URL as value. The JSON defines the project and must validate against schema/appverse-project-schema.json
        this.option('project', {
            type: String,
            required: false
        });
        this.project = this.options['project'];

        if (!_.isUndefined(this.project)) {
            this.interactiveMode = false;
            utils.jsonutils.readJSONFileOrUrl(this.project, function (error, data) {
                if (!error) {
                    this.jsonproject = data;
                    utils.jsonutils.validateJson(this.jsonproject, this.templatePath(), function (error, data) {
                        if (!error) {
                            this.appName = slug.slugify(this.jsonproject.project);
                            this.appTranslate = this.jsonproject.components.translate.enabled;
                            // this.appQR = this.jsonproject.components.qr.enabled;
                            this.appRest = this.jsonproject.components.rest.enabled;
                            this.appPerformance = this.jsonproject.components.performance.enabled;
                            this.appSecurity = false //this.jsonproject.components.security.enabled;
                            this.appServerPush = this.jsonproject.components.serverpush.enabled;
                            this.appCache = this.jsonproject.components.cache.enabled;
                            this.appLogging = this.jsonproject.components.logging.enabled;
                            this.appDetection = this.jsonproject.components.detection.enabled;
                            this.appBootstrapSelector = this.jsonproject.theme.enabled;
                            this.env.options.appPath = this.options.appPath || 'app';
                            this.config.set('appPath', this.env.options.appPath);
                        } else {
                            this.log(error);
                            process.exit();
                        }
                    }.bind(this));
                } else {
                    this.log(error);
                    process.exit();
                }
            }.bind(this));
        }
    },
    prompting: function () {
        var done = this.async();
        utils.out.logo();
        utils.projectutils.checkVersion.call(this);
        var prompts;
        if (this.interactiveMode) {
            prompts = [
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
                        new inquirer.Separator(),
                        {
                            name: 'Logging',
                            value: 'appLogging',
                            checked: false
                        }, {
                            name: 'Cache',
                            value: 'appCache',
                            checked: false
                        }, {
                            name: 'Performance',
                            value: 'appPerformance',
                            checked: false
                        }, {
                            name: 'Detection',
                            value: 'appDetection',
                            checked: false
                        },
                        new inquirer.Separator(),
                        {
                            name: 'REST',
                            value: 'appRest',
                            checked: false
                        }, {
                            name: 'Server Push',
                            value: 'appServerPush',
                            checked: false
                        },
                       /* new inquirer.Separator(),
                        {
                            name: 'Security',
                            value: 'appSecurity',
                            checked: false
                        }, */
                        new inquirer.Separator(),
                        {
                            name: 'Translate',
                            value: 'appTranslate',
                            checked: false
                        }
                    ]
                }, {
                    type: "confirm",
                    name: "bootstrapTheme",
                    message: "Do you want to select a Bootstrap theme from Bootswatch.com?",
                    default: false
                }
                            ];
        } else {
            prompts = [];
        }

        this.prompt(prompts, function (props) {
            function hasFeature(options, feat) {
                if (typeof options !== 'undefined') {
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
                this.appTranslate = hasFeature(coreOptions, 'appTranslate');
                this.appRest = hasFeature(coreOptions, 'appRest');
                this.spushBaseUrl = props.spushBaseUrl;
                this.appPerformance = hasFeature(coreOptions, 'appPerformance');
                this.appSecurity = false //hasFeature(coreOptions, 'appSecurity');
                this.appServerPush = hasFeature(coreOptions, 'appServerPush');
                this.appCache = hasFeature(coreOptions, 'appCache');
                this.appLogging = hasFeature(coreOptions, 'appLogging');
                this.appDetection = hasFeature(coreOptions, 'appDetection');
                this.env.options.appPath = this.options.appPath || 'app';
                this.config.set('appPath', this.env.options.appPath);
                this.appBootstrapSelector = props.bootstrapTheme;
            }
            done();
        }.bind(this));

    },
    writing: function () {
        this.fs.copyTpl(
            this.templatePath('app/index.html'),
            this.destinationPath('app/index.html'),
            this
        );


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
            this.templatePath('.editorconfig'),
            this.destinationPath('.editorconfig'),
            this
        );
        this.fs.copyTpl(
            this.templatePath('.jshintrc'),
            this.destinationPath('.jshintrc'),
            this
        );
        this.fs.copyTpl(
            this.templatePath('README.md'),
            this.destinationPath('README.md'),
            this
        );
        this.fs.copy(
            this.templatePath('.yo-rc.json'),
            this.destinationPath('.yo-rc.json')
        );
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
        this.fs.copyTpl(
            this.templatePath('sonar-project.properties'),
            this.destinationPath('sonar-project.properties'),
            this
        );
        this.fs.copy(
            this.templatePath('app/views/theme.html'),
            this.destinationPath('app/views/theme.html')
        );
        this.fs.copyTpl(
            this.templatePath('app/views/home.html'),
            this.destinationPath('app/views/home.html'),
            this
        );
        this.fs.copyTpl(
            this.templatePath('app/scripts/controllers/home-controller.js'),
            this.destinationPath('app/scripts/controllers/home-controller.js'),
            this
        );
        this.fs.copy(
            this.templatePath('app/views/components.html'),
            this.destinationPath('app/views/components.html'),
            this
        );
        this.fs.copy(
            this.templatePath('app/views/modal-template.html'),
            this.destinationPath('app/views/modal-template.html'),
            this
        );
        this.fs.copy(
            this.templatePath('app/views/charts.html'),
            this.destinationPath('app/views/charts.html'),
            this
        );
        this.fs.copy(
            this.templatePath('app/scripts/controllers/components-controller.js'),
            this.destinationPath('app/scripts/controllers/components-controller.js'),
            this
        );
        this.fs.copy(
            this.templatePath('app/scripts/controllers/modal-controller.js'),
            this.destinationPath('app/scripts/controllers/modal-controller.js'),
            this
        );
        this.fs.copy(
            this.templatePath('app/scripts/controllers/charts-controller.js'),
            this.destinationPath('app/scripts/controllers/charts-controller.js'),
            this
        );
        this.fs.copyTpl(
            this.templatePath('app/scripts/states/app-states.js'),
            this.destinationPath('app/scripts/states/app-states.js'),
            this
        );
        this.fs.copyTpl(
            this.templatePath('app/scripts/app.js'),
            this.destinationPath('app/scripts/app.js'),
            this
        );


        //paths starting with "/" cause problems on UNIX based OS like OSX
        this.fs.copy(
            this.templatePath('test'),
            this.destinationPath('test')
        );

        this.fs.copy(
            this.templatePath('app/styles'),
            this.destinationPath('app/styles')
        );

        this.fs.copy(
            this.templatePath('config'),
            this.destinationPath('config')
        );

        this.fs.copy(
            this.templatePath('tasks'),
            this.destinationPath('tasks')
        );

        this.indexFile = wiring.readFileAsString(this.destinationPath('app/index.html'));
        var js = ['bower_components/jquery/dist/jquery.min.js',
                  'bower_components/angular/angular.min.js',
                  'bower_components/angular-touch/angular-touch.min.js',
                  'bower_components/modernizr/modernizr.js',
                  'bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js',
                  'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
                  'bower_components/ng-grid/build/ng-grid.min.js',
                  'bower_components/venturocket-angular-slider/build/angular-slider.min.js',
                  'bower_components/angular-animate/angular-animate.min.js',
                  'bower_components/angular-xeditable/dist/js/xeditable.js',
                  'bower_components/appverse-web-html5-core/dist/appverse/appverse.min.js',
                  'bower_components/appverse-web-html5-core/dist/appverse-router/appverse-router.min.js',
                  'bower_components/angular-ui-router/release/angular-ui-router.min.js',
                  'bower_components/appverse-web-html5-core/dist/appverse-utils/appverse-utils.min.js',
                  'bower_components/angular-ripple/angular-ripple.js',
                  'bower_components/angular-ui-select/dist/select.min.js',
                  'bower_components/angularjs-slider/dist/rzslider.min.js',
                  'bower_components/angular-resize/dist/angular-resize.min.js',
                  'bower_components/angular-sanitize/angular-sanitize.min.js',
                  'bower_components/Chart.js/Chart.min.js',
                  'bower_components/angular-chart.js/dist/angular-chart.min.js'
              ];
        //APP FILES
        var appsJS = ['scripts/app.js', 'scripts/controllers/home-controller.js', 'scripts/controllers/components-controller.js', 'scripts/controllers/modal-controller.js', 'scripts/controllers/charts-controller.js', 'scripts/states/app-states.js'];
        Array.prototype.push.apply(js, appsJS);
        this.indexFile = wiring.appendScripts(this.indexFile, 'scripts/scripts.js', js);
        this.write(this.destinationPath('app/index.html'), this.indexFile);

    },
    install: function () {
        if (this.appCache) {
            this.composeWith('appverse-html5:cache', {});
        }
        if (this.appLogging) {
            this.composeWith('appverse-html5:logging', {});
        }

        if (this.appRest) {
            this.composeWith('appverse-html5:rest', {
                options: {
                    interactiveMode: this.interactiveMode,
                    config: this.jsonproject,
                    'skip-install': this.options['skip-install']
                }
            });
        }
        if (this.appServerPush) {
            this.composeWith('appverse-html5:serverpush', {
                options: {
                    interactiveMode: this.interactiveMode,
                    config: this.jsonproject,
                    'skip-install': this.options['skip-install']
                }
            });
        }
        if (this.appTranslate) {
            this.composeWith('appverse-html5:translate', {});
        }
        if (this.appSecurity) {
            this.composeWith('appverse-html5:security', {
                options: {
                    'skip-install': this.options['skip-install']
                }
            });
        }
        if (this.appDetection) {
            this.composeWith('appverse-html5:detection', {});
        }
        if (this.appPerformance) {
            this.composeWith('appverse-html5:performance', {});
        }
        this.composeWith('appverse-html5:webkit', {
            options: {
                config: this.jsonproject,
                interactiveMode: this.interactiveMode,
                'skip-install': this.options['skip-install']
            }
        });

        this.composeWith('appverse-html5:imagemin', {
            options: {
                interactiveMode: this.interactiveMode,
                config: this.jsonproject,
                'skip-install': this.options['skip-install']
            }
        });

        if (this.appBootstrapSelector) {
            this.composeWith('appverse-html5:bootstrap-theme', {
                options: {
                    interactiveMode: this.interactiveMode,
                    config: this.jsonproject,
                    'skip-install': this.options['skip-install']
                }
            });
        }
        this.composeWith('appverse-html5:mobile', {
            options: {
                interactiveMode: this.interactiveMode,
                config: this.jsonproject,
                'skip-install': this.options['skip-install']
            }
        });

        this.installDependencies({
            skipInstall: this.options['skip-install'],
            callback: function () {
                // Emit a new event - dependencies installed
                this.emit('dependenciesInstalled');
            }.bind(this)
        });

        //Now you can bind to the dependencies installed event
        this.on('dependenciesInstalled', function () {
            this.spawnCommand('grunt', ['list']);
        });


    },
    end: function () {
        this.log(os.EOL + "Finish!" + os.EOL);
        if (this.options['skip-install']) {
            this.log(os.EOL + "Execute 'npm install & bower install' to resolve project dependencies.");
            this.log("Execute 'grunt list' to report the available grunt tasks into the Readme.md file." + os.EOL);
        } else {
            this.log(os.EOL + "Execute '$ grunt server:open' to see the results. That will starts the nodejs server and will open your browser with the home page");
            this.log(" or just execute '$ grunt server' to start the server." + os.EOL);
            this.log("Check your Readme.md for available grunt tasks." + os.EOL);
        }
        // event handler dependenciesInstalled fails with skip-install !!!
        process.exit();
    }


});
