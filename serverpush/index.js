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
/*jshint -W069*/
'use strict';
var yeoman = require('yeoman-generator');
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var utils = require('../lib').projectutils;
var os = require('os');
var _ = require('lodash');

module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);
        utils.checkVersion.call(this);
        //CONFIG
        this.option('interactiveMode', {
            desc: 'Allow prompts',
            type: Boolean,
            defaults: false
        });
        if (!_.isUndefined(this.options['interactiveMode'])) {
            this.interactiveMode = this.options['interactiveMode'];
        } else {
            this.interactiveMode = true;
        }
    },
    initializing: function () {
        this.log('You called the Appverse Html5 - ServerPush subgenerator.');
        this.conflicter.force = true;

        this.option('config', {
            desc: 'JSON COnfiguration',
            type: Object
        });
        this.serverpush = this.options['config'];
        if (!_.isUndefined(this.serverpush)) {
            this.interactiveMode = false;
            this.spushBaseUrl = this.serverpush.serverURL;
        }

        this.spushBaseUrl = '';

    },
    prompting: function () {
        var done = this.async();
        var prompts = [];
        if (this.interactiveMode) {
            prompts = [{
                type: "input",
                name: "spushBaseUrl",
                message: "Configure your Server Push URL? ",
                default: "http://127.0.0.1:3000"

        }];
        } else {
            prompts = [];
        }
        this.prompt(prompts, function (props) {
            if (prompts.length > 0) {
                this.spushBaseUrl = props.spushBaseUrl;
            } else {
                this.spushBaseUrl = "http://127.0.0.1:3000";
            }
            done();
        }.bind(this));

    },
    writing: function () {
        var sPushJS = os.EOL +
            '    <!-- SERVER PUSH MODULE -->' + os.EOL +
            '    <script src="bower_components/socket.io-client/dist/socket.io.min.js"></script>' + os.EOL +
            '    <script src="bower_components/appverse-web-html5-core/dist/appverse-serverpush/appverse-serverpush.min.js"></script>';


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
        }


        //ANGULAR MODULE
        utils.addAngularModule.call(this, 'appverse.serverPush');

        //APP NAME
        var appName = utils.getApplicationName(this);

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

        //CONFIG
        var path = this.destinationPath('app/scripts/app.js');
        var file = this.readFileAsString(path);
        //PARSE FILE
        var moduleCode = esprima.parse(file);
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
