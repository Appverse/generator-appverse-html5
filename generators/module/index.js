'use strict';
var yeoman = require('yeoman-generator');
var fs = require('fs');
var os = require('os');
var _ = require('lodash');
var generator = require('./module-base');
var modules = require('./modules.json');
var util = require('util');


module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        this.conflicter.force = true;
        this.welcome();
        this.checkVersion();
        this.argument('name', {
            required: true,
            type: String,
            desc: 'The subgenerator name'
        });

        this.log('Searching module ' + this.name + '.');
        this.module = this.findModule(this.name, modules);

        if (this.module) {
            this.log('Module found: ' + JSON.stringify(this.module.name));
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
            this.addPackage(this.module.bower, 'bower.json', 'dependencies');
        }
        //NPM
        if (this.module.npm) {
            this.addPackage(this.module.npm, 'package.json', 'devDependencies');
        }
        //FILES
        if (this.module.files) {
            this.moveFiles(this.module.files);
        }
        //TEMPLATES
        if (this.module.templates) {
            this.moveTemplates(this.module.templates);
        }
        //CONFIG
        if (this.module.config) {
            this.addConfig(this.module.config);
        }
    }
});
