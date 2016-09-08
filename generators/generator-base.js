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
var path = require('path');
var fs = require('fs-extra');
var cheerio = require('cheerio');
var appverse = require('appverse-generator-commons');
var chalk = require('chalk');
var ZSchema = require('z-schema');
var request = require('request');
var beautify = require('js-beautify').js_beautify;


var appverseHTML5Generator = appverse.extend({
    constructor: function() {
        // Calling the super constructor
        appverse.apply(this, arguments);

        //adding a custom option
        this.option('demo', {
            alias: 'd',
            desc: 'Loads demo code for example purposes'
        }); //Adds support for --demo flag
    },
    /**
     * Get the Generated application name
     **/
    getAppName: function getAppName() {
        //APP NAME
        var pkgPath = this.destinationPath('package.json');
        var pkg = JSON.parse(this.fs.read(pkgPath));
        return pkg.name;
    },
    /**
     * Get the Generated AngularJS application name
     **/
    getApplicationName: function getApplicationName() {
        return this.getAppName() + "App";
    },
    /**
     *
     * Find module by name from the available module list
     * @param {string} nameKey - Name to find
     * @param {Object} configs - Configuration object
     *
     */
    findConfig: function findConfig(nameKey, configs) {
        for (var i = 0; i < configs.length; i++) {
            if (configs[i].name === nameKey) {
                return configs[i];
            }
        }
    },
    /**
     *
     * Find build for prompting on start
     * @param {string} config - Configuration file path
     */
    promptsConfig: function promptsConfig(config) {
        var modules = require(config);
        var prompts = [];
        for (var i = 0; i < modules.length; i++) {
            if (modules[i].startprompt) {
                prompts.push(modules[i].name);
            }
        }
        return prompts;
    },
    /**
     * Check required arguments
     * Rewrite the method to beatufiy the error message.
     **/
    checkRequiredArgs: function() {
        // If the help option was provided, we don't want to check for required
        // arguments, since we're only going to print the help message anyway.
        if (this.options.help) {
            return;
        }
        // Bail early if it's not possible to have a missing required arg
        if (this.args.length > this._arguments.length) {
            return;
        }
        this._arguments.forEach(function(arg, position) {
            // If the help option was not provided, check whether the argument was
            // required, and whether a value was provided.
            if (arg.config.required && position >= this.args.length) {
                this.warning('Did not provide required argument ' + chalk.bold(arg.name) + '!');
                return;
            }
        }, this);
    },
    /** Read JSON SCHEMA
     *  Remote JSON Schema uses 'Accept': 'application/schema+json' header for request
     *  @param {string} url - Remote JSON Schema URL or path
     *  @param {function} callback - Callback function
     **/
    readJSONSchemaFileOrUrl: function readJSONSchemaFileOrUrl(url, callback) {
        if (/^https?:/.test(url)) {
            var options = {
                url: url,
                headers: {
                    'Accept': 'application/schema+json'
                }
            };
            request(options, function(error, response, body) {
                if (response.statusCode === 404) {
                    callback(error, null);
                    return;
                }
                if (!error && response.statusCode === 200) {
                    callback(null, JSON.parse(body.toString()));
                } else {
                    callback(error, null);
                }
            });
            return;
        }
        if (!fs.existsSync(url)) {
            callback("Wrong Path. I can't find a JSON file there!", null);
        }
        callback(null, JSON.parse(fs.readFileSync(url, 'utf8')));
    },
    /**
     * Read JSON from file or URL
     * @param {string} url - JSON file URL or Path
     * @param {function} callback - Callback function
     **/
    readJSONFileOrUrl: function readJSONFileOrUrl(url, callback) {
        if (/^https?:/.test(url)) {
            request(url, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    callback(null, JSON.parse(body.toString()));
                } else {
                    callback(error, null);
                }
            });
            return;
        }
        if (!fs.existsSync(url)) {
            this.info("JSON URL: " + url);
            callback("Wrong Path. I can't find a JSON file there!", null);
        }
        callback(null, JSON.parse(fs.readFileSync(url, 'utf8')));
    },
    /**
     *  Validate JSON against Appverse Project JSON schema
     *  @param {string} json - Json to validate
     *  @param {string} tpath - Template path
     *  @param {function} callback - Callback function
     **/
    validateJson: function validateJson(json, tpath, callback) {
        var validator = new ZSchema();
        this.schema = JSON.parse(fs.readFileSync(path.join(tpath, '../schema/appverse-project-schema.json'), 'utf-8'));
        var valid = validator.validate(json, this.schema);
        if (!valid) {
            callback("Sorry. Not a valid JSON project! ", null);
            callback("Check the project-schema.json for a valid JSON file. \n", null);
            callback(JSON.stringify(this.schema), null);
        }
        callback(null, true);
    },
    /**
     * Add Routing
     * @param {string} name - rounting name
     **/
    addRouteState: function addRouteState(name, noController) {
        //STATES
        var hook = 'configureStates([',
            path = this.destinationPath('app/components/' + name + '/' + name + '-states.js'),
            file = this.fs.read(path),
            insert = "{state:'" + name + "', config: { url: '/" + name + "',templateUrl: 'components/" + name + "/" + name + ".html'";

        if (!noController) {
            insert += ",controller: '" + name + "Controller'";
        }

        insert += "} }";

        if (file.indexOf(insert) === -1) {
            var pos = file.lastIndexOf(hook) + hook.length;
            var output = [file.slice(0, pos), insert, file.slice(pos)].join('');
            this.fs.write(path, output);
        }
    },
    /**
     * Add Link to NAV Bar.
     * @param {string} name - rounting name
     * @param {String} _icon - OPTIONAL icon to be shown in the NavBar
     **/
    addLinkToNavBar: function addLinkToNavBar(name, _icon, noController) {
        var icon = _icon || "glyphicon-globe";
        var indexPath = this.destinationPath('app/index.html');
        var index = this.fs.read(indexPath);
        var indexHTML = cheerio.load(index);
        //ADD LINK
        var findlink = indexHTML('*[ui-sref="' + name + '"]');
        if (require('lodash').isEmpty(findlink)) {
            var navLink = '<li data-ng-class="{active: $state.includes(\'' + name + '\')}"><a angular-ripple ui-sref="' + name + '"><i class="glyphicon ' + icon + '"></i> ' + name.capitalizeFirstLetter() + '</a></li>';
            indexHTML('ul.nav.navbar-nav').append(navLink);
            indexHTML('ul.sidebar-nav').append(navLink);
        }
        this.fs.write(indexPath, indexHTML.html());
        this.addRouteState(name, noController);
    }
});
module.exports = appverseHTML5Generator;
/**
 * Check if an element exists in array using a comparer function
 * @param {function} comparer - Comparer
 **/
Array.prototype.inArray = function(comparer) {
    for (var i = 0; i < this.length; i++) {
        if (comparer(this[i])) {
            return true;
        }
    }
    return false;
};
/**
 * Adds an element to the array if it does not already exist using a comparer
 * @param {Object} element - Element
 * @param {function} comparer - Comparer
 **/
Array.prototype.pushIfNotExist = function(element, comparer) {
    if (!this.inArray(comparer)) {
        this.push(element);
    }
};
/**
 * Adds an element to the array if it does not already exist using a comparer function
 * @param {Object} element - Element
 * @param {function} comparer - Comparer
 **/
Array.prototype.unshiftIfNotExist = function(element, comparer) {
    if (!this.inArray(comparer)) {
        this.unshift(element);
    }
};

/**
 * Serialize object to module with beautify
 * @param  {Object} plain - Element
 *
 **/
function modularize(plain) {
    return beautify('\'use strict\'; \n module.exports = ' + util.inspect(plain, {
        depth: null
    }) + ';', {
        indent_size: 2
    });
}

/**
 * Changes the first letter to its capital.
 */
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
