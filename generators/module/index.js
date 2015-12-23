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
var path = require('path');
var moduleGenerator = require('./module-base');
var pkg = require("../../package.json");

module.exports = moduleGenerator.extend({
    initializing: function() {
        this.conflicter.force = true;
        this.props = {};
        if (!this.options['skip-welcome-message']) {
            this.welcome(pkg);
            this.checkVersion();
        }
        if (!this.options.config) {
            this.modules = require('./config/modules.json');
        } else {
            this.modules = require(this.options.config);
        }

        this.argument('name', {
            required: true,
            type: String,
            desc: 'The subgenerator name'
        });
        if (this.name) {
            this.info('Searching module ' + this.name + '.');
            this.module = this.findConfig(this.name, this.modules);
        }

        if (this.module) {
            this.info('Module found: ' + JSON.stringify(this.module.name));
        } else {
            this.warning('Can not find module ' + this.name + '.');
            this.help();
            process.exit();
        }

        if (this.options.jsonproject) {
            this.jsonproject = this.options.jsonproject;
            if (this.jsonproject.modules[this.module.name].config) {
                for (var key in this.jsonproject.modules[this.module.name].config) {
                    this.module.prompts[key] = this.jsonproject.modules[this.module.name].config[key];
                }
            }
        }
        if (!this.options.templatePath) {
            this.templatepath = path.join(this.templatePath(), this.module.name);
        } else {
            this.templatepath = path.join(this.options.templatePath, this.module.name);
        }
    },
    //PROMPTING
    prompting: function() {
        if (this.module.prompts) {
            if (!this.options['skip-prompts']) {
                var done = this.async();
                var prompts = [];
                Array.prototype.push.apply(prompts, this.module.prompts);
                this.prompt(prompts, function(props) {
                    this.props = props;
                    // To access props later use this.props.someOption;
                    done();
                }.bind(this));
            } else {
                this.module.prompts.forEach(function(p) {
                    var prop = p.name;
                    this.props[prop] = p.default;
                }.bind(this));
            }
        }
    },
    writing: function() {
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
            this.newpackages = true;
            this.addPackage(this.module.bower, 'bower.json', 'dependencies');
        }
        //NPM
        if (this.module.npm) {
            this.newpackages = true;
            this.addPackage(this.module.npm, 'package.json', 'devDependencies');
        }
        //FILES
        if (this.module.files) {
            this.moveFiles(this.templatepath, this.module.files);
        }
        //TEMPLATES
        if (this.module.templates) {
            this.moveTemplates(this.templatepath, this.module.templates);
        }
        //CONFIG
        if (this.module.config) {
            this.addConfig(this.module.config);
        }
        if (this.module.css) {
            this.addCSSToIndex(this.module.css);
        }
    },
    install: function() {
        if (this.newpackages) {
            this.installDependencies({
                skipInstall: this.options['skip-install']
            });
        }
    },
    end: function() {
        this.info("Finish " + this.name);
    }

});
