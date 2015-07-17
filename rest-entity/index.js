/*
 Copyright (c) 2015 GFT Appverse, S.L., Sociedad Unipersonal.
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
var utils = require('../lib').projectutils;
var jsonutils = require('../lib').jsonutils;
var arrayutils = require('../lib').arrayutils;
var fs = require('fs');
var _ = require('lodash');
var jsf = require('json-schema-faker');
var cheerio = require('cheerio');

var writeFiles = function () {}

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        this.argument('entity', {
            required: true,
            type: String,
            desc: 'The entity name'
        });

        this.option('menu', {
            required: false,
            type: String,
            desc: 'The Dropdown menu name'
        });

        this.option('schema', {
            required: false,
            type: String,
            desc: 'The Dropdown menu name'
        });

        this.option('rows', {
            required: false,
            type: Number,
            desc: 'Generate mock objects'
        });

        utils.checkVersion.call(this);
        this.restModule = utils.checkAngularModule.call(this, 'appverse.rest');
        this.name = this.entity;
        if (!_.isUndefined(this.options['menu'])) {
            this.menu = this.options['menu'];
        }

    },
    configuring: function () {
        //ADD NG_GRID ANGULAR
        utils.addAngularModule.call(this, 'ngGrid');
        if (this.restModule) {
            if (!_.isUndefined(this.name)) {
                var done = this.async();
                //ADD FILES: VIEW.HTML and CONTROLLER.JS
                utils.addViewAndController.call(this);
                done();
            }
        }
    },
    writing: {
        writeCode: function () {
            if (this.restModule) {
                //CHECK IF MOCK SERVER IS PRESENT
                var pkgPath = this.destinationPath('package.json');
                this.pkg = JSON.parse(this.readFileAsString(pkgPath));
                //MOCKSERVER ?
                if (!_.isUndefined(this.pkg.devDependencies['json-server'])) {
                    this.mockentity = [];
                    this.model = {};
                    //SCHEMA ?
                    if (!_.isUndefined(this.options['schema'])) {
                        jsonutils.readJSONSchemaFileOrUrl(this.options['schema'], function (error, data) {
                            if (!data) {
                                this.log ("Can't find a valid schema definition there!");
                                process.exit();
                                return;
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
                                //MOCK N ROWS
                                if (!_.isUndefined(this.options['rows'])) {
                                    for (var i = 0; i < this.options['rows']; i++) {
                                        this.mockentity.push(jsf(this.model.properties));
                                    }
                                } else {
                                    //MOCK ONE ROW
                                    this.mockentity.push(jsf(this.model.properties));
                                }
                                // MOCK API - TODO - I moved it here to fix write mock generation.
                                //When schema comes from http, fake generation was too slow, and the file was empty.
                                this.log('Writing api/' + this.entity + '.json');
                                fs.writeFileSync(this.destinationPath('api/' + this.name + '.json'), JSON.stringify(this.mockentity));
                                //MODAL FORM
                                this.fs.copyTpl(
                                    this.templatePath('/app/views/view/viewModalForm.html'),
                                    this.destinationPath('/app/views/' + this.name + '/' + this.name + 'ModalForm.html'),
                                    this
                                );
                                this.controllerScript = this.name + '-modal-controller.js';
                                this.fs.copyTpl(
                                    this.templatePath('/app/scripts/controllers/view-modal-controller.js'),
                                    this.destinationPath('/app/scripts/controllers/' + this.controllerScript),
                                    this
                                );
                                //ADD SCRIPT TO INDEX.HTML
                                utils.addControllerScriptToIndex.call(this);

                            }
                        }.bind(this));
                        // NO SCHEMA PROVIDED
                        // TODO: PROVIDE A FUNCTION TO DO THE COMMON PART
                        // PROBLEM WITH SYNC, BECAUSE OF THE REMOTE SCHEMAS. VARIABLES WERE NOT SET WHEN TEMPLATE WAS MOVED
                    } else {
                        //MOCK SCHEMA
                        this.mockmodel = {
                                name: this.name,
                                description: this.name,
                                links: [],
                                properties: {
                                    id: {
                                        type: "integer",
                                        description: "id",
                                        required: false
                                    },
                                    name: {
                                        type: "string",
                                        description: "name",
                                        required: false
                                    },
                                }
                            }
                            //MOCK ONE ROW
                        this.model = this.mockmodel;
                        this.mockentity.push(jsf(this.model.properties));
                        // MOCK API
                        this.log('Writing api/' + this.entity + '.json');
                        fs.writeFileSync(this.destinationPath('api/' + this.name + '.json'), JSON.stringify(this.mockentity));
                        //MODAL FORM
                        this.fs.copyTpl(
                            this.templatePath('/app/views/view/viewModalForm.html'),
                            this.destinationPath('/app/views/' + this.name + '/' + this.name + 'ModalForm.html'),
                            this
                        );
                        this.controllerScript = this.name + '-modal-controller.js';
                        this.fs.copyTpl(
                            this.templatePath('/app/scripts/controllers/view-modal-controller.js'),
                            this.destinationPath('/app/scripts/controllers/' + this.controllerScript),
                            this
                        );
                        //ADD SCRIPT TO INDEX.HTML
                        utils.addControllerScriptToIndex.call(this);
                    }
                }

            } else {
                this.log("Execute 'yo appverse-html5:rest' to add the REST module to the project.");
            }
        }
    },
    end: function () {
        this.log("Finish.");
    }
});
