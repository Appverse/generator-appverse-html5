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
var chalk = require('chalk');
var slug = require("underscore.string");
var utils = require('../utils.js');
var pkg = require('../package.json');
var inquirer = require('inquirer');

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        this.conflicter.force = true;

    },
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);
        this.interactiveMode = true;
        // This makes `appname` an argument.
        this.argument('applicationName', {
            type: String,
            required: false
        });
        // And you can then access it later on this way; e.g. CamelCased
        if (typeof this.applicationName !== 'undefined') {
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
            if (this.options.cache || this.options.detection || this.options.logging || this.options.performance || this.options.qr || this.options.translate || this.options.serverpush || this.options.security || this.options.rest || this.options.all) {
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
        this.log(chalk.bgBlack.cyan('\n' +
            '                 __    __                    \n' +
            '   __ _ _ __  _ _\\ \\  / /__ _ __ ___  ___    \n' +
            '  / _| | |_ \\| |_ \\ \\/ / _ | |__/ __|/ _ \\   \n' +
            ' | (_| | |_) | |_) \\  /  __| |  \\__ |  __/   \n' +
            '  \\__|_| .__/| .__/ \\/ \\___|_|  |___/\\___|   \n' +
            '       | |   | |                             \n' +
            '       |_|   |_|                             \n' +
            '                                    ' + 'v' + pkg.version + '\n \n'));

        // Have Yeoman greet the user.
        this.log(
            'Welcome to the ' + chalk.bgBlack.cyan('Appverse Html5') + ' generator! \n'
        );
        utils.checkVersion.call(this);

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
                        new inquirer.Separator(),
                        {
                            name: 'Security',
                            value: 'appSecurity',
                            checked: false
                        },
                        new inquirer.Separator(),
                        {
                            name: 'Translate',
                            value: 'appTranslate',
                            checked: false
                        }, {
                            name: 'QR',
                            value: 'appQR',
                            checked: false
                        }
                    ]
                }, {
                    type: "confirm",
                    name: "bootstrapTheme",
                    message: "Do you want to select a Bootstrap theme from Bootswatch.com?",
                    default: false
                }, {
                    type: "confirm",
                    name: "webkit",
                    message: "Do you want to package your application as a desktop application using Node-Webkit?",
                    default: false
                }, {
                    type: "input",
                    name: "spushBaseUrl",
                    message: "Configure your WebSocket Server URL? ",
                    default: "http://127.0.0.1:3000",
                    when: function (answers) {
                        return answers.coreOptions && answers.coreOptions.indexOf('appServerPush') !== -1;
                    }
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
                this.bootstrapSelector = props.bootstrapTheme;
                this.webkit = props.webkit;
                var coreOptions = props.coreOptions;

                // manually deal with the response, get back and store the results.
                // we change a bit this way of doing to automatically do this in the self.prompt() method.
                this.appTranslate = hasFeature(coreOptions, 'appTranslate');
                this.appQR = hasFeature(coreOptions, 'appQR');
                this.appRest = hasFeature(coreOptions, 'appRest');
                this.spushBaseUrl = props.spushBaseUrl;
                this.appPerformance = hasFeature(coreOptions, 'appPerformance');
                this.appSecurity = hasFeature(coreOptions, 'appSecurity');
                this.appServerPush = hasFeature(coreOptions, 'appServerPush');
                this.appCache = hasFeature(coreOptions, 'appCache');
                this.appLogging = hasFeature(coreOptions, 'appLogging');
                this.appDetection = hasFeature(coreOptions, 'appDetection');
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
            this.indexFile = this.readFileAsString(this.templatePath('app/index.html'));
            this.indexFile = this.engine(this.indexFile, this);
            var js = ['bower_components/jquery/dist/jquery.min.js',
                'bower_components/angular/angular.min.js',
                'bower_components/angular-touch/angular-touch.min.js',
                'bower_components/modernizr/modernizr.js',
                'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.min.js',
                'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
                'bower_components/ng-grid/build/ng-grid.min.js',
                'bower_components/venturocket-angular-slider/build/angular-slider.min.js',
                'bower_components/angular-animate/angular-animate.min.js',
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
            this.write(this.destinationPath('app/index.html'), this.indexFile);
        },
        files: function () {
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
                this.templatePath('/app/views/theme.html'),
                this.destinationPath('/app/views/theme.html')
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
                this.templatePath('/app/scripts/states/app-states.js'),
                this.destinationPath('/app/scripts/states/app-states.js'),
                this
            );
            this.fs.copyTpl(
                this.templatePath('/app/scripts/app.js'),
                this.destinationPath('/app/scripts/app.js'),
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

        }
    },

    install: function () {
        if (this.bootstrapSelector) {
            this.composeWith('appverse-html5:bootstrap-theme', {
                options: {}
            });
        }
        if (this.appCache) {
            this.composeWith('appverse-html5:cache', {
                options: {
                    'skip-install': this.options['skip-install']
                }
            });
        }
        if (this.appLogging) {
            this.composeWith('appverse-html5:logging', {
                options: {}
            });
        }

        if (this.appRest) {
            this.composeWith('appverse-html5:rest', {
                options: {}
            });
        }
        if (this.appServerPush) {
            this.composeWith('appverse-html5:serverpush', {
                options: {
                    spushBaseUrl: this.spushBaseUrl
                }
            });
        }
        if (this.appTranslate) {
            this.composeWith('appverse-html5:translate', {
                options: {}
            });
        }
        if (this.appSecurity) {
            this.composeWith('appverse-html5:security', {
                options: {}
            });
        }
        if (this.appDetection) {
            this.composeWith('appverse-html5:detection', {
                options: {}
            });
        }
        if (this.appPerformance) {
            this.composeWith('appverse-html5:performance', {
                options: {}
            });
        }

        if (this.appQR) {
            this.composeWith('appverse-html5:qr', {
                options: {}
            });
        }

        if (this.webkit) {
            this.composeWith('appverse-html5:webkit', {
                options: {}
            });
        }

        this.composeWith('appverse-html5:imagemin', {
            options: {
                'skip-install': this.options['skip-install']
            }
        });

        this.installDependencies({
            skipInstall: this.options['skip-install']
        });
    },
    end: function () {
        this.log("Finish! Execute 'grunt server:open' to see the results. That will starts the nodejs server and will open your browser with the home page.");
        this.log(" or just execute 'grunt server' to start the server.");
    },

});
