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
 var path = require('path');
require('./module-base');


module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);

    },
    initializing: function () {
        this.conflicter.force = true;
        this.props = {};
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
            this.modules = require('./config/modules.json');
        } else {
            this.modules = require(this.options['config']);
        }

        this.argument('name', {
            required: true,
            type: String,
            desc: 'The subgenerator name'
        });
        if (this.name) {
            this.log('Searching module ' + this.name + '.');
            this.module = this.findConfig(this.name, this.modules);
        }

        if (this.module) {
            this.log('Module found: ' + JSON.stringify(this.module.name));
        } else {
            this.warning('Can not find module ' + this.name + '.');
            this.help();
            process.exit();
        }

        if (this.options['jsonproject']) {
            this.jsonproject = this.options['jsonproject'];
            if (this.jsonproject.modules[this.module.name].config) {
                for (var key in this.jsonproject.modules[this.module.name].config) {
                    this.props[key] = this.jsonproject.modules[this.module.name].config[key];
                }
            }
        }
    },
    //PROMPTING
    prompting: function () {
        if (!this.options['skip-prompts']) {
            if (this.module.prompts) {
                var done = this.async();
                var prompts = [];
                Array.prototype.push.apply(prompts, this.module.prompts);
                this.prompt(prompts, function (props) {
                    this.props = props;
                    // To access props later use this.props.someOption;
                    done();
                }.bind(this));
            }
        } else {
          this.module.prompts.forEach (function(p){
              var prop = p.name;
              this.props[prop] = p.default;
          }.bind(this));
        }
    },
    writing: function () {
        //SCRIPTS
        if (this.module.scripts) {
            this.addScriptsToIndex(this.module.scripts);
        }
        //ANGULAR MODULE
        if (this.module.angular) {
            this.addAngularModule(this.module.angular);
        }
        //PACKAGES
        //BOWER
        if (this.module.bower) {
            this.newpacakages = true;
            this.addPackage(this.module.bower, 'bower.json', 'dependencies');
        }
        //NPM
        if (this.module.npm) {
            this.newpacakages = true;
            this.addPackage(this.module.npm, 'package.json', 'devDependencies');
        }
        //FILES
        if (this.module.files) {
            this.moveFiles(path.join(this.templatepath, this.name), this.module.files);
        }
        //TEMPLATES
        if (this.module.templates) {
            this.moveTemplates(path.join(this.templatepath, this.name), this.module.templates);
        }
        //CONFIG
        if (this.module.config) {
            this.addConfig(this.module.config);
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
