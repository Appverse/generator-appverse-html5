/*
 Copyright (c) 2015 GFT Appverse, S.L., Sociedad Unipersonal.
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

/*jshint node:true*/

'use strict';
var yeoman = require('yeoman-generator');
var fs = require('fs');
var utils = require('../lib');
var os = require('os');
var _ = require('lodash');


module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);
        utils.projectutils.checkVersion.call(this);
    },
    initializing: function () {
        this.conflicter.force = true;
        //CONFIG
        this.option('interactiveMode', {
            desc: 'Allow prompts',
            type: Boolean,
            defaults: false
        });
        if (!_.isUndefined(this.options['interactiveMode'])) {
            this.interactiveMode = this.options['interactiveMode'];
        } else {
            this.interactiveMode = true;
        }
        this.appName = utils.projectutils.getApplicationName(this);
        this.mobile = {
            builder: {
                hostname: 'https://yourhostname',
                username: 'username',
                password: 'password'
            }
        };
    },

    prompting: function () {
        var done = this.async();
        var prompts = [];
        if (this.interactiveMode) {
            prompts = [
                {
                    type: "confirm",
                    name: "mobile",
                    message: "Do you want to add Mobile Builds?",
                    default: false
                },
                {
                    type: "input",
                    name: "hostname",
                    message: "Mobile Builder Host name",
                    default: "https://yourhostname",
                    when: function (answers) {
                        return answers.mobile;
                    }
             }, {
                    type: "input",
                    name: "username",
                    message: "User name",
                    default: "username",
                    when: function (answers) {
                        return answers.mobile;
                    }
             }, {
                    type: "input",
                    name: "password",
                    message: "Password ",
                    default: "password",
                    when: function (answers) {
                        return answers.mobile;
                    }
            }
        ];
        } else {
            prompts = [];
        }

        this.prompt(prompts, function (props) {
            if (prompts.length > 0) {
                this.mobile = props.mobile;
                if (this.mobile) {
                    this.mobile.builder.hostname = props.hostname;
                    this.mobile.builder.username = props.username;
                    this.mobile.builder.password = props.password;
                }
            } else {
                this.mobile = false;
            }
            done();

        }.bind(this));
    },
    writing: function () {
        if (this.mobile) {
            this.fs.copy(
                this.templatePath('tasks'),
                this.destinationPath('tasks')
            );
            this.fs.copyTpl(
                this.templatePath('tasks/mobile.js'),
                this.destinationPath('tasks/mobile.js'),
                this
            );
            this.fs.copy(
                this.templatePath('config'),
                this.destinationPath('config')
            );
            this.fs.copyTpl(
                this.templatePath('config/http_upload.js'),
                this.destinationPath('config/http_upload.js'),
                this
            );
            this.fs.copy(
                this.templatePath('mobile-builder-bundle'),
                this.destinationPath('mobile-builder-bundle')
            );
            this.fs.copyTpl(
                this.templatePath('mobile-builder-bundle/build.properties'),
                this.destinationPath('mobile-builder-bundle/build.properties'),
                this
            );
        }
    },

    conflicts: function () {
        if (this.mobile) {
            var moreoptions = 'var _ = require (\'lodash\'); ' + os.EOL +
                ' var mobileDistDownloader = require(\'./tasks/grunt-helpers/download-mobile-dist\');' + os.EOL +
                ' grunt.config.set(\'paths.mobileDist\', \'dist/mobile\'); ' + os.EOL +
                ' grunt.config.set(\'mobileBuilder.hostname\',\'' + this.mobile.builder.hostname + '\'); ' + os.EOL +
                ' grunt.config.set(\'mobileBuilder.username\',\'' + this.mobile.builder.username + '\'); ' + os.EOL +
                ' grunt.config.set(\'mobileBuilder.password\',\'' + this.mobile.builder.password + '\'); ' + os.EOL + '}; ';

            //I can not use this method to append JS code to the Grunfile.js
            //this.gruntfile.prependJavaScript(moreoptions);
            //
            //Do it 'by hand' at the ent of the file
            var indexPath = this.destinationPath('Gruntfile.js');
            var index = this.readFileAsString(indexPath);
            var indexTag = '};';
            var output = index;
            var pos;
            if (index.indexOf("paths.mobileDist") === -1) {
                pos = index.lastIndexOf(indexTag) + indexTag.length;
                output = [index.slice(0, pos - 2), moreoptions, index.slice(pos)].join('');
            }
            if (output.length > index.length) {
                fs.writeFileSync(indexPath, output);
                this.log('Writing Gruntfile.js');
            }
        }
    },
    dependencies: function () {
        if (this.mobile) {
            var packagePath = this.destinationPath('package.json');
            //this.npmInstall () is not working with skip-install
            var pkg = require(packagePath);
            pkg.devDependencies["lodash"] = "3.8.0";
            pkg.devDependencies["promise"] = "^7.0.1";
            pkg.devDependencies["plist"] = "^1.1.0";
            pkg.devDependencies["grunt-contrib-compress"] = "^0.13.0";
            pkg.devDependencies["grunt-http-upload"] = "^0.1.8";
            pkg.devDependencies["grunt-replace"] = "^0.9.2";
            fs.writeFileSync(packagePath, JSON.stringify(pkg));
        }
    },
    installingDeps: function () {
        if (this.mobile) {
            this.installDependencies({
                skipInstall: this.options['skip-install']
            });
        }
    },
    end: function () {
        if (this.mobile) {
            this.log('Finish.');
        }
    }
});
