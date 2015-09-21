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
var os = require('os');
var path = require('path');
var wiring = require('html-wiring');
var project = require('./config/project-config.json');
var gen = require('../generator-base');

module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);
    },
    initializing: function () {
        this.conflicter.force = true;
        this.skipprompts = false;
        this.props = {};
        this.props.moduleOptions = [];
        this.props.buildOptions = [];
        require('events').EventEmitter.defaultMaxListeners = 20;

        if (!this.options['skip-welcome-message']) {
            this.welcome();
            this.checkVersion();
        }

        if (!this.options['modules']) {
            this.modules = path.join(__dirname, '../module/config/modules.json');
        } else {
            this.modules = this.options['modules'];
        }

        if (!this.options['builds']) {
            this.builds = path.join(__dirname, '../build/config/build.json');
        } else {
            this.builds = this.options['builds'];
        }

        // This makes `appname` an argument.
        this.argument('application', {
            type: String,
            required: false
        });
        // Get the application name as argument to skip promtps and init all the variables
        // false by default or --all
        if (typeof this.application !== 'undefined') {
            this.skipprompts = true;
            this.appName = this.application;
        }

        // This makes `project` an option. --project=project.json
        // Get a JSON path or URL as value. The JSON defines the project and must validate against schema/appverse-project-schema.json
        if (this.options['project']) {
            this.project = this.options['project'];
            this.readJSONFileOrUrl(this.project, function (error, data) {
                if (!error) {
                    this.jsonproject = data;
                    this.validateJson(this.jsonproject, this.templatePath(), function (error, data) {
                        if (!error) {
                            this.appName = slug.slugify(this.jsonproject.project);
                            //ENABLED MODULES
                            for (var key in this.jsonproject.modules) {
                                if (this.jsonproject.modules[key].enabled) {
                                    if (this.jsonproject.modules.hasOwnProperty(key)) {
                                        this.props.moduleOptions.push(key);
                                    }
                                }
                            }
                            //ENABLED BUILDS
                            for (var buildkey in this.jsonproject.builds) { 
                                if (this.jsonproject.builds[buildkey].enabled) {
                                    if (this.jsonproject.builds.hasOwnProperty(buildkey)) {
                                        this.props.buildOptions.push(buildkey);
                                    }
                                }
                            }
                            this.env.options.appPath = this.options.appPath || 'app';
                            this.config.set('appPath', this.env.options.appPath);
                            this.skipprompts = true;
                        } else {
                            this.warning(error);
                            process.exit();
                        }
                    }.bind(this));
                } else {
                    this.warning(error);
                    process.exit();
                }
            }.bind(this));
        }
    },
    prompting: function () {
        if (!this.skipprompts) {
            var done = this.async();
            var prompts = [{
                    name: 'appName',
                    message: 'What is your app\'s name ?  ' +
                        '\n Application name cannot contain special characters or a blank space. ' +
                        '\n Name will be slug if needed.  ',
                    default: slug.slugify(this.appname)
                }, {
                    type: 'checkbox',
                    name: 'moduleOptions',
                    message: "Select core modules. \n You can add the modules later executing the subgenerators",
                    choices: this.promptsConfig(this.modules)
                }, {
                    type: 'checkbox',
                    name: 'buildOptions',
                    message: "Select build types. \n You can add the build types later executing the subgenerators",
                    choices: this.promptsConfig(this.builds)
                }
                ];

            this.prompt(prompts, function (props) {
                if (prompts.length > 0) {
                    this.appName = slug.slugify(props.appName);
                    this.props = props;
                    this.env.options.appPath = this.options.appPath || 'app';
                    this.config.set('appPath', this.env.options.appPath);
                    this.appBootstrapSelector = props.bootstrapTheme;
                }
                done();
            }.bind(this));
        }
    },
    writing: function () {
        //TEMPLATES
        this.moveTemplates(this.templatePath(), project.templates);
        //FILES
        this.moveFiles(this.templatePath(), project.files);
        //SCRIPTS
        var indexFile = this.fs.read(this.destinationPath('app/index.html'));
        Array.prototype.push.apply(project.scripts, project.appScripts);
        indexFile = wiring.appendScripts(indexFile, 'scripts/scripts.js', project.scripts);
        this.write(this.destinationPath('app/index.html'), indexFile);
    },
    install: function () {
        if (this.props.moduleOptions) {
            if (this.props.moduleOptions.length > 0) {
                //MODULES
                this.props.moduleOptions.forEach(function (option) {
                    this.composeWith('appverse-html5:module', {
                        args: option,
                        options: {
                            'modules': this.modules,
                            'skip-welcome-message': true,
                            'skip-install': true,
                            'skip-prompts': this.skipprompts,
                            'jsonproject': this.jsonproject
                        }
                    });
                }.bind(this));
            }
        }
        if (this.props.buildOptions) {
            if (this.props.buildOptions.length > 0) {
                //BUILDS
                this.props.buildOptions.forEach(function (option) {
                    this.composeWith('appverse-html5:build', {
                       args: option,
                       options: {
                           'builds': this.builds,
                           'skip-welcome-message': true,
                           'skip-prompts': this.skipprompts,
                           'jsonproject': this.jsonproject
                         }
                     });
                 }.bind(this));
             }
         }
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
    }
});
