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

/*jshint node:true*/

'use strict';
var yeoman = require('yeoman-generator');
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var utils = require('../lib');
var os = require('os');
var _ = require('lodash');

module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);
        utils.projectutils.checkVersion.call(this);
    },
    initializing: function () {
        this.log('You called the Appverse Html5 - REST subgenerator.');
        this.conflicter.force = true;
        //CONFIG
        this.option('interactiveMode');
        if (!_.isUndefined(this.options['interactiveMode'])) {
            this.interactiveMode = this.options['interactiveMode'];
        } else {
            this.interactiveMode = true;
        }
        //REST_CONFIG
        this.option('config', {
            desc: 'JSON COnfiguration',
            type: Object
        });
        this.rest = this.options['config'];
        if (!_.isUndefined(this.rest)) {
            this.interactiveMode = false;
            this.restBaseUrl = this.rest.config.rest.backend.host;
            this.restBaseUrlPort = this.rest.config.rest.backend.port;
            if (!_.isUndefined(this.rest.config.rest.mock)) {
                this.mockServer = true;
                this.mockServerHost = this.rest.config.rest.mock.host;
                this.mockServerPort = this.rest.config.rest.mock.port;
            } else {
                this.mockServer = false;
            }
        }
    },

    prompting: function () {
        var done = this.async();
        var prompts = [];

        if (this.interactiveMode) {
            prompts = [
                {
                    type: "input",
                    name: "restBaseUrl",
                    message: "Configure your REST backend URL",
                    default: "http://127.0.0.1"
             }, {
                    type: "input",
                    name: "restBaseUrlPort",
                    message: "Configure your REST backend URL Port",
                    default: "8000"
             }, {
                    type: "confirm",
                    name: "mockServer",
                    message: "Do you want a REST MOCK Server (json-server)?",
                    default: true
             }, {
                    type: "input",
                    name: "mockServerPort",
                    message: "Configure your REST MOCK server PORT? ",
                    default: "8888",
                    when: function (answers) {
                        return answers.mockServer;
                    }
            }
        ];
        } else {
            prompts = [];
        }
        this.prompt(prompts, function (props) {
            if (prompts.length > 0) {
                this.restBaseUrl = props.restBaseUrl;
                this.restBaseUrlPort = props.restBaseUrlPort;
                this.mockServer = props.mockServer;
                this.mockServerPort = props.mockServerPort;
            } else {
                this.restBaseUrl = "http://127.0.0.1";
                this.restBaseUrlPort = "8000";
                this.mockServer = true;
                this.mockServerPort = "8888";
            }
            done();

        }.bind(this));

    },

    configuring: function () {
        //ADD ANGULAR MODULE
        utils.projectutils.addAngularModule.call(this, 'appverse.rest');
    },
    writing: function () {
        var restJS = os.EOL +
            '    <!-- REST MODULE -->' + os.EOL +
            '    <script src="bower_components/lodash/lodash.min.js"></script>' + os.EOL +
            '    <script src="bower_components/restangular/dist/restangular.min.js"></script>' + os.EOL +
            '    <script src="bower_components/appverse-web-html5-core/dist/appverse-rest/appverse-rest.min.js"></script>';

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
        //REST CONFIG
        this.log('Writing angular configuration (app.js) by the Rest generator');
        var path = this.destinationPath('app/scripts/app.js');
        var file = this.readFileAsString(path);

        //PARSE FILE
        var astCode = esprima.parse(file);

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
                        value: 'BaseUrl',
                        raw: 'BaseUrl'
                    },
                    computed: false,
                    value: {
                        type: 'Literal',
                        value: '/api',
                        raw: '/api'
                    },
                    kind: 'init',
                    method: false,
                    shorthand: false
               }, {
                    type: 'Property',
                    key: {
                        type: 'Literal',
                        value: 'RequestSuffix',
                        raw: 'RequestSuffix'
                    },
                    computed: false,
                    value: {
                        type: 'Literal',
                        value: '',
                        raw: ''
                    },
                    kind: 'init',
                    method: false,
                    shorthand: false
               }]
            }
        };
        var configCode = estraverse.replace(astCode, {
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

        this.template('config/connect.js');
        this.template('tasks/server.js');

        if (this.mockServer) {
            if (!fs.existsSync("tasks")) {
                fs.mkdirSync("tasks");
            }
            if (!fs.existsSync("api")) {
                fs.mkdirSync("api");
            }
            this.template('tasks/mockserverTask.js');
        }
    },
    installingDeps: function () {
        var packagePath = this.destinationPath('package.json');
        //this.npmInstall () is not working with skip-install
        var pkg = require(packagePath);
        pkg.devDependencies["grunt-connect-proxy"] = "0.1.10";
        if (this.mockServer) {
            pkg.devDependencies["json-server"] = "0.6.10";
        }
        fs.writeFileSync(packagePath, JSON.stringify(pkg));
    },
    end: function () {
        if (this.mockServer) {
            this.log("\n Execute 'grunt mockserver' to start you application on Mock mode.");
            this.log("Put your .json files into the api folder to serve them automatically with the Mock server");
            this.log("The Mock server will route all your entities using REST URL patterns.");
        }
    }
});
