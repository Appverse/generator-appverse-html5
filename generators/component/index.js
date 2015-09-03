'use strict';
var yeoman = require('yeoman-generator');
var fs = require('fs');
var os = require('os');
var path = require('path');
var _ = require('lodash');
var generator = require('./component-base');

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
            this.components = require('./config/components.json');
        } else {
            this.components = require(this.options['config']);
        }

        this.argument('componentName', {
            required: true,
            type: String,
            desc: 'The component name'
        });
        if (this.componentName) {
            this.log('Searching component ' + this.componentName + '.');
            this.component = this.findConfig(this.componentName, this.components);
        }

        if (this.component) {
            this.log('Component found: ' + JSON.stringify(this.component.name));
            if (this.component.option) {
                this.component.option.forEach(function (option) {
                    if (!this.options[option]) {
                        this.warning('Can not find component options ' + option + '.');
                        this.warning('You need to provide the option --' + option + '=[option]');
                        this.help();
                        process.exit();
                    }
                }.bind(this));
            }
        } else {
            this.warning('Can not find component ' + this.componentName + '.');
            this.help();
            process.exit();
        }
    },
    writing: function () {
        //SCRIPTS
        if (this.component['named-scripts'] && this.options["name"]) {
            this.namedScripts(this.component['named-scripts'], this.options["name"]);
        }
        //TEMPLATES
        if (this.component['named-templates'] && this.options["name"]) {
            this.moveNamedTemplates(path.join(this.templatepath, this.componentName), this.component['named-templates'], this.options["name"]);
        }
        //NAVIGATION
        if (this.component.navigation) {
            if (!this.options['menu']) {
                this.addLinkToNavBar(this.options["name"]);
            } else {
                this.menu = this.options['menu'];
                this.addDropDownOption(this.options["name"]);
            }
        }
        //TARGET
        if (this.options["target"] && this.options["name"]) {
            if (this.component['named-templates']) {
                this.moveNamedTemplates(path.join(this.templatepath, this.componentName), this.component['named-templates'], this.options["name"]);
                this.addToTargetView(path.join(this.templatepath, this.componentName), this.component['named-templates'], this.options["name"]);
            }
        }
        //SCHEMA
        if (this.options["schema"]) {}

    },
    end: function () {
        this.info("Finish " + this.componentName);
    }

});
