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
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var utils = require('../utils.js');

module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);
        //SERVERPUSH_CONFIG
        this.option('spushBaseUrl', {
            desc: 'Server Push server base URL',
            type: String,
            defaults: 'http://127.0.0.1:3000'
        });
        this.spushBaseUrl = this.options['spushBaseUrl'];
        utils.checkVersion();
    },
    initializing: function () {
        this.log('You called the Appverse Html5 - ServerPush subgenerator.');
        this.conflicter.force = true;
    },

    writing: function () {
        var sPushJS = '\n \t<!-- SERVER PUSH MODULE --> \n' +
            '\t<script src="bower_components/socket.io-client/dist/socket.io.min.js"></script>\n' +
            '\t<script src="bower_components/appverse-web-html5-core/dist/appverse-serverpush/appverse-serverpush.min.js"></script>';

        var indexPath = this.destinationPath('app/index.html');
        var index = this.readFileAsString(indexPath);
        var indexTag = 'app-states.js"></script>';
        var output = index;

        if (index.indexOf("appverse-serverpush.js") === -1) {
            var pos = index.lastIndexOf(indexTag) + indexTag.length;
            output = [index.slice(0, pos), sPushJS, index.slice(pos)].join('');
        }
        if (output.length > index.length) {
            fs.writeFileSync(indexPath, output);
            this.log('Writing index.html by the Server Push generator');
        }
    },
    projectFiles: function () {
        //ANGULAR MODULES
        this.log('Writing angular modules (app.js) by the Rest generator');
        var path = this.destinationPath('app/scripts/app.js');
        var file = this.readFileAsString(path);

        //PARSE FILE
        var astCode = esprima.parse(file);

        //ANGULAR REST MODULE
        var appverseServerPush = {
            type: "Literal",
            value: "appverse.serverPush",
            raw: "'appverse.serverPush'"
        };

        //APP NAME
        var appName = utils.getApplicationName(this);

        //REPLACE JS
        var moduleCode = estraverse.replace(astCode, {
            enter: function (node, parent) {
                if (node.type === 'Literal' && node.value === appName) {
                    parent.arguments[1].elements.unshiftIfNotExist(appverseServerPush, function (e) {
                        return e.type === appverseServerPush.type && e.value === appverseServerPush.value;
                    });
                    this.break();
                }
            }
        });

        var config = {
            type: 'Property',
            key: {
                type: 'Literal',
                value: 'SERVERPUSH_CONFIG',
                raw: 'SERVERPUSH_CONFIG'
            },
            computed: false,
            value: {
                type: 'ObjectExpression',
                properties: [{
                    type: 'Property',
                    key: {
                        type: 'Literal',
                        value: 'BaseUrl',
                        raw: 'BaseUrl'
                    },
                    computed: false,
                    value: {
                        type: 'Literal',
                        value: this.spushBaseUrl,
                        raw: this.spushBaseUrl
                    },
                    kind: 'init',
                    method: false,
                    shorthand: false
               }]
            }
        };

        var configCode = estraverse.replace(moduleCode, {
            enter: function (node, parent) {
                if (node.type === 'Identifier' && node.name === 'environment') {
                    parent.value.properties.pushIfNotExist(config, function (e) {
                        return e.type === config.type && e.key.value === config.key.value;
                    });
                    this.break();
                }
            }
        });
        var finalCode = escodegen.generate(configCode);
        fs.writeFileSync(path, finalCode);

    }
});
