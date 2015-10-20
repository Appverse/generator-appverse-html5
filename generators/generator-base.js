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
var fs = require('fs');
var appverse = require ('appverse-generator-commons');
var chalk = require('chalk');
var ZSchema = require('z-schema');
var request = require('request');
var cheerio = require('cheerio');

var appverseHTML5Generator = appverse.extend({
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
 getApplicationName : function getApplicationName() {
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
checkRequiredArgs : function () {
    // If the help option was provided, we don't want to check for required
    // arguments, since we're only going to print the help message anyway.
    if (this.options.help) {
        return;
    }
    // Bail early if it's not possible to have a missing required arg
    if (this.args.length > this._arguments.length) {
        return;
    }
    this._arguments.forEach(function (arg, position) {
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
        request(options, function (error, response, body) {
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
        request(url, function (error, response, body) {
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
validateJson : function validateJson(json, tpath, callback) {
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
 * Add Scripts tag to index.html
 * @param {string[]} scripts - Scripts path array
 **/
 addScriptsToIndex: function addScriptsToIndex(scripts) {
    this.info(" Adding scripts to index.html");
    var index = this.fs.read(this.destinationPath('app/index.html'));
    var indexHTML = cheerio.load(index);
    var write = false;
    scripts.forEach(function (script) {
        var scriptTag = '\n <script src=\"' + script + '\"></script>';
        var exists = false;
        for (var i = 0; i < indexHTML('script').length; i++) {
            var current = indexHTML('script').get()[i].attribs.src;
            if (current === script) {
                exists = true;
                break;
            }
        }
        if (!exists) {
            write = true;
            indexHTML(scriptTag).insertAfter(indexHTML('script').get()[indexHTML('script').length - 1]);
        }
    });
    if (write) {
        this.fs.write(this.destinationPath('app/index.html'), indexHTML.html());
    } else {
        this.info(" >< Scripts already exists at index.html");
    }
}
});
module.exports = appverseHTML5Generator;
/**
* Check if an element exists in array using a comparer function
* @param {function} comparer - Comparer
**/
Array.prototype.inArray = function (comparer) {
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
Array.prototype.pushIfNotExist = function (element, comparer) {
    if (!this.inArray(comparer)) {
        this.push(element);
    }
};
/**
* Adds an element to the array if it does not already exist using a comparer function
* @param {Object} element - Element
* @param {function} comparer - Comparer
**/
Array.prototype.unshiftIfNotExist = function (element, comparer) {
    if (!this.inArray(comparer)) {
        this.unshift(element);
    }
};
