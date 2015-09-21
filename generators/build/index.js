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
require('./build-base');
var path = require('path');


module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        this.conflicter.force = true;
        this.props = {};
        this.appName = this.getAppName();
        if (!this.options['skip-welcome-message']) {
            this.welcome();
            this.checkVersion();
        }
        if (!this.options['templatePath']) {
            this.templatepath = this.templatePath();
        } else {
            this.templatepath = this.options['templatePath'];
        }

        if (!this.options['config']) {
            this.builds = require('./config/build.json');
        } else {
            this.builds = require(this.options['config']);
        }
        this.argument('name', {
            required: true,
            type: String,
            desc: 'The build type name'
        });
        if (this.name) {
            this.log('Searching build type ' + this.name + '.');
            this.build = this.findConfig(this.name, this.builds);
        }
        if (this.build) {
            this.log('Build type found: ' + JSON.stringify(this.build.name));
        } else {
            this.warning('Can not find ' + this.name + ' build type.');
            this.help();
            process.exit();
        }
        if (this.options['jsonproject']) {
            this.jsonproject = this.options['jsonproject']; 
            if (this.jsonproject.builds[this.build.name].config) {
                for (var key in this.jsonproject.builds[this.build.name].config) {
                  this.build.prompts[key] = this.jsonproject.builds[this.build.name].config[key];
                }
            }
        }
    },
    //PROMPTING
    prompting: function () {
        if (this.build.prompts) {
           if (!this.options['skip-prompts']) {
              var done = this.async();
              var prompts = [];
              Array.prototype.push.apply(prompts, this.build.prompts);
              this.prompt(prompts, function (props) {
                    this.props = props;
                    // To access props later use this.props.someOption;
                    done();
              }.bind(this));
            } else {
              this.build.prompts.forEach (function(p){
              var prop = p.name;
              this.props[prop] = p.default;
          }.bind(this));
        }
      }
    },
    writing: function () {
        //NPM
        if (this.build.npm) {
            this.newpacakages = true;
            this.addPackage(this.build.npm, 'package.json', 'devDependencies');
        }
        //NPM SCRIPTS
        if (this.build.scripts) {
            this.addScriptsToPackage(this.build.scripts);
        }
        //FILES
        if (this.build.files) {
            this.moveFiles(path.join(this.templatepath, this.name), this.build.files);
        }
        //TEMPLATES
        if (this.build.templates) {
            this.moveTemplates(path.join(this.templatepath, this.name), this.build.templates);
        }
    },
    install: function () {
        if (this.newpacakages) {
            this.installDependencies({
                skipInstall: this.options['skip-install']
            });
        }
    },
    end: function () {
        this.info("Finish " + this.name);
    }

});
