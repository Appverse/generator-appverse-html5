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

var _ = require('lodash');
var path = require('path');
var componentGenerator = require('./component-base');
var jsf = require('json-schema-faker');
var pkg = require('../../package.json');

module.exports = componentGenerator.extend({
    initializing: function() {
        this.conflicter.force = true;
        if (!this.options['skip-welcome-message']) {
            this.welcome(pkg);
            this.checkVersion();
        }

        if (!this.options.config) {
            this.components = require('./config/components.json');
        } else {
            this.components = require(this.options.config);
        }
        this.argument('componentName', {
            required: true,
            type: String,
            desc: 'The component name'
        });
        if (this.componentName) {
            this.info('Searching component ' + this.componentName + '.');
            this.component = this.findConfig(this.componentName, this.components);
        }
        if (this.component) {
            this.info('Component found: ' + JSON.stringify(this.component.name));
            //REQUIRED OPTIONS
            if (this.component.option.required) {
                this.component.option.required.forEach(function(option) {
                    if (!this.options[option]) {
                        this.warning('Can not find component options ' + option + '.');
                        this.warning('You need to provide the option --' + option + '=[option]');
                        this.help();
                        process.exit();
                    }
                    //If there is a type options, there is a types array
                    if (option === 'type') {
                        var validType = this.component.types.inArray(function(e) {
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
                //VALIDATE OPTIONAL OPTIONS
            }
        } else {
            this.warning('Can not find component ' + this.componentName + '.');
            this.help();
            process.exit();
        }
        if (!this.options.templatePath) {
            this.templatepath = path.join(this.templatePath(), this.componentName);
        } else {
            this.templatepath = path.join(this.options.templatePath, this.componentName);
        }
    },
    writing: {
        schema: function() {
            //SCHEMA
            if (this.options.schema) {
                this.readJSONSchemaFileOrUrl(this.options.schema, function(error, data) {
                    if (!data) {
                        this.warning("Can't find a valid schema definition there!");
                        process.exit();
                    }
                    if (!error) {
                        this.model = data;
                        //CHECK IF THERE IS AN ID PROP
                        if (_.has(data, 'container')) {
                            this.model.properties = data.container.properties;
                        }
                        if (!_.has(this.model.properties, 'id') && this.componentName !== "form") {
                            this.model.properties.id = {
                                type: "integer",
                                description: "id",
                                required: false
                            };
                        }
                    }
                }.bind(this));
            } else {
                //MOCK SCHEMA
                this.model = {
                    name: this.name,
                    description: this.name,
                    links: [],
                    type: 'object',
                    properties: {
                        id: {
                            type: "integer",
                            description: "id",
                            faker: "random.number"
                        },
                        name: {
                            type: "string",
                            description: "name",
                            faker: "name.firstName"
                        }
                    },
                    required: ['id', 'name']
                };
            }
        },
        rows: function() {
            this.mockentity = [];
            this.rows = 0;
            if (this.options.rows) {
                this.rows = this.options.rows;
            }
            for (var i = 0; i < this.rows; i++) {
                var obj = jsf(this.model);
                this.mockentity.push(obj);
            }
        },
        api: function() {
            //Write MOCK DATA to JSON File.
            if (this.component.api) {
                this.info('Writing api/' + this.options.name + '.json');
                this.fs.write(this.destinationPath('api/' + this.options.name + '.json'), JSON.stringify(this.mockentity));
            }
        },
        templates: function() {
            //TEMPLATES
            if (this.component['named-templates'] && this.options.name) {
                this.moveNamedTemplates(this.templatepath, this.component['named-templates'], this.options.name, this.options.name);
            }
        },
        target: function() {
            //TARGET
            if (this.options.target) {
                if (!this.validateTarget(this.options.target)) {
                    this.warning('Can not find target view ' + this.options.target);
                    this.help();
                    process.exit();
                }
                this.target = this.options.target;
                this.name = this.options.target;
                if (this.options.type) {
                    this.name = this.options.target + this.options.type;
                }
                this.name += "_" + new Date().getTime();
                if (this.component['html-snippet']) {
                    this.moveNamedTemplate(this.templatepath, this.component['html-snippet'], this.name, this.target);
                    this.addToTargetView(this.component['html-snippet'], this.name, this.target);
                }
                if (this.component['js-snippet']) {
                    this.moveNamedTemplate(this.templatepath, this.component['js-snippet'], this.name, this.target);
                }
            }
        },
        navigation: function() {
            //NAVIGATION
            if (this.component.navigation) {
                if (!this.options.menu) {
                    this.addLinkToNavBar(this.options.name);
                } else {
                    this.menu = this.options.menu;
                    this.addDropDownOption(this.options.name);
                }
            }
        },
        module: function() {
            //MODULE
            if (this.component.addModule) {
                this.addAngularModule('App.' + this.options.name);
            }
        }
    },
    end: function() {
        this.info("Finish " + this.componentName);
    }

});
