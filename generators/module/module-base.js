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
var chalk = require('chalk');
var os = require('os');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var _ = require('lodash');
var beautify = require('js-beautify').js_beautify;
var util = require('util');
var appverseHTML5Generator = require('../generator-base');

var moduleGenerator = appverseHTML5Generator.extend({
    /**
     *
     * This method rewrites the yeoman.help()  generator/lib/actions/help.js
     * The help() outputs the USAGE file if exists.
     * This method adds dynamic help from the modules.json.
     *
     */
    help: function help() {
        this.modules = require('./config/modules.json');
        this.log(chalk.bgBlack.white(os.EOL + " Usage: yo appverse-html5:module [module]" + os.EOL));
        this.log(chalk.bgBlack.white(" Available module list:"));
        this.modules.forEach(function(e) {
            console.log("\t" + chalk.bgBlack.cyan(e.name));
        });
        return "";
    },
    /**
     * Check if AngularJS module is loaded
     * @param {string} moduleName - Module name
     **/
    checkAngularModule: function(moduleName) {
        //CHECK IF moduleName IS AVAILABLE
        var file = this.fs.read(this.destinationPath('app/app.js'));
        //PARSE FILE
        var astCode = esprima.parse(file);
        var installedModule = false;
        estraverse.traverse(astCode, {
            enter: function(node) {
                if (node.type === 'Literal' && node.value === moduleName) {
                    installedModule = true;
                }
            }
        });
        return installedModule;
    },
    /**
     * Add angular module
     * @param {string} moduleName - Module name
     **/
    addAngularModule: function(moduleName) {
        if (!this.checkAngularModule(moduleName)) {
            //ANGULAR MODULES
            this.info(" > " + this.name + ': Writing angular modules (app.js).');
            var file = this.fs.read(this.destinationPath('app/app.js'));
            //PARSE FILE
            var astCode = esprima.parse(file);
            //ANGULAR MODULE
            var angularModule = {
                type: "Literal",
                value: moduleName,
                raw: "'" + moduleName + "'"
            };
            //APP NAME
            var appName = this.getApplicationName();
            //REPLACE JS
            var moduleCode = estraverse.replace(astCode, {
                enter: function(node, parent) {
                    if (node.type === 'Literal' && node.value === appName) {
                        parent.arguments[1].elements.unshiftIfNotExist(angularModule, function(e) {
                            return e.type === angularModule.type && e.value === angularModule.value;
                        });
                        this.break();
                    }
                }
            });
            var finalCode = escodegen.generate(moduleCode);
            this.fs.write(this.destinationPath('app/app.js'), finalCode);
        } else {
            this.info(" > " + this.name + ": Angular module already installed");
        }
    },
    /**
     * Add environment configuration
     * @param {Object} configuration - Configuration
     */
    addConfig: function addConfig(configuration) {
        this.info(this.name + ': Writing angular configuration (app.js)');
        var file = this.fs.read(this.destinationPath('app/app.js'));
        //PARSE FILE
        var astCode = esprima.parse(file);
        var config = {
            type: 'Property',
            key: {
                type: 'Literal',
                value: configuration.name,
                raw: configuration.name
            },
            computed: false,
            value: {
                type: 'ObjectExpression',
                properties: []
            }
        };
        configuration.values.forEach(function(element) {
            var prop = {
                type: 'Property',
                key: {
                    type: 'Literal',
                    value: element.name,
                    raw: element.name
                },
                computed: false,
                value: {
                    type: 'Literal',
                    value: element.value,
                    raw: element.value
                },
                kind: 'init',
                method: false,
                shorthand: false
            };
            config.value.properties.push(prop);
        });

        var configCode = estraverse.replace(astCode, {
            enter: function(node, parent) {
                if (node.type === 'Identifier' && node.name === 'environment') {
                    parent.value.properties.pushIfNotExist(config, function(e) {
                        return e.type === config.type && e.key.value === config.key.value;
                    });
                }
            }
        });
        var finalCode = escodegen.generate(configCode);
        this.fs.write(this.destinationPath('app/app.js'), finalCode);
    },
    /**
     * Completes wiredep configuration using the added module
     * @param {Object} wiredep - Module's wiredep configuration
     * @param {String} fileName - Wiredep's main config file name
     */
    addWiredepConfig: function(wiredep, fileName) {
        var target = fileName || 'config/wiredep.js';
        var file = require(this.destinationPath(target)); //parse file

        _.mergeWith(file.update.options.overrides, wiredep.overrides, function(a, b) {
            // Handles existing overrides
            if (_.isArray(a)) {
                return _.union(a, b);
            }
        });

        file.update.options.exclude = _.union(file.update.options.exclude, wiredep.exclude);

        // Deletes the excludes of the new modules.
        for (var key in wiredep.overrides) {
            if (wiredep.overrides.hasOwnProperty(key)) {
                var index = file.update.options.exclude.indexOf("/" + key + "/");
                if (index > -1) {
                    file.update.options.exclude.splice(index, 1);
                }
            }
        }

        var serialized = modularize(file);
        this.fs.write(this.destinationPath(target), serialized);
    }
});

module.exports = moduleGenerator;

/**
 * Serialize object to module with beautify
 * @param  {Object} plain - Element
 */
function modularize(plain) {
    return beautify('\'use strict\'; \n module.exports = ' + util.inspect(plain, {
        depth: null
    }) + ';', {
        indent_size: 2
    });
};
