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
var util = require('util');
var path = require('path');
var chalk = require('chalk');
var cheerio = require('cheerio');
var fs = require('fs');
var os = require('os');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var yeoman = require('yeoman-generator');
var gen = require('../generator-base');

var Generator = yeoman.generators.Base;

/**
 *
 * This method rewrites the yeoman.help()  generator/lib/actions/help.js
 * The help() outputs the USAGE file if exists.
 * This method adds dynamic help from the modules.json.
 *
 */
Generator.prototype.help = function help() {
    this.modules = require('./config/modules.json');
    this.log(chalk.bgBlack.white(os.EOL + " Usage: yo appverse-html5:module [module]" + os.EOL));
    this.log(chalk.bgBlack.white(" Available module list:"));
    this.modules.forEach(function (e) {
        console.log("\t" + chalk.bgBlack.cyan(e.name));
    });
    return "";
};


/**
 * Check if angular module is loaded
 **/
Generator.prototype.checkAngularModule = function (moduleName) {
    //CHECK IF moduleName IS AVAILABLE
    var file = this.fs.read(this.destinationPath('app/app.js'));
    //PARSE FILE
    var astCode = esprima.parse(file);
    var installedModule = false;
    estraverse.traverse(astCode, {
        enter: function (node) {
            if (node.type === 'Literal' && node.value === moduleName) {
                installedModule = true;
            }
        }
    });
    return installedModule;
};
/**
 * ADD angular module
 **/
Generator.prototype.addAngularModule = function (moduleName) {
    if (!this.checkAngularModule(moduleName)) {
        //ANGULAR MODULES
        this.log(" > " + this.name + ': Writing angular modules (app.js).');
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
            enter: function (node, parent) {
                if (node.type === 'Literal' && node.value === appName) {
                    parent.arguments[1].elements.unshiftIfNotExist(angularModule, function (e) {
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
};

/**
 * Add environment configuration
 */
Generator.prototype.addConfig = function addConfig(configuration) {
    this.log(this.name + ': Writing angular configuration (app.js)');
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
    configuration.values.forEach(function (element) {
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
        enter: function (node, parent) {
            if (node.type === 'Identifier' && node.name === 'environment') {
                parent.value.properties.pushIfNotExist(config, function (e) {
                    return e.type === config.type && e.key.value === config.key.value;
                });
            }
        }
    });
    var finalCode = escodegen.generate(configCode);
    this.fs.write(this.destinationPath('app/app.js'), finalCode);
};
