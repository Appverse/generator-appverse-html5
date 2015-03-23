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
var path = require('path');
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var utils = require('../utils.js');


module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);

        this.option('restBaseUrl', {
            desc: 'Rest server base URL',
            type: String,
            defaults: 'http://127.0.0.1:8000'
        });
        this.restBaseUrl = this.options['restBaseUrl'];
    },
    initializing: function () {
        this.log('You called the AppverseHtml5 REST subgenerator.');
        this.conflicter.force = true;
    },
    writing: function () {
        var restJS = '\n  \t<!-- REST MODULE --> \n' +
            '\t<script src="bower_components/angular-resource/angular-resource.min.js"></script> \n' +
            '\t<script src="bower_components/lodash/dist/lodash.underscore.min.js"></script> \n' +
            '\t<script src="bower_components/restangular/dist/restangular.min.js"></script> \n' +
            '\t<script src="bower_components/appverse-web-html5-core/dist/appverse-rest/appverse-rest.min.js"></script> \n';


        var indexPath = this.destinationPath('app/index.html');
        var index = this.readFileAsString(indexPath);
        var indexTag = 'app-states.js"></script>';
        var output = index;

        if (index.indexOf("appverse-rest.js") === -1) {
            var pos = index.lastIndexOf(indexTag) + indexTag.length;
            output = [index.slice(0, pos), restJS, index.slice(pos)].join('');
        }
        if (output.length > index.length) {
            fs.writeFileSync(indexPath, output);
            this.log('Writing index.html by the Rest generator');
        }
        //ANGULAR MODULES
        this.log('Writing angular modules (app.js) by the Rest generator');
        var path = this.destinationPath('app/scripts/app.js');
        var file = this.readFileAsString(path);

        //PARSE FILE
        var astCode = esprima.parse(file);

        //ANGULAR REST MODULE
        var appverseRest = {
            type: "Literal",
            value: "appverse.rest",
            raw: "'appverse.rest'"
        };
        //APP NAME
        var indexPath = this.destinationPath('package.json');
        var packageApp = JSON.parse(this.readFileAsString(indexPath));
        var appName = packageApp.name + "App";

        //REPLACE JS
        var moduleCode = estraverse.replace(astCode, {
            enter: function (node, parent) {
                if (node.type === 'Literal' && node.value == appName) {
                    parent.arguments[1].elements.unshiftIfNotExist(appverseRest, function (e) {
                        return e.type === appverseRest.type && e.value === appverseRest.value;
                    });
                    this.break();
                }
            }
        });

        var config = {
            type: 'Property',
            key: {
                type: 'Literal',
                value: 'REST_CONFIG',
                raw: 'REST_CONFIG'
            },
            computed: false,
            value: {
                type: 'ObjectExpression',
                properties: [{
                    type: 'Property',
                    key: {
                        type: 'Literal',
                        value: 'baseUrl',
                        raw: 'baseUrl'
                    },
                    computed: false,
                    value: {
                        type: 'Literal',
                        value: this.restBaseUrl,
                        raw: this.restBaseUrl
                    },
                    kind: 'init',
                    method: false,
                    shorthand: false
               }]
            }
        };

        var configCode = estraverse.replace(moduleCode, {
            enter: function (node, parent) {
                if (node.type === 'Identifier' && node.name == 'environment') {
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
