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
                    //If there is a type options, there is a types array
                    if (option === 'type') {
                        var validType = this.component.types.inArray (function (e) {
                            return e === this.options[option];
                        }.bind(this));
                        if (!validType) {
                              this.warning('Invalid type value: ' + this.options[option]);
                              this.info("Valid types: " + this.component.types);
                              process.exit();
                        } else {
                            this.type = this.options[option];
                        }
                    }
                }.bind(this));
            }
        } else {
            this.warning('Can not find component ' + this.componentName + '.');
            this.help();
            process.exit();
        }
    },
    writing: {
        schema: function () {
            //SCHEMA
            if (this.options["schema"]) {
                this.readJSONSchemaFileOrUrl(this.options['schema'], function (error, data) {
                    if (!data) {
                        this.warning("Can't find a valid schema definition there!");
                        process.exit();
                    }
                    if (!error) {
                        this.model = data;
                        //CHECK IF THERE IS AN ID PROP
                        if (_.has(data, 'container')) {
                            this.model["properties"] = data.container.properties;
                        }
                        if (!_.has(this.model.properties, 'id')) {
                            this.model["properties"]["id"] = {
                                type: "integer",
                                description: "id",
                                required: false
                            }
                        }
                    }
                }.bind(this));
            }
        },
        templates: function () {
            //TEMPLATES
            if (this.component['named-templates'] && this.options["name"]) {
                this.moveNamedTemplates(this.component['named-templates'], this.options["name"], this.options["name"]);
            }
        },
        target: function () {
            //TARGET
            if (this.options["target"]) {
                 if (!this.validateTarget(this.options["target"])){
                    this.warning('Can not find target view ' + this.options["target"]);
                    this.help();
                    process.exit();
                }
                this.target = this.options["target"];
                this.name = this.options["target"];
                if (this.options["type"]) {
                     this.name = this.options["target"] + this.options["type"];
                }

                if (this.component['html-snippet']) {
                    this.moveNamedTemplate(this.component['html-snippet'], this.name, this.target);
                    this.addToTargetView(this.component['html-snippet'], this.name, this.target);
                }
                if (this.component['js-snippet']) {
                    this.moveNamedTemplate(this.component['js-snippet'], this.name, this.target);
                    var scripts = [];
                    var scriptPath = this.resolveNamedTemplatePath(this.component['js-snippet'], this.name, this.target);
                    var replacement = new RegExp('\\bapp/\\b', 'g');
                    var res = scriptPath.replace(replacement, '');
                    scripts.push(res);
                    this.addScriptsToIndex(scripts);
                }
            }
        },
        scripts: function () {
            //SCRIPTS
            if (this.component['named-scripts'] && this.options["name"]) {
                this.namedScripts(this.component['named-scripts'], this.options["name"],this.options["name"]);
            }
        },
        navigation: function () {
            //NAVIGATION
            if (this.component.navigation) {
                if (!this.options['menu']) {
                    this.addLinkToNavBar(this.options["name"]);
                } else {
                    this.menu = this.options['menu'];
                    this.addDropDownOption(this.options["name"]);
                }
            }
        }
    },
    end: function () {
        this.info("Finish " + this.componentName);
    }

});
