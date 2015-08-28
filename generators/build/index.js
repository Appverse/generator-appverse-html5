'use strict';
var yeoman = require('yeoman-generator');
var fs = require('fs');
var os = require('os');
var _ = require('lodash');
var generator = require('./build-base');
var modules = require('./build.json');
var util = require('util');


module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        this.conflicter.force = true;
        if (!this.options['skip-welcome-message']) {
            this.welcome();
            this.checkVersion();
        }
        this.argument('name', {
            required: true,
            type: String,
            desc: 'The build type name'
        });

        this.log('Searching build type ' + this.name + '.');
        this.module = this.findModule(this.name, modules);

        if (this.module) {
            this.log('Build type found: ' + JSON.stringify(this.module.name));
        } else {
            this.warning('Can not find module ' + this.name + '.');
            this.help();
            process.exit();
        }
    },
    //PROMPTING
    prompting: function () {
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
    },
    writing: function () {
        //NPM
        if (this.module.npm) {
            this.newpacakages = true;
            this.addPackage(this.module.npm, 'package.json', 'devDependencies');
        }
        //FILES
        if (this.module.files) {
            this.moveFiles(this.name, this.module.files);
        }
        //TEMPLATES
        if (this.module.templates) {
            this.moveTemplates(this.name, this.module.templates);
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
