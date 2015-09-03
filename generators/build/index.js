'use strict';
var yeoman = require('yeoman-generator');
var fs = require('fs');
var os = require('os');
var _ = require('lodash');
var generator = require('./build-base');
var path = require('path');


module.exports = yeoman.generators.Base.extend({
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
            this.module = this.findConfig(this.name, this.builds);
        }
        if (this.module) {
            this.log('Build type found: ' + JSON.stringify(this.module.name));
        } else {
            this.warning('Can not find ' + this.name + ' build type.');
            this.help();
            process.exit();
        }
        if (this.options['jsonproject']) {
            this.jsonproject = this.options['jsonproject'];
            if (this.jsonproject.modules[this.module.name].config) {
                for (var key in this.jsonproject.modules[this.module.name].config) {
                    this.props[key] = this.jsonproject.modules[this.module.name].config[key];
                }
                this.log(" >> JSON CONFIG >>> " + JSON.stringify(this.jsonproject));
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
        //NPM
        if (this.module.npm) {
            this.newpacakages = true;
            this.addPackage(this.module.npm, 'package.json', 'devDependencies');
        }
        //NPM SCRIPTS
        if (this.module.scripts) {
            this.addScriptsToPackage(this.module.scripts);
        }
        //FILES
        if (this.module.files) {
            this.moveFiles(path.join(this.templatepath, this.name), this.module.files);
        }
        //TEMPLATES
        if (this.module.templates) {
            this.moveTemplates(path.join(this.templatepath, this.name), this.module.templates);
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
