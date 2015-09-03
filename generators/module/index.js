'use strict';
var yeoman = require('yeoman-generator');
var fs = require('fs');
var os = require('os');
var path = require('path');
var _ = require('lodash');
var generator = require('./module-base');

var util = require('util');

module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);

    },
    initializing: function () {
        this.conflicter.force = true;

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
            this.props = {};
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
